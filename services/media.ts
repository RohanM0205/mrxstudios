import { supabase } from '@/lib/supabase-browser'
import type { Media, Testimonial, Song, DancePlanRule } from '@/lib/types'

// Media functions
export async function fetchMedia(): Promise<{ data: Media[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: data as Media[] | null, error: error as Error | null }
}

export async function fetchFeaturedMedia(): Promise<{ data: Media[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  return { data: data as Media[] | null, error: error as Error | null }
}

export async function fetchMediaByCategory(category: string): Promise<{ data: Media[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  return { data: data as Media[] | null, error: error as Error | null }
}

export async function createMedia(mediaData: Partial<Media>): Promise<{ data: Media | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('media')
    .insert(mediaData)
    .select()
    .single()

  return { data: data as Media | null, error: error as Error | null }
}

export async function updateMedia(id: string, mediaData: Partial<Media>): Promise<{ data: Media | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('media')
    .update(mediaData)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Media | null, error: error as Error | null }
}

export async function deleteMedia(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id)

  return { error: error as Error | null }
}

// Testimonial functions
export async function fetchTestimonials(): Promise<{ data: Testimonial[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: data as Testimonial[] | null, error: error as Error | null }
}

export async function fetchFeaturedTestimonials(): Promise<{ data: Testimonial[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_featured', true)
    .order('rating', { ascending: false })

  return { data: data as Testimonial[] | null, error: error as Error | null }
}

export async function createTestimonial(testimonialData: Partial<Testimonial>): Promise<{ data: Testimonial | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonialData)
    .select()
    .single()

  return { data: data as Testimonial | null, error: error as Error | null }
}

export async function updateTestimonial(id: string, testimonialData: Partial<Testimonial>): Promise<{ data: Testimonial | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('testimonials')
    .update(testimonialData)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Testimonial | null, error: error as Error | null }
}

export async function deleteTestimonial(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  return { error: error as Error | null }
}

// Song functions
export async function fetchSongs(): Promise<{ data: Song[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('title', { ascending: true })

  return { data: data as Song[] | null, error: error as Error | null }
}

export async function fetchSongsByEventType(eventType: string): Promise<{ data: Song[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('event_type', eventType)
    .order('title', { ascending: true })

  return { data: data as Song[] | null, error: error as Error | null }
}

export async function createSong(songData: Partial<Song>): Promise<{ data: Song | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('songs')
    .insert(songData)
    .select()
    .single()

  return { data: data as Song | null, error: error as Error | null }
}

export async function updateSong(id: string, songData: Partial<Song>): Promise<{ data: Song | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('songs')
    .update(songData)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Song | null, error: error as Error | null }
}

export async function deleteSong(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', id)

  return { error: error as Error | null }
}

// Dance Plan Rules functions
export async function fetchDancePlanRules(): Promise<{ data: DancePlanRule[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('dance_plan_rules')
    .select('*')
    .order('event_type', { ascending: true })

  return { data: data as DancePlanRule[] | null, error: error as Error | null }
}

export async function fetchDancePlanRulesByEventType(eventType: string): Promise<{ data: DancePlanRule[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('dance_plan_rules')
    .select('*')
    .eq('event_type', eventType)

  return { data: data as DancePlanRule[] | null, error: error as Error | null }
}

export async function createDancePlanRule(ruleData: Partial<DancePlanRule>): Promise<{ data: DancePlanRule | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('dance_plan_rules')
    .insert(ruleData)
    .select()
    .single()

  return { data: data as DancePlanRule | null, error: error as Error | null }
}

export async function updateDancePlanRule(id: string, ruleData: Partial<DancePlanRule>): Promise<{ data: DancePlanRule | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('dance_plan_rules')
    .update(ruleData)
    .eq('id', id)
    .select()
    .single()

  return { data: data as DancePlanRule | null, error: error as Error | null }
}

export async function deleteDancePlanRule(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('dance_plan_rules')
    .delete()
    .eq('id', id)

  return { error: error as Error | null }
}
