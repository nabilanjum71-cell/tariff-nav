export async function GET() {
  const baseUrl = 'https://tariff-nav.vercel.app'

  const staticUrls = [
    { url: baseUrl, priority: '1.0', freq: 'daily' },
    { url: `${baseUrl}/chapters`, priority: '0.9', freq: 'weekly' },
    { url: `${baseUrl}/blog`, priority: '0.8', freq: 'daily' },
    { url: `${baseUrl}/calculator`, priority: '0.7', freq: 'monthly' },
    { url: `${baseUrl}/compare`, priority: '0.7', freq: 'monthly' },
    { url: `${baseUrl}/privacy`, priority: '0.3', freq: 'yearly' },
    { url: `${baseUrl}/terms`, priority: '0.3', freq: 'yearly' },
    { url: `${baseUrl}/disclaimer`, priority: '0.3', freq: 'yearly' },
    ...Array.from({ length: 97 }, (_, i) => ({
      url: `${baseUrl}/chapter/${String(i + 1).padStart(2, '0')}`,
      priority: '0.8',
      freq: 'weekly',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(({ url, priority, freq }) => `  <url>
    <loc>${url}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}