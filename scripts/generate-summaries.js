const Groq = require('groq-sdk')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH_SIZE = 50
const DELAY_MS = 1200

async function generateSummary(code) {
  const prompt = `You are writing content for a tariff information website. 
Write a 200-word plain-English explanation for importers about HS tariff code ${code.hts_code}.
Product: "${code.description}"
Current US duty rate: ${code.us_duty_rate}%
Cover these points in 2-3 paragraphs:
1. What products this code covers
2. Who typically imports this and why
3. Current US duty situation and trade policy impacts
4. One practical tip for importers
Write in helpful professional tone. No jargon. No markdown. Plain paragraphs only.`

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }]
    })
    return response.choices[0].message.content
  } catch (err) {
    console.error(`Summary failed for ${code.hts_code}:`, err.message)
    return `${code.description}. This HS code is subject to a ${code.us_duty_rate}% duty rate when imported into the United States.`
  }
}

async function main() {
  const args = process.argv.slice(2)
  const batchArg = args.find(a => a.startsWith('--batch='))
  const batchNum = batchArg ? parseInt(batchArg.split('=')[1]) : 1
  const offset = (batchNum - 1) * BATCH_SIZE

  console.log(`Generating summaries — batch ${batchNum}\n`)

  const { data: codes, error } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate')
    .or('ai_summary.is.null,ai_summary.eq.')
    .range(offset, offset + BATCH_SIZE - 1)

  if (error) { console.error('Supabase error:', error); return }
  if (!codes?.length) { console.log('All summaries done!'); return }

  console.log(`Found ${codes.length} codes\n`)

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    process.stdout.write(`[${i + 1}/${codes.length}] ${code.hts_code}... `)
    const summary = await generateSummary(code)
    await supabase.from('hs_codes').update({ ai_summary: summary }).eq('id', code.id)
    console.log('done')
    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log(`\nBatch ${batchNum} complete!`)
}

main().catch(console.error)