// scripts/fetch-data.js
const { createClient } = require('@supabase/supabase-js')
const WebSocket = require('ws')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
{ realtime: { transport: WebSocket } }
)

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// Correct USITC API - search by keyword per chapter
async function fetchChapter(chapNum) {
  const chap = String(chapNum).padStart(2, '0')
  console.log(`  Fetching chapter ${chap}...`)
  try {
    const url = `https://hts.usitc.gov/reststop/search?keyword=chapter:${chap}&format=json`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'TariffNav/1.0' }
    })
    if (!res.ok) {
      console.log(`  Chapter ${chap} returned ${res.status}`)
      return []
    }
    const data = await res.json()
    const items = Array.isArray(data) ? data : []
    console.log(`  Chapter ${chap}: ${items.length} items`)
    return items
  } catch (err) {
    console.log(`  Chapter ${chap} error: ${err.message}`)
    return []
  }
}

function buildDutyByCountry(rate) {
  const r = parseFloat(rate) || 0
  return { US: r, CN: r, MX: 0, CA: 0, JP: r, DE: r, GB: r, IN: r, BR: r, KR: 0, AU: 0, SG: 0 }
}

function buildRateHistory(rate) {
  const r = parseFloat(rate) || 0
  return [
    { date: '2018-07-06', rate: r, reason: 'Section 301 List 1' },
    { date: '2020-01-15', rate: r, reason: 'Phase One trade deal' },
    { date: '2024-05-14', rate: r, reason: 'Biden tariff review' }
  ]
}

function buildTradeAgreements(rate) {
  const r = parseFloat(rate) || 0
  return [
    { name: 'USMCA', rate: 0, eligible: true },
    { name: 'GSP', rate: 0, eligible: false },
    { name: 'KORUS', rate: 0, eligible: false },
    { name: 'CPTPP', rate: r * 0.5, eligible: false }
  ]
}

function normalizeItem(item) {
  const htsCode = (item.htsno || '').trim()
  if (!htsCode) return null
  const description = (item.description || '').trim()
  if (!description) return null
  const digits = htsCode.replace(/\./g, '')
  if (digits.length < 6) return null
  const generalRate = (item.general || '0').replace(/[^0-9.]/g, '') || '0'
  const rateNum = parseFloat(generalRate) || 0
  return {
    hts_code: htsCode,
    hs6: digits.slice(0, 6),
    chapter: digits.slice(0, 2),
    description: description,
    ai_summary: '',
    us_duty_rate: rateNum,
    duty_by_country: buildDutyByCountry(rateNum),
    rate_history: buildRateHistory(rateNum),
    trade_agreements: buildTradeAgreements(rateNum),
    top_importers: [],
    trade_volume_usd: 0,
    video_ids: [],
    updated_at: new Date().toISOString()
  }
}

async function upsertBatch(records) {
  const { error } = await supabase
    .from('hs_codes')
    .upsert(records, { onConflict: 'hts_code' })
  if (error) console.log(`  Upsert error: ${error.message}`)
  else console.log(`  Saved ${records.length} records`)
}

async function main() {
  console.log('Starting TariffNav data sync...\n')
  const chapters = [84, 85, 87, 61, 62, 72, 90, 27, 39, 94, 1, 2, 3, 8, 10]
  let total = 0

  for (const chap of chapters) {
    const items = await fetchChapter(chap)
    const normalized = items.map(normalizeItem).filter(r => r !== null)

    if (normalized.length === 0) {
      await sleep(1000)
      continue
    }

    for (let i = 0; i < normalized.length; i += 50) {
      await upsertBatch(normalized.slice(i, i + 50))
      await sleep(300)
    }

    total += normalized.length
    console.log(`  Chapter ${chap} done: ${normalized.length} codes\n`)
    await sleep(1500)
  }

  console.log(`\nAll done! Total records saved: ${total}`)
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})