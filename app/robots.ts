export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://tariff-nav.vercel.app/sitemap.xml',
  }
}