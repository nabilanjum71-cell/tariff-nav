import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tariff-nav.vercel.app'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/chapters`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
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

  // HS Code entity pages — paginate in chunks since Supabase/PostgREST
  // caps rows per request (commonly 1000) regardless of .limit() value.
  const PAGE_SIZE = 1000
  let allCodes: { hts_code: string; updated_at: string }[] = []
  let from = 0
  let keepGoing = true

  while (keepGoing) {
    const { data, error } = await supabase
      .from('hs_codes')
      .select('hts_code, updated_at')
      .order('hts_code', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.error('Sitemap fetch error:', error.message)
      break
    }

    if (!data || data.length === 0) {
      keepGoing = false
      break
    }

    allCodes = allCodes.concat(data)

    if (data.length < PAGE_SIZE) {
      keepGoing = false
    } else {
      from += PAGE_SIZE
    }
  }

  const codePages: MetadataRoute.Sitemap = allCodes.map(code => ({
    url: `${baseUrl}/hs-code/${code.hts_code.replace(/\./g, '-')}`,
    lastModified: new Date(code.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...chapterPages, ...codePages]
}