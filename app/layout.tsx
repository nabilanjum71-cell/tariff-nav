import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'TariffNav — Free HS Code Lookup & US Import Duty Calculator',
    template: '%s | TariffNav'
  },
  description: 'Free HS code lookup tool with US import duty rates for 14,556 HTS codes. Find tariff rates for 164 countries, USMCA benefits, Section 301 China tariffs, and landed cost calculator. Updated daily from USITC.',
  keywords: ['HS code lookup', 'HTS code', 'import duty rates', 'US tariff', 'customs duty calculator', 'USMCA', 'Section 301', 'trade agreements', 'landed cost calculator', 'harmonized tariff schedule'],
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

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TariffNav',
  url: 'https://tariff-nav.vercel.app',
  description: 'Plain-English duty rates, trade agreements, and import data for every HS tariff code.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://tariff-nav.vercel.app/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {/* Microsoft Clarity */}
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xow9warv1p");
        `}</Script>

        {/* Google Analytics 4 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RGNX43NN9Z" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RGNX43NN9Z');
        `}</Script>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
