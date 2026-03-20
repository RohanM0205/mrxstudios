'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { BookingForm } from '@/components/booking/booking-form'
import { BookingSuccess } from '@/components/booking/booking-success'
import { Phone, Clock, MapPin, Star, Shield, Zap } from 'lucide-react'

const C = {
  marigold: '#f5a623',
  ember:    '#ff6b35',
  crimson:  '#e8175d',
  base:     '#0d0a1a',
  surface:  '#1a0d2e',
  border:   'rgba(245,166,35,0.18)',
  text:     '#fff',
  muted:    'rgba(255,255,255,0.52)',
}

const trustStats = [
  { value: '500+', label: 'Events Delivered' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '10+', label: 'Years Experience' },
]

const whyUs = [
  { icon: Zap,    text: 'Response within 24 hours' },
  { icon: Star,   text: 'Personalised choreography' },
  { icon: Shield, text: 'Flexible scheduling' },
  { icon: MapPin, text: 'Home & studio sessions' },
]

export default function BookingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <main style={{ minHeight: '100vh', background: C.base }}>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', paddingTop: 'clamp(96px, 14vw, 140px)', paddingBottom: 'clamp(48px, 7vw, 80px)', overflow: 'hidden', background: 'linear-gradient(180deg, #120a1c 0%, #0d0a1a 100%)' }}>
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(245,166,35,0.055) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glows */}
        <div style={{ position: 'absolute', borderRadius: '50%', width: 'min(600px, 80vw)', height: 'min(600px, 80vw)', top: '-20%', right: '-10%', background: `radial-gradient(circle, ${C.marigold} 0%, transparent 65%)`, opacity: 0.07, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', borderRadius: '50%', width: 'min(400px, 60vw)', height: 'min(400px, 60vw)', bottom: '-10%', left: '-8%', background: `radial-gradient(circle, ${C.crimson} 0%, transparent 65%)`, opacity: 0.07, filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)', textAlign: 'center' }}>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.marigold, boxShadow: `0 0 8px ${C.marigold}cc` }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.marigold }}>
              Free Consultation
            </span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.crimson, boxShadow: '0 0 8px rgba(232,23,93,0.8)' }} />
          </div>

          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 900, color: C.text, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 18 }}>
            Book Your{' '}
            <span style={{ background: `linear-gradient(110deg, ${C.marigold} 0%, ${C.ember} 50%, ${C.crimson} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: `drop-shadow(0 0 28px ${C.marigold}50)` }}>
              Session
            </span>
          </h1>

          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(15px, 2vw, 18px)', color: C.muted, maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.75 }}>
            Fill out the form and we'll get back within 24 hours with a personalised plan, pricing, and timeline.
          </p>

          {/* Trust stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(20px, 4vw, 48px)' }}>
            {trustStats.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, color: C.marigold, textShadow: `0 0 20px ${C.marigold}60`, margin: '0 0 3px' }}>
                  {stat.value}
                </p>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FORM + SIDEBAR
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px, 7vw, 96px) 0', background: 'linear-gradient(180deg, #0d0a1a 0%, #0f0818 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
          <div className="booking-layout">

            {/* ── Left: Form ── */}
            <div style={{ minWidth: 0 }}>
              {isSubmitted
                ? <BookingSuccess onReset={() => setIsSubmitted(false)} />
                : <BookingForm onSuccess={() => setIsSubmitted(true)} />
              }
            </div>

            {/* ── Right: Sidebar ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Quick Contact */}
              <div style={{ borderRadius: 20, padding: 'clamp(20px, 3vw, 28px)', background: 'linear-gradient(160deg, rgba(26,13,46,0.8), rgba(13,10,26,0.95))', border: `1px solid ${C.border}`, backdropFilter: 'blur(20px)' }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.marigold, marginBottom: 16 }}>
                  Quick Contact
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { Icon: Phone, label: 'Call us directly', value: '+91 98765 43210', href: 'tel:+919876543210' },
                    { Icon: Clock, label: 'Response time', value: 'Within 24 hours', href: null },
                    { Icon: MapPin, label: 'Studio location', value: 'Mumbai, Maharashtra', href: null },
                  ].map(({ Icon, label, value, href }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${C.marigold}12`, border: `1px solid ${C.marigold}25` }}>
                        <Icon size={16} style={{ color: C.marigold }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: C.muted, margin: '0 0 2px' }}>{label}</p>
                        {href
                          ? <a href={href} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, color: C.text, textDecoration: 'none' }}>{value}</a>
                          : <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{value}</p>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why MRX */}
              <div style={{ borderRadius: 20, padding: 'clamp(20px, 3vw, 28px)', background: 'linear-gradient(160deg, rgba(26,13,46,0.8), rgba(13,10,26,0.95))', border: `1px solid ${C.border}`, backdropFilter: 'blur(20px)' }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.marigold, marginBottom: 16 }}>
                  Why MRX Studios?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {whyUs.map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${C.ember}12`, border: `1px solid ${C.ember}25` }}>
                        <Icon size={13} style={{ color: C.ember }} />
                      </div>
                      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20choreography%20services." target="_blank" rel="noopener noreferrer"
                style={{ borderRadius: 20, padding: 'clamp(20px, 3vw, 28px)', background: 'linear-gradient(135deg, rgba(37,211,102,0.12), rgba(37,211,102,0.06))', border: '1px solid rgba(37,211,102,0.25)', display: 'block', textDecoration: 'none', transition: 'all 0.25s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, rgba(37,211,102,0.2), rgba(37,211,102,0.1))' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, rgba(37,211,102,0.12), rgba(37,211,102,0.06))' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 700, color: '#25D366', margin: 0 }}>Prefer WhatsApp?</p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Quick replies, easy planning</p>
                  </div>
                </div>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(37,211,102,0.85)' }}>
                  Start a chat →
                </span>
              </a>

              {/* Testimonial snippet */}
              <div style={{ borderRadius: 20, padding: 'clamp(18px, 3vw, 26px)', background: 'linear-gradient(160deg, rgba(245,166,35,0.06), rgba(13,10,26,0.8))', border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={C.marigold}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 15, fontStyle: 'italic', color: 'rgba(255,240,210,0.85)', lineHeight: 1.65, margin: '0 0 12px' }}>
                  "Ritesh made our sangeet magical. Every guest was on their feet — it was beyond what we imagined."
                </p>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600, color: C.marigold, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Priya & Rahul — Wedding Sangeet
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      <style>{`
        .booking-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: clamp(24px, 4vw, 48px);
          align-items: start;
        }
        @media (max-width: 1024px) {
          .booking-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  )
}