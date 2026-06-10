import Link from 'next/link'

const ALL_CHAPTERS = [
  { num: '01', title: 'Live Animals', icon: '🐄' },
  { num: '02', title: 'Meat & Edible Offal', icon: '🥩' },
  { num: '03', title: 'Fish & Seafood', icon: '🐟' },
  { num: '04', title: 'Dairy & Eggs', icon: '🥚' },
  { num: '05', title: 'Animal Products', icon: '🦴' },
  { num: '06', title: 'Plants & Flowers', icon: '🌸' },
  { num: '07', title: 'Vegetables', icon: '🥦' },
  { num: '08', title: 'Fruits & Nuts', icon: '🍎' },
  { num: '09', title: 'Coffee, Tea & Spices', icon: '☕' },
  { num: '10', title: 'Cereals', icon: '🌾' },
  { num: '11', title: 'Milling Products', icon: '🌽' },
  { num: '12', title: 'Oil Seeds', icon: '🌻' },
  { num: '13', title: 'Lac & Gums', icon: '🌿' },
  { num: '14', title: 'Vegetable Materials', icon: '🪴' },
  { num: '15', title: 'Animal & Vegetable Fats', icon: '🫙' },
  { num: '16', title: 'Meat Preparations', icon: '🥫' },
  { num: '17', title: 'Sugars', icon: '🍬' },
  { num: '18', title: 'Cocoa & Chocolate', icon: '🍫' },
  { num: '19', title: 'Cereals & Pastry', icon: '🍞' },
  { num: '20', title: 'Vegetables Preparations', icon: '🥗' },
  { num: '21', title: 'Miscellaneous Food', icon: '🧂' },
  { num: '22', title: 'Beverages & Spirits', icon: '🍷' },
  { num: '23', title: 'Food Industry Residues', icon: '♻️' },
  { num: '24', title: 'Tobacco', icon: '🚬' },
  { num: '25', title: 'Salt & Stone', icon: '⛏️' },
  { num: '26', title: 'Ores & Slag', icon: '🪨' },
  { num: '27', title: 'Mineral Fuels & Oil', icon: '⚡' },
  { num: '28', title: 'Inorganic Chemicals', icon: '⚗️' },
  { num: '29', title: 'Organic Chemicals', icon: '🧪' },
  { num: '30', title: 'Pharmaceutical Products', icon: '💊' },
  { num: '31', title: 'Fertilizers', icon: '🌱' },
  { num: '32', title: 'Tanning & Dyes', icon: '🎨' },
  { num: '33', title: 'Perfumes & Cosmetics', icon: '💄' },
  { num: '34', title: 'Soap & Wax', icon: '🧼' },
  { num: '35', title: 'Albuminoidal Substances', icon: '🔬' },
  { num: '36', title: 'Explosives', icon: '💥' },
  { num: '37', title: 'Photographic Goods', icon: '📷' },
  { num: '38', title: 'Chemical Products', icon: '🧫' },
  { num: '39', title: 'Plastics', icon: '🔩' },
  { num: '40', title: 'Rubber', icon: '⭕' },
  { num: '41', title: 'Raw Hides & Leather', icon: '👜' },
  { num: '42', title: 'Leather Articles', icon: '👝' },
  { num: '43', title: 'Furskins', icon: '🦊' },
  { num: '44', title: 'Wood & Articles', icon: '🪵' },
  { num: '45', title: 'Cork', icon: '🍾' },
  { num: '46', title: 'Straw Products', icon: '🧺' },
  { num: '47', title: 'Pulp of Wood', icon: '📄' },
  { num: '48', title: 'Paper & Paperboard', icon: '📃' },
  { num: '49', title: 'Printed Books', icon: '📚' },
  { num: '50', title: 'Silk', icon: '🧵' },
  { num: '51', title: 'Wool', icon: '🐑' },
  { num: '52', title: 'Cotton', icon: '🌿' },
  { num: '53', title: 'Vegetable Textile Fibers', icon: '🪢' },
  { num: '54', title: 'Man-made Filaments', icon: '🧶' },
  { num: '55', title: 'Man-made Staple Fibers', icon: '🪡' },
  { num: '56', title: 'Wadding & Felt', icon: '🧷' },
  { num: '57', title: 'Carpets & Floor Coverings', icon: '🪣' },
  { num: '58', title: 'Special Woven Fabrics', icon: '🎀' },
  { num: '59', title: 'Impregnated Textiles', icon: '🏭' },
  { num: '60', title: 'Knitted Fabrics', icon: '🧣' },
  { num: '61', title: 'Knitted Clothing', icon: '👕' },
  { num: '62', title: 'Woven Clothing', icon: '👔' },
  { num: '63', title: 'Other Textile Articles', icon: '🛏️' },
  { num: '64', title: 'Footwear', icon: '👟' },
  { num: '65', title: 'Headgear', icon: '🎩' },
  { num: '66', title: 'Umbrellas & Sticks', icon: '☂️' },
  { num: '67', title: 'Feathers & Artificial Flowers', icon: '🌺' },
  { num: '68', title: 'Stone & Cement Articles', icon: '🪨' },
  { num: '69', title: 'Ceramic Products', icon: '🏺' },
  { num: '70', title: 'Glass & Glassware', icon: '🪟' },
  { num: '71', title: 'Precious Stones & Metals', icon: '💎' },
  { num: '72', title: 'Iron & Steel', icon: '🏗️' },
  { num: '73', title: 'Iron & Steel Articles', icon: '🔧' },
  { num: '74', title: 'Copper', icon: '🔶' },
  { num: '75', title: 'Nickel', icon: '🔷' },
  { num: '76', title: 'Aluminum', icon: '🥈' },
  { num: '78', title: 'Lead', icon: '⚫' },
  { num: '79', title: 'Zinc', icon: '🔘' },
  { num: '80', title: 'Tin', icon: '🥫' },
  { num: '81', title: 'Other Base Metals', icon: '⚙️' },
  { num: '82', title: 'Tools & Cutlery', icon: '🔨' },
  { num: '83', title: 'Miscellaneous Metal Articles', icon: '🪛' },
  { num: '84', title: 'Machinery', icon: '⚙️' },
  { num: '85', title: 'Electrical Equipment', icon: '💡' },
  { num: '86', title: 'Railway Equipment', icon: '🚂' },
  { num: '87', title: 'Vehicles', icon: '🚗' },
  { num: '88', title: 'Aircraft', icon: '✈️' },
  { num: '89', title: 'Ships & Boats', icon: '🚢' },
  { num: '90', title: 'Optical & Medical', icon: '🔬' },
  { num: '91', title: 'Clocks & Watches', icon: '⌚' },
  { num: '92', title: 'Musical Instruments', icon: '🎸' },
  { num: '93', title: 'Arms & Ammunition', icon: '🎯' },
  { num: '94', title: 'Furniture', icon: '🪑' },
  { num: '95', title: 'Toys & Games', icon: '🎮' },
  { num: '96', title: 'Miscellaneous Articles', icon: '🎁' },
  { num: '97', title: 'Art & Antiques', icon: '🎨' },
]

export default function ChaptersPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>
        All HS Chapters
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Browse all 97 harmonized system chapters — click any chapter to see all codes and duty rates.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {ALL_CHAPTERS.map(ch => (
          <a key={ch.num} href={`/chapter/${ch.num}`}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', textDecoration: 'none', display: 'block', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glow)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{ch.icon}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>CH. {ch.num}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{ch.title}</div>
          </a>
        ))}
      </div>
    </div>
  )
}