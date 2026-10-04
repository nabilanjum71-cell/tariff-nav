import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { ExpandedPage } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('expanded_pages')
    .select('title, content')
    .eq('type', 'guide')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Page Not Found' }

  return {
    title: `${data.title} | TariffNav Guides`,
    description: (data.content || data.title).slice(0, 155),
    alternates: {
      canonical: `https://tariff-nav.vercel.app/guides/${params.slug}`,
    },
    openGraph: {
      title: data.title,
      description: (data.content || '').slice(0, 200),
    }
  }
}

export default async function GuidePage({ params }: Props) {
  const { data: page } = await supabase
    .from('expanded_pages')
    .select('*')
    .eq('type', 'guide')
    .eq('slug', params.slug)
    .single<ExpandedPage>()

  if (!page || !page.content) notFound()

  const { data: otherGuides } = await supabase
    .from('expanded_pages')
    .select('slug, name')
    .eq('type', 'guide')
    .neq('slug', params.slug)
    .not('content', 'is', null)
    .limit(5)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tariff-nav.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://tariff-nav.vercel.app/guides' },
      { '@type': 'ListItem', position: 3, name: page.name, item: `https://tariff-nav.vercel.app/guides/${params.slug}` },
    ],
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    url: `https://tariff-nav.vercel.app/guides/${params.slug}`,
    publisher: { '@type': 'Organization', name: 'TariffNav' }
  }

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.duty-speakable'] },
    url: `https://tariff-nav.vercel.app/guides/${params.slug}`
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

      <nav style={{ padding: '1.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/guides" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Guides</a>
      </nav>

      <header style={{ padding: '1.5rem 0 2rem' }}>
        <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{page.title}</h1>
      </header>

      <section style={{ marginBottom: '2.5rem' }}>
        <div className="card duty-speakable" style={{ color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '0.98rem', whiteSpace: 'pre-line' }}>
          {page.content}
        </div>
      </section>

      {otherGuides && otherGuides.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>More Import Guides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {otherGuides.map((g) => (
              <a key={g.slug} href={`/guides/${g.slug}`} className="card" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, padding: '0.85rem 1rem' }}>
                {g.name} →
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('expanded_pages')
    .select('slug')
    .eq('type', 'guide')

  return (data || []).map(row => ({ slug: row.slug }))
}
