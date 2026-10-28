'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Find any HS code and calculate your exact duty cost.
      </p>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Enter a product name or HS code, add your shipment value in USD, and choose the country you are importing from. The calculator applies the correct duty rate — including Section 301 tariffs for China and preferential rates under USMCA and GSP — and shows your duty owed and total landed cost instantly. Free, no sign-up.
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

      {/* FAQ — indexable text for duty calculator queries */}
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Frequently Asked Questions</h2>

        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>How is US import duty calculated?</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Multiply your shipment's customs value by the duty rate for its HS code. For example, a $10,000 shipment at a 5% duty rate owes $500 in duty. Merchandise Processing Fees (MPF) and Harbor Maintenance Fees (HMF) may also apply.</p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Do I pay extra duty on goods imported from China?</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Many Chinese goods carry additional Section 301 tariffs on top of the standard duty rate. Select China in the calculator above to see the applicable rate for your HS code, including any Section 301 duty.</p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Can a trade agreement reduce my duty to zero?</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Yes. Goods that qualify under agreements such as USMCA (Canada and Mexico) or GSP can enter at 0% duty with a valid Certificate of Origin. The calculator shows preferential rates where they apply.</p>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: "How is US import duty calculated?",
                acceptedAnswer: { '@type': 'Answer', text: "Multiply your shipment's customs value by the duty rate for its HS code. For example, a $10,000 shipment at a 5% duty rate owes $500 in duty. Merchandise Processing Fees (MPF) and Harbor Maintenance Fees (HMF) may also apply." },
              },
              {
                '@type': 'Question',
                name: "Do I pay extra duty on goods imported from China?",
                acceptedAnswer: { '@type': 'Answer', text: "Many Chinese goods carry additional Section 301 tariffs on top of the standard duty rate. Select China in the calculator above to see the applicable rate for your HS code, including any Section 301 duty." },
              },
              {
                '@type': 'Question',
                name: "Can a trade agreement reduce my duty to zero?",
                acceptedAnswer: { '@type': 'Answer', text: "Yes. Goods that qualify under agreements such as USMCA (Canada and Mexico) or GSP can enter at 0% duty with a valid Certificate of Origin. The calculator shows preferential rates where they apply." },
              },
            ],
          }),
        }}
      />
    </div>
  )
}