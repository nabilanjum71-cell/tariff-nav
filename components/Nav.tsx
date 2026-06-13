'use client'
import Link from 'next/link'
import { useState } from 'react'
import AlertsModal from '@/components/AlertsModal'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
const [alertsOpen, setAlertsOpen] = useState(false)

  return (
    <nav style={{ borderBottom: '1px solid var(--border)', background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', height: '56px', display: 'flex', alignItems: 'center', gap: '2rem' }}>

        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 4L10 9L13 6L14 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>TariffNav</span>
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto', alignItems: 'center' }}>
          <Link href="/chapters" className="nav-link">Chapters</Link>
	<Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/compare" className="nav-link">Compare</Link>
          <Link href="/calculator" className="nav-link">Calculator</Link>
       <button
            onClick={() => setAlertsOpen(true)}
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-glow)', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
          >
            Get Alerts
          </button>
          {alertsOpen && <AlertsModal onClose={() => setAlertsOpen(false)} />}
        </div>
      </div>
    </nav>
  )
}
