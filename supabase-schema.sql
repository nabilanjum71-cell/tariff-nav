-- ============================================================
-- TariffNav — Supabase Schema
-- Run this in Supabase SQL Editor before first data fetch
-- ============================================================

-- ── HS Codes table (core — up to 500K rows) ──────────────────
create table if not exists hs_codes (
  id              uuid default gen_random_uuid() primary key,
  hts_code        text unique not null,        -- e.g. "8471.30.01"
  hs6             text,                         -- e.g. "847130"
  chapter         text,                         -- e.g. "84"
  description     text not null default '',
  ai_summary      text default '',
  us_duty_rate    numeric(6,2) default 0,
  duty_by_country jsonb default '{}',           -- { "CN": 25, "MX": 0 }
  rate_history    jsonb default '[]',           -- [{ date, rate, reason }]
  trade_agreements jsonb default '[]',          -- [{ name, rate, eligible }]
  top_importers   jsonb default '[]',           -- [{ country, share }]
  trade_volume_usd bigint default 0,
  video_ids       text[] default '{}',
  updated_at      timestamptz default now()
);

-- Indexes for fast lookups
create index if not exists idx_hs_codes_chapter on hs_codes(chapter);
create index if not exists idx_hs_codes_hs6 on hs_codes(hs6);
create index if not exists idx_hs_codes_updated on hs_codes(updated_at desc);

-- Full-text search index on description
create index if not exists idx_hs_codes_fts
  on hs_codes using gin(to_tsvector('english', description));

-- ── HS Chapters table (97 rows) ──────────────────────────────
create table if not exists chapters (
  id              uuid default gen_random_uuid() primary key,
  chapter_num     text unique not null,         -- e.g. "84"
  title           text not null,
  description     text default '',
  ai_summary      text default '',
  avg_duty_rate   numeric(6,2) default 0,
  total_codes     int default 0,
  video_ids       text[] default '{}',
  top_importers   jsonb default '[]',
  updated_at      timestamptz default now()
);

-- ── Rate changes from Federal Register ───────────────────────
create table if not exists rate_changes (
  id              uuid default gen_random_uuid() primary key,
  document_number text unique not null,
  title           text not null,
  abstract        text default '',
  published_at    date,
  change_type     text default 'neutral',       -- 'increase' | 'decrease' | 'neutral'
  affected_codes  text[] default '{}',
  created_at      timestamptz default now()
);

create index if not exists idx_rate_changes_date on rate_changes(published_at desc);

