import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side client with service role for data scripts
export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

export type HSCode = {
  id: string
  hts_code: string           // e.g. "8471.30.01"
  hs6: string                // e.g. "847130"
  chapter: string            // e.g. "84"
  description: string        // official WTO description
  ai_summary: string         // Claude-generated plain English
  us_duty_rate: number       // e.g. 0 = free, 5.5 = 5.5%
  duty_by_country: Record<string, number>   // { "CN": 25, "MX": 0, ... }
  rate_history: { date: string; rate: number; reason: string }[]
  trade_agreements: { name: string; rate: number; eligible: boolean }[]
  top_importers: { country: string; share: number }[]
  trade_volume_usd: number
  video_ids: string[]        // YouTube video IDs
  updated_at: string
}

export type Chapter = {
  id: string
  chapter_num: string        // e.g. "84"
  title: string              // e.g. "Nuclear reactors, boilers, machinery"
  description: string
  ai_summary: string
  avg_duty_rate: number
  total_codes: number
  video_ids: string[]
  top_importers: { country: string; share: number }[]
  updated_at: string
}
