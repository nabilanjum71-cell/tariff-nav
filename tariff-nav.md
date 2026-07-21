# TariffNav — Master Agent File
**Site:** https://tariff-nav.vercel.app
**GitHub:** https://github.com/nabilanjum71-cell/tariff-nav
**Project Location:** E:\tariff-nav (Windows PC)
**Last Updated:** July 19, 2026
**Purpose:** Hand this file to any new Claude chat to continue exactly where we left off.

---

## 🏗️ TECH STACK
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS / inline styles
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (auto-deploys from GitHub on every push)
- **AI Summaries:** Groq API — llama-3.3-70b-versatile model
- **Blog Images:** Unsplash API
- **Charts:** Quickchart.io (free, no key needed)
- **Node version:** 24

---

## 🔑 API KEYS (All stored in GitHub Secrets — never hardcode)
| Secret Name | Purpose |
|-------------|---------|
| `GROQ_API_KEY` | Primary Groq key — AI summaries batch 1 |
| `GROQ_KEY_2` | Secondary Groq key — AI summaries batch 2 |
| `GROQ_KEY_3` | Third Groq key — blog posts only |
| `UNSPLASH_KEY` | Unsplash API — blog header images |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key |
| `VERCEL_DEPLOY_HOOK` | Triggers Vercel rebuild after workflow |

---

## 📊 ANALYTICS & TRACKING (Added July 19, 2026)
| Tool | ID | Purpose |
|------|-----|---------|
| Google Analytics 4 | `G-RGNX43NN9Z` | Traffic, clicks, conversions |
| Microsoft Clarity | `xow9warv1p` | Heatmaps, session recordings |
| Google Search Console | Verified | Indexing, impressions, clicks |
| Bing Webmaster Tools | Verified | Bing indexing + traffic |

---

## 🗄️ DATABASE (Supabase)

### hs_codes (14,556 rows)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key |
| hts_code | text | e.g. "8471.30.01" |
| hs6 | text | 6-digit code |
| chapter | text | chapter number |
| description | text | product description |
| ai_summary | text | AI plain-English summary — DO NOT overwrite on upsert |
| us_duty_rate | numeric | duty rate % |
| duty_by_country | jsonb | rates for 164 countries |
| rate_history | jsonb | historical rate changes |
| trade_agreements | jsonb | USMCA, GSP, KORUS etc |
| top_importers | text | country names |
| trade_volume_usd | numeric | trade volume |
| video_ids | text | YouTube video IDs (currently empty [] for all rows) |
| updated_at | timestamptz | last update time |

### blog_posts
| Column | Notes |
|--------|-------|
| id, slug, title, content, excerpt | standard fields |
| topic_index | which of 90 topics (0-89) |
| status | published/draft |
| image_url, image_credit | from Unsplash |
| chart_url | from Quickchart.io |
| created_at, updated_at | timestamps |

### subscribers
| Column | Notes |
|--------|-------|
| id, email | subscriber info |
| alert_codes | text[] — HS codes to watch |
| created_at | signup date |

---

