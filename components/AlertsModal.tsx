'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AlertsModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [codes, setCodes] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  async function submit() {
    if (!email) return
    setStatus('loading')
    const codeList = codes.split(',').map(c => c.trim()).filter(Boolean)
    const { error } = await supabase.from('subscribers').insert({ email, hs_codes: codeList })
    setStatus(error ? 'error' : 'success')
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>✅</div>
            <h2 style={{ marginTop: 12 }}>You're subscribed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>We'll email you when rates change.</p>
            <button onClick={onClose} style={{ marginTop: 16, padding: '8px 24px', borderRadius: 8, background: 'var(--accent)', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Close</button>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: 6, fontSize: 20 }}>🔔 Get Tariff Alerts</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>Get emailed when duty rates change for your HS codes.</p>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, marginBottom: 14, boxSizing: 'border-box' }} />
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>HS Codes to Watch (comma-separated)</label>
            <input type="text" value={codes} onChange={e => setCodes(e.target.value)} placeholder="e.g. 8471.30.01, 8517.12.00"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, marginBottom: 20, boxSizing: 'border-box' }} />
            {status === 'error' && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>Error saving. Make sure the subscribers table exists in Supabase.</p>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={submit} disabled={status === 'loading'}
                style={{ padding: '8px 20px', borderRadius: 8, background: 'var(--accent)', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                {status === 'loading' ? 'Saving…' : 'Subscribe'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}