import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare HS Codes Side by Side — Duty Rate Comparison',
  description: 'Compare US import duty rates for two HS codes side by side across 164 countries, including Section 301 China tariffs and USMCA preferential rates.',
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
