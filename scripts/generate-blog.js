const { createClient } = require('@supabase/supabase-js')
const Groq = require('groq-sdk')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const TOPICS = [
  { title: 'HS Code for Laptops — Complete Import Guide 2025', slug: 'hs-code-laptops-import-guide', keywords: 'HS code laptops, laptop import duty, HTS 8471.30' },
  { title: 'HS Code for Smartphones — Duty Rates & Classification', slug: 'hs-code-smartphones-duty-rates', keywords: 'HS code smartphones, phone import duty, HTS 8517.12' },
  { title: 'HS Code for T-Shirts — Clothing Import Tariff Guide', slug: 'hs-code-t-shirts-clothing-tariff', keywords: 'HS code t-shirts, clothing import duty, HTS 6109.10' },
  { title: 'HS Code for Coffee — Import Duties & Trade Agreements', slug: 'hs-code-coffee-import-duties', keywords: 'HS code coffee, coffee import duty, HTS 0901.11' },
  { title: 'HS Code for Solar Panels — Tariff Classification Guide', slug: 'hs-code-solar-panels-tariff', keywords: 'HS code solar panels, solar import duty, Section 201 tariff' },
  { title: 'HS Code for Electric Vehicles — Import Duty 2025', slug: 'hs-code-electric-vehicles-import-duty', keywords: 'HS code electric vehicles, EV import duty, HTS 8703' },
  { title: 'HS Code for Furniture — Anti-Dumping Duties Explained', slug: 'hs-code-furniture-anti-dumping', keywords: 'HS code furniture, furniture import duty, anti-dumping China' },
  { title: 'HS Code for Shoes — Why Footwear Has 37.5% Duty', slug: 'hs-code-shoes-footwear-duty', keywords: 'HS code shoes, footwear import duty, HTS 6401, 37.5% tariff' },
  { title: 'HS Code for Steel — Section 232 Tariff Complete Guide', slug: 'hs-code-steel-section-232', keywords: 'HS code steel, steel import duty, Section 232 tariff' },
  { title: 'HS Code for Aluminum — Section 232 Import Rules', slug: 'hs-code-aluminum-section-232', keywords: 'HS code aluminum, aluminum import duty, Section 232' },
  { title: 'HS Code for Medicines — Pharmaceutical Import Guide', slug: 'hs-code-medicines-pharmaceutical-import', keywords: 'HS code medicines, pharmaceutical import duty, HTS 3004' },
  { title: 'HS Code for Toys — China Section 301 Tariff Guide', slug: 'hs-code-toys-section-301-china', keywords: 'HS code toys, toy import duty, Section 301 China tariff' },
  { title: 'HS Code for Car Parts — Automotive Import Classification', slug: 'hs-code-car-parts-automotive', keywords: 'HS code car parts, auto parts import duty, HTS 8708' },
  { title: 'HS Code for Rice — Agricultural Import Duty Guide', slug: 'hs-code-rice-agricultural-import', keywords: 'HS code rice, rice import duty, agricultural tariff' },
  { title: 'HS Code for Wine — Beverage Import Tariff Guide', slug: 'hs-code-wine-beverage-tariff', keywords: 'HS code wine, wine import duty, HTS 2204' },
  { title: 'How to Import from China to USA — Complete 2025 Guide', slug: 'how-to-import-from-china-usa-2025', keywords: 'import from China, China tariffs, Section 301, import duty China' },
  { title: 'How to Import from India to USA — Tariff & GSP Guide', slug: 'how-to-import-from-india-usa', keywords: 'import from India, India tariffs, GSP India, import duty India' },
  { title: 'How to Import from Mexico — USMCA Zero Duty Guide', slug: 'how-to-import-from-mexico-usmca', keywords: 'import from Mexico, USMCA Mexico, zero duty Mexico' },
  { title: 'How to Import from Canada — USMCA Benefits Explained', slug: 'how-to-import-from-canada-usmca', keywords: 'import from Canada, USMCA Canada, duty free Canada' },
  { title: 'How to Import from Vietnam — Tariff Rates 2025', slug: 'how-to-import-from-vietnam-2025', keywords: 'import from Vietnam, Vietnam tariffs, duty rates Vietnam' },
  { title: 'How to Import from Bangladesh — Clothing Tariff Guide', slug: 'how-to-import-from-bangladesh-clothing', keywords: 'import from Bangladesh, Bangladesh clothing tariff, GSP Bangladesh' },
  { title: 'How to Import from Germany — EU Import Duty Rates', slug: 'how-to-import-from-germany-eu', keywords: 'import from Germany, EU import duty, German products tariff' },
  { title: 'How to Import from Japan — Trade Agreement Guide', slug: 'how-to-import-from-japan', keywords: 'import from Japan, Japan tariffs, KORUS Japan trade' },
  { title: 'How to Import from South Korea — KORUS FTA Benefits', slug: 'how-to-import-from-south-korea-korus', keywords: 'import from South Korea, KORUS FTA, Korea duty rates' },
  { title: 'How to Import from Thailand — GSP Eligibility Guide', slug: 'how-to-import-from-thailand-gsp', keywords: 'import from Thailand, Thailand GSP, duty rates Thailand' },
  { title: 'How to Import from Indonesia — Import Duty Rates 2025', slug: 'how-to-import-from-indonesia', keywords: 'import from Indonesia, Indonesia tariffs, duty rates 2025' },
  { title: 'How to Import from Turkey — Tariff Classification Guide', slug: 'how-to-import-from-turkey', keywords: 'import from Turkey, Turkey tariffs, duty rates Turkey' },
  { title: 'How to Import from Brazil — Import Duty & Trade Rules', slug: 'how-to-import-from-brazil', keywords: 'import from Brazil, Brazil tariffs, import duty Brazil' },
  { title: 'How to Import from Taiwan — Electronics Import Guide', slug: 'how-to-import-from-taiwan-electronics', keywords: 'import from Taiwan, Taiwan electronics tariff, duty rates Taiwan' },
  { title: 'How to Import from United Kingdom — Post-Brexit Tariffs', slug: 'how-to-import-from-uk-post-brexit', keywords: 'import from UK, post-Brexit tariffs, UK import duty USA' },
  { title: 'Section 301 Tariffs — Complete List of China Products 2025', slug: 'section-301-tariffs-china-products-2025', keywords: 'Section 301 tariffs, China tariff list, trade war tariffs' },
  { title: 'Section 232 Tariffs — Steel & Aluminum Import Rules', slug: 'section-232-tariffs-steel-aluminum', keywords: 'Section 232 tariffs, steel tariff, aluminum tariff' },
  { title: 'USMCA Rules of Origin — How to Qualify for Zero Duty', slug: 'usmca-rules-of-origin-zero-duty', keywords: 'USMCA rules of origin, zero duty USMCA, Mexico Canada tariff' },
  { title: 'GSP Program Explained — Which Countries Get Lower Rates', slug: 'gsp-program-explained-lower-duty-rates', keywords: 'GSP program, Generalized System of Preferences, developing country tariff' },
  { title: 'Most Favored Nation Rates — What Importers Need to Know', slug: 'most-favored-nation-mfn-rates-importers', keywords: 'MFN rates, Most Favored Nation tariff, WTO duty rates' },
  { title: 'Anti-Dumping Duties — How They Work & Which Products', slug: 'anti-dumping-duties-explained', keywords: 'anti-dumping duties, ADD tariffs, dumping investigation' },
  { title: 'Countervailing Duties — Government Subsidy Tariffs', slug: 'countervailing-duties-subsidy-tariffs', keywords: 'countervailing duties, CVD tariffs, subsidy investigation' },
  { title: 'Tariff Rate Quotas — How TRQs Work for Agricultural Imports', slug: 'tariff-rate-quotas-agricultural-imports', keywords: 'tariff rate quota, TRQ, agricultural import quota' },
  { title: 'De Minimis Rule — $800 Threshold for Duty-Free Imports', slug: 'de-minimis-rule-800-duty-free', keywords: 'de minimis rule, $800 threshold, duty free shipping' },
  { title: 'Foreign Trade Zones — How to Defer Import Duties', slug: 'foreign-trade-zones-defer-import-duties', keywords: 'foreign trade zone, FTZ, defer import duty' },
  { title: 'Duty Drawback — How to Get Refunds on Import Duties', slug: 'duty-drawback-refunds-import-duties', keywords: 'duty drawback, import duty refund, CBP drawback' },
  { title: 'CBP Binding Ruling — How to Get Official HS Classification', slug: 'cbp-binding-ruling-hs-classification', keywords: 'CBP binding ruling, official HS code, customs ruling' },
  { title: 'Importing Electronics from China — Section 301 Guide', slug: 'importing-electronics-china-section-301', keywords: 'import electronics China, Section 301 electronics, China electronics duty' },
  { title: 'Importing Clothing & Apparel — Complete Tariff Guide 2025', slug: 'importing-clothing-apparel-tariff-guide', keywords: 'import clothing USA, apparel tariff, clothing duty rates' },
  { title: 'Importing Food Products — FDA & Customs Requirements', slug: 'importing-food-products-fda-customs', keywords: 'import food USA, FDA food import, food customs clearance' },
  { title: 'Importing Medical Devices — FDA & Duty Rates', slug: 'importing-medical-devices-fda-duty', keywords: 'import medical devices, FDA 510k, medical device duty rate' },
  { title: 'Importing Cosmetics — FDA Registration & Import Duties', slug: 'importing-cosmetics-fda-registration', keywords: 'import cosmetics USA, FDA cosmetics, cosmetics duty rate' },
  { title: 'Importing Machinery — Chapter 84 Classification Guide', slug: 'importing-machinery-chapter-84-guide', keywords: 'import machinery USA, Chapter 84 HS code, machinery duty rate' },
  { title: 'Importing Automotive Parts — HTS Code Lookup Guide', slug: 'importing-automotive-parts-hts-code', keywords: 'import auto parts, automotive HTS code, car parts duty' },
  { title: 'Importing Jewelry — Precious Metals Duty Rates', slug: 'importing-jewelry-precious-metals-duty', keywords: 'import jewelry USA, jewelry duty rate, precious metals tariff' },
  { title: 'Importing Textiles — Quota & Tariff Complete Guide', slug: 'importing-textiles-quota-tariff-guide', keywords: 'import textiles USA, textile quota, fabric duty rate' },
  { title: 'Importing Supplements — FDA Guidelines & Duty Rates', slug: 'importing-supplements-fda-duty-rates', keywords: 'import supplements USA, FDA supplements, supplement duty rate' },
  { title: 'Importing Batteries — Lithium Battery Import Regulations', slug: 'importing-batteries-lithium-regulations', keywords: 'import lithium batteries, battery regulations, battery duty rate' },
  { title: 'Importing Drones — FAA & CBP Classification Guide', slug: 'importing-drones-faa-cbp-guide', keywords: 'import drones USA, FAA drone rules, drone HS code' },
  { title: 'How to Calculate Import Duty — Step by Step Guide', slug: 'how-to-calculate-import-duty', keywords: 'calculate import duty, duty calculator, how much is import tax' },
  { title: 'What is CIF vs FOB — How Shipping Terms Affect Duty', slug: 'cif-vs-fob-shipping-terms-duty', keywords: 'CIF vs FOB, shipping terms duty, incoterms customs' },
  { title: 'Customs Bond — When You Need One & How to Get It', slug: 'customs-bond-when-needed-how-to-get', keywords: 'customs bond, import bond, CBP bond requirement' },
  { title: 'ISF Filing — Importer Security Filing Complete Guide', slug: 'isf-filing-importer-security-guide', keywords: 'ISF filing, 10+2 filing, importer security filing' },
  { title: 'Customs Broker — Do You Need One & How to Choose', slug: 'customs-broker-do-you-need-one', keywords: 'customs broker, do I need customs broker, find customs broker' },
  { title: 'Commercial Invoice Requirements — What Customs Needs', slug: 'commercial-invoice-requirements-customs', keywords: 'commercial invoice customs, invoice requirements import, customs documentation' },
  { title: 'Certificate of Origin — When Required & How to Get It', slug: 'certificate-of-origin-import-guide', keywords: 'certificate of origin, country of origin, origin documentation' },
  { title: 'Customs Examination — What Happens When CBP Inspects', slug: 'customs-examination-cbp-inspection', keywords: 'customs examination, CBP inspection, customs hold' },
  { title: 'Customs Penalties — How to Avoid Import Violations', slug: 'customs-penalties-avoid-violations', keywords: 'customs penalties, import violations, CBP fines' },
  { title: 'Country of Origin Marking — Made in USA vs Import Rules', slug: 'country-of-origin-marking-rules', keywords: 'country of origin marking, Made in USA, origin label rules' },
  { title: 'Amazon FBA Imports — HS Code & Duty Calculator Guide', slug: 'amazon-fba-imports-hs-code-duty', keywords: 'Amazon FBA import duty, FBA HS code, Amazon import guide' },
  { title: 'Shopify Import Business — Tariff Guide for eCommerce', slug: 'shopify-import-business-tariff-guide', keywords: 'Shopify import duty, ecommerce tariff, online store import' },
  { title: 'Dropshipping Import Duties — What You Must Know', slug: 'dropshipping-import-duties-guide', keywords: 'dropshipping import duty, dropship customs, de minimis dropship' },
  { title: 'How Tariffs Affect Product Pricing — Importer Guide', slug: 'how-tariffs-affect-product-pricing', keywords: 'tariff impact pricing, import cost calculator, tariff effect business' },
  { title: 'Supply Chain Diversification — Moving from China to Vietnam', slug: 'supply-chain-china-to-vietnam', keywords: 'China plus one, Vietnam manufacturing, supply chain diversification' },
  { title: 'Tariff Engineering — Legal Ways to Reduce Import Duty', slug: 'tariff-engineering-reduce-import-duty', keywords: 'tariff engineering, reduce import duty legally, duty minimization' },
  { title: 'First Time Importer Guide — Complete Step by Step 2025', slug: 'first-time-importer-guide-2025', keywords: 'first time importer, how to import USA, import guide beginners' },
  { title: 'Freight Forwarder vs Customs Broker — Difference Explained', slug: 'freight-forwarder-vs-customs-broker', keywords: 'freight forwarder vs customs broker, import agent, shipping agent' },
  { title: 'Incoterms 2025 — Complete Guide for Importers', slug: 'incoterms-2025-guide-importers', keywords: 'Incoterms 2025, EXW FOB CIF DDP, shipping terms explained' },
  { title: 'Landed Cost Calculator — True Cost of Importing Products', slug: 'landed-cost-calculator-importing', keywords: 'landed cost calculator, total import cost, duty plus shipping' },
  { title: 'Minimum Order Quantity vs Duty Cost — Import Strategy', slug: 'minimum-order-quantity-duty-strategy', keywords: 'MOQ import duty, minimum order import, import quantity strategy' },
  { title: 'HS Code Audit — How to Review Your Import Classifications', slug: 'hs-code-audit-import-classifications', keywords: 'HS code audit, classification review, customs compliance audit' },
  { title: 'Future of US Tariffs — Trade Policy Outlook 2025-2026', slug: 'future-us-tariffs-trade-policy-2025-2026', keywords: 'US tariff outlook, trade policy 2025, future import duties' },
  { title: 'What is an HS Code — Complete Beginner Guide', slug: 'what-is-hs-code-beginner-guide', keywords: 'what is HS code, HTS code explained, harmonized system' },
  { title: 'HTS Code vs HS Code — What is the Difference', slug: 'hts-code-vs-hs-code-difference', keywords: 'HTS vs HS code, difference HTS HS, harmonized tariff schedule' },
  { title: 'How to Find Your HS Code — Step by Step Guide', slug: 'how-to-find-hs-code-guide', keywords: 'find HS code, lookup HTS code, HS code search' },
  { title: 'Import Duty vs Sales Tax — What Importers Must Know', slug: 'import-duty-vs-sales-tax', keywords: 'import duty vs sales tax, customs duty tax, VAT import' },
  { title: 'Trade War Impact on Import Costs — 2025 Analysis', slug: 'trade-war-impact-import-costs-2025', keywords: 'trade war 2025, tariff impact, import cost increase' },
  { title: 'China Tariffs 2025 — Complete Updated List', slug: 'china-tariffs-2025-complete-list', keywords: 'China tariffs 2025, Section 301 list, China import duty' },
  { title: 'USMCA vs NAFTA — What Changed for Importers', slug: 'usmca-vs-nafta-what-changed', keywords: 'USMCA vs NAFTA, trade agreement change, Mexico Canada import' },
  { title: 'Import Duty Exemptions — Who Qualifies & How to Apply', slug: 'import-duty-exemptions-who-qualifies', keywords: 'duty exemption, import tax exemption, duty free qualification' },
  { title: 'Bonded Warehouse — Store Imports Without Paying Duty', slug: 'bonded-warehouse-defer-import-duty', keywords: 'bonded warehouse, defer import duty, customs warehouse' },
  { title: 'Prior Disclosure — How to Fix Customs Mistakes', slug: 'prior-disclosure-fix-customs-mistakes', keywords: 'prior disclosure CBP, customs mistake fix, import error correction' },
  { title: 'Top 10 Most Imported Products into the USA — 2025', slug: 'top-10-most-imported-products-usa-2025', keywords: 'most imported products USA, top imports America, US import statistics' },
  { title: 'Tariff Classification Disputes — How to Appeal CBP Decisions', slug: 'tariff-classification-disputes-cbp-appeal', keywords: 'CBP appeal, tariff dispute, HS code dispute resolution' },
  { title: 'Import Licenses — When Do You Need One', slug: 'import-licenses-when-needed', keywords: 'import license USA, when need import permit, restricted imports' },
  { title: 'Intellectual Property & Customs — Protecting Your Brand', slug: 'intellectual-property-customs-brand-protection', keywords: 'CBP IPR, intellectual property customs, brand protection import' },
]

