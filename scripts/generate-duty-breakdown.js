const Groq = require('groq-sdk')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const groq = new Groq({ apiKey: process.env.GROQ_KEY_5 })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH_SIZE = 100
const DELAY_MS = 500

async function generateDutyBreakdown(code) {
  const rate = parseFloat(code.us_duty_rate) || 0
  const mpf = 0.3464
  const hmf = 0.125

  const calc10k = {
    duty: (10000 * rate / 100).toFixed(2),
    mpf: Math.min(10000 * mpf / 100, 614.35).toFixed(2),
    hmf: (10000 * hmf / 100).toFixed(2),
    total: (10000 + (10000 * rate / 100) + Math.min(10000 * mpf / 100, 614.35) + (10000 * hmf / 100)).toFixed(2)
  }
  const calc50k = {
    duty: (50000 * rate / 100).toFixed(2),
    mpf: Math.min(50000 * mpf / 100, 614.35).toFixed(2),
    hmf: (50000 * hmf / 100).toFixed(2),
    total: (50000 + (50000 * rate / 100) + Math.min(50000 * mpf / 100, 614.35) + (50000 * hmf / 100)).toFixed(2)
  }

  const section301 = code.rate_history
    ? JSON.stringify(code.rate_history).includes('301')
    : false

  const prompt = `You are a US customs broker writing for a tariff information website.

Write a 150-200 word Duty Cost Breakdown for importers of this product:

Product: "${code.description}"
HS Code: ${code.hts_code}
Base US Duty Rate: ${rate}%
MPF (Merchandise Processing Fee): 0.3464%
HMF (Harbor Maintenance Fee): 0.125%
${section301 ? 'Note: This product has been subject to Section 301 China tariffs.' : ''}

Real cost examples:
$10,000 shipment: Duty $${calc10k.duty} + MPF $${calc10k.mpf} + HMF $${calc10k.hmf} = Total $${calc10k.total}
$50,000 shipment: Duty $${calc50k.duty} + MPF $${calc50k.mpf} + HMF $${calc50k.hmf} = Total $${calc50k.total}

Write about:
1. What the ${rate}% duty rate means in real dollar terms using the examples above
2. Explain MPF and HMF briefly in plain English
3. ${section301 ? 'Mention Section 301 China tariff history' : 'Mention any duty savings opportunities'}
4. One tip to minimize total landed cost

Rules:
- 150-200 words exactly
- Use the real dollar figures above
- Plain English for a business owner
- No markdown, flowing paragraphs only
- Be specific to THIS product`

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }]
    })
    return response.choices[0]?.message?.content?.trim() || ''
  } catch (err) {
    console.error(`Duty breakdown failed for ${code.hts_code}:`, err.message)
    return ''
  }
}

async function main() {
  console.log('Generating duty breakdowns (Groq Key 5)\n')

  const { data: codes, error } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate, rate_history, trade_agreements')
    .is('duty_breakdown', null)
    .limit(BATCH_SIZE)

  if (error) { console.error('Supabase error:', error); return }
  if (!codes?.length) { console.log('All duty breakdowns done!'); return }

  console.log(`Found ${codes.length} codes to process\n`)

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    process.stdout.write(`[${i + 1}/${codes.length}] ${code.hts_code}... `)
    const content = await generateDutyBreakdown(code)
    if (content) {
      await supabase.from('hs_codes').update({ duty_breakdown: content }).eq('id', code.id)
      console.log('done')
    } else {
      console.log('skipped')
    }
    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log('\nDuty breakdowns batch complete!')
}

main().catch(console.error)
