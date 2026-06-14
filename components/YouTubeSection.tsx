'use client'
import { useState } from 'react'

type Props = {
  chapterTitle: string
  chapterNum: string
}

const CHAPTER_VIDEOS: Record<string, { id: string; title: string }[]> = {
  '01': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '02': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '03': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '04': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '05': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '06': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '07': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '08': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '09': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '10': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '11': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '12': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '13': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '14': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '15': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '16': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '17': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '18': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '19': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '20': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '21': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '22': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '23': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '24': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '25': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '26': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '27': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'xsPuj1vQLzU', title: 'US Customs Import Duty Calculator Explained' },
  ],
  '28': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '29': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '30': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '31': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '32': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '33': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '34': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '35': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '36': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '37': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '38': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '39': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '40': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '41': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '42': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '43': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '44': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '45': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '46': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '47': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '48': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '49': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '50': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '51': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '52': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '53': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '54': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '55': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '56': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '57': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '58': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '59': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '60': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '61': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '62': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '63': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '64': [
    { id: '6d1XsGInzZc', title: 'Footwear Import Duty USA Tariff Guide' },
    { id: '3tRevmATrvs', title: 'Shoe Import Tariff — 37% Duty Explained' },
  ],
  '65': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '66': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '67': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '68': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '69': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '70': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '71': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '72': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '73': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '74': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '75': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '76': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '78': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '79': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '80': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '81': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '82': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '83': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '84': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
    { id: 'xsPuj1vQLzU', title: 'US Customs Import Duty Calculator Explained' },
  ],
  '85': [
    { id: 'PJpF0M_rjYs', title: 'How to Import from China — Section 301 Tariff 2024' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
    { id: 'xsPuj1vQLzU', title: 'US Customs Import Duty Calculator Explained' },
  ],
  '86': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '87': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'xsPuj1vQLzU', title: 'US Customs Import Duty Calculator Explained' },
  ],
  '88': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '89': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '90': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'xsPuj1vQLzU', title: 'US Customs Import Duty Calculator Explained' },
  ],
  '91': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '92': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '93': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '94': [
    { id: '3oTIh_A2-Mo', title: 'Anti-Dumping Duty Furniture Import USA' },
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
  ],
  '95': [
    { id: 'PJpF0M_rjYs', title: 'How to Import from China — Section 301 Tariff 2024' },
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
  ],
  '96': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
  '97': [
    { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
    { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
  ],
}

const DEFAULT_VIDEOS = [
  { id: 'JXKLoDXmZNo', title: 'US Import Duty & HS Code Explained' },
  { id: 'x-SDVKIzJdI', title: 'HTS Code Classification Guide — USA Customs' },
]

export default function YouTubeSection({ chapterTitle, chapterNum }: Props) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const videos = CHAPTER_VIDEOS[chapterNum] || DEFAULT_VIDEOS

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
        Learn: Importing {chapterTitle}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Expert guides on importing Chapter {chapterNum} products into the United States.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {videos.map((video, i) => (
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
                onClick={() => setPlayingId(`${chapterNum}-${i}`)}
                style={{ aspectRatio: '16/9', position: 'relative', cursor: 'pointer', background: '#0f172a' }}
              >
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" fill="rgba(239,68,68,0.95)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <path d="M20 16L34 24L20 32V16Z" fill="white"/>
                  </svg>
                </div>
              </div>
            )}
            <div style={{ padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{video.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}