async function generateBlogPost(topic) {
  const prompt = `Write a comprehensive, SEO-optimized blog post for an import/tariff information website called TariffNav.

Title: ${topic.title}
Target keywords: ${topic.keywords}

Requirements:
- 800-1000 words
- Start with a compelling introduction explaining why this matters to importers
- Include practical, actionable information
- Mention specific duty rates, HS codes, or trade agreements where relevant
- Include a section on "How TariffNav Helps" that mentions searching for HS codes
- End with a clear conclusion and call to action
- Write in plain English, not legal jargon
- Format with clear headings using ## for H2 and ### for H3
- Include a meta description at the very start in format: META: [description under 160 chars]

Write the complete blog post now:`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  })
  return response.choices[0].message.content
}

async function main() {
  // Find which topic to write today
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('topic_index')
    .order('topic_index', { ascending: false })
    .limit(1)

  const lastIndex = existing?.[0]?.topic_index ?? -1
  const nextIndex = lastIndex + 1

  if (nextIndex >= TOPICS.length) {
    console.log('All 90 topics completed!')
    return
  }

  const topic = TOPICS[nextIndex]
  console.log(`Writing blog post ${nextIndex + 1}/90: ${topic.title}`)

  const content = await generateBlogPost(topic)

  // Extract meta description
  const metaMatch = content.match(/META:\s*(.+)/i)
  const excerpt = metaMatch ? metaMatch[1].trim() : topic.title

  // Save to Supabase
  const { error } = await supabase
    .from('blog_posts')
    .insert({
      slug: topic.slug,
      title: topic.title,
      content: content.replace(/META:.*\n?/i, '').trim(),
      excerpt,
      topic_index: nextIndex,
      status: 'published'
    })

  if (error) {
    console.error('Error saving:', error)
  } else {
    console.log(`✓ Published: ${topic.slug}`)
  }
}

main().catch(console.error)