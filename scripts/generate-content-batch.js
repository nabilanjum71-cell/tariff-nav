// Universal content generator — pass --section and --key args
const Groq = require('groq-sdk')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const args = process.argv.slice(2)
const sectionArg = args.find(a => a.startsWith('--section='))?.split('=')[1]
const keyArg = args.find(a => a.startsWith('--key='))?.split('=')[1]

if (!sectionArg || !keyArg) {
  console.error('Usage: node generate-content-batch.js --section=import_guide --key=GROQ_KEY_6')
  process.exit(1)
}

const apiKey = process.env[keyArg]
if (!apiKey) {
  console.error(`API key ${keyArg} not set!`)
  process.exit(0)
}

const groq = new Groq({ apiKey })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH_SIZE = 100
const DELAY_MS = 800
const MODEL = 'llama-3.1-8b-instant'

function buildPrompt(section, code) {
  const rate = code.us_duty_rate === 0 ? 'Free (0%)' : `${code.us_duty_rate}%`
  const agreements = code.trade_agreements
    ? Object.entries(code.trade_agreements)
        .filter(([,v]) => v === 'Free' || v === '0%' || v === 0)
        .map(([k]) => k).join(', ')
    : ''

  const base = `Product: "${code.description}"\nHS Code: ${code.hts_code}\nUS Duty Rate: ${rate}\n${agreements ? `Free Trade Agreements: ${agreements}` : ''}`

  const prompts = {
    import_guide: `You are a US customs expert. Write a 160-180 word Import Guide for US importers of this product:\n${base}\n\nCover: who imports it and why, key considerations, one practical tip. Plain English, no bullet points, no markdown.`,

    duty_breakdown: `You are a US customs broker. Write a 160-180 word Duty Cost Breakdown for this product:\n${base}\n\nOn $10,000 shipment: duty $${(10000*(code.us_duty_rate||0)/100).toFixed(2)}, MPF $${Math.min(10000*0.003464,614.35).toFixed(2)}, HMF $12.50\nOn $50,000: duty $${(50000*(code.us_duty_rate||0)/100).toFixed(2)}, MPF $${Math.min(50000*0.003464,614.35).toFixed(2)}, HMF $62.50\n\nExplain the real costs, MPF/HMF briefly, one savings tip. Plain English, no bullet points.`,

    trade_guide: `You are a US trade agreement expert. Write a 160-180 word Trade Agreement Guide for this product:\n${base}\n\nCover: which agreements apply, which country to source from for best rate, real dollar savings example, how to qualify. Plain English, no bullet points.`,

    importer_faq: `You are a US customs expert. Write exactly 4 Q&A pairs for importers of this product:\n${base}\n\nFormat:\nQ1: [question about duty rate]\nA1: [35-50 word answer]\n\nQ2: [question about trade agreements]\nA2: [35-50 word answer]\n\nQ3: [question about documents needed]\nA3: [35-50 word answer]\n\nQ4: [question specific to this product]\nA4: [35-50 word answer]`
  }

  return prompts[section] || prompts.import_guide
}

async function generate(section, code) {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: 'user', content: buildPrompt(section, code) }]
    })
    return response.choices[0]?.message?.content?.trim() || ''
  } catch (err) {
    if (err.status === 429) {
      console.log('Rate limited — waiting 20s...')
      await new Promise(r => setTimeout(r, 20000))
      return ''
    }
    console.error(`Error for ${code.hts_code}:`, err.message)
    return ''
  }
}

async function main() {
  console.log(`\nGenerating ${sectionArg} using ${keyArg}\n`)

  const { data: codes, error } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate, trade_agreements, rate_history')
    .is(sectionArg, null)
    .limit(BATCH_SIZE)

  if (error) { console.error('Supabase error:', error.message); return }
  if (!codes?.length) { console.log(`All ${sectionArg} done!`); return }

  console.log(`Found ${codes.length} rows to process`)

  let done = 0
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    process.stdout.write(`[${i+1}/${codes.length}] ${code.hts_code}... `)
    const content = await generate(sectionArg, code)
    if (content && content.length > 50) {
      await supabase.from('hs_codes').update({ [sectionArg]: content }).eq('id', code.id)
      done++
      console.log('✓')
    } else {
      console.log('skip')
    }
    await new Promise(r => setTimeout(r, DELAY_MS))
  }
  console.log(`\nDone! ${done}/${codes.length} generated`)
}

main().catch(console.error)
