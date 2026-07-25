const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH_SIZE = 100
const DELAY_MS = 800

async function generateImportGuide(code) {
  const dutyText = code.us_duty_rate === 0
    ? 'duty-free (0%)'
    : `${code.us_duty_rate}% duty rate`

  const tradeAgreements = code.trade_agreements
    ? Object.entries(code.trade_agreements)
        .filter(([, v]) => v === 'Free' || v === '0%' || v === 0)
        .map(([k]) => k)
        .join(', ')
    : ''

  const prompt = `You are a US customs and trade expert writing for a tariff information website.

Write a 150-200 word Import Guide for US importers of this specific product:

Product: "${code.description}"
HS Code: ${code.hts_code}
US Duty Rate: ${dutyText}
${code.trade_volume_usd ? `Annual Trade Volume: $${(code.trade_volume_usd / 1e9).toFixed(1)} Billion` : ''}
${code.top_importers ? `Top Source Countries: ${code.top_importers}` : ''}
${tradeAgreements ? `Trade Agreement Benefits: ${tradeAgreements}` : ''}

Write SPECIFICALLY about THIS product. Cover:
1. What industries and businesses import this product and why
2. Key considerations for US importers of this specific item
3. Most important compliance or documentation points
4. One specific practical tip unique to this product type

Rules:
- 150-200 words exactly
- Plain English, no jargon
- No markdown, no bullet points — flowing paragraphs only
- Be specific to THIS product — not generic import advice
- Do not start with "Importing" or "When importing"
- Write as if advising a real US business owner`

  try {
    if (!process.env.MISTRAL_KEY_1) {
      console.error('MISTRAL_KEY_1 is not set!')
      return ''
    }
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_KEY_1}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        max_tokens: 350,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    if (!response.ok) {
      const errText = await response.text()
      console.error(`Mistral API error ${response.status}:`, errText)
      return ''
    }
    const data = await response.json()
    return data.choices?.[0]?.message?.content?.trim() || ''
  } catch (err) {
    console.error(`Import guide failed for ${code.hts_code}:`, err.message)
    return ''
  }
}

async function main() {
  console.log('Generating import guides (Mistral Key 1)\n')

  const { data: codes, error } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate, trade_agreements, top_importers, trade_volume_usd')
    .or('import_guide.is.null,import_guide.eq.""')
    .limit(BATCH_SIZE)

  if (error) { console.error('Supabase error:', error); return }
  if (!codes?.length) { console.log('All import guides done!'); return }

  console.log(`Found ${codes.length} codes to process\n`)

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    process.stdout.write(`[${i + 1}/${codes.length}] ${code.hts_code}... `)
    const content = await generateImportGuide(code)
    if (content) {
      await supabase.from('hs_codes').update({ import_guide: content }).eq('id', code.id)
      console.log('done')
    } else {
      console.log('skipped')
    }
    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log('\nImport guides batch complete!')
}

main().catch(console.error)
