# TariffNav — Master Agent File
**Site:** https://tariff-nav.vercel.app
**GitHub:** https://github.com/nabilanjum71-cell/tariff-nav
**Project Location:** E:\tariff-nav (Windows PC)
**Last Updated:** September 20, 2026
**Purpose:** Hand this file to any new Claude chat to continue exactly where we left off.

---

## 🏗️ TECH STACK
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS / inline styles
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel (Hobby plan — free)
- **AI Content:** Groq API (multiple keys)
- **Blog Images:** Unsplash API
- **Node version:** 24

---

## 🔑 ALL API KEYS (GitHub Secrets)
| Secret Name | Purpose | Status |
|-------------|---------|--------|
| `GROQ_API_KEY` | AI summaries batch 1 | ✅ Working |
| `GROQ_KEY_2` | Importer FAQ generation | ✅ Working |
| `GROQ_KEY_3` | Blog posts only | ✅ Working |
| `GROQ_KEY_4` | Import guide generation | ✅ Working |
| `GROQ_KEY_5` | Duty breakdown generation | ✅ Working |
| `GROQ_KEY_1` | Trade guide generation | ✅ Working |
| `GROQ_API_KEY_11` | Import guide (new) | ✅ Added Sep 18 |
| `GROQ_API_KEY_12` | Import guide (new) | ✅ Added Sep 18 |
| `GROQ_KEY_14` | Duty breakdown (new) | ✅ Added Sep 18 |
| `GROQ_KEY_15` | Duty breakdown (new) | ✅ Added Sep 18 |
| `MISTRAL_KEY_1` | Unused — Mistral stopped working | ❌ Dead |
| `MISTRAL_KEY_2` | Unused — Mistral stopped working | ❌ Dead |
| `UNSPLASH_KEY` | Blog header images | ✅ Working |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | ✅ Working |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin | ✅ Working |
| `VERCEL_DEPLOY_HOOK` | Unused — removed from workflow | ❌ Removed |

---

## 📊 ANALYTICS & TRACKING
| Tool | ID | Status |
|------|-----|--------|
| Google Analytics 4 | `G-RGNX43NN9Z` | ✅ Live |
| Microsoft Clarity | `xow9warv1p` | ✅ Live |
| Google Search Console | Verified | ✅ Live |
| Bing Webmaster Tools | Verified | ✅ Live |

---

## 🗄️ DATABASE (Supabase) — hs_codes (14,556 rows)
| Column | Type | Status |
|--------|------|--------|
| id | uuid | primary key |
| hts_code | text | e.g. "8471.30.01" |
| description | text | product description |
| ai_summary | text | ✅ 14,556/14,556 COMPLETE |
| us_duty_rate | numeric | duty rate % |
| duty_by_country | jsonb | 164 countries |
| rate_history | jsonb | historical changes |
| trade_agreements | jsonb | USMCA, GSP, KORUS etc |
| import_guide | text | 🔄 200/14,556 |
| duty_breakdown | text | 🔄 4,052/14,556 |
| trade_guide | text | 🔄 1,576/14,556 |
| importer_faq | text | 🔄 61/14,556 |
| top_importers | text | country names |
| trade_volume_usd | numeric | trade volume |
| video_ids | text | YouTube (empty) |
| updated_at | timestamptz | last update |

### ⚠️ CRITICAL DB NOTE
All 4 content columns have mix of NULL and empty string ''.
Script now handles BOTH but to be safe run this monthly:
```sql
UPDATE hs_codes SET import_guide = NULL WHERE import_guide = '';
UPDATE hs_codes SET duty_breakdown = NULL WHERE duty_breakdown = '';
UPDATE hs_codes SET trade_guide = NULL WHERE trade_guide = '';
UPDATE hs_codes SET importer_faq = NULL WHERE importer_faq = '';
```

---

## ⚙️ GITHUB ACTIONS WORKFLOW
**File:** `.github/workflows/daily-sync.yml`
**Schedule:** 6am UTC + 6pm UTC (2 runs/day)
**Total per run: ~800 pages**

| Step | Key Used | Section | Pages/run |
|------|----------|---------|-----------|
| Blog post | GROQ_KEY_3 | blog_posts | 1 |
| import_guide | GROQ_KEY_4 | import_guide | 100 |
| import_guide | GROQ_API_KEY_11 | import_guide | 100 |
| import_guide | GROQ_API_KEY_12 | import_guide | 100 |
| duty_breakdown | GROQ_KEY_5 | duty_breakdown | 100 |
| duty_breakdown | GROQ_KEY_14 | duty_breakdown | 100 |
| duty_breakdown | GROQ_KEY_15 | duty_breakdown | 100 |
| trade_guide | GROQ_KEY_1 | trade_guide | 100 |
| importer_faq | GROQ_KEY_2 | importer_faq | 100 |

**800/run × 2 = 1,600/day = all done ~Oct 1**

### ⚠️ CRITICAL WARNINGS
1. **NEVER add fetch-data.js to workflow** — wipes ai_summary
2. **Vercel rebuild removed** — force-dynamic serves fresh data
3. **Mistral keys dead** — all switched to Groq

---

## 📁 KEY FILES
```
app/
├── page.tsx                    ← Homepage (force-dynamic)
├── layout.tsx                  ← GA4 + Clarity + Schema
├── hs-code/[code]/page.tsx     ← All content sections
├── chapter/[chapter]/page.tsx  ← Breadcrumb schema
├── sitemap.xml/route.ts        ← Master sitemap index
├── sitemap-static.xml/         ← 105 static URLs
├── sitemap-codes-1.xml/        ← HS codes 1-1000
│   ... (codes 2-15)
scripts/
├── generate-content-batch.js   ← Universal content script
├── generate-blog.js            ← Blog generation
├── generate-summaries.js       ← AI summaries (COMPLETE)
├── fetch-data.js               ← DANGER: MANUAL ONLY
public/
└── BingSiteAuth.xml            ← Bing verification
```

