import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { RelatedCodes } from '@/components/shared'
import type { ExpandedPage } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('expanded_pages')
    .select('name, title, content')
    .eq('type', 'product')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Page Not Found' }

  return {
    title: `${data.title} | TariffNav`,
    description: (data.content || `US import duty guide for ${data.name}`).slice(0, 155),
    alternates: {
      canonical: `https://tariff-nav.vercel.app/import/${params.slug}`,
    },
    openGraph: {
      title: data.title,
      description: (data.content || '').slice(0, 200),
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { data: page } = await supabase
    .from('expanded_pages')
    .select('*')
    .eq('type', 'product')
    .eq('slug', params.slug)
    .single<ExpandedPage>()

  if (!page || !page.content) notFound()

  // Best-effort match to relevant HS codes by product name
  const searchTerm = page.name.replace(/s$/i, '')
  const { data: related } = await supabase
    .from('hs_codes')
    .select('hts_code, description, us_duty_rate')
    .ilike('description', `%${searchTerm}%`)
    .limit(6)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tariff-nav.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Import', item: 'https://tariff-nav.vercel.app/import' },
      { '@type': 'ListItem', position: 3, name: page.name, item: `https://tariff-nav.vercel.app/import/${params.slug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the US import duty rate for ${page.name.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: page.content.slice(0, 250)
        }
      },
      {
        '@type': 'Question',
        name: `How do I find the exact HS code for ${page.name.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use TariffNav's HS code search to find the specific 10-digit code for your exact product, since duty rates can vary within a product category depending on material, use, and specification.`
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
        <span>Import {page.name}</span>
      </nav>

      <header style={{ padding: '1.5rem 0 2rem' }}>
        <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{page.title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          General duty rate ranges, HS code guidance, and compliance tips for importing {page.name.toLowerCase()} into the US.
        </p>
      </header>

      <section style={{ marginBottom: '2.5rem' }}>
        {(() => {
          const paragraphs = page.content.split(/\n\n+/).filter(p => p.trim())
          const sections = [
            { label: 'HS Code Classification', border: 'var(--accent)' },
            { label: 'Typical Duty Rate Range', border: 'var(--warning)' },
            { label: 'Compliance Requirements', border: '#22c55e' },
            { label: 'Cost-Saving Tip', border: '#a78bfa' },
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

      {related && related.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Related HS Codes</h2>
          <RelatedCodes codes={related} />
        </section>
      )}

      <section style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Need the exact duty rate for your specific product?
          </p>
          <a href="/" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Search HS Codes →</a>
        </div>
      </section>
    </div>
  )
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('expanded_pages')
    .select('slug')
    .eq('type', 'product')

  return (data || []).map(row => ({ slug: row.slug }))
}
