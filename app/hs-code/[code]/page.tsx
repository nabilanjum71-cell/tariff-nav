import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import DutyRateHero from '@/components/DutyRateHero'
import { DutyBarChart } from '@/components/charts/DutyBarChart'
import RateHistoryChart from '@/components/charts/RateHistoryChart'
import ImportShareChart from '@/components/charts/ImportShareChart'
import { WorldMap } from '@/components/shared'
import DutyCalculator from '@/components/DutyCalculator'
import { TradeAgreements } from '@/components/shared'
import { RelatedCodes } from '@/components/shared'
import type { HSCode } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type Props = { params: { code: string } }

// Convert URL slug back to HTS code: "8471-30-01" → "8471.30.01"
function slugToCode(slug: string) {
  return slug.replace(/-/g, '.')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const code = slugToCode(params.code)
  const { data } = await supabase
    .from('hs_codes')
    .select('hts_code, description, us_duty_rate')
    .eq('hts_code', code)
    .single()

  if (!data) return { title: 'HS Code Not Found' }

  return {
    title: `HS Code ${data.hts_code} — ${data.description.slice(0, 60)}`,
    description: `Import duty rates for HS code ${data.hts_code}: ${data.description}. Current US rate: ${data.us_duty_rate}%. View rates for 164 countries, trade agreements, and history.`,
    openGraph: {
      title: `HS ${data.hts_code} — Duty Rate: ${data.us_duty_rate === 0 ? 'Free' : data.us_duty_rate + '%'}`,
      description: data.description,
    }
  }
}