## 📁 KEY FILE STRUCTURE
```
E:\tariff-nav\
├── app\
│   ├── page.tsx                        ← Homepage
│   ├── layout.tsx                      ← Root layout — GA4 + Clarity + Schema.org scripts
│   ├── robots.ts                       ← robots.txt
│   ├── sitemap.xml\route.ts            ← Sitemap INDEX — points to all 16 sub-sitemaps
│   ├── sitemap-static.xml\route.ts     ← 105 static + chapter URLs
│   ├── sitemap-codes-1.xml\route.ts    ← HS codes 1-1000
│   ├── sitemap-codes-2.xml\route.ts    ← HS codes 1001-2000
│   ├── sitemap-codes-3.xml\route.ts    ← HS codes 2001-3000
│   ├── sitemap-codes-4.xml\route.ts    ← HS codes 3001-4000
│   ├── sitemap-codes-5.xml\route.ts    ← HS codes 4001-5000
│   ├── sitemap-codes-6.xml\route.ts    ← HS codes 5001-6000
│   ├── sitemap-codes-7.xml\route.ts    ← HS codes 6001-7000
│   ├── sitemap-codes-8.xml\route.ts    ← HS codes 7001-8000
│   ├── sitemap-codes-9.xml\route.ts    ← HS codes 8001-9000
│   ├── sitemap-codes-10.xml\route.ts   ← HS codes 9001-10000
│   ├── sitemap-codes-11.xml\route.ts   ← HS codes 10001-11000
│   ├── sitemap-codes-12.xml\route.ts   ← HS codes 11001-12000
│   ├── sitemap-codes-13.xml\route.ts   ← HS codes 12001-13000
│   ├── sitemap-codes-14.xml\route.ts   ← HS codes 13001-14000
│   ├── sitemap-codes-15.xml\route.ts   ← HS codes 14001-14556
│   ├── blog\page.tsx + [slug]\page.tsx
│   ├── calculator\page.tsx
│   ├── chapters\page.tsx
│   ├── chapter\[chapter]\page.tsx      ← Has breadcrumb schema + top HS codes cards
│   ├── compare\page.tsx
│   ├── hs-code\[code]\page.tsx
│   ├── privacy\page.tsx
│   ├── terms\page.tsx
│   └── disclaimer\page.tsx
├── components\
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── HsSearch.tsx
│   ├── DutyCalculator.tsx
│   ├── YouTubeSection.tsx
│   └── AlertsModal.tsx
├── public\
│   └── BingSiteAuth.xml                ← Bing Webmaster Tools verification
├── scripts\
│   ├── fetch-data.js                   ← DANGER: MANUAL ONLY — wipes ai_summary
│   ├── generate-summaries.js           ← Daily AI summaries
│   └── generate-blog.js                ← Daily blog post
└── .github\workflows\
    └── daily-sync.yml                  ← Runs 2x daily (6am + 6pm UTC)
```

---

## ⚙️ GITHUB ACTIONS WORKFLOW
**Schedule:** 6am UTC + 6pm UTC daily
**Steps:** summaries → blog → Vercel rebuild
**Expected:** ~520 AI summaries/day + 1 blog post/day

**⚠️ CRITICAL — NEVER add fetch-data.js to daily-sync.yml — it wipes all ai_summary fields**

---

## ✅ PHASE 1 — FOUNDATION (COMPLETED June 2026)
- [x] All pages: Homepage, 14,556 HS code pages, 97 chapter pages, blog, calculator, compare, legal
- [x] Footer, robots.txt, SEO meta, Open Graph tags
- [x] Google Search Console verified
- [x] Daily automation running (summaries + blog)
- [x] fetch-data.js bug fixed

---

## ✅ PHASE 2 — ANALYTICS & SEO (COMPLETED July 19, 2026)
- [x] Google Analytics 4 added (G-RGNX43NN9Z)
- [x] Microsoft Clarity added (xow9warv1p)
- [x] Bing Webmaster Tools verified + sitemap submitted
- [x] Schema.org: FAQ, WebSite, BreadcrumbList added
- [x] Chapter pages: Top HS Codes quick-link cards
- [x] Internal linking: blog↔HS codes already existed
- [x] Junk root folders removed
- [x] Sitemap split into 16 files (index + 15 chunks of 1000 URLs)
- [x] Sitemap submitted to Google Search Console

### ⚠️ Sitemap Note (July 19, 2026)
Search Console shows "Couldn't fetch" — this is Google delay, NOT a bug.
All sitemap URLs open correctly in browser.
Google already indexed 3,845 pages without sitemap via link crawling.
Check August 9 if status updated to Success.

---

## 📊 STATS ON JULY 19, 2026
| Metric | Value |
|--------|-------|
| Google indexed pages | 3,845 |
| Impressions (28 days) | 3,140 |
| Clicks (28 days) | 12 |
| Queries showing | 203 |
| Avg position | 17.2 |
| AI Summaries done | ~11,000+ |
| Blog posts | 33 |

---

## 📅 AUGUST 9 — FULL AUDIT CHECKLIST
**Share ALL screenshots with Claude before doing anything else**

