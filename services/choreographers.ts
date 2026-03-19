import { supabase } from '@/lib/supabase'
import type { Choreographer } from '@/lib/types'

// Fetch all choreographers
export async function fetchChoreographers(): Promise<{ data: Choreographer[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('choreographers')
    .select('*')
    .order('name', { ascending: true })

  return { data: data as Choreographer[] | null, error: error as Error | null }
}

// Fetch active choreographers only
export async function fetchActiveChoreographers(): Promise<{ data: Choreographer[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('choreographers')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  return { data: data as Choreographer[] | null, error: error as Error | null }
}

// Fetch choreographer by ID
export async function fetchChoreographerById(id: string): Promise<{ data: Choreographer | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('choreographers')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Choreographer | null, error: error as Error | null }
}

// Create a new choreographer
export async function createChoreographer(choreographerData: Partial<Choreographer>): Promise<{ data: Choreographer | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('choreographers')
    .insert(choreographerData)
    .select()
    .single()

  return { data: data as Choreographer | null, error: error as Error | null }
}

// Update a choreographer
export async function updateChoreographer(
  id: string, 
  choreographerData: Partial<Choreographer>
): Promise<{ data: Choreographer | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('choreographers')
    .update(choreographerData)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Choreographer | null, error: error as Error | null }
}

// Toggle choreographer active status
export async function toggleChoreographerStatus(id: string, isActive: boolean): Promise<{ data: Choreographer | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('choreographers')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Choreographer | null, error: error as Error | null }
}

// Delete a choreographer
export async function deleteChoreographer(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('choreographers')
    .delete()
    .eq('id', id)

  return { error: error as Error | null }
}
