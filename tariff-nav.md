# TariffNav — Master Agent File
**Site:** https://tariff-nav.vercel.app
**GitHub:** https://github.com/nabilanjum71-cell/tariff-nav
**Project Location:** E:\tariff-nav (Windows PC)
**Last Updated:** June 19, 2026
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
│   ├── page.tsx              ← Homepage
│   ├── layout.tsx            ← Root layout — contains Google Search Console verification meta tag
│   ├── sitemap.ts            ← Sitemap — paginates Supabase in chunks of 1000 to get all 14,556 pages
│   ├── robots.ts             ← robots.txt
│   ├── blog\page.tsx + [slug]\page.tsx
│   ├── calculator\page.tsx
│   ├── chapters\page.tsx
│   ├── chapter\[chapter]\page.tsx
│   ├── compare\page.tsx
│   ├── hs-code\[code]\page.tsx
│   ├── privacy\page.tsx      ← Legal page (added June 17, 2026)
│   ├── terms\page.tsx        ← Legal page (added June 17, 2026)
│   └── disclaimer\page.tsx   ← Legal page (added June 17, 2026)
├── components\
│   ├── Nav.tsx
│   ├── Footer.tsx            ← Redesigned June 2026 — logo, nav links, legal links, data sources
│   ├── HsSearch.tsx
│   ├── DutyCalculator.tsx
│   ├── YouTubeSection.tsx
│   └── AlertsModal.tsx
├── scripts\
│   ├── fetch-data.js         ← DANGER: overwrites ai_summary with '' on upsert. Run MANUALLY ONLY, never in daily workflow
│   ├── generate-summaries.js ← Daily AI summaries via Groq. BATCH_SIZE=130. Uses --batch= arg for offset
│   └── generate-blog.js      ← Daily blog post via Groq key 3
└── .github\workflows\
    └── daily-sync.yml        ← Runs 2x daily (6am + 6pm UTC). Steps: summaries → blog → Vercel rebuild
