import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tariff-nav.vercel.app'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/chapters`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Chapter pages (97 total)
  const chapterPages: MetadataRoute.Sitemap = Array.from({ length: 97 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    return {
      url: `${baseUrl}/chapter/${num}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })

  // HS Code entity pages (up to 500K)
  const { data: codes } = await supabase
    .from('hs_codes')
    .select('hts_code, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50000) // Sitemap max is 50K URLs per file

  const codePages: MetadataRoute.Sitemap = (codes || []).map(code => ({
    url: `${baseUrl}/hs-code/${code.hts_code.replace(/\./g, '-')}`,
    lastModified: new Date(code.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...chapterPages, ...codePages]
}
