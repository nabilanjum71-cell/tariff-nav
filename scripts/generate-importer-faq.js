const Groq = require('groq-sdk')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const groq = new Groq({ apiKey: process.env.GROQ_KEY_5 })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH_SIZE = 50
const DELAY_MS = 1200

async function generateImporterFaq(code) {
  const rate = parseFloat(code.us_duty_rate) || 0
  const agreements = code.trade_agreements || {}
  const freeAgreements = Object.entries(agreements)
    .filter(([, v]) => v === 'Free' || v === '0%' || v === 0)
    .map(([k]) => k)

  const prompt = `You are a US customs expert writing FAQ content for a tariff website.

Write exactly 5 FAQ questions and answers for US importers of this product:

Product: "${code.description}"
HS Code: ${code.hts_code}
US Duty Rate: ${rate}%
${freeAgreements.length ? `Free under: ${freeAgreements.join(', ')}` : ''}

Format EXACTLY like this — no deviation:
Q1: [question]
A1: [answer in 40-60 words]

Q2: [question]
A2: [answer in 40-60 words]

Q3: [question]
A3: [answer in 40-60 words]

Q4: [question]
A4: [answer in 40-60 words]

Q5: [question]
A5: [answer in 40-60 words]

Questions must cover:
1. What is the duty rate and what does it cost in dollars
2. Is it subject to Section 301 China tariffs
3. Which trade agreements apply and how to qualify
4. What documents are required to import this product
5. One specific question unique to this product type

Rules:
- Each answer 40-60 words — no more, no less
- Direct answer in first sentence
- Plain English
- Specific to THIS product — not generic
- Real dollar examples where relevant`

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }]
    })
    return response.choices[0].message.content
  } catch (err) {
    console.error(`FAQ failed for ${code.hts_code}:`, err.message)
    return ''
  }
}

async function main() {
  console.log('Generating importer FAQs (Groq Key 5)\n')

  const { data: codes, error } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate, trade_agreements, rate_history')
    .is('importer_faq', null)
    .limit(BATCH_SIZE)

  if (error) { console.error('Supabase error:', error); return }
  if (!codes?.length) { console.log('All FAQs done!'); return }

  console.log(`Found ${codes.length} codes to process\n`)

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    process.stdout.write(`[${i + 1}/${codes.length}] ${code.hts_code}... `)
    const content = await generateImporterFaq(code)
    if (content) {
      await supabase.from('hs_codes').update({ importer_faq: content }).eq('id', code.id)
      console.log('done')
    } else {
      console.log('skipped')
    }
    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log('\nImporter FAQs batch complete!')
}

main().catch(console.error)
