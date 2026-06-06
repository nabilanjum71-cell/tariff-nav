'use client'
import { useState } from 'react'
import Image from 'next/image'

type Props = {
  chapterTitle: string
  chapterNum: string
  videoIds?: string[]
}

// Fallback search query -> YouTube thumbnail URL pattern
function getYTThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

// Demo video IDs for display — in production these come from Supabase
const DEMO_VIDEOS: Record<string, { id: string; title: string }[]> = {
  '84': [
    { id: 'dQw4w9WgXcQ', title: 'How to Import Machinery — Complete Tariff Guide' },
    { id: 'dQw4w9WgXcQ', title: 'Chapter 84 HS Codes Explained for Importers' },
    { id: 'dQw4w9WgXcQ', title: 'US Customs Duty on Industrial Equipment' },
  ],
  '85': [
    { id: 'dQw4w9WgXcQ', title: 'Importing Electronics — Section 301 Tariff Guide' },
    { id: 'dQw4w9WgXcQ', title: 'Chapter 85 HS Code Classification Tips' },
  ],
}

export default function YouTubeSection({ chapterTitle, chapterNum, videoIds }: Props) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const demoVids = DEMO_VIDEOS[chapterNum] || DEMO_VIDEOS['84']

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
        Learn: Importing {chapterTitle}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
        {demoVids.map((video, i) => (
          <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {playingId === `${chapterNum}-${i}` ? (
              <iframe
                width="100%"
                style={{ aspectRatio: '16/9', display: 'block', border: 'none' }}
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                className="yt-thumb"
                onClick={() => setPlayingId(`${chapterNum}-${i}`)}
                style={{ aspectRatio: '16/9', position: 'relative', cursor: 'pointer', background: 'var(--bg-elevated)' }}
              >
                {/* Thumbnail placeholder — real thumbnails come from YouTube API */}
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" fill="rgba(239,68,68,0.9)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                    <path d="M20 16L34 24L20 32V16Z" fill="white"/>
                  </svg>
                </div>
              </div>
            )}
            <div style={{ padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{video.title}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
        Videos sourced via YouTube Data API. Click to load.
      </div>
    </section>
  )
}
