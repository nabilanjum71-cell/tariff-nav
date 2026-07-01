import { supabase } from '@/lib/supabase'

export async function GET() {
  const baseUrl = 'https://tariff-nav.vercel.app'

  // Get total count
  const { count } = await supabase
    .from('hs_codes')
    .select('*', { count: 'exact', head: true })

  const totalPages = Math.ceil((count || 14556) / 3000)

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  ${Array.from({ length: totalPages }, (_, i) => `
  <sitemap>
    <loc>${baseUrl}/sitemap-codes-${i + 1}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}