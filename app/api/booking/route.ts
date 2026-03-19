import { NextResponse } from 'next/server'
import type { BookingFormData } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body: BookingFormData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'event_type', 'event_subtype', 'event_date', 'location']
    for (const field of requiredFields) {
      if (!body[field as keyof BookingFormData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate phone format (10 digits)
    const phoneDigits = body.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Create the lead in the database
    // 2. Send notification email to admin
    // 3. Send confirmation email to client
    // 4. Send WhatsApp notification

    // For now, we'll return a success response
    // The actual database operations will be connected when Supabase is integrated
    
    const mockLeadId = `lead_${Date.now()}`
    
    return NextResponse.json({
      success: true,
      message: 'Booking request received',
      data: {
        id: mockLeadId,
        ...body,
        status: 'new',
        source: 'website',
        created_at: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Booking API is running. Use POST to submit a booking.' },
    { status: 200 }
  )
}
