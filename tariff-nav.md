# TariffNav — Master Agent File
**Site:** https://tariff-nav.vercel.app
**GitHub:** https://github.com/nabilanjum71-cell/tariff-nav
**Project Location:** E:\tariff-nav (Windows PC)
**Last Updated:** July 25, 2026
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
| `GROQ_API_KEY` | AI summaries batch 1 |
| `GROQ_KEY_2` | AI summaries batch 2 |
| `GROQ_KEY_3` | Blog posts only |
| `GROQ_KEY_4` | Trade guide generation |
| `GROQ_KEY_5` | Importer FAQ generation |
| `MISTRAL_KEY_1` | Import guide generation |
| `MISTRAL_KEY_2` | Duty breakdown generation |
| `UNSPLASH_KEY` | Blog header images |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key |
| `VERCEL_DEPLOY_HOOK` | Triggers Vercel rebuild |

---

## 📊 ANALYTICS & TRACKING
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
| ai_summary | text | DO NOT overwrite on upsert |
| us_duty_rate | numeric | duty rate % |
| duty_by_country | jsonb | rates for 164 countries |
| rate_history | jsonb | historical rate changes |
| trade_agreements | jsonb | USMCA, GSP, KORUS etc |
| top_importers | text | country names |
| trade_volume_usd | numeric | trade volume |
| video_ids | text | YouTube video IDs |
| import_guide | text | NEW — Mistral Key 1 |
| duty_breakdown | text | NEW — Mistral Key 2 |
| trade_guide | text | NEW — Groq Key 4 |
| importer_faq | text | NEW — Groq Key 5 |
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
│   ├── page.tsx
│   ├── layout.tsx                      ← GA4 + Clarity + Schema.org
│   ├── robots.ts
│   ├── sitemap.xml\route.ts            ← Master index → 16 sub-sitemaps
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
│   ├── chapter\[chapter]\page.tsx      ← breadcrumb schema + top HS codes
│   ├── compare\page.tsx
│   ├── hs-code\[code]\page.tsx         ← ALL new sections added
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
│   └── BingSiteAuth.xml
├── scripts\
│   ├── fetch-data.js                   ← DANGER: MANUAL ONLY
│   ├── generate-summaries.js           ← GROQ_API_KEY + GROQ_KEY_2
│   ├── generate-blog.js                ← GROQ_KEY_3
│   ├── generate-import-guide.js        ← MISTRAL_KEY_1 (NEW)
│   ├── generate-duty-breakdown.js      ← MISTRAL_KEY_2 (NEW)
│   ├── generate-trade-guide.js         ← GROQ_KEY_4 (NEW)
│   └── generate-importer-faq.js        ← GROQ_KEY_5 (NEW)
└── .github\workflows\
    └── daily-sync.yml