### 1. Supabase SQL Editor — Run these:
```sql
-- AI summaries count
select count(case when ai_summary != '' and ai_summary is not null then 1 end) as has_summary from hs_codes;

-- Blog posts count
select count(*) as total_blogs from blog_posts;

-- Latest 5 blogs
select id, title, created_at from blog_posts order by created_at desc limit 5;

-- Subscribers
select count(*) as total_subscribers from subscribers;
```

### 2. GitHub Actions
- https://github.com/nabilanjum71-cell/tariff-nav/actions
- Screenshot — must show ✅ green

### 3. Google Search Console — Screenshot all:
- Performance → 28 days (clicks, impressions, queries)
- Indexing → Pages (how many indexed?)
- Sitemaps (did status change from "Couldn't fetch"?)

### 4. Google Analytics 4
- analytics.google.com → TariffNav property
- Screenshot dashboard (users, sessions, page views)

### 5. Microsoft Clarity
- clarity.microsoft.com → TariffNav project
- Screenshot (heatmaps/recordings showing?)

### 6. Vercel
- All deployments ✅ green?
- Screenshot deployments page

### 7. Live Site
- https://tariff-nav.vercel.app (screenshot)
- https://tariff-nav.vercel.app/chapter/84 (screenshot)
- https://tariff-nav.vercel.app/hs-code/8471-30-01 (screenshot)

---

## 📅 ROADMAP
| Date | Session | Goal |
|------|---------|------|
| ✅ June 2026 | Phase 1 | Site launched |
| ✅ July 19, 2026 | Phase 2 | Analytics + SEO done |
| **August 9, 2026** | Audit #1 | Check all metrics, fix issues |
| **August 30, 2026** | Audit #2 | Check growth, add content |
| **September 10, 2026** | Final Build | New tools, monetization, domain |

---

## 🔴 THINGS STILL TO BUILD (September 10 session)
- [ ] HS Code AI Classifier
- [ ] Section 301 Checker
- [ ] Landed Cost Calculator (upgraded)
- [ ] Country pages: /import-from/china, /import-from/india, /import-from/mexico
- [ ] Product pages: /import/laptops, /import/furniture, /import/clothing
- [ ] Related Blog Posts on HS code pages
- [ ] YouTube video IDs for top chapters
- [ ] Google News RSS on homepage
- [ ] Bulk HS Code Lookup
- [ ] Custom domain transfer
- [ ] Google AdSense application
- [ ] Affiliate links (Flexport, Freightos)
- [ ] Stripe Pro subscription ($9/month)

---

## ⚠️ CRITICAL WARNINGS
1. **fetch-data.js** — NEVER in daily-sync.yml — wipes ai_summary
2. **Sitemap** — DO NOT change sitemap structure — 16 files working correctly
3. **app/ folders** — real pages in app/privacy, app/terms, app/disclaimer — root duplicates deleted
4. **Build time** — 10-12 min on Vercel for 14,556 pages — NORMAL, do not cancel

---

## 🔧 USEFUL COMMANDS
```cmd
cd E:\tariff-nav
git add .
git commit -m "description"
git push
notepad app\layout.tsx
notepad app\page.tsx
```

---

## 🔗 IMPORTANT LINKS
| Resource | URL |
|----------|-----|
| Live Site | https://tariff-nav.vercel.app |
| GitHub Repo | https://github.com/nabilanjum71-cell/tariff-nav |
| GitHub Actions | https://github.com/nabilanjum71-cell/tariff-nav/actions |
| Vercel | https://vercel.com/dashboard |
| Supabase | https://supabase.com/dashboard |
| Search Console | https://search.google.com/search-console |
| Google Analytics | https://analytics.google.com |
| Microsoft Clarity | https://clarity.microsoft.com |
| Bing Webmaster | https://www.bing.com/webmasters |
| Groq Console | https://console.groq.com |

---

*Last Updated: July 19, 2026. For August 9 session — run ALL audit checks first and share screenshots before asking Claude to do anything.*
