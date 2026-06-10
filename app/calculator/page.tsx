'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CalculatorPage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedCode, setSelectedCode] = useState<any>(null)
  const [shipmentValue, setShipmentValue] = useState('')
  const [country, setCountry] = useState('US')

  async function searchCodes(q: string) {
    setQuery(q)
    if (q.length < 2) { setSuggestions([]); return }
    const { data } = await supabase
      .from('hs_codes')
      .select('hts_code, description, us_duty_rate, duty_by_country')
      .or(`hts_code.ilike.${q}%,description.ilike.%${q}%`)
      .limit(6)
    setSuggestions(data || [])
  }

  function selectCode(code: any) {
    setSelectedCode(code)
    setQuery(code.hts_code + ' — ' + code.description.slice(0, 50))
    setSuggestions([])
  }

  const dutyRate = selectedCode
    ? (selectedCode.duty_by_country?.[country] ?? selectedCode.us_duty_rate ?? 0)
    : 0
  const value = parseFloat(shipmentValue) || 0
  const dutyOwed = value * (dutyRate / 100)
  const totalLanded = value + dutyOwed

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        Import Duty Calculator
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Find any HS code and calculate your exact duty cost.
      </p>

      {/* Step 1: Search HS Code */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Step 1 — Select HS Code
        </div>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={e => searchCodes(e.target.value)}
            placeholder="Type HS code or product name (e.g. laptop, 8471)"
            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'var(--bg-card)', border: '1px solid var(--border-glow)', borderRadius: '8px', marginTop: '4px' }}>
              {suggestions.map(s => (
                <div key={s.hts_code} onClick={() => selectCode(s)}
                  style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{s.hts_code}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.description.slice(0, 80)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedCode && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Selected: <span style={{ color: 'var(--accent)' }}>{selectedCode.hts_code}</span> — US Rate: <span style={{ color: '#22c55e' }}>{selectedCode.us_duty_rate === 0 ? 'Free' : selectedCode.us_duty_rate + '%'}</span>
          </div>
        )}
      </div>

      {/* Step 2: Shipment Value */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Step 2 — Shipment Value (USD)
        </div>
        <input
          type="number"
          value={shipmentValue}
          onChange={e => setShipmentValue(e.target.value)}
          placeholder="e.g. 10000"
          style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem', boxSizing: 'border-box' }}
        />
      </div>

      {/* Step 3: Country */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Step 3 — Importing From
        </div>
        <select value={country} onChange={e => setCountry(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <option value="US">United States (Base Rate)</option>
          <option value="CN">China</option>
          <option value="MX">Mexico (USMCA)</option>
          <option value="CA">Canada (USMCA)</option>
          <option value="JP">Japan</option>
          <option value="DE">Germany</option>
          <option value="GB">United Kingdom</option>
          <option value="IN">India</option>
          <option value="KR">South Korea (KORUS)</option>
          <option value="AU">Australia</option>
        </select>
      </div>

      {/* Results */}
      {selectedCode && value > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          {[
            { label: 'Duty Rate', value: dutyRate === 0 ? 'FREE' : `${dutyRate}%`, color: dutyRate === 0 ? '#22c55e' : '#fbbf24' },
            { label: 'Duty Owed', value: `$${dutyOwed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'var(--text-primary)' },
            { label: 'Total Landed', value: `$${totalLanded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: 'var(--accent)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{s.label}</div>
              <div className="font-display" style={{ fontSize: '1.5rem', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}