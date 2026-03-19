// Database Types based on the schema

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  event_type: string
  event_subtype: string
  event_date: string
  location: string
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string
  follow_up_date: string | null
  notes: string | null
  has_song: boolean
  user_description: string | null
  extracted_mood: string | null
  extracted_difficulty: string | null
  extracted_group_size: string | null
  created_at: string
  updated_at: string
}

export interface LeadSong {
  id: string
  lead_id: string
  song_name: string
  artist: string
  created_at: string
}

export interface Booking {
  id: string
  lead_id: string
  client_name: string
  phone: string
  event_type: string
  event_subtype: string
  event_date: string
  location: string
  package_id: string | null
  assigned_choreographer_id: string | null
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  advance_paid: number
  total_amount: number
  payment_status: 'pending' | 'partial' | 'paid'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Package {
  id: string
  name: string
  price: number
  sessions: number
  features: string[]
  is_active: boolean
}

export interface Choreographer {
  id: string
  name: string
  phone: string
  email: string
  specialization: string
  image_url: string | null
  bio: string
  experience_years: number
  is_active: boolean
}

export interface Session {
  id: string
  booking_id: string
  session_date: string
  duration_minutes: number
  location: string
  notes: string | null
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  payment_mode: 'cash' | 'upi' | 'bank_transfer' | 'card'
  payment_status: 'pending' | 'completed' | 'failed'
  transaction_id: string | null
  payment_date: string
}

export interface Song {
  id: string
  title: string
  artist: string
  mood: string
  difficulty: 'easy' | 'medium' | 'hard'
  event_type: string
  youtube_url: string | null
  tags: string[]
}

export interface BookingSong {
  id: string
  booking_id: string
  song_id: string | null
  custom_song_name: string | null
}

export interface Media {
  id: string
  title: string
  description: string | null
  media_url: string
  thumbnail_url: string | null
  category: string
  tags: string[]
  is_featured: boolean
}

export interface Testimonial {
  id: string
  client_name: string
  content: string
  rating: number
  video_url: string | null
  is_featured: boolean
}

export interface AIResponse {
  id: string
  lead_id: string
  type: string
  request_input: string
  response_output: string
  status: string
  confidence_score: number
}

export interface DancePlanRule {
  id: string
  event_type: string
  event_subtype: string
  min_people: number
  max_people: number
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  recommended_sessions: number
  recommended_days: number
  style: string
}

// Form types
export interface BookingFormData {
  name: string
  phone: string
  email: string
  event_type: string
  event_subtype: string
  event_date: string
  location: string
  message: string
  has_song: boolean
  songs: { song_name: string; artist: string }[]
}

// Event types for services
export type EventType = 'wedding' | 'corporate' | 'college' | 'audition'
export type EventSubtype = string

export const EVENT_TYPES = {
  wedding: {
    label: 'Wedding',
    subtypes: ['Sangeet', 'Reception', 'Mehendi', 'Engagement', 'Haldi']
  },
  corporate: {
    label: 'Corporate',
    subtypes: ['Annual Day', 'Team Building', 'Product Launch', 'Awards Night', 'Conference']
  },
  college: {
    label: 'College',
    subtypes: ['Freshers', 'Farewell', 'Annual Fest', 'Competition', 'Flash Mob']
  },
  audition: {
    label: 'Audition',
    subtypes: ['Reality Show', 'Film', 'Music Video', 'Brand', 'Personal']
  }
} as const
