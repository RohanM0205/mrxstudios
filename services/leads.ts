// ── Lead service functions ─────────────────────────────────────────────────────
// All Supabase calls for the leads and lead_songs tables live here.
// The client is imported from lib/supabase so there is a single instance
// across the whole app (consistent with bookings.ts, choreographers.ts, etc.)

import { supabase } from '@/lib/supabase'
import type { BookingFormData, Lead, LeadSong } from '@/lib/types'

// ── createLead ─────────────────────────────────────────────────────────────────
// Inserts one row into public.leads and returns the created record.
// guest_performance stores as event_type = 'guest_performance' — no DB migration needed,
// the column is already type text.
export async function createLead(
  formData: BookingFormData
): Promise<{ data: Lead | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('leads')
    .insert({
      name:          formData.name.trim(),
      phone:         formData.phone.replace(/\D/g, ''),  // strip non-digits: +91 98765 → 9198765
      email:         formData.email.trim()  || null,
      event_type:    formData.event_type,
      event_subtype: formData.event_subtype || null,
      event_date:    formData.event_date    || null,
      location:      formData.location.trim() || null,
      message:       formData.message.trim()  || null,
      has_song:      formData.has_song,
      status:        'new',
      source:        'website',
      priority:      'medium',
    })
    .select()
    .single()

  if (error) {
    console.error('[createLead]', error.message)
    return { data: null, error: new Error(error.message) }
  }

  return { data: data as Lead, error: null }
}

// ── createLeadSongs ────────────────────────────────────────────────────────────
// Bulk-inserts all songs for a lead in a single round-trip.
// Skips entries where song_name is blank.
export async function createLeadSongs(
  leadId: string,
  songs: { song_name: string; artist: string }[]
): Promise<{ data: LeadSong[] | null; error: Error | null }> {
  const rows = songs
    .filter(s => s.song_name.trim())
    .map(s => ({
      lead_id:   leadId,
      song_name: s.song_name.trim(),
      artist:    s.artist.trim() || null,
    }))

  if (rows.length === 0) return { data: [], error: null }

  const { data, error } = await supabase
    .from('lead_songs')
    .insert(rows)
    .select()

  if (error) {
    console.error('[createLeadSongs]', error.message)
    return { data: null, error: new Error(error.message) }
  }

  return { data: data as LeadSong[], error: null }
}