// scripts/generate-summaries.js
// Generates plain-English summaries for each HS code using Claude
// Run in batches: node scripts/generate-summaries.js --batch=1

const Anthropic = require('@anthropic-ai/sdk')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BATCH_SIZE = 50   // 50 per run to stay within free tier
const DELAY_MS = 1200   // 1.2s between calls to avoid rate limits

async function generateSummary(code) {
  const prompt = `You are writing content for a tariff information website. 
Write a 200-word plain-English explanation for importers about HS tariff code ${code.hts_code}.

Product: "${code.description}"
Current US duty rate: ${code.us_duty_rate}%

Cover these points naturally in 2-3 paragraphs:
1. What products this code covers (be specific with real examples)
2. Who typically imports this and why
3. The current US duty situation and any notable trade policy impacts
4. One practical tip for importers

Write in a helpful, professional tone. No jargon. No markdown. Plain paragraphs only.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }]
    })
    return response.content[0].text
  } catch (err) {
    console.error(`Summary failed for ${code.hts_code}:`, err.message)
    return `${code.description}. This HS code covers products subject to a ${code.us_duty_rate}% duty rate when imported into the United States. Check applicable trade agreements for potential duty reductions.`
  }
}

async function main() {
  const args = process.argv.slice(2)
  const batchArg = args.find(a => a.startsWith('--batch='))
  const batchNum = batchArg ? parseInt(batchArg.split('=')[1]) : 1
  const offset = (batchNum - 1) * BATCH_SIZE

  console.log(`🤖 Generating summaries — batch ${batchNum} (codes ${offset}–${offset + BATCH_SIZE})\n`)

  // Get codes that don't have summaries yet
  const { data: codes, error } = await supabase
    .from('hs_codes')
    .select('id, hts_code, description, us_duty_rate')
    .or('ai_summary.is.null,ai_summary.eq.')
    .range(offset, offset + BATCH_SIZE - 1)

  if (error) { console.error('Supabase error:', error); return }
  if (!codes?.length) { console.log('✅ All summaries up to date!'); return }

  console.log(`Found ${codes.length} codes needing summaries\n`)

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    process.stdout.write(`[${i + 1}/${codes.length}] ${code.hts_code}... `)

    const summary = await generateSummary(code)

    const { error: updateError } = await supabase
      .from('hs_codes')
      .update({ ai_summary: summary })
      .eq('id', code.id)

    if (updateError) console.error('Update failed:', updateError.message)
    else console.log('✅')

    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  console.log(`\n✅ Batch ${batchNum} complete. Run with --batch=${batchNum + 1} for next batch.`)
}

main().catch(console.error)
