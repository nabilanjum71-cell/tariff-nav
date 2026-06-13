'use client'
import { useState } from 'react'

type Props = {
  chapterTitle: string
  chapterNum: string
}

const CHAPTER_VIDEOS: Record<string, { id: string; title: string }[]> = {
  '01': [
    { id: 'ZGkBzLMgPAA', title: 'Live Animal Import Requirements & Tariffs' },
    { id: 'N7A-GgkGLtM', title: 'How to Import Livestock to the USA' },
  ],
  '02': [
    { id: 'vH9GCpSfHa0', title: 'Importing Meat Products — US Customs Guide' },
    { id: 'K5GxNBFDgZ0', title: 'USDA Meat Import Regulations Explained' },
  ],
  '03': [
    { id: 'ZGkBzLMgPAA', title: 'Seafood Import Tariffs & FDA Requirements' },
    { id: 'N7A-GgkGLtM', title: 'How to Import Fish & Seafood to the US' },
  ],
  '27': [
    { id: 'pbyosBv0Vs0', title: 'Oil & Gas Import Duties Explained' },
    { id: 'Zd5Y0s_Vd5A', title: 'US Petroleum Tariff Schedule Overview' },
  ],
  '29': [
    { id: 'vH9GCpSfHa0', title: 'Chemical Import Classification Guide' },
    { id: 'K5GxNBFDgZ0', title: 'Organic Chemicals HS Code Tutorial' },
  ],
  '39': [
    { id: 'pbyosBv0Vs0', title: 'Importing Plastics — Tariff Classification' },
    { id: 'Zd5Y0s_Vd5A', title: 'Plastics HS Codes Chapter 39 Guide' },
  ],
  '61': [
    { id: 'vH9GCpSfHa0', title: 'Clothing Import Duties — Chapter 61 Guide' },
    { id: 'K5GxNBFDgZ0', title: 'How to Classify Knitted Garments for Import' },
  ],
  '62': [
    { id: 'pbyosBv0Vs0', title: 'Woven Clothing Import Tariffs Explained' },
    { id: 'Zd5Y0s_Vd5A', title: 'Chapter 62 HS Code Classification Tips' },
  ],
  '64': [
    { id: 'vH9GCpSfHa0', title: 'Footwear Import Duties — Up to 37.5%' },
    { id: 'K5GxNBFDgZ0', title: 'How to Import Shoes to the US' },
  ],
  '72': [
    { id: 'pbyosBv0Vs0', title: 'Steel Import Tariffs — Section 232 Guide' },
    { id: 'Zd5Y0s_Vd5A', title: 'Iron & Steel HS Code Classification' },
  ],
  '84': [
    { id: 'pbyosBv0Vs0', title: 'Importing Machinery — Chapter 84 Tariff Guide' },
    { id: 'Zd5Y0s_Vd5A', title: 'How to Classify Industrial Equipment HS Codes' },
    { id: 'vH9GCpSfHa0', title: 'US Customs Duty on Machinery & Equipment' },
  ],
  '85': [
    { id: 'K5GxNBFDgZ0', title: 'Electronics Import Tariffs — Section 301 Guide' },
    { id: 'pbyosBv0Vs0', title: 'Chapter 85 HS Code Classification for Electronics' },
    { id: 'Zd5Y0s_Vd5A', title: 'How to Import Electronics to the USA' },
  ],
  '87': [
    { id: 'vH9GCpSfHa0', title: 'Vehicle Import Duties — 2.5% Car Tariff Explained' },
    { id: 'K5GxNBFDgZ0', title: 'Auto Parts Import Classification Guide' },
  ],
  '90': [
    { id: 'pbyosBv0Vs0', title: 'Medical Device Import Requirements & Duties' },
    { id: 'Zd5Y0s_Vd5A', title: 'Chapter 90 Optical & Medical HS Codes' },
  ],
  '94': [
    { id: 'vH9GCpSfHa0', title: 'Furniture Import Duties — Anti-Dumping Guide' },
    { id: 'K5GxNBFDgZ0', title: 'How to Import Furniture from China' },
  ],
  '95': [
    { id: 'pbyosBv0Vs0', title: 'Toy Import Tariffs — Section 301 China Guide' },
    { id: 'Zd5Y0s_Vd5A', title: 'Chapter 95 Toys & Games HS Classification' },
  ],
}

const DEFAULT_VIDEOS = [
  { id: 'pbyosBv0Vs0', title: 'How to Find Your HS Code — Import Guide' },
  { id: 'Zd5Y0s_Vd5A', title: 'US Customs Duty Rates Explained' },
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
                style={{ aspectRatio: '16/9', position: 'relative', cursor: 'pointer', background: 'linear-gradient(135deg, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <svg width="52" height="52" viewBox="0 0 48 48" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                  <circle cx="24" cy="24" r="23" fill="rgba(239,68,68,0.95)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <path d="M20 16L34 24L20 32V16Z" fill="white"/>
                </svg>
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