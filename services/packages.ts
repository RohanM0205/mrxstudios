import { supabase } from '@/lib/supabase-browser'
import type { Package } from '@/lib/types'

// Fetch all packages
export async function fetchPackages(): Promise<{ data: Package[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('price', { ascending: true })

  return { data: data as Package[] | null, error: error as Error | null }
}

// Fetch active packages only
export async function fetchActivePackages(): Promise<{ data: Package[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  return { data: data as Package[] | null, error: error as Error | null }
}

// Fetch package by ID
export async function fetchPackageById(id: string): Promise<{ data: Package | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Package | null, error: error as Error | null }
}

// Create a new package
export async function createPackage(packageData: Partial<Package>): Promise<{ data: Package | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('packages')
    .insert(packageData)
    .select()
    .single()

  return { data: data as Package | null, error: error as Error | null }
}

// Update a package
export async function updatePackage(
  id: string, 
  packageData: Partial<Package>
): Promise<{ data: Package | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('packages')
    .update(packageData)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Package | null, error: error as Error | null }
}

// Toggle package active status
export async function togglePackageStatus(id: string, isActive: boolean): Promise<{ data: Package | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('packages')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Package | null, error: error as Error | null }
}

// Delete a package
export async function deletePackage(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id)

  return { error: error as Error | null }
}
