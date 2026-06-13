import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .single()
  if (!data) return { title: 'Article Not Found' }
  return {
    title: `${data.title} | TariffNav`,
    description: data.excerpt,
  }
}

function renderMarkdown(content: string) {
  return content
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return `<h2 style="font-size:1.4rem;margin:2rem 0 0.75rem;color:var(--text-primary)">${line.slice(3)}</h2>`
      if (line.startsWith('### ')) return `<h3 style="font-size:1.1rem;margin:1.5rem 0 0.5rem;color:var(--text-primary)">${line.slice(4)}</h3>`
      if (line.startsWith('- ')) return `<li style="color:var(--text-secondary);margin-bottom:4px;line-height:1.7">${line.slice(2)}</li>`
      if (line.startsWith('**') && line.endsWith('**')) return `<strong style="color:var(--text-primary)">${line.slice(2, -2)}</strong>`
      if (line.trim() === '') return '<br/>'
      return `<p style="color:var(--text-secondary);line-height:1.8;margin-bottom:1rem">${line}</p>`
    })
    .join('')
}

export default async function BlogPostPage({ params }: Props) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const { data: related } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt')
    .eq('status', 'published')
    .neq('slug', params.slug)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem', display: 'flex', gap: '6px' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{post.title.slice(0, 40)}...</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · TariffNav Import Guide
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', lineHeight: 1.25, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          {post.title}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, borderLeft: '3px solid var(--accent)', paddingLeft: '1rem' }}>
          {post.excerpt}
        </p>
      </div>

      {/* Content */}
      <article
        style={{ fontSize: '1rem', lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      {/* CTA */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '1.5rem 2rem', margin: '3rem 0', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Find Your HS Code Instantly</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Search 14,556 real USITC codes with duty rates for 164 countries.
        </p>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 2rem', borderRadius: '8px' }}>
          Search HS Codes →
        </Link>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Related Guides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {related.map(r => (
              <Link key={r.slug} href={`/blog/${r.slug}`}
                style={{ display: 'block', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{r.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.excerpt}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}