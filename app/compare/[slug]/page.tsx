import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CompareCharts from '@/components/CompareCharts'

type Props = { params: { slug: string } }

// slug format: "8471-30__US-vs-CN"
function parseSlug(slug: string) {
  const [codePart, countryPart] = slug.split('__')
  const code = codePart.replace(/-/g, '.')
  const countries = (countryPart || 'US-vs-CN').split('-vs-')
  return { code, countries }
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', CN: 'China', MX: 'Mexico', CA: 'Canada',
  DE: 'Germany', JP: 'Japan', GB: 'United Kingdom', IN: 'India',
  BR: 'Brazil', KR: 'South Korea', AU: 'Australia', SG: 'Singapore',
  FR: 'France', VN: 'Vietnam', TH: 'Thailand', IT: 'Italy',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code, countries } = parseSlug(params.slug)
  const countryNames = countries.map(c => COUNTRY_NAMES[c] || c).join(' vs ')
  return {
    title: `HS ${code} — ${countryNames} Duty Rate Comparison`,
    description: `Compare import duty rates for HS code ${code} between ${countryNames}. Which country offers the lowest tariff rate? Updated from official government sources.`,
  }
}

export default async function ComparePage({ params }: Props) {
  const { code, countries } = parseSlug(params.slug)

  const { data: hsCode } = await supabase
    .from('hs_codes')
    .select('*')
    .eq('hts_code', code)
    .single()

  if (!hsCode) notFound()

  const countryData = countries.map(c => ({
    code: c,
    name: COUNTRY_NAMES[c] || c,
    rate: hsCode.duty_by_country?.[c] ?? hsCode.us_duty_rate ?? 0,
  }))

  const winner = countryData.reduce((a, b) => a.rate <= b.rate ? a : b)
  const loser  = countryData.reduce((a, b) => a.rate >= b.rate ? a : b)
  const saving = loser.rate - winner.rate

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

      {/* Breadcrumb */}
      <nav style={{ padding: '1.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href={`/hs-code/${code.replace(/\./g, '-')}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>HS {code}</a>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>Compare {countries.join(' vs ')}</span>
      </nav>

      {/* Hero */}
      <section style={{ padding: '2rem 0 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-elevated)', padding: '3px 10px', borderRadius: '6px', color: 'var(--accent)', border: '1px solid var(--border-glow)' }}>
            HTS {hsCode.hts_code}
          </code>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duty Rate Comparison</span>
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', lineHeight: 1.2, marginBottom: '1rem' }}>
          {countryData.map(c => c.name).join(' vs ')}
          <br/>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75em' }}>for {hsCode.description.slice(0, 70)}{hsCode.description.length > 70 ? '…' : ''}</span>
        </h1>
      </section>

      {/* Side-by-side rate cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${countryData.length}, 1fr)`, gap: '12px', marginBottom: '2rem' }}>
        {countryData.map(country => {
          const isWinner = country.code === winner.code
          const rateColor = country.rate === 0 ? '#22c55e' : country.rate < 5 ? '#86efac' : country.rate < 15 ? '#fbbf24' : '#f87171'
          return (
            <div key={country.code} className="card" style={{ textAlign: 'center', ...(isWinner ? { borderColor: 'var(--border-glow)', boxShadow: '0 0 20px rgba(34,197,94,0.08)' } : {}) }}>
              {isWinner && (
                <div style={{ fontSize: '0.7rem', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-glow)', borderRadius: '100px', padding: '2px 10px', display: 'inline-block', marginBottom: '10px' }}>
                  ★ Lowest Rate
                </div>
              )}
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                {country.code === 'US' ? '🇺🇸' : country.code === 'CN' ? '🇨🇳' : country.code === 'MX' ? '🇲🇽' : country.code === 'CA' ? '🇨🇦' : country.code === 'DE' ? '🇩🇪' : country.code === 'JP' ? '🇯🇵' : country.code === 'GB' ? '🇬🇧' : country.code === 'IN' ? '🇮🇳' : '🌍'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{country.name}</div>
              <div className="font-display" style={{ fontSize: '2.5rem', color: rateColor, lineHeight: 1 }}>
                {country.rate === 0 ? 'Free' : `${country.rate}%`}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>duty rate</div>
            </div>
          )
        })}
      </div>

      {/* AI winner recommendation */}
      <div className="card" style={{ marginBottom: '2rem', borderLeft: '3px solid var(--accent)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Analysis
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {saving > 0
            ? `Importing HS code ${code} from ${winner.name} currently offers a ${winner.rate === 0 ? 'duty-free' : `${winner.rate}%`} rate — saving ${saving.toFixed(1)} percentage points compared to importing from ${loser.name} at ${loser.rate}%. On a $100,000 shipment, this represents a saving of $${(saving * 1000).toLocaleString()} in duty costs. ${winner.rate === 0 ? `The zero rate for ${winner.name} is likely the result of an active trade agreement such as USMCA or a GSP preference.` : ''}`
            : `Both countries currently offer the same duty rate of ${winner.rate === 0 ? 'duty free' : `${winner.rate}%`} for this HS code. Check applicable trade agreements below for potential further reductions.`
          }
        </p>
      </div>

      {/* Comparison charts */}
      <CompareCharts countryData={countryData} history={hsCode.rate_history} />

      {/* Savings calculator */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Savings Calculator</h2>
        <SavingsCalc countryData={countryData} />
      </section>

      {/* Back to full code page */}
      <div style={{ textAlign: 'center' }}>
        <Link href={`/hs-code/${code.replace(/\./g, '-')}`}
          style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← View full data for HS {code}
        </Link>
      </div>

    </div>
  )
}

// Inline savings calculator — no extra file needed
function SavingsCalc({ countryData }: { countryData: { code: string; name: string; rate: number }[] }) {
  return (
    <div className="card" suppressHydrationWarning>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Enter your shipment value to see the exact duty saving between countries.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${countryData.length + 1}, 1fr)`, gap: '1px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ background: 'var(--bg-elevated)', padding: '1rem', fontWeight: 500, fontSize: '0.875rem' }}>
          Shipment Value
        </div>
        {countryData.map(c => (
          <div key={c.code} style={{ background: 'var(--bg-elevated)', padding: '1rem', textAlign: 'center', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {c.name}
          </div>
        ))}
        {[10000, 50000, 100000, 500000].map(val => (
          <>
            <div key={`v-${val}`} style={{ background: 'var(--bg-card)', padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
              ${val.toLocaleString()}
            </div>
            {countryData.map(c => (
              <div key={`${val}-${c.code}`} style={{ background: 'var(--bg-card)', padding: '0.875rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: c.rate === 0 ? '#22c55e' : 'var(--text-primary)' }}>
                ${(val * c.rate / 100).toLocaleString()}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('hs_codes')
    .select('hts_code')
    .limit(1000)

  const pairs = [
    ['US', 'CN'], ['US', 'MX'], ['US', 'DE'],
    ['CN', 'MX'], ['US', 'JP'], ['US', 'IN'],
  ]

  return (data || []).flatMap(row =>
    pairs.map(([a, b]) => ({
      slug: `${row.hts_code.replace(/\./g, '-')}__${a}-vs-${b}`
    }))
  )
}
