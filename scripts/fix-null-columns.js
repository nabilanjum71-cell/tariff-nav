const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('Setting empty string columns to NULL...\n')

  const cols = ['import_guide', 'importer_faq', 'duty_breakdown', 'trade_guide']

  for (const col of cols) {
    // Use rpc with raw SQL to update empty strings to null
    const { error } = await supabase.rpc('exec_sql', {
      sql: `UPDATE hs_codes SET ${col} = NULL WHERE ${col} = ''`
    })
    if (error) {
      // Try direct update approach
      console.log(`Direct update for ${col}...`)
      let from = 0
      let total = 0
      while (true) {
        const { data, error: fetchErr } = await supabase
          .from('hs_codes')
          .select('id')
          .eq(col, '')
          .limit(1000)
        
        if (fetchErr || !data?.length) break
        
        const ids = data.map(r => r.id)
        await supabase.from('hs_codes').update({ [col]: null }).in('id', ids)
        total += ids.length
        console.log(`  ${col}: nullified ${total} rows...`)
        if (data.length < 1000) break
      }
      console.log(`  ${col}: done! ${total} rows updated`)
    } else {
      console.log(`  ${col}: SQL update done!`)
    }
  }

  console.log('\nAll columns nullified! Scripts will now find rows correctly.')
}

main().catch(console.error)
