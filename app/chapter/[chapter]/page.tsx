import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DutyBarChart } from '@/components/charts/DutyBarChart'

type Props = { params: { chapter: string } }

const CHAPTER_META: Record<string, { title: string; icon: string; description: string }> = {
  '01': { title: 'Live Animals', icon: '🐄', description: 'All live animals including livestock, poultry, horses, and other living creatures traded internationally. Duty rates vary by species and country of origin.' },
  '02': { title: 'Meat & Edible Offal', icon: '🥩', description: 'Fresh, chilled, and frozen meat products including beef, pork, poultry, and edible offal. Subject to significant trade restrictions and tariff-rate quotas.' },
  '03': { title: 'Fish & Seafood', icon: '🐟', description: 'Fish, crustaceans, molluscs, and other aquatic invertebrates. Covers fresh, frozen, dried, and prepared seafood products.' },
  '04': { title: 'Dairy & Eggs', icon: '🥚', description: 'Milk, cream, butter, cheese, eggs, and honey. Many dairy products are subject to tariff-rate quotas under US trade agreements.' },
  '05': { title: 'Animal Products', icon: '🦴', description: 'Other animal products including hair, feathers, bones, ivory, and animal gut. Used in manufacturing, fashion, and industrial applications.' },
  '06': { title: 'Plants & Flowers', icon: '🌸', description: 'Live trees, plants, bulbs, cut flowers, and ornamental foliage. Subject to phytosanitary requirements in addition to duty rates.' },
  '07': { title: 'Vegetables', icon: '🥦', description: 'Fresh, chilled, frozen, and dried vegetables. Includes potatoes, tomatoes, onions, and all edible plants not classified elsewhere.' },
  '08': { title: 'Fruits & Nuts', icon: '🍊', description: 'Fresh and dried fruits, nuts, and citrus peel. Trade volumes are substantial — the US imports billions in tropical fruits annually.' },
  '09': { title: 'Coffee, Tea & Spices', icon: '☕', description: 'Coffee, tea, maté, spices, and pepper. Coffee alone represents one of the largest agricultural imports into the United States.' },
  '10': { title: 'Cereals', icon: '🌾', description: 'Wheat, rice, corn, oats, barley, and other cereal grains. Fundamental to global food security and heavily influenced by US agricultural policy.' },
  '11': { title: 'Milling Products', icon: '🌾', description: 'Flour, meal, starch, and malt derived from cereals and vegetables. Used extensively in food manufacturing.' },
  '12': { title: 'Oil Seeds', icon: '🌻', description: 'Soybeans, sunflower seeds, peanuts, and other oil-bearing crops. Critical inputs for food oils, animal feed, and biofuels.' },
  '13': { title: 'Lac & Gums', icon: '🌿', description: 'Lac, natural gums, resins, and vegetable saps. Used in food coatings, adhesives, and pharmaceutical applications.' },
  '14': { title: 'Vegetable Materials', icon: '🪵', description: 'Vegetable plaiting materials and products used for stuffing or padding.' },
  '15': { title: 'Animal & Vegetable Fats', icon: '🫙', description: 'Fats and oils derived from animals and plants, including lard, palm oil, soybean oil, and their fractions.' },
  '16': { title: 'Meat Preparations', icon: '🥫', description: 'Prepared or preserved meat, fish, and crustaceans including canned goods, sausages, and processed seafood.' },
  '17': { title: 'Sugars', icon: '🍬', description: 'Cane sugar, beet sugar, molasses, and artificial honey. Subject to tariff-rate quotas under US trade policy.' },
  '18': { title: 'Cocoa & Chocolate', icon: '🍫', description: 'Cocoa beans, cocoa powder, chocolate, and cocoa preparations. The US is one of the world\'s largest chocolate markets.' },
  '19': { title: 'Cereals & Pastry', icon: '🥐', description: 'Preparations of cereals, flour, starch, or milk including bread, pastry, pasta, and breakfast cereals.' },
  '20': { title: 'Vegetables Preparations', icon: '🥗', description: 'Preserved and prepared vegetables, fruits, and nuts including jams, juices, and pickled products.' },
  '21': { title: 'Miscellaneous Food', icon: '🍱', description: 'Miscellaneous edible preparations including soups, sauces, seasonings, ice cream, and dietary supplements.' },
  '22': { title: 'Beverages & Spirits', icon: '🍷', description: 'Waters, juices, soft drinks, beer, wine, and distilled spirits. Duty rates vary significantly by product type.' },
  '23': { title: 'Food Industry Residues', icon: '🌽', description: 'Residues from food manufacturing used as animal feed, including bran, oil-cake, and fermentation residues.' },
  '24': { title: 'Tobacco', icon: '🚬', description: 'Tobacco and manufactured tobacco substitutes including cigarettes, cigars, and smokeless tobacco.' },
  '25': { title: 'Salt & Stone', icon: '🪨', description: 'Salt, sulfur, earth, stone, plaster, lime, and cement. Essential raw materials for construction and chemical industries.' },
  '26': { title: 'Ores & Slag', icon: '⛏️', description: 'Metal ores, slag, and ash including iron ore, copper ore, and precious metal concentrates.' },
  '27': { title: 'Mineral Fuels & Oil', icon: '⛽', description: 'Petroleum, natural gas, coal, and energy products. Among the highest-value globally traded commodities.' },
  '28': { title: 'Inorganic Chemicals', icon: '⚗️', description: 'Inorganic chemical compounds including acids, bases, salts, and precious metal compounds.' },
  '29': { title: 'Organic Chemicals', icon: '🧪', description: 'Organic chemical compounds used in pharmaceutical, agricultural, and industrial applications.' },
  '30': { title: 'Pharmaceutical Products', icon: '💊', description: 'Medicines, vaccines, bandages, and pharmaceutical preparations. One of the fastest growing import categories.' },
  '31': { title: 'Fertilizers', icon: '🌱', description: 'Mineral and chemical fertilizers including nitrogen, phosphate, and potash compounds.' },
  '32': { title: 'Tanning & Dyes', icon: '🎨', description: 'Tanning extracts, synthetic dyes, paints, varnishes, inks, and related products.' },
  '33': { title: 'Perfumes & Cosmetics', icon: '💄', description: 'Essential oils, perfumes, cosmetics, and toiletry preparations. A multi-billion dollar import category.' },
  '34': { title: 'Soap & Wax', icon: '🧼', description: 'Soaps, detergents, lubricants, waxes, and surface-active preparations.' },
  '35': { title: 'Albuminoidal Substances', icon: '🧬', description: 'Proteins, casein, albumin, gelatin, enzymes, and starches used in food and pharmaceutical applications.' },
  '36': { title: 'Explosives', icon: '💥', description: 'Explosives, matches, pyrotechnic products, and flammable preparations. Highly regulated with strict import controls.' },
  '37': { title: 'Photographic Goods', icon: '📷', description: 'Photographic film, plates, paper, and chemicals for imaging applications.' },
  '38': { title: 'Chemical Products', icon: '🔬', description: 'Miscellaneous chemical products including insecticides, disinfectants, adhesives, and finishing agents.' },
  '39': { title: 'Plastics', icon: '🧴', description: 'Plastics and plastic articles from raw polymers to finished consumer products. One of the largest import categories.' },
  '40': { title: 'Rubber', icon: '⚫', description: 'Natural and synthetic rubber, and rubber articles including tires, tubes, and industrial rubber products.' },
  '41': { title: 'Raw Hides & Leather', icon: '🐂', description: 'Raw hides and skins, leather, and composition leather used in footwear, bags, and upholstery.' },
  '42': { title: 'Leather Articles', icon: '👜', description: 'Travel goods, handbags, wallets, belts, and other leather articles. High-value fashion goods attract significant duties.' },
  '43': { title: 'Furskins', icon: '🦊', description: 'Furskins and artificial fur, and articles made from fur.' },
  '44': { title: 'Wood & Articles', icon: '🪵', description: 'Wood, lumber, plywood, and wooden articles. Anti-dumping duties apply on certain wood products from China.' },
  '45': { title: 'Cork', icon: '🍾', description: 'Natural cork and cork articles including stoppers, flooring, and insulation materials.' },
  '46': { title: 'Straw Products', icon: '🌾', description: 'Plaiting materials, basketwork, wickerwork, and similar articles made from straw, rattan, or bamboo.' },
  '47': { title: 'Pulp of Wood', icon: '📄', description: 'Wood pulp and fibrous cellulosic material used as raw material for paper and specialty products.' },
  '48': { title: 'Paper & Paperboard', icon: '📰', description: 'Paper, paperboard, and articles including packaging, printing paper, tissue, and specialty papers.' },
  '49': { title: 'Printed Books', icon: '📚', description: 'Books, newspapers, pictures, and printed matter. Generally duty-free under international agreements.' },
  '50': { title: 'Silk', icon: '🪡', description: 'Silk yarn, fabric, and waste. Luxury textile with significant import dependence.' },
  '51': { title: 'Wool', icon: '🐑', description: 'Wool, fine animal hair, yarn, and woven fabric. Australia and New Zealand are major US suppliers.' },
  '52': { title: 'Cotton', icon: '🌿', description: 'Cotton, yarn, and woven fabrics. The US is both a major producer and importer of cotton textiles.' },
  '53': { title: 'Vegetable Textile Fibers', icon: '🌿', description: 'Flax, jute, hemp, and other vegetable textile fibers, yarn, and woven fabric.' },
  '54': { title: 'Man-made Filaments', icon: '🧵', description: 'Synthetic filament yarn including polyester, nylon, and rayon filaments and woven fabrics.' },
  '55': { title: 'Man-made Staple Fibers', icon: '🧶', description: 'Synthetic staple fibers including polyester, acrylic, and nylon used in blended fabrics.' },
  '56': { title: 'Wadding & Felt', icon: '🧣', description: 'Wadding, felt, nonwovens, twine, ropes, and cordage for industrial and consumer use.' },
  '57': { title: 'Carpets & Floor Coverings', icon: '🏠', description: 'Carpets, rugs, mats, and floor coverings. Significant imports from Asia with moderate duty rates.' },
  '58': { title: 'Special Woven Fabrics', icon: '🎀', description: 'Terry toweling, lace, tapestries, ribbons, and embroidery for fashion and home furnishings.' },
  '59': { title: 'Impregnated Textiles', icon: '🏭', description: 'Textile fabrics coated or laminated with plastics or rubber for technical applications.' },
  '60': { title: 'Knitted Fabrics', icon: '🧶', description: 'Knitted or crocheted fabrics used as raw material for clothing manufacturing.' },
  '61': { title: 'Knitted Clothing', icon: '👕', description: 'Knitted garments including T-shirts, sweaters, and underwear. High duty rates make this a significant cost for importers.' },
  '62': { title: 'Woven Clothing', icon: '👔', description: 'Woven garments including suits, dresses, shirts, and outerwear. Among the highest-tariff categories in US trade.' },
  '63': { title: 'Other Textile Articles', icon: '🛏️', description: 'Blankets, bed linen, curtains, sacks, and other made-up textile articles.' },
  '64': { title: 'Footwear', icon: '👟', description: 'Shoes, boots, sandals, and parts. One of the highest-tariff categories — some footwear attracts duties up to 37.5%.' },
  '65': { title: 'Headgear', icon: '🎩', description: 'Hats, caps, helmets, and other headgear with varying duty rates by material.' },
  '66': { title: 'Umbrellas & Sticks', icon: '☂️', description: 'Umbrellas, sun umbrellas, walking sticks, and whips.' },
  '67': { title: 'Feathers & Flowers', icon: '🌺', description: 'Prepared feathers, artificial flowers, and articles made from human hair.' },
  '68': { title: 'Stone & Cement', icon: '🏗️', description: 'Articles of stone, plaster, cement, and similar materials used in construction.' },
  '69': { title: 'Ceramic Products', icon: '🏺', description: 'Ceramic products including bricks, tiles, tableware, and sanitary fixtures. Anti-dumping duties apply on Chinese ceramics.' },
  '70': { title: 'Glass & Glassware', icon: '🔮', description: 'Glass and glass products including flat glass, containers, tableware, and technical glassware.' },
  '71': { title: 'Precious Stones & Metals', icon: '💎', description: 'Natural gemstones, precious metals, jewelry, and coins. High-value category with complex valuation rules.' },
  '72': { title: 'Iron & Steel', icon: '🏗️', description: 'Iron and steel products including pig iron, flat-rolled products, and structural shapes. Subject to Section 232 tariffs.' },
  '73': { title: 'Iron & Steel Articles', icon: '⚙️', description: 'Articles of iron or steel including tubes, pipes, fittings, structures, and household articles.' },
  '74': { title: 'Copper', icon: '🔶', description: 'Copper and copper alloys including refined copper, wire, and tubes. Critical for electrical and construction industries.' },
  '75': { title: 'Nickel', icon: '⚫', description: 'Nickel and nickel alloys used in stainless steel, batteries, and industrial applications.' },
  '76': { title: 'Aluminum', icon: '🔩', description: 'Aluminum and aluminum articles including foil, plates, and structural products. Subject to Section 232 tariffs.' },
  '78': { title: 'Lead', icon: '⚫', description: 'Lead and lead articles used in batteries, radiation shielding, and cable sheathing.' },
  '79': { title: 'Zinc', icon: '🔷', description: 'Zinc and zinc articles used in galvanizing, die-casting, and brass production.' },
  '80': { title: 'Tin', icon: '🥫', description: 'Tin and tin articles used in food packaging, soldering, and specialty alloys.' },
  '81': { title: 'Other Base Metals', icon: '⚙️', description: 'Tungsten, molybdenum, tantalum, and other base metals critical for defense and high-tech manufacturing.' },
  '82': { title: 'Tools & Cutlery', icon: '🔧', description: 'Hand tools, cutlery, and base metal implements including agricultural tools and kitchen knives.' },
  '83': { title: 'Miscellaneous Metal', icon: '🔩', description: 'Miscellaneous articles of base metal including locks, hinges, springs, and metal fittings.' },
  '84': { title: 'Nuclear Reactors, Boilers, Machinery', icon: '⚙️', description: 'Industrial machinery, mechanical appliances, nuclear reactors, boilers, and parts. One of the largest globally traded HS chapters with 200+ subcategories.' },
  '85': { title: 'Electrical Machinery & Equipment', icon: '💡', description: 'Electrical machines, semiconductors, consumer electronics, and their parts. Covers everything from smartphones to industrial motors.' },
  '86': { title: 'Railway Equipment', icon: '🚂', description: 'Railway locomotives, rolling stock, track fixtures, and mechanical signaling equipment.' },
  '87': { title: 'Vehicles & Automotive Parts', icon: '🚗', description: 'Motor vehicles, trailers, cycles, and components. Subject to 2.5% car tariff, 25% truck tariff, and Section 232 reviews.' },
  '88': { title: 'Aircraft', icon: '✈️', description: 'Aircraft, spacecraft, and their parts. Subject to WTO dispute resolution between Boeing and Airbus.' },
  '89': { title: 'Ships & Boats', icon: '🚢', description: 'Ships, boats, and floating structures. The Jones Act restricts coastal shipping to US-built vessels.' },
  '90': { title: 'Optical & Medical Instruments', icon: '🔬', description: 'Medical devices, optical instruments, measuring equipment, and precision instruments. Fast-growing driven by healthcare demand.' },
  '91': { title: 'Clocks & Watches', icon: '⌚', description: 'Watches, clocks, and their parts. Switzerland and China dominate global watch exports to the US.' },
  '92': { title: 'Musical Instruments', icon: '🎸', description: 'Musical instruments and parts including pianos, guitars, brass, woodwind, and electronic instruments.' },
  '93': { title: 'Arms & Ammunition', icon: '🎯', description: 'Firearms, ammunition, and related parts. Subject to strict import licensing and export control requirements.' },
  '94': { title: 'Furniture', icon: '🛋️', description: 'Furniture, bedding, mattresses, and lighting. Subject to anti-dumping duty orders on imports from China and Vietnam.' },
  '95': { title: 'Toys & Games', icon: '🧸', description: 'Toys, games, sports equipment, and fishing gear. China is the dominant supplier with Section 301 tariffs applying.' },
  '96': { title: 'Miscellaneous Articles', icon: '🖊️', description: 'Miscellaneous manufactured articles including brooms, buttons, combs, and writing instruments.' },
  '97': { title: 'Art & Antiques', icon: '🎨', description: 'Works of art, collectors pieces, and antiques. Generally duty-free to encourage cultural exchange.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CHAPTER_META[params.chapter.padStart(2, '0')]
  const title = meta?.title || `HS Chapter ${params.chapter}`
  return {
    title: `HS Chapter ${params.chapter} — ${title} | TariffNav`,
    description: `Browse all HS codes in Chapter ${params.chapter}: ${title}. ${meta?.description || ''} View duty rates for 164 countries.`,
  }
}

export default async function ChapterPage({ params }: Props) {
  const chapterNum = params.chapter.padStart(2, '0')
  const meta = CHAPTER_META[chapterNum] || { title: `Chapter ${chapterNum}`, icon: '📋', description: `All HS codes in chapter ${chapterNum}.` }

  const { data: codes } = await supabase
    .from('hs_codes')
    .select('hts_code, description, us_duty_rate, trade_volume_usd')
    .ilike('hts_code', `${chapterNum.replace(/^0/, '')}%`)
    .order('hts_code')
    .limit(200)

  if (!codes) notFound()

  const rates = codes.map(c => c.us_duty_rate)
  const avgRate = rates.length ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1) : '0'
  const freeCount = rates.filter(r => r === 0).length
  const maxRate = Math.max(...rates)

  const avgByCode: Record<string, number> = {}
  codes.forEach(c => { avgByCode[c.hts_code] = c.us_duty_rate })

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>

      {/* Breadcrumb */}
      <nav style={{ padding: '1.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href="/chapters" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Chapters</a>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>Chapter {chapterNum}</span>
      </nav>

      {/* Hero */}
      <section style={{ padding: '2rem 0 2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{meta.icon}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-elevated)', padding: '3px 10px', borderRadius: '6px', color: 'var(--accent)', border: '1px solid var(--border-glow)' }}>
            Chapter {chapterNum}
          </code>
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>{meta.title}</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '680px', fontSize: '1rem', marginBottom: '1.5rem' }}>{meta.description}</p>

        {/* SEO content block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '800px', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>About This Chapter</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
              Chapter {chapterNum} contains <strong style={{ color: 'var(--text-primary)' }}>{codes.length} HTS codes</strong> with an average US duty rate of <strong style={{ color: 'var(--text-primary)' }}>{avgRate}%</strong>. {freeCount} codes are duty-free and the highest rate in this chapter is {maxRate > 0 ? `${maxRate}%` : 'Free'}.
            </p>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>How to Use This Page</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
              Click any HTS code below to see its full duty rate breakdown for 164 countries, trade agreements, rate history, and a built-in duty calculator.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '2.5rem' }}>
        {[
          { label: 'HS Codes', value: codes.length },
          { label: 'Avg Duty Rate', value: `${avgRate}%` },
          { label: 'Duty Free Codes', value: freeCount },
          { label: 'Max Rate', value: maxRate > 0 ? `${maxRate}%` : 'Free' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', padding: '1.25rem', textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '1.75rem', color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>US Duty Rate by Code</h2>
        <div className="card">
          <DutyBarChart data={avgByCode} />
        </div>
      </section>

      {/* Codes table */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
          All HS Codes in Chapter {chapterNum}
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400, marginLeft: '10px' }}>({codes.length} codes)</span>
        </h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ padding: '0.75rem 1.25rem' }}>HTS Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>US Duty Rate</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(code => {
                const rateColor = code.us_duty_rate === 0 ? '#22c55e' : code.us_duty_rate < 5 ? '#86efac' : code.us_duty_rate < 15 ? '#fbbf24' : '#f87171'
                const slug = code.hts_code.replace(/\./g, '-')
                return (
                  <tr key={code.hts_code}>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>{code.hts_code}</code>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '400px' }}>
                      {code.description.slice(0, 100)}{code.description.length > 100 ? '…' : ''}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: rateColor, fontWeight: 500 }}>
                      {code.us_duty_rate === 0 ? 'Free' : `${code.us_duty_rate}%`}
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                      <Link href={`/hs-code/${slug}`}
                        style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', background: 'var(--accent-dim)', border: '1px solid var(--border-glow)', borderRadius: '6px', padding: '3px 10px' }}>
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Compare duty rates across countries for any code in this chapter
        </div>
        <Link href="/compare" className="btn-primary">
          Compare HS Codes →
        </Link>
      </div>

    </div>
  )
}

export async function generateStaticParams() {
  const chapters = []
  for (let i = 1; i <= 97; i++) {
    chapters.push({ chapter: i.toString().padStart(2, '0') })
  }
  return chapters
}