---

## ✅ WHAT'S ON EVERY HS CODE PAGE

### Zero API (All 14,556 pages) ✅
- AI Summary (complete)
- Quick Facts card
- Instant Cost Calculator (3 shipment sizes)
- Trade Agreement Savings table
- FAQPage schema
- Speakable schema for voice search
- BreadcrumbList schema

### API-Powered (filling 1,600/day) 🔄
- Import Guide (~175 words)
- Duty Breakdown (~175 words)
- Trade Guide (~175 words)
- Importer FAQ (4 Q&As)

---

## 📊 CURRENT STATS (Sep 20, 2026)
| Metric | Value |
|--------|-------|
| Google indexed | 6,990 pages |
| Not indexed | 7,720 pages |
| Impressions (3 months) | 22,400 |
| Clicks (3 months) | 67 |
| Avg CTR | 0.3% |
| Avg Position | 16.8 (page 2) |
| AI Summaries | 14,556 ✅ Complete |
| Import Guides | 200 🔄 |
| Duty Breakdowns | 4,052 🔄 |
| Trade Guides | 1,576 🔄 |
| Importer FAQs | 61 🔄 |
| Blog Posts | 90+ |
| GitHub Actions | ✅ 216 runs all green |

---

## 🔴 CURRENT ISSUES
1. Content pipeline slow — fixed Sep 20 (now handles null + empty strings)
2. Vercel storage exceeded 19GB — removed daily rebuilds
3. 7,720 pages not indexed — will fix with more content
4. CTR 0.3% too low — fixed titles Sep 18

---

## 🚀 RANKING ACTION PLAN

### Already Done (Sep 18-20)
- ✅ Better page titles (HS Code + description + duty rate)
- ✅ Better meta descriptions (keywords + features)
- ✅ Canonical tags added
- ✅ Homepage keywords improved
- ✅ Content pipeline fixed (8 keys = 1,600/day)

### Do This Week 🔴
1. **Buy domain** — tariffnav.com (~$10 on namecheap.com)
2. **Reddit posts** — r/importing, r/ecommerce, r/FulfillmentByAmazon
3. **Product Hunt launch** — producthunt.com
4. **Apply AdSense** — google.com/adsense

### Domain Transfer Steps (when ready)
1. Buy tariffnav.com on Namecheap
2. Vercel → Settings → Domains → Add tariffnav.com
3. Add DNS records in Namecheap
4. Add new property in Search Console
5. Submit sitemap on new domain
6. 301 redirects automatic via Vercel

---

## 💰 MONETIZATION PLAN

### Month 1 (Now) — AdSense
- Apply immediately at google.com/adsense
- Approved in 1-2 weeks
- Expected: $20-50/month

### Month 2 — Affiliate Links
Add to every HS code page:
- Flexport (customs broker)
- Freightos (freight rates)
- ImportGenius (trade data)
- Expected: $50-200/month

### Month 3 — Pro Subscription ($9/month)
- Bulk HS code lookup
- Email alerts
- API access

---

## 📅 ROADMAP TO OCT 1

| Date | Task |
|------|------|
| Sep 20 | Content pipeline fixed — 1,600/day running |
| Sep 21 | Buy tariffnav.com domain |
| Sep 22 | Reddit + Product Hunt launch |
| Sep 23 | Apply AdSense |
| Sep 27 | All 14,556 pages fully enriched |
| Sep 28 | Transfer to custom domain |
| Oct 1 | 🎉 Full launch |

---

## 📅 DAILY MONITORING (2 min)

```
github.com/nabilanjum71-cell/tariff-nav/actions
```
All runs green ✅? Each step taking 1-2 min = working!

### Weekly SQL Check
```sql
select
count(case when import_guide is not null and import_guide != '' then 1 end) as import_guides,
count(case when duty_breakdown is not null and duty_breakdown != '' then 1 end) as duty_breakdowns,
count(case when trade_guide is not null and trade_guide != '' then 1 end) as trade_guides,
count(case when importer_faq is not null and importer_faq != '' then 1 end) as importer_faqs
from hs_codes;
```

### If a Key Dead
Check GitHub Actions → expand step → if shows 0 generated:
1. Go to console.groq.com → create new key
2. GitHub → Settings → Secrets → update that key
3. Done!

---

## 🔧 STILL TO BUILD (After Oct 1)
- [ ] HS Code AI Classifier
- [ ] Section 301 Checker
- [ ] Country pages (/import-from/china etc)
- [ ] Product pages (/import/laptops etc)
- [ ] Bulk HS Code Lookup
- [ ] YouTube video IDs for chapters
- [ ] Stripe Pro subscription

---

## ⚠️ CRITICAL WARNINGS
1. **fetch-data.js** — NEVER in daily-sync.yml
2. **Mistral keys** — both dead, don't use
3. **Vercel storage** — delete old deployments regularly
4. **Build time** — 6 min with force-dynamic (normal)
5. **DB empty strings** — run NULL update SQL if pipeline stops

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
| Namecheap | https://namecheap.com |
| AdSense | https://google.com/adsense |
| Product Hunt | https://producthunt.com |

---

*Last Updated: September 20, 2026*
*Next session: Start by sharing SQL results + GitHub Actions screenshot*
*Always provide fresh GitHub token with repo + workflow scope*
