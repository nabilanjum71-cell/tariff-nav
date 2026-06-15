import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Import & Tariff Blog — TariffNav',
  description: 'Expert guides on HS codes, import duties, trade agreements, and US customs regulations. Updated daily.',
}

export const revalidate = 3600

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(90)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>
        Import & Tariff Guide
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', maxWidth: '600px', lineHeight: 1.7 }}>
        Expert guides on HS codes, import duties, trade agreements, and US customs regulations. New article published every day.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
        {posts?.length || 0} articles published
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {posts?.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="card"
            style={{ textDecoration: 'none', display: 'block', transition: 'border-color 0.2s' }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
              {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
              {post.title}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {post.excerpt}
            </p>
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--accent)' }}>
              Read guide →
            </div>
          </Link>
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          First article publishing tomorrow. Check back soon!
        </div>
      )}
    </div>
  )
}