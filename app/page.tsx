'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import DutyCalculator from '@/components/DutyCalculator'
import { RecentChanges } from '@/components/shared'

const HS_CHAPTERS = [
  { num: '01', title: 'Live Animals', icon: '🐄' },
  { num: '02', title: 'Meat & Edible Offal', icon: '🥩' },
  { num: '03', title: 'Fish & Seafood', icon: '🐟' },
  { num: '08', title: 'Fruits & Nuts', icon: '🍎' },
  { num: '10', title: 'Cereals', icon: '🌾' },
  { num: '27', title: 'Mineral Fuels & Oil', icon: '⚜' },
  { num: '29', title: 'Organic Chemicals', icon: '🧪' },
  { num: '39', title: 'Plastics', icon: '🔩' },
  { num: '61', title: 'Knitted Clothing', icon: '👕' },
  { num: '62', title: 'Woven Clothing', icon: '👔' },
  { num: '72', title: 'Iron & Steel', icon: '🏗' },
  { num: '84', title: 'Machinery', icon: '⚙' },
  { num: '85', title: 'Electrical Equipment', icon: '💡' },
  { num: '87', title: 'Vehicles', icon: '🚗' },
  { num: '90', title: 'Optical & Medical', icon: '🔬' },
  { num: '94', title: 'Furniture', icon: '🪑' },
]

const POPULAR_SEARCHES = [
  { code: '8471.30', label: 'Laptops' },
  { code: '8517.12', label: 'Smartphones' },
  { code: '6109.10', label: 'T-Shirts' },
  { code: '0901.11', label: 'Coffee' },
  { code: '8708.29', label: 'Auto Parts' },
  { code: '2709.00', label: 'Crude Oil' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [stats, setStats] = useState({ total_codes: 0 })
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('hs_codes').select('id', { count: 'exact', head: true })
      .then(({ count }) => { if (count) setStats({ total_codes: count }) })
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Autocomplete — search after 2 characters
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('hs_codes')
        .select('hts_code, description, us_duty_rate')
        .or(`hts_code.ilike.${query}%,description.ilike.%${query}%`)
        .limit(8)
      if (data && data.length > 0) {
        setSuggestions(data)
        setShowSuggestions(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    const cleaned = query.trim().replace(/\./g, '-').replace(/\s+/g, '-')
    window.location.href =  `/hs-code/${cleaned}-01-00`
  }

  function goToCode(htsCode: string) {
    const slug = htsCode.replace(/\./g, '-')
    window.location.href =  `/hs-code/${slug}-01-00`
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

      {/* Hero */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-dim)', border: '1px solid var(--border-glow)', borderRadius: '100px', padding: '4px 14px', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--accent)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          Updated daily from USITC · WTO · UN Comtrade
        </div>

        <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.15, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Every HS Tariff Code,<br />
          <span style={{ color: 'var(--accent)' }}>Plain & Simple</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          Duty rates, trade agreements, country comparisons, and import data for 500,000+ HS codes. Free, always up-to-date.
        </p>

        {/* Search with autocomplete */}
        <div ref={searchRef} style={{ position: 'relative', maxWidth: '520px', margin: '0 auto 1rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Enter HS code or product name..."
              style={{ flex: 1, fontSize: '1rem', padding: '0.75rem 1rem' }}
              autoComplete="off"
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              Search
            </button>
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
              background: 'var(--bg-card)', border: '1px solid var(--border-glow)',
              borderRadius: '12px', marginTop: '6px', overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
              {suggestions.map((s, i) => (
                <div
                  key={s.hts_code}
                  onClick={() => goToCode(s.hts_code)}
                  style={{
                    padding: '10px 16px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      {s.hts_code}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.description}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: s.us_duty_rate === 0 ? 'var(--accent)' : 'var(--warning)', marginLeft: '12px', whiteSpace: 'nowrap' }}>
                    {s.us_duty_rate === 0 ? 'Free' : `${s.us_duty_rate}%`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular searches */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {POPULAR_SEARCHES.map(s => (
            <Link key={s.code} href={`/hs-code/${s.code.replace(/\./g, '-')}`}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              {s.code} · {s.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '3rem' }}>
        {[
          { label: 'HS Codes Tracked', value: stats.total_codes > 0 ? stats.total_codes.toLocaleString() : '24,800+' },
          { label: 'Countries Covered', value: '164' },
          { label: 'HS Chapters', value: '97' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', padding: '1.25rem', textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '2rem', color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Duty Calculator */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Quick Duty Calculator</h2>
        <DutyCalculator />
      </section>

      {/* Browse by Chapter */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.6rem' }}>Browse by Chapter</h2>
          <Link href="/chapter/84" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {HS_CHAPTERS.map(ch => (
            <Link key={ch.num} href={`/chapter/${ch