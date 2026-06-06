import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DutyBarChart } from '@/components/charts/DutyBarChart'
import YouTubeSection from '@/components/YouTubeSection'

type Props = { params: { chapter: string } }

const CHAPTER_META: Record<string, { title: string; icon: string; description: string }> = {
  '01': { title: 'Live Animals', icon: '🐄', description: 'All live animals including livestock, poultry, fish, and other living creatures for import and export.' },
  '84': { title: 'Nuclear Reactors, Boilers, Machinery', icon: '⚙️', description: 'Industrial machinery, mechanical appliances, nuclear reactors, boilers, and their parts. One of the largest traded HS chapters globally.' },
  '85': { title: 'Electrical Machinery & Equipment', icon: '💡', description: 'Electrical machines, sound recorders, TV equipment, and their parts. Covers consumer electronics to industrial electrical systems.' },
  '87': { title: 'Vehicles & Automotive Parts', icon: '🚗', description: 'Motor vehicles, trailers, cycles, and their components. Subject to significant trade policy attention globally.' },
  '61': { title: 'Knitted or Crocheted Clothing', icon: '👕', description: 'T-shirts, sweaters, jerseys, and other knitted garments. High duty rates apply in many countries.' },
  '27': { title: 'Mineral Fuels, Mineral Oils', icon: '⛽', description: 'Petroleum, natural gas, coal, and related energy products. Among the highest-value globally traded commodities.' },
  '29': { title: 'Organic Chemicals', icon: '🧪', description: 'Organic chemical compounds used in pharmaceutical, agricultural, and industrial applications.' },
  '90': { title: 'Optical, Medical & Measuring Instruments', icon: '🔬', description: 'Medical devices, optical instruments, measuring equipment, and precision instruments.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CHAPTER_META[params.chapter]
  const title = meta?.title || `HS Chapter ${params.chapter}`
  return {
    title: `HS Chapter ${params.chapter} — ${title}`,
    description: `Browse all HS codes in Chapter ${params.chapter}: ${title}. Duty rates, trade data, and import guides for ${params.chapter} series codes.`,
  }
}

export default async function ChapterPage({ params }: Props) {
  const chapterNum = params.chapter.padStart(2, '0')
  const meta = CHAPTER_META[chapterNum] || { title: `Chapter ${chapterNum}`, icon: '📦', description: `All HS codes in chapter ${chapterNum}.` }

  // Get all codes in this chapter
  const { data: codes } = await supabase
    .from('hs_codes')
    .select('hts_code, description, us_duty_rate, trade_volume_usd')
    .ilike('hts_code', `${chapterNum.replace(/^0/, '')}%`)
    .order('hts_code')
    .limit(200)

  if (!codes) notFound()

  // Build duty distribution for bar chart
  const avgByCode: Record<string, number> = {}
  codes.forEach(c => { avgByCode[c.hts_code] = c.us_duty_rate })

  // Stats
  const rates = codes.map(c => c.us_duty_rate)
  const avgRate = rates.length ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1) : '0'
  const freeCount = rates.filter(r => r === 0).length
  const maxRate = Math.max(...rates)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

      {/* Breadcrumb */}
      <nav style={{ padding: '1.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/chapters" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Chapters</a>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>Chapter {chapterNum}</span>
      </nav>

      {/* Hero */}
      <section style={{ padding: '2rem 0 2.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{meta.icon}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-elevated)', padding: '3px 10px', borderRadius: '6px', color: 'var(--accent)', border: '1px solid var(--border-glow)' }}>
            Chapter {chapterNum}
          </code>
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>{meta.title}</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '680px', fontSize: '1rem' }}>{meta.description}</p>
      </section>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '2.5rem' }}>
        {[
          { label: 'HS Codes', value: codes.length },
          { label: 'Avg Duty Rate', value: `${avgRate}%` },
          { label: 'Duty Free Codes', value: freeCount },
          { label: 'Max Rate', value: maxRate > 0 ? `${maxRate}%` : 'Free' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', padding: '1.25rem', textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '1.75rem', color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Duty rate distribution chart */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>US Duty Rate by Code</h2>
        <div className="card">
          <DutyBarChart data={avgByCode} />
        </div>
      </section>

      {/* YouTube videos */}
      <YouTubeSection chapterTitle={meta.title} chapterNum={chapterNum} />

      {/* All codes table */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
          All HS Codes in Chapter {chapterNum}
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400, marginLeft: '10px' }}>({codes.length} codes)</span>
        </h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ padding: '0.75rem 1.25rem' }}>HTS Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>US Duty Rate</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(code => {
                const rateColor = code.us_duty_rate === 0 ? '#22c55e' : code.us_duty_rate < 5 ? '#86efac' : code.us_duty_rate < 15 ? '#fbbf24' : '#f87171'
                const slug = code.hts_code.replace(/\./g, '-')
                return (
                  <tr key={code.hts_code} style={{ transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>{code.hts_code}</code>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '400px' }}>
                      {code.description.slice(0, 100)}{code.description.length > 100 ? '…' : ''}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: rateColor, fontWeight: 500 }}>
                      {code.us_duty_rate === 0 ? 'Free' : `${code.us_duty_rate}%`}
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                      <Link href={`/hs-code/${slug}`}
                        style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', background: 'var(--accent-dim)', border: '1px solid var(--border-glow)', borderRadius: '6px', padding: '3px 10px' }}>
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Link to comparison */}
      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Compare duty rates across countries for any code in this chapter
        </div>
        <Link href={`/compare?chapter=${chapterNum}`} className="btn-primary">
          Compare Countries for Chapter {chapterNum}
        </Link>
      </div>

    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(CHAPTER_META).map(ch => ({ chapter: ch }))
}
