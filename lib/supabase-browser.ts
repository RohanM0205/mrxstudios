// lib/supabase-browser.ts — Admin-only SSR client
// Used exclusively in admin pages and login. Stores session in cookies.
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)