-- ── Email alerts subscribers ──────────────────────────────────
create table if not exists subscribers (
  id              uuid default gen_random_uuid() primary key,
  email           text unique not null,
  alert_codes     text[] default '{}',          -- HS codes they watch
  alert_chapters  text[] default '{}',          -- chapters they watch
  plan            text default 'free',          -- 'free' | 'pro'
  created_at      timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────
-- Allow public read on hs_codes and chapters
alter table hs_codes enable row level security;
alter table chapters enable row level security;
alter table rate_changes enable row level security;

create policy "Public read hs_codes"
  on hs_codes for select using (true);

create policy "Public read chapters"
  on chapters for select using (true);

create policy "Public read rate_changes"
  on rate_changes for select using (true);

-- Only service role can write (used by data scripts)
create policy "Service role write hs_codes"
  on hs_codes for all using (auth.role() = 'service_role');

create policy "Service role write chapters"
  on chapters for all using (auth.role() = 'service_role');

create policy "Service role write rate_changes"
  on rate_changes for all using (auth.role() = 'service_role');

-- ── Seed 97 chapters ─────────────────────────────────────────
insert into chapters (chapter_num, title) values
('01', 'Live Animals'),
('02', 'Meat and Edible Meat Offal'),
('03', 'Fish and Crustaceans'),
('04', 'Dairy Produce, Eggs, Honey'),
('05', 'Products of Animal Origin'),
('06', 'Live Trees and Plants'),
('07', 'Edible Vegetables'),
('08', 'Edible Fruits and Nuts'),
('09', 'Coffee, Tea, Spices'),
('10', 'Cereals'),
('11', 'Milling Industry Products'),
('12', 'Oil Seeds and Oleaginous Fruits'),
('13', 'Lac, Gums, Resins'),
('14', 'Vegetable Plaiting Materials'),
('15', 'Animal or Vegetable Fats and Oils'),
('16', 'Preparations of Meat or Fish'),
('17', 'Sugars and Sugar Confectionery'),
('18', 'Cocoa and Cocoa Preparations'),
('19', 'Preparations of Cereals or Flour'),
('20', 'Preparations of Vegetables or Fruit'),
('21', 'Miscellaneous Edible Preparations'),
('22', 'Beverages, Spirits and Vinegar'),
('23', 'Food Industry Residues and Wastes'),
('24', 'Tobacco and Substitutes'),
('25', 'Salt, Sulphur, Earth, Stone'),
('26', 'Ores, Slag and Ash'),
('27', 'Mineral Fuels and Mineral Oils'),
('28', 'Inorganic Chemicals'),
('29', 'Organic Chemicals'),
('30', 'Pharmaceutical Products'),
('31', 'Fertilizers'),
('32', 'Tanning and Dyeing Extracts'),
('33', 'Essential Oils and Cosmetics'),
('34', 'Soap, Washing and Cleaning Agents'),
('35', 'Albuminoidal Substances, Glues'),
('36', 'Explosives and Pyrotechnic Products'),
('37', 'Photographic or Cinematographic Goods'),
('38', 'Miscellaneous Chemical Products'),
('39', 'Plastics and Articles Thereof'),
('40', 'Rubber and Articles Thereof'),
('41', 'Raw Hides, Skins and Leather'),
('42', 'Articles of Leather'),
('43', 'Furskins and Artificial Fur'),
('44', 'Wood and Articles of Wood'),
('45', 'Cork and Articles of Cork'),
('46', 'Manufactures of Straw or Esparto'),
('47', 'Pulp of Wood'),
('48', 'Paper and Paperboard'),
('49', 'Printed Books and Newspapers'),
('50', 'Silk'),
('51', 'Wool and Fine Animal Hair'),
('52', 'Cotton'),
('53', 'Other Vegetable Textile Fibres'),
('54', 'Man-Made Filaments'),
('55', 'Man-Made Staple Fibres'),
('56', 'Wadding and Felt'),
('57', 'Carpets and Floor Coverings'),
('58', 'Special Woven Fabrics'),
('59', 'Impregnated Textile Fabrics'),
('60', 'Knitted or Crocheted Fabrics'),
('61', 'Knitted or Crocheted Clothing'),
('62', 'Woven Clothing Accessories'),
('63', 'Other Made-Up Textile Articles'),
('64', 'Footwear'),
('65', 'Headgear'),
('66', 'Umbrellas and Walking Sticks'),
('67', 'Prepared Feathers and Down'),
('68', 'Articles of Stone or Cement'),
('69', 'Ceramic Products'),
('70', 'Glass and Glassware'),
('71', 'Precious Stones and Metals'),
('72', 'Iron and Steel'),
('73', 'Articles of Iron or Steel'),
('74', 'Copper and Articles Thereof'),
('75', 'Nickel and Articles Thereof'),
('76', 'Aluminium and Articles Thereof'),
('78', 'Lead and Articles Thereof'),
('79', 'Zinc and Articles Thereof'),
('80', 'Tin and Articles Thereof'),
('81', 'Other Base Metals'),
('82', 'Tools and Cutlery'),
('83', 'Miscellaneous Articles of Base Metal'),
('84', 'Nuclear Reactors, Boilers, Machinery'),
('85', 'Electrical Machinery and Equipment'),
('86', 'Railway or Tramway Locomotives'),
('87', 'Vehicles Other than Railway'),
('88', 'Aircraft and Spacecraft'),
('89', 'Ships, Boats and Floating Structures'),
('90', 'Optical, Medical Instruments'),
('91', 'Clocks and Watches'),
('92', 'Musical Instruments'),
('93', 'Arms and Ammunition'),
('94', 'Furniture and Bedding'),
('95', 'Toys, Games and Sports Equipment'),
('96', 'Miscellaneous Manufactured Articles'),
('97', 'Works of Art and Antiques')
on conflict (chapter_num) do nothing;
