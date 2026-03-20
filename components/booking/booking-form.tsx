'use client'

import { useState } from 'react'
import { Plus, X, Loader2, Music2, ChevronDown } from 'lucide-react'
import { EVENT_TYPES, type BookingFormData } from '@/lib/types'
import { createLead, createLeadSongs } from '@/services/leads'

// ─── Palette ───────────────────────────────────────────────────────────────────
const C = {
  marigold: '#f5a623',
  ember:    '#ff6b35',
  crimson:  '#e8175d',
  base:     '#0d0a1a',
  surface:  '#1a0d2e',
  border:   'rgba(245,166,35,0.18)',
  borderHover: 'rgba(245,166,35,0.45)',
  text:     '#fff',
  muted:    'rgba(255,255,255,0.52)',
  inputBg:  'rgba(255,255,255,0.04)',
}

// ── Reusable field wrapper ─────────────────────────────────────────────────────
function Field({ label, error, children, required }: {
  label: string; error?: string; children: React.ReactNode; required?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.muted }}>
        {label}{required && <span style={{ color: C.crimson, marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: C.crimson, marginTop: 2 }}>
          {error}
        </span>
      )}
    </div>
  )
}

// ── Styled input ───────────────────────────────────────────────────────────────
function StyledInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '11px 14px', borderRadius: 12,
        background: C.inputBg,
        border: `1px solid ${error ? C.crimson : C.border}`,
        color: C.text, fontSize: 14,
        fontFamily: '"DM Sans", sans-serif',
        outline: 'none', transition: 'border-color 0.2s ease',
        ...(props.style ?? {}),
      }}
      onFocus={e => { e.currentTarget.style.borderColor = C.marigold }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? C.crimson : C.border }}
    />
  )
}

// ── Styled textarea ────────────────────────────────────────────────────────────
function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '11px 14px', borderRadius: 12,
        background: C.inputBg,
        border: `1px solid ${C.border}`,
        color: C.text, fontSize: 14, lineHeight: 1.65,
        fontFamily: '"DM Sans", sans-serif',
        outline: 'none', resize: 'vertical', minHeight: 100,
        transition: 'border-color 0.2s ease',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = C.marigold }}
      onBlur={e => { e.currentTarget.style.borderColor = C.border }}
    />
  )
}

// ── Styled select ──────────────────────────────────────────────────────────────
function StyledSelect({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        {...props}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '11px 36px 11px 14px', borderRadius: 12,
          background: C.inputBg,
          border: `1px solid ${error ? C.crimson : C.border}`,
          color: props.value ? C.text : C.muted,
          fontSize: 14, fontFamily: '"DM Sans", sans-serif',
          outline: 'none', appearance: 'none',
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          opacity: props.disabled ? 0.45 : 1,
          transition: 'border-color 0.2s ease',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = C.marigold }}
        onBlur={e => { e.currentTarget.style.borderColor = error ? C.crimson : C.border }}
      >
        {children}
      </select>
      <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

