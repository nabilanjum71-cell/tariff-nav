'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HsSearch from '@/components/HsSearch'
import DutyCalculator from '@/components/DutyCalculator'
import { RecentChanges } from '@/components/shared'

const HS_CHAPTERS = [
  { num: '01', title: 'Live Animals', icon: '🐄' },
  { num: '02', title: 'Meat & Edible Offal', icon: '🥩' },
  { num: '03', title: 'Fish & Seafood', icon: '🐟' },
  { num: '08', title: 'Fruits & Nuts', icon: '🍊' },
  { num: '10', title: 'Cereals', icon: '🌾' },
  { num: '27', title: 'Mineral Fuels & Oil', icon: '⛽' },
  { num: '29', title: 'Organic Chemicals', icon: '🧪' },
  { num: '39', title: 'Plastics', icon: '🔩' },
  { num: '61', title: 'Knitted Clothing', icon: '👕' },
  { num: '62', title: 'Woven Clothing', icon: '👔' },
  { num: '72', title: 'Iron & Steel', icon: '🏗️' },
  { num: '84', title: 'Machinery', icon: '⚙️' },
  { num: '85', title: 'Electrical Equipment', icon: '💡' },
  { num: '87', title: 'Vehicles', icon: '🚗' },
  { num: '90', title: 'Optical & Medical', icon: '🔬' },
  { num: '94', title: 'Furniture', icon: '🛋️' },
]

const POPULAR_SEARCHES = [
  { code: '8471.30.01', label: 'Laptops' },
  { code: '8517.12.00', label: 'Smartphones' },
  { code: '6109.10.00', label: 'T-Shirts' },
  { code: '0901.11.00', label: 'Coffee' },
  { code: '8708.29.10', label: 'Auto Parts' },
  { code: '2709.00.10', label: 'Crude Oil' },
]
export default function HomePage() {
  const [query, setQuery] = useState('')
  const [stats, setStats] = useState({ total_codes: 0, countries: 164, chapters: 97 })

  useEffect(() => {
    supabase.from('hs_codes').select('id', { count: 'exact', head: true })
      .then(({ count }) => { if (count) setStats(s => ({ ...s, total_codes: count })) })
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    const cleaned = query.trim().replace(/\s+/g, '').replace(/\./g, '-')
    window.location.href = `/hs-code/${cleaned}`
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center' }}>
        <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-dim)', border: '1px solid var(--border-glow)', borderRadius: '100px', padding: '4px 14px', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--accent)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
          Updated daily from USITC · WTO · UN Comtrade
        </div>

        <h1 className="animate-fade-up delay-100 font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.15, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Every HS Tariff Code,<br />
          <span style={{ color: 'var(--accent)' }}>Plain &amp; Simple</span>
        </h1>

        <p className="animate-fade-up delay-200" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          Duty rates, trade agreements, country comparisons, and import data for 500,000+ HS codes. Free, always up-to-date.
        </p>

   {/* Popular searches */}
        <div className="animate-fade-up delay-400" style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {POPULAR_SEARCHES.map(s => (
            <Link key={s.code} href={`/hs-code/${s.code.replace(/\./g, '-')}`}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-secondary)'; (e.target as HTMLElement).style.borderColor = 'var(--border)' }}
            >
              {s.code} · {s.label}
            </Link>
          ))}
        </div>
        {/* Search */}
      <div className="animate-fade-up delay-300" style={{ maxWidth: '520px', margin: '0 auto 1rem' }}>
  <HsSearch />
</div>

     
      </section>

      {/* ── Stats bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '3rem' }}>
        {[
          { label: 'HS Codes Tracked', value: stats.total_codes > 0 ? stats.total_codes.toLocaleString() : '500,000+' },
          { label: 'Countries Covered', value: '164' },
          { label: 'HS Chapters', value: '97' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', padding: '1.25rem', textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '2rem', color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Duty Calculator ── */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Quick Duty Calculator</h2>
        <DutyCalculator />
      </section>

      {/* ── Browse by Chapter ── */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.6rem' }}>Browse by Chapter</h2>
          <Link href="/chapters" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>View all 97 →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {HS_CHAPTERS.map(ch => (
            <Link key={ch.num} href={`/chapter/${ch.num}`}
              className="card"
              style={{ textDecoration: 'none', display: 'block', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border-glow)'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.transform = 'none' }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{ch.icon}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>CH. {ch.num}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{ch.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent Tariff Changes ── */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Recent Tariff Changes</h2>
        <RecentChanges />
      </section>

    </div>
  )
}
