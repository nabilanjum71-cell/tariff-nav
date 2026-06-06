// scripts/fetch-videos.js
// Fetches YouTube videos for each HS chapter (97 chapters only)
// Uses free YouTube Data API v3 — 10,000 units/day quota

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const YT_API_KEY = process.env.YOUTUBE_API_KEY

async function fetchVideosForChapter(chapter) {
  const queries = [
    `how to import ${chapter.title} tariff guide`,
    `${chapter.title} customs duty import`,
  ]

  const query = queries[0]
  const url = `https://www.googleapis.com/youtube/v3/search?` +
    `q=${encodeURIComponent(query)}` +
    `&maxResults=3` +
    `&type=video` +
    `&videoEmbeddable=true` +
    `&relevanceLanguage=en` +
    `&key=${YT_API_KEY}`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`YouTube API error: ${res.status}`)
    const data = await res.json()

    if (data.error) throw new Error(data.error.message)

    const videoIds = (data.items || []).map(item => item.id.videoId).filter(Boolean)
    console.log(`  📺 Found ${videoIds.length} videos for chapter ${chapter.chapter_num}`)
    return videoIds
  } catch (err) {
    console.error(`  ❌ YouTube failed for chapter ${chapter.chapter_num}:`, err.message)
    return []
  }
}

async function main() {
  if (!YT_API_KEY) {
    console.log('⚠️  No YOUTUBE_API_KEY found. Skipping video fetch.')
    console.log('   Get a free key at: https://console.cloud.google.com')
    return
  }

  console.log('📺 Fetching YouTube videos for HS chapters...\n')

  const { data: chapters, error } = await supabase
    .from('chapters')
    .select('id, chapter_num, title')
    .order('chapter_num')

  if (error || !chapters?.length) {
    console.error('No chapters found in DB:', error?.message)
    return
  }

  console.log(`Processing ${chapters.length} chapters (uses ~${chapters.length * 100} YouTube API units)\n`)

  for (const chapter of chapters) {
    process.stdout.write(`Chapter ${chapter.chapter_num}: ${chapter.title.slice(0, 40)}... `)

    const videoIds = await fetchVideosForChapter(chapter)

    if (videoIds.length > 0) {
      await supabase
        .from('chapters')
        .update({ video_ids: videoIds })
        .eq('id', chapter.id)
    }

    // 500ms delay between requests to be respectful
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n✅ Video fetch complete!')
  console.log(`   Used ~${chapters.length * 100} of 10,000 daily YouTube API units`)
}

main().catch(console.error)