export default async function HSCodePage({ params }: Props) {
  const code = slugToCode(params.code)

  const { data: hsCode } = await supabase
    .from('hs_codes')
    .select('*')
    .eq('hts_code', code)
    .single()

  if (!hsCode) notFound()

  // Get related codes (same HS chapter)
  const chapter = code.split('.')[0].slice(0, 2)
  const { data: related } = await supabase
    .from('hs_codes')
    .select('hts_code, description, us_duty_rate')
    .neq('hts_code', code)
    .ilike('hts_code', `${chapter}%`)
    .limit(6)

  const lastUpdated = new Date(hsCode.updated_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  const rateClass =
    hsCode.us_duty_rate === 0 ? 'rate-free' :
    hsCode.us_duty_rate < 5 ? 'rate-low' :
    hsCode.us_duty_rate < 15 ? 'rate-mid' : 'rate-high'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tariff-nav.vercel.app' },
      { '@type': 'ListItem', position: 2, name: `Chapter ${chapter}`, item: `https://tariff-nav.vercel.app/chapter/${chapter}` },
      { '@type': 'ListItem', position: 3, name: hsCode.hts_code, item: `https://tariff-nav.vercel.app/hs-code/${params.code}` },
    ],
  }

  const rate = hsCode.us_duty_rate
  const agreements = hsCode.trade_agreements || {}
  const freeAgreements = Object.entries(agreements)
    .filter(([, v]: [string, any]) => v === 'Free' || v === '0%' || v === 0)
    .map(([k]) => k)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the US import duty rate for ${hsCode.description}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The US import duty rate for ${hsCode.description} (HS code ${hsCode.hts_code}) is ${rate === 0 ? 'free (0%)' : `${rate}%`}. On a $10,000 shipment, you would pay $${(10000 * rate / 100).toFixed(2)} in duties plus MPF of $${Math.min(10000 * 0.003464, 614.35).toFixed(2)} and HMF of $12.50.`
        }
      },
      {
        '@type': 'Question',
        name: `Is ${hsCode.description} eligible for USMCA duty-free treatment?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: freeAgreements.includes('USMCA')
            ? `Yes, ${hsCode.description} (HS code ${hsCode.hts_code}) qualifies for 0% duty under USMCA when imported from Canada or Mexico, compared to the standard ${rate}% MFN rate. A Certificate of Origin is required to claim this benefit.`
            : `${hsCode.description} (HS code ${hsCode.hts_code}) does not qualify for preferential USMCA rates. The standard ${rate === 0 ? 'free (0%)' : `${rate}%`} MFN rate applies regardless of country of origin.`
        }
      },
      {
        '@type': 'Question',
        name: `What trade agreements apply to HS code ${hsCode.hts_code}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: freeAgreements.length > 0
            ? `HS code ${hsCode.hts_code} qualifies for 0% duty under ${freeAgreements.join(', ')}. Importers sourcing from eligible countries can save significantly compared to the standard ${rate}% MFN rate by providing a valid Certificate of Origin.`
            : `HS code ${hsCode.hts_code} is subject to the standard MFN rate of ${rate === 0 ? 'free (0%)' : `${rate}%`}. No preferential trade agreement rates currently apply to this product.`
        }
      },
      {
        '@type': 'Question',
        name: `What documents are required to import ${hsCode.description} into the USA?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `To import ${hsCode.description} into the United States, you typically need a commercial invoice, packing list, bill of lading or airway bill, and CBP Form 7501 (Entry Summary). If claiming trade agreement benefits, a Certificate of Origin is also required.`
        }
      },
      {
        '@type': 'Question',
        name: `How do I calculate the total landed cost for HS code ${hsCode.hts_code}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `To calculate total landed cost for HS code ${hsCode.hts_code}, add your shipment value plus ${rate === 0 ? '0% duty' : `${rate}% duty`}, plus MPF (0.3464%, max $614.35), plus HMF (0.125%). For a $10,000 shipment the total is approximately $${(10000 + (10000 * rate / 100) + Math.min(10000 * 0.003464, 614.35) + 10000 * 0.00125).toFixed(2)}.`
        }
      }
    ]
  }

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.duty-speakable']
    },
    url: `https://tariff-nav.vercel.app/hs-code/${params.code}`
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

      {/* Breadcrumb */}
      <nav style={{ padding: '1.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href={`/chapter/${chapter}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Chapter {chapter}</a>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{hsCode.hts_code}</span>
      </nav>

      {/* ── Hero section ── */}
      <section style={{ padding: '2rem 0 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'var(--bg-elevated)', padding: '3px 10px', borderRadius: '6px', color: 'var(--accent)', border: '1px solid var(--border-glow)' }}>
                HTS {hsCode.hts_code}
              </code>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated {lastUpdated}</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 1.25, maxWidth: '700px', color: 'var(--text-primary)' }}>
              {hsCode.description}
            </h1>
          </div>

          {/* Big duty rate badge */}
          <div style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 2rem', flexShrink: 0 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>US Duty Rate</div>
            <DutyRateHero rate={hsCode.us_duty_rate} />
            <div className={`${rateClass}`} style={{ fontSize: '0.75rem', borderRadius: '100px', padding: '2px 10px', marginTop: '6px', display: 'inline-block' }}>
              {hsCode.us_duty_rate === 0 ? 'Duty Free' : hsCode.us_duty_rate < 5 ? 'Low Rate' : hsCode.us_duty_rate < 15 ? 'Moderate' : 'High Rate'}
            </div>
          </div>

          {/* Speakable div for voice search */}
          <p className="duty-speakable" style={{ display: 'none' }}>
            {`The US import duty rate for ${hsCode.description} under HS code ${hsCode.hts_code} is ${hsCode.us_duty_rate === 0 ? 'free, meaning zero percent duty' : `${hsCode.us_duty_rate} percent`}. ${freeAgreements.length > 0 ? `This product qualifies for zero percent duty under ${freeAgreements.join(' and ')} trade agreements.` : ''}`}
          </p>
        </div>

        {/* AI Summary — or auto-generated for pages without one */}
        <div className="card" style={{ marginTop: '1.5rem', borderLeft: '3px solid var(--accent)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Plain-English Summary
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            {hsCode.ai_summary || `${hsCode.description} is classified under HS tariff code ${hsCode.hts_code} in the US Harmonized Tariff Schedule. Importers bringing this product into the United States are subject to ${hsCode.us_duty_rate === 0 ? 'duty-free (0%)' : `a ${hsCode.us_duty_rate}% duty rate`} at the border. Accurate HS classification is essential to ensure correct duty payment and avoid customs delays or penalties.`}
          </p>
        </div>

        {/* Quick Facts Card */}
        <div className="card" style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'HS Code', value: hsCode.hts_code, mono: true, color: 'var(--accent)' },
            { label: 'US Duty Rate', value: hsCode.us_duty_rate === 0 ? 'FREE (0%)' : `${hsCode.us_duty_rate}%`, mono: true, color: hsCode.us_duty_rate === 0 ? '#22c55e' : 'var(--warning)' },
            { label: 'MPF Fee', value: '0.3464%', mono: true, color: 'var(--text-secondary)' },
            { label: 'HMF Fee', value: '0.125%', mono: true, color: 'var(--text-secondary)' },
            { label: 'Countries', value: '164 covered', mono: false, color: 'var(--text-secondary)' },
          ].map(({ label, value, mono, color }) => (
            <div key={label}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontSize: '0.9rem', color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Instant Cost Estimates — zero API, pure math */}
        <div className="card" style={{ marginTop: '1rem', background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Instant Cost Estimate
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {[10000, 50000, 100000].map(shipVal => {
              const duty = shipVal * (hsCode.us_duty_rate / 100)
              const mpf = Math.min(shipVal * 0.003464, 614.35)
              const hmf = shipVal * 0.00125
              const total = shipVal + duty + mpf + hmf
              return (
                <div key={shipVal} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>${shipVal.toLocaleString()} shipment</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                    <div>Duty: <span style={{ color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>${duty.toFixed(2)}</span></div>
                    <div>MPF: <span style={{ fontFamily: 'var(--font-mono)' }}>${mpf.toFixed(2)}</span></div>
                    <div>HMF: <span style={{ fontFamily: 'var(--font-mono)' }}>${hmf.toFixed(2)}</span></div>
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '4px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Total: <span style={{ color: '#22c55e', fontFamily: 'var(--font-mono)' }}>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Charts grid ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Duty Rates by Country</h2>
        <div className="card">
          <DutyBarChart data={hsCode.duty_by_country} />
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Rate History</h2>
          <div className="card">
            <RateHistoryChart history={hsCode.rate_history} />
          </div>
        </div>
        <div>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Import Share</h2>
          <div className="card">
            <ImportShareChart importers={hsCode.top_importers} />
          </div>
        </div>
      </div>

      {/* ── World Map ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Global Duty Rate Map</h2>
        <div className="card">
          <WorldMap dutyByCountry={hsCode.duty_by_country} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['#22c55e', 'Free (0%)'], ['#86efac', 'Low (<5%)'], ['#fbbf24', 'Moderate (5–15%)'], ['#ef4444', 'High (>15%)']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: color as string, display: 'inline-block' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Duty Calculator ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Calculate Your Duty Cost</h2>
        <DutyCalculator hsCode={hsCode} />
      </section>

      {/* ── Trade Agreements ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Active Trade Agreements</h2>
        <TradeAgreements agreements={hsCode.trade_agreements} baseRate={hsCode.us_duty_rate} />
      </section>

      {/* ── Rate Change Timeline ── */}
      {hsCode.rate_history?.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Rate Change History</h2>
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {hsCode.rate_history.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 0', borderBottom: i < hsCode.rate_history.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingTop: '2px', minWidth: '90px' }}>{item.date}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item.reason}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: item.rate === 0 ? 'var(--accent)' : 'var(--warning)', whiteSpace: 'nowrap' }}>
                    {item.rate === 0 ? 'Free' : `${item.rate}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trade Agreement Savings Table — zero API ── */}
      {hsCode.trade_agreements && Object.keys(hsCode.trade_agreements).length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Trade Agreement Savings</h2>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Agreement', 'Preferential Rate', 'Standard Rate', 'You Save', 'Eligible Countries'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(hsCode.trade_agreements).map(([name, rawRate]: [string, any]) => {
                  // Safely convert rate to string regardless of whether it's object, number, or string
                  const prefRate: string = typeof rawRate === 'object' && rawRate !== null
                    ? (rawRate.rate ?? rawRate.value ?? 'See details').toString()
                    : String(rawRate ?? '')
                  const isFree = prefRate === 'Free' || prefRate === '0%' || prefRate === '0' || rawRate === 0
                  const numericRate = isFree ? 0 : parseFloat(prefRate) || 0
                  const saving = hsCode.us_duty_rate - numericRate
                  const countryMap: Record<string, string> = {
                    USMCA: 'Canada, Mexico',
                    GSP: '120+ developing countries',
                    KORUS: 'South Korea',
                    CPTPP: 'Japan, Vietnam, Canada, Australia + 7 more',
                    CAFTA: 'Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua, Dominican Republic',
                    FTA: 'Various FTA partners',
                  }
                  return (
                    <tr key={name} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{name}</td>
                      <td style={{ padding: '10px 12px', color: '#22c55e', fontWeight: 600 }}>{isFree ? 'Free (0%)' : prefRate}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{hsCode.us_duty_rate === 0 ? 'Free' : `${hsCode.us_duty_rate}%`}</td>
                      <td style={{ padding: '10px 12px', color: saving > 0 ? '#22c55e' : 'var(--text-muted)', fontWeight: saving > 0 ? 600 : 400 }}>
                        {saving > 0 ? `${saving.toFixed(1)}% saved` : 'Same rate'}
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{countryMap[name] || 'See agreement details'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p style={{ margin: '10px 12px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              💡 Certificate of Origin required to claim preferential rates. Verify eligibility with your customs broker.
            </p>
          </div>
        </section>
      )}

      {/* ── Import Guide ── */}
      {hsCode.import_guide && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Import Guide</h2>
          <div className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
              {hsCode.import_guide}
            </p>
          </div>
        </section>
      )}

      {/* ── Duty Breakdown ── */}
      {hsCode.duty_breakdown && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Duty Cost Breakdown</h2>
          <div className="card" style={{ borderLeft: '3px solid var(--warning)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
              {hsCode.duty_breakdown}
            </p>
          </div>
        </section>
      )}

      {/* ── Trade Agreement Guide ── */}
      {hsCode.trade_guide && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Trade Agreement Savings Guide</h2>
          <div className="card" style={{ borderLeft: '3px solid #22c55e' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
              {hsCode.trade_guide}
            </p>
          </div>
        </section>
      )}

      {/* ── Importer FAQ ── */}
      {hsCode.importer_faq && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
          <div className="card">
            {hsCode.importer_faq.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => {
              if (line.startsWith('Q')) {
                return (
                  <div key={i} style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', marginTop: i === 0 ? 0 : '1.25rem', marginBottom: '0.4rem' }}>
                    {line.replace(/^Q\d+:\s*/, '')}
                  </div>
                )
              }
              if (line.startsWith('A')) {
                return (
                  <div key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', paddingLeft: '0.75rem', borderLeft: '2px solid var(--border)' }}>
                    {line.replace(/^A\d+:\s*/, '')}
                  </div>
                )
              }
              return null
            })}
          </div>
        </section>
      )}

      {/* ── Related Codes ── */}
      {related && related.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Related HS Codes</h2>
          <RelatedCodes codes={related} />
        </section>
      )}

    </div>
  )
}

// Static site generation — generate pages for all codes at build time
export async function generateStaticParams() {
  const { data } = await supabase
    .from('hs_codes')
    .select('hts_code')
    .limit(10000)

  return (data || []).map(row => ({
    code: row.hts_code.replace(/\./g, '-')
  }))
}