```

---

## ⚙️ GITHUB ACTIONS WORKFLOW (current state)
**File:** `.github/workflows/daily-sync.yml`
**Schedule:** 6am UTC + 6pm UTC daily (2 runs/day)
**Steps per run:**
1. Generate AI summaries (130 rows × 2 Groq keys = up to 260/run)
2. Wait 30 seconds
3. Generate 1 blog post (Groq key 3 + Unsplash)
4. Trigger Vercel rebuild

**⚠️ CRITICAL — fetch-data.js was REMOVED from this workflow on June 18, 2026**
Reason: fetch-data.js does a full row upsert including `ai_summary: ''`, which was wiping all AI summaries on every run. This was the root cause of summaries staying stuck at 137 for weeks. fetch-data.js now runs MANUALLY ONLY when duty rate data needs refreshing.

**Expected output per day:**
- ~520 new AI summaries (260 × 2 runs)
- 1 new blog post with header image and chart

---

## ✅ PHASE 1 — FOUNDATION (COMPLETED June 2026)

### Site & Pages
- [x] Homepage — hero, search autocomplete, FAQ, stats, recently updated codes, highest duty rates
- [x] 14,556 individual HS code pages — AI summary, duty rate charts, calculator, trade agreements, rate history
- [x] 97 Chapter pages — descriptions, stats, duty rate chart, YouTube section, codes table
- [x] Chapters listing page
- [x] Blog listing page `/blog`
- [x] Individual blog post pages `/blog/[slug]` — header image + chart
- [x] Calculator page `/calculator`
- [x] Compare page `/compare`
- [x] Privacy Policy page `/privacy`
- [x] Terms of Service page `/terms`
- [x] Disclaimer page `/disclaimer`

### Technical SEO
- [x] Footer redesigned — logo, tagline, nav links, legal links, data sources, copyright
- [x] robots.txt — allows all, points to sitemap
- [x] Sitemap fixed — now paginates Supabase to include all 14,661 URLs (was capped at 1,100 due to Supabase default row limit of 1000)
- [x] Google Search Console verified — HTML tag method in layout.tsx
- [x] Sitemap submitted to Google Search Console (June 19, 2026)
- [x] SEO meta tags on all pages
- [x] Open Graph tags on all pages

### Automation & Data Pipeline
- [x] Daily AI summary generation — 2 Groq keys, 130 batches, 2x daily
- [x] Daily blog post generation — Groq key 3 + Unsplash images
- [x] Vercel auto-deploy after each workflow run
- [x] fetch-data.js REMOVED from daily workflow (was wiping ai_summary — critical bug fixed)

### Current Data Status (as of June 19, 2026)
| Metric | Status |
|--------|--------|
| Total HS code pages | 14,556 |
| Pages with AI summary | 527 (3.6%) |
| Remaining | ~14,029 |
| Days to complete at 520/day | ~27 days |
| Blog posts published | Growing daily (90 topics planned) |
| GitHub Actions | ✅ Green, 2x daily |
| Google Search Console | ✅ Verified + sitemap submitted |

---

## 🔴 PHASE 2 — ANALYTICS & NEW TOOLS (Start after 10 days monitoring)
**Start Date: ~June 29, 2026**

### Day 1 — Analytics Setup
- [ ] Install Google Analytics 4 (add script to layout.tsx)
- [ ] Install Microsoft Clarity (free heatmaps — add script to layout.tsx)
- [ ] Submit to Bing Webmaster Tools (https://www.bing.com/webmasters)
- [ ] Add Google News RSS tariff headlines section to homepage

### Day 2 — New Tools
- [ ] HS Code AI Classifier — user describes product → AI suggests HS code
- [ ] Section 301 Checker — enter HS code → see current China tariff status
- [ ] Landed Cost Calculator — full breakdown with MPF (0.3464%), HMF (0.125%), freight, insurance

### Day 3 — Schema.org Structured Data
- [ ] FAQ schema on homepage (you already have FAQ section — add JSON-LD)
- [ ] WebSite schema with SearchAction
- [ ] BreadcrumbList schema on chapter and HS code pages
- [ ] Add to layout.tsx or individual page files

### Day 4 — Internal Linking
- [ ] Add "Related Blog Posts" section to HS code pages
- [ ] Add internal links from blog posts to relevant HS code pages
- [ ] Add "Related HS Codes" section to chapter pages

### Day 5 — YouTube Videos
- [ ] Search YouTube for each chapter topic (list below) and add 2 real video IDs per chapter
- [ ] Update video_ids column in Supabase for chapters: 84, 85, 87, 61, 62, 64, 94, 27
- [ ] SQL to update: `UPDATE hs_codes SET video_ids = '["VIDEO_ID_1","VIDEO_ID_2"]' WHERE chapter = '84';`

**YouTube search terms per chapter:**
| Chapter | Search Term |
|---------|------------|
| 84 Machinery | "importing machinery HS code customs guide" |
| 85 Electronics | "importing electronics Section 301 tariff USA" |
| 87 Vehicles | "importing cars auto parts USA customs duty" |
| 61/62 Clothing | "importing clothing apparel tariff duty rate" |
| 64 Footwear | "importing shoes footwear tariff USA 37.5%" |
| 94 Furniture | "importing furniture anti-dumping duty China" |
| 27 Oil/Gas | "petroleum import duty HS code tariff" |

---

## 🟡 PHASE 3 — CONTENT EXPANSION (Month 2)
- [ ] Country import guide pages — `/import-from/china`, `/import-from/india`, `/import-from/mexico`
- [ ] Product landing pages — `/import/laptops`, `/import/furniture`, `/import/clothing`
- [ ] These pages target high-volume buyer-intent keywords
- [ ] Duty Savings Calculator — shows savings with USMCA, GSP, KORUS trade agreements
- [ ] Bulk HS Code Lookup — paste 10 codes, get all rates in one table

---

## 💰 PHASE 4 — MONETIZATION (Month 3+)
- [ ] Apply for Google AdSense (need ~3 months of content + real traffic first)
- [ ] Add affiliate links to customs broker services (Flexport, Freightos, Customs City)
- [ ] Add "Get a Quote" buttons on HS code pages linking to freight forwarders
- [ ] Set up Stripe for Pro subscription ($9/month)
- [ ] Pro features: bulk lookup, API access, email alerts with rate changes

---

## 🚀 PHASE 5 — GROWTH & AUTHORITY (Month 4-6)
- [ ] Reddit presence — post helpful tariff guides in r/importing, r/ecommerce, r/FulfillmentByAmazon
- [ ] Twitter/X bot — auto-tweet daily tariff changes using GitHub Actions
- [ ] Weekly email newsletter to subscribers (use Resend or SendGrid free tier)
- [ ] Guest posts on importing/ecommerce blogs with backlinks to TariffNav
- [ ] Submit to niche directories (customs broker directories, trade resource lists)
- [ ] YouTube channel — short explainer videos for top HS code chapters

---

## 📊 TRAFFIC & REVENUE TARGETS
| Timeframe | Traffic Target | Revenue Target |
|-----------|---------------|----------------|
| Month 1-2 | 0-3,000/month | $0 (building) |
| Month 3 | 3,000-10,000/month | $20-100 AdSense |
| Month 4 | 10,000-30,000/month | $100-500/month |
| Month 6 | 30,000-50,000/month | $500-2,000/month |
| Month 12 | 50,000+/month | $2,000-10,000/month |

---

## 📅 DAILY MONITORING ROUTINE (Do every morning — 5 min)

### 1. Check GitHub Actions
Go to: https://github.com/nabilanjum71-cell/tariff-nav/actions
- Must show ✅ GREEN for both scheduled runs
- If ❌ RED — screenshot the error log and fix immediately

### 2. Check AI summary count (Supabase SQL Editor)
```sql
select count(case when ai_summary != '' and ai_summary is not null then 1 end) as has_summary 
from hs_codes;
```
- Should increase by ~520 each day
- If flat or decreasing — fetch-data.js may have been re-added to workflow accidentally

### 3. Check blog posts
```sql
select id, title, created_at from blog_posts order by created_at desc limit 5;
```
- Count should increase by 1 each day

### 4. Check live site
- https://tariff-nav.vercel.app/blog — new article should appear daily

### 5. Check Search Console (weekly, every Friday)
- Go to Indexing → Pages — how many pages are indexed?
- Go to Performance — any clicks/impressions appearing yet?
- Check for any Coverage errors

---

## ⚠️ KNOWN ISSUES & IMPORTANT WARNINGS

### CRITICAL — fetch-data.js
**NEVER run `node scripts/fetch-data.js` automatically or add it back to daily-sync.yml.**
It does a full upsert with `ai_summary: ''` which wipes all AI summaries.
Only run it manually when deliberately refreshing duty rate data, and ONLY after fixing the normalizeItem() function to exclude ai_summary from the upsert object.

### YouTube Videos
All chapter pages have `video_ids: []` in the database — videos are shown as placeholders or empty. Phase 2 task to fix manually.

### Junk folders in project root
The following folders exist in `E:\tariff-nav\` root (NOT in `app\`) from earlier typo errors. They are harmless but messy:
- `privacy\` (root level — wrong, real one is `app\privacy\`)
- `terms\` (root level — wrong)
- `disclaimer\` (root level — wrong)
- `privacymkdir\` (typo artifact)
- `termsmkdir\` (typo artifact)
- `{app\` (typo artifact)
- `sitemap_check.txt` (accidentally committed — harmless)
These can be deleted and removed from git when convenient.

### Sitemap "Couldn't fetch" in Search Console
As of June 19, 2026 (day of submission), Search Console showed "Couldn't fetch" with 0 discovered pages. This is normal timing — Google hadn't crawled it yet. Check again in 24-48 hours for an updated status.

---

## 🔧 USEFUL COMMANDS

```cmd
cd E:\tariff-nav

# Check build locally (WARNING: takes ~10-12 min for 7000+ pages)
npm run build

# Push changes
git add .
git commit -m "description of change"
git push

# Check workflow file
notepad .github\workflows\daily-sync.yml

# Check AI summary count in Supabase
# (run in Supabase SQL Editor, not terminal)

# Check sitemap URL count
curl -s https://tariff-nav.vercel.app/sitemap.xml > sitemap_check.txt
findstr /c:"<loc>" sitemap_check.txt | find /c "<loc>"

# Open any file in notepad
notepad app\layout.tsx
notepad components\Footer.tsx
```

---

## 🔗 IMPORTANT LINKS
| Resource | URL |
|----------|-----|
| Live Site | https://tariff-nav.vercel.app |
| Blog | https://tariff-nav.vercel.app/blog |
| Sitemap | https://tariff-nav.vercel.app/sitemap.xml |
| robots.txt | https://tariff-nav.vercel.app/robots.txt |
| GitHub Repo | https://github.com/nabilanjum71-cell/tariff-nav |
| GitHub Actions | https://github.com/nabilanjum71-cell/tariff-nav/actions |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard |
| Google Search Console | https://search.google.com/search-console |
| Groq Console | https://console.groq.com |
| Unsplash Developers | https://unsplash.com/developers |
| Bing Webmaster Tools | https://www.bing.com/webmasters |

---

## 💡 FUTURE FEATURE BACKLOG (Phase 5+)
- PDF export of duty rate reports
- API access for businesses (paid tier)
- Mobile app (React Native)
- Tariff change timeline visualization per HS code
- Import cost comparison: China vs Vietnam vs India vs Mexico
- CBP ruling database search
- Customs broker directory
- Trade show calendar for importers
- Twitter/X auto-tweet bot for daily tariff changes
- YouTube channel + auto-embed new videos via YouTube API

---

*Created: June 19, 2026. Hand this file to any new Claude chat to continue from exactly where we left off. Always update the phase checkboxes and "Last Updated" date after completing tasks.*
