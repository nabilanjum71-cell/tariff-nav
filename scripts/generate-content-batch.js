const Groq = require('groq-sdk')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const args = process.argv.slice(2)
const section = args.find(a => a.startsWith('--section='))?.split('=')[1]
const keyName = args.find(a => a.startsWith('--key='))?.split('=')[1]

if (!section || !keyName) {
  console.error('Usage: node generate-content-batch.js --section=import_guide --key=GROQ_KEY_4')
  process.exit(1)
}

const apiKey = process.env.GROQ_API_KEY
if (!apiKey) {
  console.log(`⚠️  GROQ_API_KEY not set for ${keyName} — skipping`)
  process.exit(0)
}

const groq = new Groq({ apiKey })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH = 400
const DELAY = 7000 // 8K TPM / ~900 tokens per call ≈ 8-9/min ceiling
const MODEL = 'openai/gpt-oss-120b'
const MAX_RETRIES = 2

function buildPrompt(section, c) {
  const rate = c.us_duty_rate === 0 ? 'Free (0%)' : `${c.us_duty_rate}%`
  const fta = c.trade_agreements
    ? Object.entries(c.trade_agreements)
        .filter(([,v]) => v==='Free'||v==='0%'||v===0)
        .map(([k])=>k).join(', ')
    : ''
  const base = `Product: "${c.description}"\nHS Code: ${c.hts_code}\nUS Duty: ${rate}${fta?'\nFree under: '+fta:''}`

  const d = c.us_duty_rate || 0
  const ship10 = { duty:(10000*d/100).toFixed(2), mpf:Math.min(10000*0.003464,614.35).toFixed(2), total:(10000+(10000*d/100)+Math.min(10000*0.003464,614.35)+12.5).toFixed(2) }
  const ship50 = { duty:(50000*d/100).toFixed(2), mpf:Math.min(50000*0.003464,614.35).toFixed(2), total:(50000+(50000*d/100)+Math.min(50000*0.003464,614.35)+62.5).toFixed(2) }

  const prompts = {
    import_guide: `Write a 160-180 word import guide paragraph for US importers of this product:\n${base}\nCover: who imports it, why, key compliance points, one practical tip. Plain English, NO bullet points, NO headers, flowing paragraph only.`,

    duty_breakdown: `Write a 160-180 word duty cost breakdown paragraph for this product:\n${base}\n$10k shipment: duty $${ship10.duty} + MPF $${ship10.mpf} + HMF $12.50 = Total $${ship10.total}\n$50k shipment: duty $${ship50.duty} + MPF $${ship50.mpf} + HMF $62.50 = Total $${ship50.total}\nExplain real costs using above numbers, what MPF/HMF are, one savings tip. Plain English, NO bullet points, flowing paragraph only.`,

    trade_guide: `Write a 160-180 word trade agreement guide paragraph for this product:\n${base}\nCover: which agreements apply, best country to source from, real dollar savings, how to qualify. Plain English, NO bullet points, flowing paragraph only.`,

    importer_faq: `Write 4 Q&A pairs for US importers of this product:\n${base}\n\nFormat strictly as:\nQ1: [question]\nA1: [40-50 word answer]\n\nQ2: [question]\nA2: [40-50 word answer]\n\nQ3: [question]\nA3: [40-50 word answer]\n\nQ4: [question]\nA4: [40-50 word answer]`
  }
  return prompts[section]
}

async function generate(c, attempt = 0) {
  try {
    const res = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1000,
      reasoning_effort: 'low',
      messages: [{ role:'user', content: buildPrompt(section, c) }]
    })
    const out = res.choices[0]?.message?.content?.trim() || ''
    if (!out) {
      console.log(`  Empty (finish_reason=${res.choices[0]?.finish_reason}, tokens=${res.usage?.completion_tokens})`)
    }
    return out
  } catch(err) {
    if (err.status === 429) {
      const retryAfter = Number(err.headers?.get?.('retry-after')) || 20
      if (attempt < MAX_RETRIES) {
        console.log(`  Rate limited — retry ${attempt+1}/${MAX_RETRIES} after ${retryAfter}s...`)
        await new Promise(r=>setTimeout(r, retryAfter*1000))
        return generate(c, attempt+1)
      }
      console.log(`  Rate limited — out of retries, skipping`)
      return ''
    }
    console.error(`  Error: ${err.message}`)
    return ''
  }
}

async function main() {
  console.log(`\n🔑 ${keyName} → section: ${section}`)
  console.log('─'.repeat(50))

  const { data: nullRows } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate, trade_agreements, rate_history')
    .is(section, null)
    .limit(BATCH)

  const { data: emptyRows } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate, trade_agreements, rate_history')
    .eq(section, '')
    .limit(BATCH - (nullRows?.length || 0))

  const rows = [...(nullRows || []), ...(emptyRows || [])]

  if (!rows?.length) { console.log(`✅ All ${section} done!`); return }

  console.log(`Found ${rows.length} rows to process\n`)

  let done = 0, skipped = 0
  const start = Date.now()

  for (let i = 0; i < rows.length; i++) {
    const c = rows[i]
    process.stdout.write(`[${i+1}/${rows.length}] ${c.hts_code}... `)
    const content = await generate(c)
    if (content && content.length > 30) {
      const { error: updateErr } = await supabase
        .from('hs_codes')
        .update({ [section]: content })
        .eq('id', c.id)
      if (updateErr) {
        console.log(`✗ DB error: ${updateErr.message}`)
        skipped++
      } else {
        done++
        console.log('✓')
      }
    } else {
      skipped++
      console.log(`✗ skip (len=${content?.length || 0})`)
    }
    await new Promise(r=>setTimeout(r, DELAY))
  }

  const mins = ((Date.now()-start)/60000).toFixed(1)
  console.log(`\n📊 ${keyName} Summary:`)
  console.log(`   ✓ Generated: ${done}`)
  console.log(`   ✗ Skipped:   ${skipped}`)
  console.log(`   ⏱ Time:      ${mins} min`)
  console.log(`   📈 Rate:      ${(done/parseFloat(mins)).toFixed(0)}/min`)
}

main().catch(console.error)
