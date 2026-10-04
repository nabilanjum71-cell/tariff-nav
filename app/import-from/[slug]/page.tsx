import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { ExpandedPage } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('expanded_pages')
    .select('name, title, content')
    .eq('type', 'country')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Page Not Found' }

  return {
    title: `${data.title} | TariffNav`,
    description: (data.content || `US import duty guide for goods from ${data.name}`).slice(0, 155),
    alternates: {
      canonical: `https://tariff-nav.vercel.app/import-from/${params.slug}`,
    },
    openGraph: {
      title: data.title,
      description: (data.content || '').slice(0, 200),
    }
  }
}

export default async function CountryPage({ params }: Props) {
  const { data: page } = await supabase
    .from('expanded_pages')
    .select('*')
    .eq('type', 'country')
    .eq('slug', params.slug)
    .single<ExpandedPage>()

  if (!page || !page.content) notFound()

  const { data: popularProducts } = await supabase
    .from('expanded_pages')
    .select('slug, name')
    .eq('type', 'product')
    .not('content', 'is', null)
    .limit(8)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tariff-nav.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Import From', item: 'https://tariff-nav.vercel.app/import-from' },
      { '@type': 'ListItem', position: 3, name: page.name, item: `https://tariff-nav.vercel.app/import-from/${params.slug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I calculate US import duty on goods from ${page.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Look up the specific HS code for your product on TariffNav to get the exact duty rate, then use the landed cost calculator to include MPF and HMF fees alongside the duty rate from ${page.name}.`
        }
      },
      {
        '@type': 'Question',
        name: `What products are commonly imported from ${page.name} to the US?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${page.content.slice(0, 220)}`
        }
      }
    ]
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav style={{ padding: '1.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <span>Import From {page.name}</span>
      </nav>

      <header style={{ padding: '1.5rem 0 2rem' }}>
        <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{page.title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          A guide to US import duty, trade agreement eligibility, and sourcing considerations for goods from {page.name}.
        </p>
      </header>

      <section style={{ marginBottom: '2.5rem' }}>
        {(() => {
          const paragraphs = page.content.split(/\n\n+/).filter(p => p.trim())
          const sections = [
            { label: 'What This Country Commonly Exports', border: 'var(--accent)' },
            { label: 'Typical Duty Rates', border: 'var(--warning)' },
            { label: 'Trade Agreement Status', border: '#22c55e' },
            { label: 'Practical Tips for Importers', border: '#a78bfa' },
          ]
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {paragraphs.map((para, i) => (
                <div key={i} className="card" style={{ borderLeft: `3px solid ${sections[i]?.border || 'var(--border)'}` }}>
                  {sections[i] && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: sections[i].border, marginBottom: '0.6rem' }}>
                      {sections[i].label}
                    </div>
                  )}
                  <p className="duty-speakable" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
                    {para.trim()}
                  </p>
                </div>
              ))}
            </div>
          )
        })()}
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Know the specific product? Look up its exact HS code and duty rate directly.
          </p>
          <a href="/" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Search HS Codes →</a>
        </div>
      </section>

      {popularProducts && popularProducts.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Popular Products to Import</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {popularProducts.map((p) => (
              <a key={p.slug} href={`/import/${p.slug}`} className="card" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, padding: '0.9rem 1rem' }}>
                {p.name}
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
    .eq('type', 'country')

  return (data || []).map(row => ({ slug: row.slug }))
}
