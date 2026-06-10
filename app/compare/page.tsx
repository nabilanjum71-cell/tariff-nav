'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ComparePage() {
  const [query1, setQuery1] = useState('')
  const [query2, setQuery2] = useState('')
  const [suggestions1, setSuggestions1] = useState<any[]>([])
  const [suggestions2, setSuggestions2] = useState<any[]>([])
  const [code1, setCode1] = useState<any>(null)
  const [code2, setCode2] = useState<any>(null)

  async function search(q: string, num: number) {
    if (num === 1) setQuery1(q)
    else setQuery2(q)
    if (q.length < 2) { num === 1 ? setSuggestions1([]) : setSuggestions2([]); return }
    const { data } = await supabase
      .from('hs_codes')
      .select('hts_code, description, us_duty_rate, duty_by_country')
      .or(`hts_code.ilike.${q}%,description.ilike.%${q}%`)
      .limit(5)
    num === 1 ? setSuggestions1(data || []) : setSuggestions2(data || [])
  }

  function select(code: any, num: number) {
    if (num === 1) { setCode1(code); setQuery1(code.hts_code); setSuggestions1([]) }
    else { setCode2(code); setQuery2(code.hts_code); setSuggestions2([]) }
  }

  const countries = ['US', 'CN', 'MX', 'CA', 'JP', 'DE', 'GB', 'IN', 'KR', 'AU']

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Compare HS Codes</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Compare duty rates for two HS codes side by side.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {[1, 2].map(num => (
          <div key={num} className="card">
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Code {num}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={num === 1 ? query1 : query2}
                onChange={e => search(e.target.value, num)}
                placeholder="Type HS code or product..."
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
              {(num === 1 ? suggestions1 : suggestions2).length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'var(--bg-card)', border: '1px solid var(--border-glow)', borderRadius: '8px', marginTop: '4px' }}>
                  {(num === 1 ? suggestions1 : suggestions2).map(s => (
                    <div key={s.hts_code} onClick={() => select(s, num)}
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{s.hts_code}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.description.slice(0, 60)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(num === 1 ? code1 : code2) && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {(num === 1 ? code1 : code2).description.slice(0, 80)}
              </div>
            )}
          </div>
        ))}
      </div>

      {code1 && code2 && (
        <div className="card">
          <h2 className="font-display" style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Duty Rate Comparison</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Country</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--accent)', fontSize: '0.75rem' }}>{code1.hts_code}</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--accent)', fontSize: '0.75rem' }}>{code2.hts_code}</th>
                <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Difference</th>
              </tr>
            </thead>
            <tbody>
              {countries.map(c => {
                const r1 = code1.duty_by_country?.[c] ?? code1.us_duty_rate ?? 0
                const r2 = code2.duty_by_country?.[c] ?? code2.us_duty_rate ?? 0
                const diff = r1 - r2
                return (
                  <tr key={c} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: r1 === 0 ? '#22c55e' : '#fbbf24' }}>
                      {r1 === 0 ? 'Free' : `${r1}%`}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: r2 === 0 ? '#22c55e' : '#fbbf24' }}>
                      {r2 === 0 ? 'Free' : `${r2}%`}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: diff === 0 ? 'var(--text-muted)' : diff > 0 ? '#f87171' : '#22c55e' }}>
                      {diff === 0 ? '—' : diff > 0 ? `+${diff}%` : `${diff}%`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}