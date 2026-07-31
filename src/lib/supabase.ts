import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables Supabase manquantes dans .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type Role = 'student' | 'company' | 'admin'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: Role
  avatar_url: string | null
  phone: string | null
  bio: string | null
  created_at: string
}

export type Company = {
  id: string
  owner_id: string
  name: string
  slug: string | null
  description: string | null
  sector: string | null
  website: string | null
  location: string | null
  logo_url: string | null
  size: string | null
  verified: boolean
  created_at: string
}

export type Internship = {
  id: string
  company_id: string
  title: string
  description: string
  type: 'academic' | 'professional' | 'both'
  field: string
  location: string | null
  remote: boolean
  duration_weeks: number | null
  start_date: string | null
  compensation: string | null
  requirements: string | null
  status: 'draft' | 'open' | 'closed'
  spots: number | null
  created_at: string
  company?: Pick<Company, 'id' | 'name' | 'logo_url' | 'location' | 'sector' | 'description' | 'website' | 'verified'> | null
}

export type Application = {
  id: string
  internship_id: string
  student_id: string
  cover_letter: string | null
  status: 'submitted' | 'reviewing' | 'accepted' | 'rejected'
  created_at: string
  internship?: Pick<Internship, 'id' | 'title' | 'location' | 'type' | 'company_id'> | null
  student?: Pick<Profile, 'id' | 'full_name' | 'email' | 'phone'> | null
  company?: Pick<Company, 'id' | 'name'> | null
}
