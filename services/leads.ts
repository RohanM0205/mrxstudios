import { supabase } from '@/lib/supabase'
import type { Lead, LeadSong, BookingFormData } from '@/lib/types'

// Create a new lead from booking form
export async function createLead(formData: BookingFormData): Promise<{ data: Lead | null; error: Error | null }> {
  const leadData = {
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    event_type: formData.event_type,
    event_subtype: formData.event_subtype,
    event_date: formData.event_date,
    location: formData.location,
    message: formData.message,
    has_song: formData.has_song,
    status: 'new',
    source: 'website',
  }

  const { data, error } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single()

  return { data: data as Lead | null, error: error as Error | null }
}

// Create songs for a lead
export async function createLeadSongs(
  leadId: string, 
  songs: { song_name: string; artist: string }[]
): Promise<{ data: LeadSong[] | null; error: Error | null }> {
  const songsData = songs.map(song => ({
    lead_id: leadId,
    song_name: song.song_name,
    artist: song.artist,
  }))

  const { data, error } = await supabase
    .from('lead_songs')
    .insert(songsData)
    .select()

  return { data: data as LeadSong[] | null, error: error as Error | null }
}

// Fetch all leads
export async function fetchLeads(): Promise<{ data: Lead[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: data as Lead[] | null, error: error as Error | null }
}

// Fetch a single lead by ID
export async function fetchLeadById(id: string): Promise<{ data: Lead | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Lead | null, error: error as Error | null }
}

// Update lead status
export async function updateLeadStatus(
  id: string, 
  status: Lead['status']
): Promise<{ data: Lead | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Lead | null, error: error as Error | null }
}

// Update lead notes
export async function updateLeadNotes(
  id: string, 
  notes: string
): Promise<{ data: Lead | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('leads')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Lead | null, error: error as Error | null }
}

// Update follow-up date
export async function updateFollowUpDate(
  id: string, 
  followUpDate: string
): Promise<{ data: Lead | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('leads')
    .update({ follow_up_date: followUpDate, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Lead | null, error: error as Error | null }
}

// Fetch lead songs
export async function fetchLeadSongs(leadId: string): Promise<{ data: LeadSong[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('lead_songs')
    .select('*')
    .eq('lead_id', leadId)

  return { data: data as LeadSong[] | null, error: error as Error | null }
}

// Delete a lead
export async function deleteLead(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  return { error: error as Error | null }
}
