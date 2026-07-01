import { supabase } from '@/lib/supabase'

const PAGE_SIZE = 3000

export async function GET(
  _req: Request,
  context: { params: Promise<{ page: string }> }
) {
  const baseUrl = 'https://tariff-nav.vercel.app'
  const { page: pageParam } = await context.params
  const page = parseInt(pageParam) || 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('hs_codes')
    .select('hts_code, updated_at')
    .order('hts_code', { ascending: true })
    .range(from, to)

  if (error) {
    return new Response('Error fetching codes', { status: 500 })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(data || []).map(code => `  <url>
    <loc>${baseUrl}/hs-code/${code.hts_code.replace(/\./g, '-')}</loc>
    <lastmod>${new Date(code.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}