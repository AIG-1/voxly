import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  user_id: string
  company_id: string | null
  full_name: string | null
  email: string | null
  role: 'member' | 'admin' | 'super_admin'
  created_at: string
}

export type Company = {
  id: string
  name: string
  industry: string | null
  team_size: string | null
  created_at: string
}

export type Call = {
  id: string
  company_id: string
  user_id: string | null
  title: string | null
  audio_url: string | null
  transcript: string | null
  utterances: any | null
  status: 'pending' | 'transcribing' | 'analyzing' | 'completed' | 'error'
  outcome: 'won' | 'lost' | 'follow_up' | 'unknown' | null
  talk_ratio_rep: number | null
  talk_ratio_customer: number | null
  coaching_score: number | null
  topics: any | null
  objections: any | null
  buying_signals: any | null
  next_steps: any | null
  coaching_feedback: string | null
  duration_seconds: number | null
  created_at: string
}
