import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'TariffNav — HS Code & Import Duty Explorer',
    template: '%s | TariffNav'
  },
  description: 'Plain-English duty rates, trade agreements, and import data for every HS tariff code. Updated daily from official government sources.',
  keywords: ['HS code', 'tariff', 'import duty', 'customs', 'trade', 'HTS code'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tariff-nav.vercel.app',
    siteName: 'TariffNav',
  },
  robots: { index: true, follow: true },
  verification: {
    google: 'wewjezoNa7BnP3tw4rtz5PuC7r9Lsmf7LuRJhvKyZS0',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
