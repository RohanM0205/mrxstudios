'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EVENT_TYPES, type BookingFormData } from '@/lib/types'
import { createLead, createLeadSongs } from '@/services/leads'

interface BookingFormProps {
  onSuccess: () => void
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    event_type: '',
    event_subtype: '',
    event_date: '',
    location: '',
    message: '',
    has_song: false,
    songs: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.event_type) newErrors.event_type = 'Please select an event type'
    if (!formData.event_subtype) newErrors.event_subtype = 'Please select an event subtype'
    if (!formData.event_date) newErrors.event_date = 'Event date is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Create lead
      const { data: lead, error: leadError } = await createLead(formData)
      
      if (leadError) {
        console.error('Error creating lead:', leadError)
        // In production, show error toast
      }

      // Create lead songs if any
      if (lead && formData.has_song && formData.songs.length > 0) {
        const validSongs = formData.songs.filter(s => s.song_name.trim())
        if (validSongs.length > 0) {
          await createLeadSongs(lead.id, validSongs)
        }
      }

      onSuccess()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSong = () => {
    setFormData(prev => ({
      ...prev,
      songs: [...prev.songs, { song_name: '', artist: '' }],
    }))
  }

  const removeSong = (index: number) => {
    setFormData(prev => ({
      ...prev,
      songs: prev.songs.filter((_, i) => i !== index),
    }))
  }

  const updateSong = (index: number, field: 'song_name' | 'artist', value: string) => {
    setFormData(prev => ({
      ...prev,
      songs: prev.songs.map((song, i) => 
        i === index ? { ...song, [field]: value } : song
      ),
    }))
  }

  const selectedEventType = formData.event_type as keyof typeof EVENT_TYPES
  const subtypes = selectedEventType ? EVENT_TYPES[selectedEventType]?.subtypes || [] : []

  return (
    <form onSubmit={handleSubmit} className="bg-background rounded-3xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6 font-serif">Book Your Session</h2>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Personal Information
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                className="rounded-xl"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="rounded-xl"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
              className="rounded-xl"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Event Details
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Type *</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  event_type: value,
                  event_subtype: '' 
                }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.event_type && <p className="text-sm text-destructive">{errors.event_type}</p>}
            </div>

            <div className="space-y-2">
              <Label>Event Subtype *</Label>
              <Select
                value={formData.event_subtype}
                onValueChange={(value) => setFormData(prev => ({ ...prev, event_subtype: value }))}
                disabled={!formData.event_type}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent>
                  {subtypes.map((subtype) => (
                    <SelectItem key={subtype} value={subtype}>{subtype}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.event_subtype && <p className="text-sm text-destructive">{errors.event_subtype}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Event Date *</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                className="rounded-xl"
              />
              {errors.event_date && <p className="text-sm text-destructive">{errors.event_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Event Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City or venue"
                className="rounded-xl"
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tell us about your vision, group size, any special requirements..."
              className="rounded-xl min-h-[100px]"
            />
          </div>
        </div>

        {/* Song Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Song Preferences
          </h3>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="has_song"
              checked={formData.has_song}
              onCheckedChange={(checked) => {
                setFormData(prev => ({ 
                  ...prev, 
                  has_song: checked as boolean,
                  songs: checked ? [{ song_name: '', artist: '' }] : []
                }))
              }}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="has_song" className="cursor-pointer">
                I have specific songs in mind
              </Label>
              <p className="text-sm text-muted-foreground">
                Add songs you&apos;d like to dance to (we can also help you choose!)
              </p>
            </div>
          </div>

          {formData.has_song && (
            <div className="space-y-3 pl-6 border-l-2 border-[#E6C9A8]">
              {formData.songs.map((song, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Song name"
                      value={song.song_name}
                      onChange={(e) => updateSong(index, 'song_name', e.target.value)}
                      className="rounded-xl"
                    />
                    <Input
                      placeholder="Artist (optional)"
                      value={song.artist}
                      onChange={(e) => updateSong(index, 'artist', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSong(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSong}
                className="rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Song
              </Button>
            </div>
          )}
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white rounded-2xl py-6 text-lg font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Booking Request'
          )}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          By submitting, you agree to our terms and privacy policy. 
          We&apos;ll contact you within 24 hours.
        </p>
      </div>
    </form>
  )
}
