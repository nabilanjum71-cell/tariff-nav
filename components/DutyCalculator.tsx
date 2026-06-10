'use client'
import { useState } from 'react'
import HsSearch from '@/components/HsSearch'
import type { HSCode } from '@/lib/supabase'

const COUNTRIES = [
  { code: 'US', name: 'United States (Base)' },
  { code: 'CN', name: 'China' },
  { code: 'MX', name: 'Mexico (USMCA)' },
  { code: 'CA', name: 'Canada (USMCA)' },
  { code: 'JP', name: 'Japan' },
  { code: 'DE', name: 'Germany (EU)' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'KR', name: 'South Korea' },
  { code: 'AU', name: 'Australia' },
]

type Props = { hsCode?: HSCode }

export default function DutyCalculator({ hsCode: initialHsCode }: Props) {
  const [hsCode, setHsCode] = useState<HSCode | undefined>(initialHsCode)
  const [value, setValue] = useState('')
  const [country, setCountry] = useState('US')
  const [currency, setCurrency] = useState('USD')

  const numValue = parseFloat(value) || 0
  const dutyRate = hsCode?.duty_by_country?.[country] ?? hsCode?.us_duty_rate ?? 0
  const dutyAmount = numValue * (dutyRate / 100)
  const totalLanded = numValue + dutyAmount

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'

  function fmt(n: number) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--bg-elevated))' }}>
     {/* HS Code Search */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>HS Code</label>
        <HsSearch
          placeholder="Type code or product name…"
          autoNavigate={false}
          onSelect={code => setHsCode({ ...code, us_duty_rate: parseFloat(code.us_duty_rate) || 0 } as any)}
        />
        {hsCode && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Selected: <strong style={{ color: 'var(--accent)' }}>{(hsCode as any).hts_code}</strong>
          </div>
     )}
      </div>

      {/* Country and Currency Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Importing From</label>
          <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: '100%' }}>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Currency</label>
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ width: '100%' }}>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
          </select>
        </div>
      </div>

      {numValue > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden', animation: 'fadeUp 0.3s ease both' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Duty Rate</div>
            <div className="font-display" style={{ fontSize: '1.5rem', color: dutyRate === 0 ? '#22c55e' : dutyRate < 15 ? '#fbbf24' : '#f87171' }}>
              {dutyRate === 0 ? 'FREE' : `${dutyRate}%`}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Duty Owed</div>
            <div className="font-display" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              {currencySymbol}{fmt(dutyAmount)}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Landed</div>
            <div className="font-display" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>
              {currencySymbol}{fmt(totalLanded)}
            </div>
          </div>
        </div>
      )}

      {!numValue && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>
          Enter a shipment value to calculate your duty cost instantly
        </div>
      )}
    </div>
  )
}
