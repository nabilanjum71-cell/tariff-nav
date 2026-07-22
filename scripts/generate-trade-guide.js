const Groq = require('groq-sdk')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const groq = new Groq({ apiKey: process.env.GROQ_KEY_4 })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH_SIZE = 100
const DELAY_MS = 800

async function generateTradeGuide(code) {
  const agreements = code.trade_agreements || {}
  const baseRate = parseFloat(code.us_duty_rate) || 0

  const agreementList = Object.entries(agreements)
    .map(([name, rate]) => `${name}: ${rate}`)
    .join(', ')

  const freeAgreements = Object.entries(agreements)
    .filter(([, v]) => v === 'Free' || v === '0%' || v === 0)
    .map(([k]) => k)

  const prompt = `You are a US trade agreement expert writing for a tariff information website.

Write a 150-200 word Trade Agreement Guide for importers of this product:

Product: "${code.description}"
HS Code: ${code.hts_code}
Base US Duty Rate: ${baseRate}%
Trade Agreements: ${agreementList || 'Standard MFN rates apply'}
${freeAgreements.length ? `Free trade under: ${freeAgreements.join(', ')}` : 'No preferential trade agreements apply'}

Write about:
1. Which trade agreements apply to this specific product and what rate they offer
2. Which countries to source from to get the best duty rate
3. Real savings example — what a $10,000 or $50,000 importer saves using the best agreement
4. One key requirement to qualify for the preferential rate (certificate of origin etc)

Rules:
- 150-200 words exactly
- Mention specific agreement names (USMCA, GSP, KORUS, CPTPP etc)
- Give real dollar savings examples
- Plain English — no jargon
- No markdown, flowing paragraphs only
- If no agreements apply, focus on MFN rate and any WTO considerations
- Be specific to THIS product`

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }]
    })
    return response.choices[0].message.content
  } catch (err) {
    console.error(`Trade guide failed for ${code.hts_code}:`, err.message)
    return ''
  }
}

async function main() {
  console.log('Generating trade guides (Groq Key 4)\n')

  const { data: codes, error } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate, trade_agreements')
    .or('trade_guide.is.null,trade_guide.eq.')
    .limit(BATCH_SIZE)

  if (error) { console.error('Supabase error:', error); return }
  if (!codes?.length) { console.log('All trade guides done!'); return }

  console.log(`Found ${codes.length} codes to process\n`)

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    process.stdout.write(`[${i + 1}/${codes.length}] ${code.hts_code}... `)
    const content = await generateTradeGuide(code)
    if (content) {
      await supabase.from('hs_codes').update({ trade_guide: content }).eq('id', code.id)
      console.log('done')
    } else {
      console.log('skipped')
    }
    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log('\nTrade guides batch complete!')
}

main().catch(console.error)
