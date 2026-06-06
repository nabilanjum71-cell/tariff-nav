import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import DutyRateHero from '@/components/DutyRateHero'
import DutyBarChart from '@/components/charts/DutyBarChart'
import RateHistoryChart from '@/components/charts/RateHistoryChart'
import ImportShareChart from '@/components/charts/ImportShareChart'
import WorldMap from '@/components/WorldMap'
import DutyCalculator from '@/components/DutyCalculator'
import TradeAgreements from '@/components/TradeAgreements'
import RelatedCodes from '@/components/RelatedCodes'
import type { HSCode } from '@/lib/supabase'

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

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

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
        </div>

        {/* AI Summary */}
        {hsCode.ai_summary && (
          <div className="card" style={{ marginTop: '1.5rem', borderLeft: '3px solid var(--accent)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Plain-English Summary
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {hsCode.ai_summary}
            </p>
          </div>
        )}
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
