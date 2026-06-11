'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Result {
  hts_code: string
  description: string
  us_duty_rate: number
}

interface Props {
  placeholder?: string
  autoNavigate?: boolean
  onSelect?: (code: Result) => void
  inputStyle?: React.CSSProperties
}

export default function HsSearch({ placeholder = 'Search HS code or product…', autoNavigate = true, onSelect, inputStyle = {} }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return }
    const t = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('hs_codes')
        .select('hts_code, description, us_duty_rate')
        .or(`hts_code.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(8)
      setResults(data || [])
      setOpen(true)
      setLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  function pick(item: Result) {
    setQuery(item.hts_code)
    setOpen(false)
    if (onSelect) onSelect(item)
    if (autoNavigate) router.push(`/hs-code/${item.hts_code.replace(/\./g, '-')}`)
  }

  function formatRate(rate: number) {
    if (rate === 0 || rate === null || rate === undefined) return 'Free'
    return `${rate}%`
  }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        style={{ width: '100%', fontSize: '1rem', padding: '0.75rem 1rem', boxSizing: 'border-box', ...inputStyle }}
      />
      {loading && (
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--text-muted)' }}>
          Searching…
        </span>
      )}
      {open && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, zIndex: 999, listStyle: 'none', margin: '4px 0 0', padding: 0, maxHeight: 320, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          {results.length === 0
            ? (
              <li style={{ padding: '10px 16px', color: 'var(--text-muted)', fontSize: 14 }}>
                No results for "{query}"
              </li>
            )
            : results.map(item => (
              <li
                key={item.hts_code}
                onClick={() => pick(item)}
                style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', gap: 12 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', marginRight: 8 }}>
                    {item.hts_code}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                    {item.description?.slice(0, 55)}{(item.description?.length ?? 0) > 55 ? '…' : ''}
                  </span>
                </div>
                <span style={{ background: item.us_duty_rate === 0 ? 'rgba(34,197,94,0.1)' : 'var(--accent-dim)', color: item.us_duty_rate === 0 ? '#22c55e' : 'var(--accent)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatRate(item.us_duty_rate)}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}