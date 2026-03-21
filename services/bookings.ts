import { supabase } from '@/lib/supabase-browser'
import type { Booking, Session, Payment, BookingSong } from '@/lib/types'

// Create a new booking
export async function createBooking(bookingData: Partial<Booking>): Promise<{ data: Booking | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single()

  return { data: data as Booking | null, error: error as Error | null }
}

// Fetch all bookings
export async function fetchBookings(): Promise<{ data: Booking[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  return { data: data as Booking[] | null, error: error as Error | null }
}

// Fetch booking by ID
export async function fetchBookingById(id: string): Promise<{ data: Booking | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Booking | null, error: error as Error | null }
}

// Update booking status
export async function updateBookingStatus(
  id: string, 
  status: Booking['status']
): Promise<{ data: Booking | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Booking | null, error: error as Error | null }
}

// Update booking payment status
export async function updateBookingPaymentStatus(
  id: string, 
  paymentStatus: Booking['payment_status'],
  advancePaid?: number
): Promise<{ data: Booking | null; error: Error | null }> {
  const updateData: Partial<Booking> = { 
    payment_status: paymentStatus, 
    updated_at: new Date().toISOString() 
  }
  if (advancePaid !== undefined) {
    updateData.advance_paid = advancePaid
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Booking | null, error: error as Error | null }
}

// Assign choreographer to booking
export async function assignChoreographer(
  bookingId: string, 
  choreographerId: string
): Promise<{ data: Booking | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      assigned_choreographer_id: choreographerId, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', bookingId)
    .select()
    .single()

  return { data: data as Booking | null, error: error as Error | null }
}

// Session management
export async function createSession(sessionData: Partial<Session>): Promise<{ data: Session | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select()
    .single()

  return { data: data as Session | null, error: error as Error | null }
}

export async function fetchSessionsByBooking(bookingId: string): Promise<{ data: Session[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('booking_id', bookingId)
    .order('session_date', { ascending: true })

  return { data: data as Session[] | null, error: error as Error | null }
}

export async function updateSessionStatus(
  id: string, 
  status: Session['status']
): Promise<{ data: Session | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('sessions')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Session | null, error: error as Error | null }
}

// Payment management
export async function createPayment(paymentData: Partial<Payment>): Promise<{ data: Payment | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select()
    .single()

  return { data: data as Payment | null, error: error as Error | null }
}

export async function fetchPaymentsByBooking(bookingId: string): Promise<{ data: Payment[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', bookingId)
    .order('payment_date', { ascending: false })

  return { data: data as Payment[] | null, error: error as Error | null }
}

// Booking songs
export async function addBookingSong(songData: Partial<BookingSong>): Promise<{ data: BookingSong | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('booking_songs')
    .insert(songData)
    .select()
    .single()

  return { data: data as BookingSong | null, error: error as Error | null }
}

export async function fetchBookingSongs(bookingId: string): Promise<{ data: BookingSong[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('booking_songs')
    .select('*')
    .eq('booking_id', bookingId)

  return { data: data as BookingSong[] | null, error: error as Error | null }
}

// Delete booking
export async function deleteBooking(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  return { error: error as Error | null }
}
