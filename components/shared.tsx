'use client'
import Link from 'next/link'

// ── Trade Agreements ─────────────────────────────────────────────────────────
export function TradeAgreements({ agreements, baseRate }: { agreements: any[], baseRate: number }) {
  if (!agreements?.length) return null
  return (
    <div className="card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Agreement</th>
            <th>Preferential Rate</th>
            <th>Savings vs Base</th>
            <th>Eligible</th>
          </tr>
        </thead>
        <tbody>
          {agreements.map((ag, i) => {
            const savings = baseRate - ag.rate
            return (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{ag.name}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: ag.rate === 0 ? '#22c55e' : '#fbbf24' }}>
                  {ag.rate === 0 ? 'Free' : `${ag.rate}%`}
                </td>
                <td style={{ color: savings > 0 ? '#22c55e' : 'var(--text-muted)' }}>
                  {savings > 0 ? `−${savings.toFixed(1)}%` : '—'}
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '100px', ...(ag.eligible ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' } : { background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid var(--border)' }) }}>
                    {ag.eligible ? '✓ Yes' : '✗ No'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Related Codes ────────────────────────────────────────────────────────────
export function RelatedCodes({ codes }: { codes: { hts_code: string; description: string; us_duty_rate: number }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
      {codes.map(code => {
        const rateColor = code.us_duty_rate === 0 ? '#22c55e' : code.us_duty_rate < 5 ? '#86efac' : code.us_duty_rate < 15 ? '#fbbf24' : '#f87171'
        return (
          <Link key={code.hts_code} href={`/hs-code/${code.hts_code.replace(/\./g, '-')}`}
            className="card"
            style={{ textDecoration: 'none', display: 'block', transition: 'border-color 0.2s, transform 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.transform = 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)', display: 'block', marginBottom: '4px' }}>{code.hts_code}</code>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{code.description.slice(0, 80)}{code.description.length > 80 ? '...' : ''}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: rateColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {code.us_duty_rate === 0 ? 'Free' : `${code.us_duty_rate}%`}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// ── Recent Changes (from Federal Register) ───────────────────────────────────
export function RecentChanges() {
  // In production: fetch from supabase rate_changes table
  const mockChanges = [
    { title: 'USTR Announces Section 301 Duty Modifications on Solar Panel Components', date: '2024-05-15', type: 'increase' },
    { title: 'GSP Benefit Restoration for Certain Agricultural Products', date: '2024-04-22', type: 'decrease' },
    { title: 'Steel and Aluminum Section 232 Tariff Exclusion Renewals', date: '2024-04-10', type: 'neutral' },
    { title: 'USMCA Origin Verification Procedures — Updated Guidance', date: '2024-03-28', type: 'neutral' },
    { title: 'China Section 301 List 4A Rate Adjustment Effective June 2024', date: '2024-03-14', type: 'increase' },
  ]

  return (
    <div className="card">
      {mockChanges.map((change, i) => (
        <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 0', borderBottom: i < mockChanges.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', whiteSpace: 'nowrap', marginTop: '2px', ...(change.type === 'increase' ? { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' } : change.type === 'decrease' ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' } : { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }) }}>
            {change.type === 'increase' ? '▲ Rate Up' : change.type === 'decrease' ? '▼ Rate Down' : '→ Update'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{change.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>{change.date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── World Map (SVG placeholder — replace with full map data) ─────────────────
export function WorldMap({ dutyByCountry }: { dutyByCountry: Record<string, number> }) {
  function getColor(countryCode: string) {
    const rate = dutyByCountry?.[countryCode]
    if (rate === undefined) return '#1e293b'
    if (rate === 0) return '#22c55e'
    if (rate < 5) return '#86efac'
    if (rate < 15) return '#fbbf24'
    return '#ef4444'
  }

  // Simplified world regions as visual placeholder
  // In production: use a full SVG world map with country paths
  const regions = [
    { name: 'North America', countries: ['US','CA','MX'], x: 80, y: 130, w: 120, h: 80 },
    { name: 'Europe', countries: ['DE','GB','FR','IT'], x: 350, y: 80, w: 100, h: 70 },
    { name: 'East Asia', countries: ['CN','JP','KR'], x: 580, y: 110, w: 90, h: 60 },
    { name: 'South Asia', countries: ['IN'], x: 530, y: 160, w: 60, h: 50 },
    { name: 'South America', countries: ['BR'], x: 180, y: 250, w: 80, h: 90 },
    { name: 'Australia', countries: ['AU'], x: 600, y: 260, w: 70, h: 55 },
  ]

  return (
    <div>
      <svg viewBox="0 0 750 350" style={{ width: '100%', borderRadius: '8px' }}>
        <rect width="750" height="350" fill="#0f172a" rx="8"/>
        {/* Ocean */}
        <rect x="0" y="0" width="750" height="350" fill="#0f172a" rx="8"/>

        {regions.map(region => {
          const repCountry = region.countries[0]
          const color = getColor(repCountry)
          const rate = dutyByCountry?.[repCountry]
          return (
            <g key={region.name}>
              <rect x={region.x} y={region.y} width={region.w} height={region.h}
                fill={color} opacity={0.85} rx={6}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              />
              <text x={region.x + region.w / 2} y={region.y + region.h / 2 - 7}
                textAnchor="middle" fill="rgba(0,0,0,0.8)" fontSize="9" fontFamily="var(--font-body)" fontWeight="600">
                {region.name}
              </text>
              <text x={region.x + region.w / 2} y={region.y + region.h / 2 + 7}
                textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize="10" fontFamily="var(--font-mono)">
                {rate === undefined ? '—' : rate === 0 ? 'Free' : `${rate}%`}
              </text>
            </g>
          )
        })}

        <text x="375" y="335" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="var(--font-body)">
          Representative rates shown — see table above for full country list
        </text>
      </svg>
    </div>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', marginTop: '4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="font-display" style={{ fontSize: '1rem', marginBottom: '4px' }}>TariffNav</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Data from USITC · WTO · UN Comtrade · Federal Register. Updated daily.
          </div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Not legal or financial advice. Verify rates with a licensed customs broker.
        </div>
      </div>
    </footer>
  )
}

export { Footer as default }