```

---

## ⚙️ GITHUB ACTIONS WORKFLOW
**Schedule:** 6am UTC + 6pm UTC daily (2 runs/day)
**Steps per run:**
1. Generate AI summaries (GROQ_API_KEY + GROQ_KEY_2)
2. Wait 30s
3. Generate import guides (MISTRAL_KEY_1) — 100/run
4. Wait 30s
5. Generate duty breakdowns (MISTRAL_KEY_2) — 100/run
6. Wait 30s
7. Generate trade guides (GROQ_KEY_4) — 100/run
8. Wait 30s
9. Generate importer FAQs (GROQ_KEY_5) — 100/run
10. Wait 30s
11. Generate blog post (GROQ_KEY_3 + Unsplash)
12. Trigger Vercel rebuild

**Daily output:**
- ~520 AI summaries
- 200 import guides
- 200 duty breakdowns
- 200 trade guides
- 200 importer FAQs
- 1 blog post

**⚠️ CRITICAL — NEVER add fetch-data.js to daily-sync.yml**

---

## ✅ WHAT EVERY HS CODE PAGE NOW HAS

### Zero API (Live on ALL 14,556 pages) ✅
| Section | Source |
|---------|--------|
| AI Summary OR auto-generated summary | DB columns |
| Quick Facts card (HS code, rate, MPF, HMF) | DB data |
| Instant Cost Estimate (3 shipment sizes) | Pure math |
| Trade Agreement Savings table | trade_agreements column |
| FAQPage schema (5 auto Qs) | DB data |
| Speakable schema | Voice search |
| BreadcrumbList schema | Navigation |

### API-Powered (filling 800/day) 🚀
| Section | API | Words |
|---------|-----|-------|
| Import Guide | Mistral Key 1 | 150-200 |
| Duty Breakdown | Mistral Key 2 | 150-200 |
| Trade Agreement Guide | Groq Key 4 | 150-200 |
| Importer FAQ | Groq Key 5 | 150-200 |

**Total per page when complete: ~1,100+ words**

---

## ✅ COMPLETED PHASES

### Phase 1 — Foundation (June 2026)
- All pages live: homepage, 14,556 HS codes, 97 chapters, blog, calculator, compare, legal
- Daily automation running
- fetch-data.js bug fixed

### Phase 2 — Analytics & SEO (July 19, 2026)
- GA4 + Clarity added
- Bing Webmaster Tools verified
- Schema.org: FAQ, WebSite, BreadcrumbList, Speakable
- Sitemap split into 16 files (index + 15 chunks of 1000)
- Chapter pages: breadcrumb schema + top HS codes cards
- Junk root folders removed

### Phase 2.5 — Content Enrichment (July 22, 2026)
- 4 new DB columns added
- 4 new automation scripts created
- Zero-API sections added to all pages
- FAQPage + Speakable schemas on every HS code page
- Trade Agreement Savings table on every page
- Auto-summary for 3,500 pages with no AI summary

---

## 📊 STATS AS OF JULY 25, 2026
| Metric | Value |
|--------|-------|
| Google indexed pages | 3,845 |
| Impressions (28 days) | 3,140+ |
| Clicks (28 days) | 12+ |
| Queries showing | 203+ |
| AI Summaries done | ~9,366 |
| Import guides done | ~200+ (fixing was 0 due to query bug) |
| Duty breakdowns done | ~300 |
| Trade guides done | ~170 |
| Importer FAQs done | ~20 |
| Blog posts | 33+ |

### ⚠️ Bug Fixed July 25
Supabase query filter `.or('import_guide.is.null,import_guide.eq.')` was wrong.
Fixed to `.or('import_guide.is.null,import_guide.eq.""')` in all 4 scripts.
All 4 scripts now working correctly from July 25 onwards.

---

## 📅 AUGUST 9 AUDIT CHECKLIST
**Run ALL these and share screenshots with Claude**

### 1. Supabase SQL — Run this one query:
```sql
select
count(case when ai_summary != '' and ai_summary is not null then 1 end) as ai_summaries,
count(case when import_guide != '' and import_guide is not null then 1 end) as import_guides,
count(case when duty_breakdown != '' and duty_breakdown is not null then 1 end) as duty_breakdowns,
count(case when trade_guide != '' and trade_guide is not null then 1 end) as trade_guides,
count(case when importer_faq != '' and importer_faq is not null then 1 end) as importer_faqs
from hs_codes;
```

**Expected August 9 results:**
| Column | Expected |
|--------|----------|
| ai_summaries | 14,000+ (complete!) |
| import_guides | 10,000+ |
| duty_breakdowns | 10,000+ |
| trade_guides | 10,000+ |
| importer_faqs | 10,000+ |

### 2. GitHub Actions
- https://github.com/nabilanjum71-cell/tariff-nav/actions
- All recent runs ✅ green?
- Screenshot

### 3. Google Search Console
- Performance → 28 days (clicks, impressions)
- Indexing → Pages (how many indexed?)
- Sitemaps → status changed from "Couldn't fetch"?
- Screenshot all 3

### 4. Google Analytics 4
- analytics.google.com → TariffNav
- Users, sessions, page views
- Screenshot

### 5. Microsoft Clarity
- clarity.microsoft.com → TariffNav
- Heatmaps showing?
- Screenshot

### 6. Live Site
- https://tariff-nav.vercel.app/hs-code/8471-30-01
- Check all sections visible
- Screenshot

---

## 📅 ROADMAP
| Date | Session | Goal |
|------|---------|------|
| ✅ June 2026 | Phase 1 | Site launched |
| ✅ July 19 | Phase 2 | Analytics + SEO |
| ✅ July 22 | Phase 2.5 | Content enrichment pipeline |
| **Aug 9** | Audit #1 | Check all metrics + fix issues |
| **Aug 30** | Audit #2 | Check growth + add content |
| **Sep 10** | Final Build | New tools + monetization + domain |

---

## 🔴 STILL TO BUILD (September 10)
- [ ] HS Code AI Classifier
- [ ] Section 301 Checker
- [ ] Landed Cost Calculator (upgraded)
- [ ] Country pages: /import-from/china, /import-from/india, /import-from/mexico
- [ ] Product pages: /import/laptops, /import/furniture
- [ ] Related Blog Posts on HS code pages
- [ ] YouTube video IDs for top chapters
- [ ] Google News RSS on homepage
- [ ] Bulk HS Code Lookup
- [ ] Custom domain transfer (tariffnav.com)
- [ ] Google AdSense application
- [ ] Affiliate links (Flexport, Freightos)
- [ ] Stripe Pro subscription ($9/month)

---

## ⚠️ CRITICAL WARNINGS
1. **fetch-data.js** — NEVER in daily-sync.yml — wipes ai_summary
2. **Sitemap** — 16 files working, do not change structure
3. **app/ folders** — real pages in app/privacy, app/terms, app/disclaimer
4. **Build time** — 10-12 min on Vercel — normal, do not cancel
5. **trade_agreements** — column stores objects not strings — always convert safely

---

## 🔧 USEFUL COMMANDS
```cmd
cd E:\tariff-nav
git add .
git commit -m "description"
git push
notepad app\layout.tsx
notepad app\hs-code\[code]\page.tsx
notepad .github\workflows\daily-sync.yml
```

---

## 🔗 IMPORTANT LINKS
| Resource | URL |
|----------|-----|
| Live Site | https://tariff-nav.vercel.app |
| GitHub | https://github.com/nabilanjum71-cell/tariff-nav |
| Actions | https://github.com/nabilanjum71-cell/tariff-nav/actions |
| Vercel | https://vercel.com/dashboard |
| Supabase | https://supabase.com/dashboard |
| Search Console | https://search.google.com/search-console |
| Analytics | https://analytics.google.com |
| Clarity | https://clarity.microsoft.com |
| Bing Webmaster | https://www.bing.com/webmasters |
| Groq Console | https://console.groq.com |
| Mistral Console | https://console.mistral.ai |

---

*Last Updated: July 25, 2026. For August 9 — run ALL audit checks first and share screenshots before asking Claude to do anything. Always provide a fresh GitHub token at start of session.*
