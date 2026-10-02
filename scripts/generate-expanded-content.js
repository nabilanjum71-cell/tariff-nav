const Groq = require('groq-sdk')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const args = process.argv.slice(2)
const keyName = args.find(a => a.startsWith('--key='))?.split('=')[1] || 'KEY'
const batchArg = args.find(a => a.startsWith('--batch='))?.split('=')[1]
const BATCH = batchArg ? parseInt(batchArg) : 20

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

const DELAY = 7000
const MODEL = 'openai/gpt-oss-120b'
const MAX_RETRIES = 2

function buildPrompt(row) {
  if (row.type === 'country') {
    return `Write a 350-400 word guide titled "${row.title}" for US importers sourcing goods from ${row.name}.
Cover: what ${row.name} commonly exports to the US, typical duty rate ranges for its main export categories, any US free trade agreement or preference program status with ${row.name} (state clearly if none exists, don't guess specifics), and 2-3 practical tips for importers sourcing from this country.
Write in plain, confident English. No bullet points, no headers — flowing paragraphs. Do not invent specific numeric duty rates or program names if you're not certain; speak in general, accurate terms instead.`
  }
  if (row.type === 'product') {
    return `Write a 350-400 word guide titled "${row.title}" for US importers.
Cover: what HS code chapter/range ${row.name} typically falls under (general chapter only, not a fake specific code), the general US duty rate range for this product category, common compliance or labeling considerations, and one practical cost-saving tip.
Write in plain, confident English. No bullet points, no headers — flowing paragraphs. Do not invent a fake exact HS code or exact duty percentage; speak in accurate general ranges.`
  }
  // guide
  return `Write a clear, well-structured 450-550 word educational article titled "${row.title}" for someone new to importing goods into the US.
Explain the concept thoroughly and accurately, in plain English, as if for a small business owner importing for the first time. You may use short paragraphs and at most 2-3 short bullet lists if genuinely helpful, but the majority should be flowing prose. Be factually careful — do not invent specific fees, rates or legal citations you're not confident about.`
}

async function sleepWithHeartbeat(ms) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    const chunk = Math.min(30000, ms - (Date.now() - start))
    await new Promise(r => setTimeout(r, chunk))
    if (Date.now() - start < ms) console.log(`    ...still waiting (${Math.round((Date.now()-start)/1000)}s elapsed)`)
  }
}

async function generate(row, attempt = 0) {
  try {
    const res = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1200,
      reasoning_effort: 'low',
      messages: [{ role: 'user', content: buildPrompt(row) }]
    })
    const out = res.choices[0]?.message?.content?.trim() || ''
    if (!out) {
      console.log(`  Empty (finish_reason=${res.choices[0]?.finish_reason}, tokens=${res.usage?.completion_tokens})`)
    }
    return out
  } catch (err) {
    if (err.status === 429) {
      const retryAfter = Number(err.headers?.get?.('retry-after')) || 20
      if (attempt < MAX_RETRIES) {
        console.log(`  Rate limited — retry ${attempt+1}/${MAX_RETRIES} after ${retryAfter}s...`)
        await sleepWithHeartbeat(retryAfter * 1000)
        return generate(row, attempt + 1)
      }
      console.log(`  Rate limited — out of retries, skipping`)
      return ''
    }
    console.error(`  Error: ${err.message}`)
    return ''
  }
}

async function main() {
  console.log(`\n🔑 ${keyName} → expanded_pages`)
  console.log('─'.repeat(50))

  const { data: rows, error: qErr } = await supabase
    .from('expanded_pages')
    .select('id, slug, type, name, title')
    .is('content', null)
    .limit(BATCH)

  if (qErr) { console.error('Query error:', qErr.message); return }
  if (!rows?.length) { console.log('✅ All expanded_pages done!'); return }

  console.log(`Found ${rows.length} rows to process\n`)

  let done = 0, skipped = 0
  const start = Date.now()

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    process.stdout.write(`[${i+1}/${rows.length}] (${row.type}) ${row.slug}... `)
    const content = await generate(row)
    if (content && content.length > 50) {
      const { error: updateErr } = await supabase
        .from('expanded_pages')
        .update({ content })
        .eq('id', row.id)
        .is('content', null)
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
    await new Promise(r => setTimeout(r, DELAY))
  }

  const mins = ((Date.now() - start) / 60000).toFixed(1)
  console.log(`\n📊 ${keyName} Summary:`)
  console.log(`   ✓ Generated: ${done}`)
  console.log(`   ✗ Skipped:   ${skipped}`)
  console.log(`   ⏱ Time:      ${mins} min`)
}

main().catch(console.error)
