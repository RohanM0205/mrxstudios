// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL      ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (typeof window !== 'undefined') {
  console.log('[supabase] URL loaded:',      supabaseUrl      ? '✅ ' + supabaseUrl : '❌ MISSING')
  console.log('[supabase] Anon key loaded:', supabaseAnonKey  ? '✅ (set)'          : '❌ MISSING')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)