// ── Section divider ────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(to bottom, ${C.marigold}, ${C.crimson})` }} />
      <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
        {children}
      </h3>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${C.border}, transparent)` }} />
    </div>
  )
}

interface BookingFormProps {
  onSuccess: () => void
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    name: '', phone: '', email: '',
    event_type: '', event_subtype: '',
    event_date: '', location: '', message: '',
    has_song: false, songs: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: keyof BookingFormData, value: unknown) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  const normalizePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
  
    if (digits.length === 10) return digits
    if (digits.length > 10) return digits.slice(-10)
  
    return digits // for validation to catch invalid cases
  }

  

  const validateForm = () => {
    const e: Record<string, string> = {}
  
    if (!formData.name.trim()) {
      e.name = 'Name is required'
    }
  
    const normalizedPhone = normalizePhone(formData.phone)
  
    if (!formData.phone.trim()) {
      e.phone = 'Phone is required'
    } else if (normalizedPhone.length !== 10) {
      e.phone = 'Enter a valid 10-digit number'
    }
  
    if (!formData.email.trim()) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Enter a valid email address'
    }
  
    if (!formData.event_type) {
      e.event_type = 'Please select an event type'
    }
  
    if (!formData.event_subtype) {
      e.event_subtype = 'Please select a subtype'
    }
  
    if (!formData.event_date) {
      e.event_date = 'Event date is required'
    }
  
    if (!formData.location.trim()) {
      e.location = 'Location is required'
    }
  
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      const { data: lead, error: leadError } = await createLead(formData)
      if (leadError || !lead) {
        setSubmitError('Something went wrong. Please try again or WhatsApp us directly.')
        return
      }
      if (formData.has_song && formData.songs.length > 0) {
        await createLeadSongs(lead.id, formData.songs)
      }
      onSuccess()
    } catch {
      setSubmitError('Unexpected error. Please WhatsApp us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSong = () => set('songs', [...formData.songs, { song_name: '', artist: '' }])
  const removeSong = (i: number) => set('songs', formData.songs.filter((_, idx) => idx !== i))
  const updateSong = (i: number, field: 'song_name' | 'artist', val: string) =>
    set('songs', formData.songs.map((s, idx) => idx === i ? { ...s, [field]: val } : s))

  const subtypes = formData.event_type
    ? EVENT_TYPES[formData.event_type as keyof typeof EVENT_TYPES]?.subtypes ?? []
    : []

  // Today's date for min constraint
  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        input::placeholder, textarea::placeholder, select option[value=""] { color: rgba(255,255,255,0.28); }
        select option { background: #1a0d2e; color: #fff; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
        .song-row-enter { animation: fadeSlideIn 0.22s ease; }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(232,23,93,0.65) !important; }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <form onSubmit={handleSubmit} style={{ background: `linear-gradient(160deg, rgba(26,13,46,0.85), rgba(13,10,26,0.95))`, borderRadius: 24, padding: 'clamp(24px, 5vw, 40px)', border: `1px solid ${C.border}`, backdropFilter: 'blur(20px)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.marigold, boxShadow: `0 0 8px ${C.marigold}cc` }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.marigold }}>
              Free Consultation
            </span>
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: C.text, margin: 0, lineHeight: 1.1 }}>
            Book Your{' '}
            <span style={{ background: `linear-gradient(110deg, ${C.marigold}, ${C.ember}, ${C.crimson})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Session
            </span>
          </h2>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: C.muted, marginTop: 8, lineHeight: 1.7 }}>
            Fill in your details and we'll get back within 24 hours with a personalised plan.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          {/* ── Personal Information ── */}
          <div>
            <SectionTitle>Personal Information</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
              <Field label="Full Name" error={errors.name} required>
                <StyledInput
                  value={formData.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Your full name"
                  error={!!errors.name}
                />
              </Field>
              <Field label="Phone Number" error={errors.phone} required>
                <StyledInput
                  type="tel"
                  value={formData.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  error={!!errors.phone}
                />
              </Field>
            </div>
            <div style={{ marginTop: 16 }}>
              <Field label="Email Address" error={errors.email} required>
                <StyledInput
                  type="email"
                  value={formData.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  error={!!errors.email}
                />
              </Field>
            </div>
          </div>

          {/* ── Event Details ── */}
          <div>
            <SectionTitle>Event Details</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
              <Field label="Event Type" error={errors.event_type} required>
                <StyledSelect
                  value={formData.event_type}
                  onChange={e => { set('event_type', e.target.value); set('event_subtype', '') }}
                  error={!!errors.event_type}
                >
                  <option value="">Select event type</option>
                  {Object.entries(EVENT_TYPES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </StyledSelect>
              </Field>
              <Field label="Event Subtype" error={errors.event_subtype} required>
                <StyledSelect
                  value={formData.event_subtype}
                  onChange={e => set('event_subtype', e.target.value)}
                  disabled={!formData.event_type}
                  error={!!errors.event_subtype}
                >
                  <option value="">Select subtype</option>
                  {subtypes.map(s => <option key={s} value={s}>{s}</option>)}
                </StyledSelect>
              </Field>
              <Field label="Event Date" error={errors.event_date} required>
                <StyledInput
                  type="date"
                  value={formData.event_date}
                  onChange={e => set('event_date', e.target.value)}
                  min={today}
                  error={!!errors.event_date}
                />
              </Field>
              <Field label="Event Location" error={errors.location} required>
                <StyledInput
                  value={formData.location}
                  onChange={e => set('location', e.target.value)}
                  placeholder="City or venue name"
                  error={!!errors.location}
                />
              </Field>
            </div>
            <div style={{ marginTop: 16 }}>
              <Field label="Additional Message">
                <StyledTextarea
                  value={formData.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Group size, special requirements, vision, or anything else..."
                />
              </Field>
            </div>
          </div>

          {/* ── Guest Performance highlight ── */}
          {formData.event_type === 'guest_performance' && (
            <div style={{ borderRadius: 16, padding: '16px 20px', background: `linear-gradient(135deg, ${C.ember}14, rgba(13,10,26,0.6))`, border: `1px solid ${C.ember}35`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.ember}20`, border: `1px solid ${C.ember}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.ember} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700, color: C.ember, margin: '0 0 4px' }}>Guest Performance Selected</p>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.65 }}>
                  Our team will prepare a fully produced act — costumes, music editing and staging coordination included. We'll confirm availability and share a custom quote within 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* ── Song Preferences ── */}
          <div>
            <SectionTitle>Song Preferences</SectionTitle>

            {/* Checkbox toggle */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', userSelect: 'none' }}>
              <div
                onClick={() => {
                  const next = !formData.has_song
                  setFormData(prev => ({ ...prev, has_song: next, songs: next ? [{ song_name: '', artist: '' }] : [] }))
                }}
                style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  border: `2px solid ${formData.has_song ? C.marigold : C.border}`,
                  background: formData.has_song ? C.marigold : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', cursor: 'pointer',
                }}
              >
                {formData.has_song && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="#0d0a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 3px' }}>
                  I have specific songs in mind
                </p>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: C.muted, margin: 0 }}>
                  Add your preferred songs — we can also help you choose the perfect tracks!
                </p>
              </div>
            </label>

            {/* Song list */}
            {formData.has_song && (
              <div style={{ marginTop: 16, paddingLeft: 16, borderLeft: `2px solid ${C.marigold}40`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {formData.songs.map((song, i) => (
                  <div key={i} className="song-row-enter" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Music2 size={16} style={{ color: C.marigold, flexShrink: 0, marginTop: 13 }} />
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <StyledInput
                        placeholder="Song name"
                        value={song.song_name}
                        onChange={e => updateSong(i, 'song_name', e.target.value)}
                      />
                      <StyledInput
                        placeholder="Artist (optional)"
                        value={song.artist}
                        onChange={e => updateSong(i, 'artist', e.target.value)}
                      />
                    </div>
                    {formData.songs.length > 1 && (
                      <button type="button" onClick={() => removeSong(i)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(232,23,93,0.25)', background: 'rgba(232,23,93,0.06)', color: C.crimson, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 6, transition: 'all 0.2s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(232,23,93,0.15)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(232,23,93,0.06)' }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" onClick={addSong}
                  style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'rgba(245,166,35,0.06)', color: C.marigold, fontSize: 13, fontWeight: 600, fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', transition: 'all 0.2s ease', marginTop: 2 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,166,35,0.14)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,166,35,0.06)' }}
                >
                  <Plus size={14} /> Add another song
                </button>
              </div>
            )}
          </div>

          {/* ── Submit error ── */}
          {submitError && (
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(232,23,93,0.08)', border: `1px solid rgba(232,23,93,0.3)`, fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.crimson }}>
              {submitError}
            </div>
          )}

          {/* ── Submit button ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
            style={{
              width: '100%', padding: '16px 24px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #e8175d, #c0104a)',
              color: '#fff', fontSize: 16, fontWeight: 700,
              fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.03em',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 8px 28px rgba(232,23,93,0.45)',
              transition: 'all 0.25s ease',
            }}
          >
            {isSubmitting ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</>
            ) : (
              'Submit Booking Request'
            )}
          </button>

          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 1.7, marginTop: -8 }}>
            By submitting you agree to our terms and privacy policy. We'll contact you within 24 hours.
          </p>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}