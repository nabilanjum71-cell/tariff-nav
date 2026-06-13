'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HsSearch from '@/components/HsSearch'
import DutyCalculator from '@/components/DutyCalculator'

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
  { code: '8708.29.50', label: 'Auto Parts' },
  { code: '2709.00.00', label: 'Crude Oil' },
]

const FAQ = [
  {
    q: 'What is an HS code?',
    a: 'An HS code (Harmonized System code) is a standardized numerical system used worldwide to classify traded products. Every physical product imported or exported has a unique HS code that determines its applicable duty rate, trade agreement eligibility, and customs treatment.'
  },
  {
    q: 'How do I find the right HS code for my product?',
    a: 'Use the search box above — type your product name (e.g. "laptop", "cotton shirt") or a partial code. TariffNav searches 14,000+ real USITC codes and returns the closest matches with their current duty rates.'
  },
  {
    q: 'Why do some products show a "Free" duty rate?',
    a: 'Many products enter the US duty-free under trade agreements like USMCA (with Canada and Mexico), GSP (developing countries), or KORUS (South Korea). Electronics like laptops and smartphones are duty-free under the WTO Information Technology Agreement.'
  },
  {
    q: 'How often are duty rates updated?',
    a: 'TariffNav syncs daily from USITC, the Federal Register, and WTO databases. Rate changes, new Section 301 tariffs, and trade agreement updates are reflected within 24 hours of official announcement.'
  },
  {
    q: 'What is the difference between HS codes and HTS codes?',
    a: 'HS codes are the international 6-digit standard set by the World Customs Organization. HTS codes (Harmonized Tariff Schedule) are the US-specific extension — they add up to 4 more digits for greater product specificity. TariffNav uses full 10-digit HTS codes for maximum accuracy.'
  },
  {
    q: 'Can I use TariffNav for official customs filings?',
    a: 'TariffNav is a research and estimation tool. For official customs declarations, always verify rates with a licensed customs broker or directly on the USITC Harmonized Tariff Schedule website. Rates may differ based on country of origin, product specifications, and special programs.'
  },
]

export default function HomePage() {
  const [stats, setStats] = useState({ total_codes: 14556, countries: 164, chapters: 97 })
  const [recentCodes, setRecentCodes] = useState<any[]>([])
  const [topDuty, setTopDuty] = useState<any[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    // Real stats
    supabase.from('hs_codes').select('id', { count: 'exact', head: true })
      .then(({ count }) => { if (count) setStats(s => ({ ...s, total_codes: count })) })

    // Recently updated codes with AI summaries
    supabase.from('hs_codes')
      .select('hts_code, description, us_duty_rate, updated_at')
      .not('ai_summary', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(6)
      .then(({ data }) => { if (data) setRecentCodes(data) })

    // Codes with highest duty rates (interesting for users)
    supabase.from('hs_codes')
      .select('hts_code, description, us_duty_rate')
      .gt('us_duty_rate', 0)
      .order('us_duty_rate', { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setTopDuty(data) })
  }, [])

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
          Duty rates, trade agreements, country comparisons, and import data for {stats.total_codes.toLocaleString()}+ HS codes. Free, always up-to-date.
        </p>

        {/* Popular buttons ABOVE search */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {POPULAR_SEARCHES.map(s => (
            <Link key={s.code} href={`/hs-code/${s.code.replace(/\./g, '-')}`}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              {s.code} · {s.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div style={{ maxWidth: '520px', margin: '0 auto 1rem' }}>
          <HsSearch />
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '3rem' }}>
        {[
          { label: 'HTS Codes Tracked', value: stats.total_codes.toLocaleString() },
          { label: 'Countries Covered', value: '164' },
          { label: 'HS Chapters', value: '97' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', padding: '1.25rem', textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '2rem', color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* What is an HS Code — SEO content */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>What is an HS Code?</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              An <strong style={{ color: 'var(--text-primary)' }}>HS code</strong> (Harmonized System code) is a standardized 6-to-10 digit number used by customs authorities in 200+ countries to classify every physical product crossing an international border. It determines your import duty rate, eligibility for trade agreement benefits, and required documentation.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              The US uses <strong style={{ color: 'var(--text-primary)' }}>HTS codes</strong> (Harmonized Tariff Schedule) — a 10-digit extension of the international HS system. TariffNav covers all {stats.total_codes.toLocaleString()} active US HTS codes with real-time duty rates sourced directly from USITC.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Getting the wrong HS code can mean overpaying duties, customs delays, or penalties. TariffNav makes it easy to find the right code and understand exactly what you'll pay before your shipment arrives.
            </p>
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>How Duty Rates Work</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Base Rate', desc: 'The standard MFN (Most Favored Nation) rate applied to all WTO member countries.' },
                { label: 'Trade Agreement Rate', desc: 'Reduced or zero rates for countries with US trade deals — USMCA, KORUS, GSP and more.' },
                { label: 'Section 301 Tariffs', desc: 'Additional duties on Chinese goods, ranging from 7.5% to 25% on top of the base rate.' },
                { label: 'Total Landed Cost', desc: 'Your shipment value + duty owed + any applicable fees. Use our calculator to compute this instantly.' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Duty Calculator */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Quick Duty Calculator</h2>
        <DutyCalculator />
      </section>

      {/* Recently Updated Codes */}
      {recentCodes.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="font-display" style={{ fontSize: '1.6rem' }}>Recently Updated Codes</h2>
            <Link href="/chapters" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>Browse all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
            {recentCodes.map(code => (
              <Link key={code.hts_code} href={`/hs-code/${code.hts_code.replace(/\./g, '-')}`}
                className="card"
                style={{ textDecoration: 'none', display: 'block', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '4px' }}>{code.hts_code}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{code.description?.slice(0, 60)}{code.description?.length > 60 ? '…' : ''}</div>
                  </div>
                  <span style={{ background: code.us_duty_rate === 0 ? 'rgba(34,197,94,0.1)' : 'var(--accent-dim)', color: code.us_duty_rate === 0 ? '#22c55e' : 'var(--accent)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {code.us_duty_rate === 0 ? 'Free' : `${code.us_duty_rate}%`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Highest Duty Rates */}
      {topDuty.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Highest US Duty Rates</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {topDuty.map((code, i) => (
              <Link key={code.hts_code} href={`/hs-code/${code.hts_code.replace(/\./g, '-')}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: i < topDuty.length - 1 ? '1px solid var(--border)' : 'none', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginRight: 10 }}>{code.hts_code}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{code.description?.slice(0, 70)}{code.description?.length > 70 ? '…' : ''}</span>
                </div>
                <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', marginLeft: 12 }}>{code.us_duty_rate}%</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Browse by Chapter */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="font-display" style={{ fontSize: '1.6rem' }}>Browse by Chapter</h2>
          <Link href="/chapters" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>View all 97 →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {HS_CHAPTERS.map(ch => (
            <Link key={ch.num} href={`/chapter/${ch.num}`}
              className="card"
              style={{ textDecoration: 'none', display: 'block', transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-glow)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{ch.icon}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>CH. {ch.num}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{ch.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ — SEO rich content */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {FAQ.map((item, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{item.q}</h3>
                <span style={{ color: 'var(--accent)', fontSize: '1.2rem', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && (
                <p style={{ margin: '12px 0 0', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}