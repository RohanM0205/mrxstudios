'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron (primary)
//  Ember     #ff6b35   burnished orange
//  Crimson   #e8175d   celebration red
// ─────────────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    id: '1',
    name: 'Priya & Rahul Sharma',
    event: 'Wedding Sangeet',
    eventColor: '#f5a623',
    content:
      'Ritesh and his team made our sangeet absolutely magical! They taught 15 of our family members a beautiful choreography in just 5 sessions. Everyone was amazed at how confident even our non-dancers became.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&q=80',
  },
  {
    id: '2',
    name: 'Vikram Mehta',
    event: 'Corporate Event',
    eventColor: '#ff6b35',
    content:
      'The energy MRX Studios brought to our company annual day was incredible. They handled 50+ employees with different skill levels and created a show-stopping performance. Highly professional team!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: '3',
    name: 'Ananya — College Fest',
    event: 'College Performance',
    eventColor: '#e8175d',
    content:
      'Our college fest performance was a huge hit thanks to MRX Studios! The choreography was modern, energetic, and perfectly suited for our group. We won first place in the inter-college competition!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
  {
    id: '4',
    name: 'Sneha Patel',
    event: 'Reality Show Audition',
    eventColor: '#f5a623',
    content:
      'I came to Ritesh with zero confidence for my dance reality show audition. His patient coaching and unique choreography helped me clear 3 rounds! Forever grateful for his guidance.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
]

const INTERVAL_MS = 6000

export function TestimonialsSection() {
  const [current, setCurrent]     = useState(0)
  const [visible, setVisible]     = useState(true)   // true = content shown, false = fading out
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const busyRef  = useRef(false)

  // ── FIX 1: ref-based timer — never captures stale `current` ──────────────
  // The original used setInterval(next, 6000) where `next` closed over a stale
  // `current` value from the render it was created in. This caused the carousel
  // to occasionally skip or repeat slides. Using a ref + functional setCurrent
  // updater solves this permanently.
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => advance('right'), INTERVAL_MS)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── FIX 2: proper two-phase transition ───────────────────────────────────
  // Original: set animating=true (hides content), then in setTimeout set
  // current + animating=false. Problem: the content data (t.name, t.content
  // etc.) swapped at the SAME time as the fade-in started, causing a flash
  // where briefly the new content appeared before the animation completed.
  //
  // Fixed approach:
  //   Phase 1 (0ms):    setVisible(false) → content fades+slides OUT
  //   Phase 2 (280ms):  setCurrent → content data swaps while invisible
  //                     setVisible(true) → content fades+slides IN from opposite side
  const advance = (dir: 'left' | 'right', targetIdx?: number) => {
    if (busyRef.current) return
    busyRef.current = true
    setDirection(dir)
    setVisible(false)

    setTimeout(() => {
      if (targetIdx !== undefined) {
        setCurrent(targetIdx)
      } else {
        // Functional updater — reads fresh state, never stale
        setCurrent(prev =>
          dir === 'right'
            ? (prev + 1) % testimonials.length
            : (prev - 1 + testimonials.length) % testimonials.length
        )
      }
      setVisible(true)
      busyRef.current = false
    }, 280)
  }

  const goTo = (idx: number, dir?: 'left' | 'right') => {
    if (idx === current || busyRef.current) return
    const resolvedDir = dir ?? (idx > current ? 'right' : 'left')
    advance(resolvedDir, idx)
    startTimer() // reset auto-advance timer on manual interaction
  }

  const next = () => { advance('right'); startTimer() }
  const prev = () => { advance('left');  startTimer() }

  const t = testimonials[current]

  // Slide direction for the exit animation
  const slideOffset = direction === 'right' ? '-24px' : '24px'

  return (
    <section
      className="relative overflow-hidden testimonials-section"
      style={{ background: 'linear-gradient(180deg, #0d0a1a 0%, #120a1c 50%, #0d0a1a 100%)' }}
    >
      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 'min(700px, 120vw)',
            height: 'min(700px, 120vw)',
            top: '-10%', right: '-15%',
            background: 'radial-gradient(circle, #f5a623 0%, transparent 65%)',
            opacity: 0.055, filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 'min(550px, 100vw)',
            height: 'min(550px, 100vw)',
            bottom: '-10%', left: '-10%',
            background: 'radial-gradient(circle, #e8175d 0%, transparent 65%)',
            opacity: 0.06, filter: 'blur(80px)',
          }}
        />
        {/* Dot-grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(245,166,35,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl testimonials-container">

        {/* ── SECTION HEADER ── */}
        <div className="text-center testimonials-header">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 header-eyebrow">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5a623', boxShadow: '0 0 8px rgba(245,166,35,0.8)', flexShrink: 0 }} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#f5a623',
            }}>
              Client Love
            </span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8175d', boxShadow: '0 0 8px rgba(232,23,93,0.8)', flexShrink: 0 }} />
          </div>

          {/* Heading */}
          <h2 className="testimonials-heading">
            Stories That{' '}
            <span
              style={{
                background: 'linear-gradient(110deg, #f5a623 0%, #ff6b35 50%, #e8175d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.35))',
              }}
            >
              Move Us
            </span>
          </h2>

          {/* Subtext */}
          <p className="testimonials-subtext">
            Don't just take our word for it — hear from the people who've danced with us.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 header-divider">
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(245,166,35,0.4))' }} />
            <div style={{ width: 6, height: 6, background: '#f5a623', transform: 'rotate(45deg)', borderRadius: 1, flexShrink: 0 }} />
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(245,166,35,0.4))' }} />
          </div>
        </div>

        {/* ── AVATAR STRIP ── */}
        <div className="flex items-center justify-center avatar-strip">
          {testimonials.map((t2, i) => (
            <button
              key={t2.id}
              onClick={() => goTo(i, i > current ? 'right' : 'left')}
              className="relative rounded-full overflow-hidden flex-shrink-0"
              style={{
                width:  i === current ? 'clamp(52px, 10vw, 64px)' : 'clamp(36px, 7vw, 44px)',
                height: i === current ? 'clamp(52px, 10vw, 64px)' : 'clamp(36px, 7vw, 44px)',
                border: i === current
                  ? `3px solid ${t2.eventColor}`
                  : '2px solid rgba(255,255,255,0.1)',
                boxShadow: i === current
                  ? `0 0 0 4px ${t2.eventColor}30, 0 0 24px ${t2.eventColor}50`
                  : 'none',
                opacity:    i === current ? 1 : 0.45,
                transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                padding: 0,
                cursor: 'pointer',
                background: 'transparent',
              }}
              aria-label={`View testimonial from ${t2.name}`}
            >
              <Image src={t2.image} alt={t2.name} fill className="object-cover" />
            </button>
          ))}
        </div>

        {/* ── MAIN TESTIMONIAL CARD ── */}
        <div className="relative testimonial-card-wrapper">

          {/* Decorative large quote mark */}
          <div
            className="quote-decoration"
            aria-hidden="true"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 900,
              background: 'linear-gradient(135deg, rgba(245,166,35,0.12), rgba(232,23,93,0.06))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              userSelect: 'none',
              pointerEvents: 'none',
              lineHeight: 1,
            }}
          >
            &ldquo;
          </div>

          {/* Card shell */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(26,13,46,0.75), rgba(13,10,26,0.9))',
              border: `1px solid ${t.eventColor}30`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 0 60px ${t.eventColor}14, 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
              transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            }}
          >
            {/* Fire top-bar — colour-matched to active testimonial */}
            <div
              style={{
                height: 3,
                background: `linear-gradient(90deg, transparent, ${t.eventColor}, #ff6b35, ${t.eventColor}, transparent)`,
                transition: 'background 0.4s ease',
              }}
            />

            {/* Animated content wrapper */}
            <div
              className="testimonial-card-body"
              style={{
                // FIX: use `visible` not `animating` so the slide-in direction
                // is correct and the data swap happens while content is invisible
                opacity:   visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : `translateX(${slideOffset})`,
                transition: 'opacity 0.28s ease, transform 0.28s ease',
              }}
            >
              {/* Stars */}
              <div className="flex gap-1.5 stars-row">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    style={{
                      color: '#f5a623',
                      fill: '#f5a623',
                      filter: 'drop-shadow(0 0 6px rgba(245,166,35,0.7))',
                      flexShrink: 0,
                    }}
                  />
                ))}
                <span
                  className="ml-2"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 12, fontWeight: 600,
                    color: 'rgba(255,255,255,0.35)',
                    alignSelf: 'center',
                  }}
                >
                  5.0 / 5.0
                </span>
              </div>

              {/* Quote text */}
              <blockquote className="testimonial-quote">
                &ldquo;{t.content}&rdquo;
              </blockquote>

              {/* Accent divider */}
              <div
                style={{
                  height: 1,
                  background: `linear-gradient(90deg, ${t.eventColor}40, transparent)`,
                  marginBottom: 20,
                }}
              />

              {/* Author row — wraps on small screens */}
              <div className="author-row">
                <div className="flex items-center author-info">
                  {/* Avatar */}
                  <div
                    className="relative rounded-full overflow-hidden flex-shrink-0"
                    style={{
                      width: 48, height: 48,
                      border: `2px solid ${t.eventColor}`,
                      boxShadow: `0 0 16px ${t.eventColor}50`,
                    }}
                  >
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  {/* Name + event */}
                  <div>
                    <p style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: 17, fontWeight: 700,
                      color: '#fff', lineHeight: 1.2,
                    }}>
                      {t.name}
                    </p>
                    <p style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: t.eventColor, marginTop: 3,
                    }}>
                      {t.event}
                    </p>
                  </div>
                </div>

                {/* Verified badge */}
                <div
                  className="verified-badge inline-flex items-center gap-2 rounded-full"
                  style={{
                    background: 'rgba(245,166,35,0.08)',
                    border: '1px solid rgba(245,166,35,0.22)',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5a623', boxShadow: '0 0 6px rgba(245,166,35,0.8)', flexShrink: 0 }} />
                  <span style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(245,166,35,0.8)', whiteSpace: 'nowrap',
                  }}>
                    Verified Client
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── NAVIGATION CONTROLS ── */}
        <div className="flex items-center justify-center gap-4 nav-controls">

          {/* Prev */}
          <button
            onClick={prev}
            className="flex items-center justify-center rounded-full nav-btn"
            style={{
              width: 48, height: 48,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(245,166,35,0.22)',
              color: 'rgba(255,255,255,0.6)',
              transition: 'all 0.25s ease',
              flexShrink: 0, cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(245,166,35,0.12)'
              el.style.borderColor = 'rgba(245,166,35,0.5)'
              el.style.color = '#f5a623'
              el.style.transform = 'translateX(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(255,255,255,0.05)'
              el.style.borderColor = 'rgba(245,166,35,0.22)'
              el.style.color = 'rgba(255,255,255,0.6)'
              el.style.transform = 'translateX(0)'
            }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((t2, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                style={{
                  height: 4,
                  width: i === current ? 28 : 8,
                  borderRadius: 999,
                  background: i === current
                    ? `linear-gradient(90deg, ${t2.eventColor}, #ff6b35)`
                    : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  boxShadow: i === current ? `0 0 8px ${t2.eventColor}80` : 'none',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="flex items-center justify-center rounded-full nav-btn"
            style={{
              width: 48, height: 48,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(245,166,35,0.22)',
              color: 'rgba(255,255,255,0.6)',
              transition: 'all 0.25s ease',
              flexShrink: 0, cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(245,166,35,0.12)'
              el.style.borderColor = 'rgba(245,166,35,0.5)'
              el.style.color = '#f5a623'
              el.style.transform = 'translateX(2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(255,255,255,0.05)'
              el.style.borderColor = 'rgba(245,166,35,0.22)'
              el.style.color = 'rgba(255,255,255,0.6)'
              el.style.transform = 'translateX(0)'
            }}
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ── TRUST ROW ── */}
        <div className="trust-row">
          {[
            { value: '500+', label: 'Happy Clients', color: '#f5a623' },
            { value: '4.9★', label: 'Average Rating', color: '#ff6b35' },
            { value: '100%', label: 'Recommend Us',  color: '#e8175d' },
          ].map(stat => (
            <div key={stat.label} className="trust-stat">
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(22px, 5vw, 34px)',
                fontWeight: 900,
                color: stat.color,
                textShadow: `0 0 20px ${stat.color}60`,
                lineHeight: 1, marginBottom: 4,
              }}>
                {stat.value}
              </p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 10, fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.38)',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FONTS + FULL RESPONSIVE STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ─── Section vertical rhythm ─── */
        .testimonials-section {
          padding: 72px 0 64px;
        }
        .testimonials-container {
          padding: 0 16px;
        }

        /* ─── Header ─── */
        .testimonials-header {
          margin-bottom: 48px;
        }
        .header-eyebrow {
          margin-bottom: 16px;
        }
        .testimonials-heading {
          font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
          font-size: clamp(28px, 7vw, 62px);
          font-weight: 900;
          line-height: 1.08;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .testimonials-subtext {
          font-family: "DM Sans", sans-serif;
          font-size: clamp(14px, 3vw, 17px);
          color: rgba(255,255,255,0.52);
          max-width: 440px;
          margin: 0 auto;
          line-height: 1.75;
        }
        .header-divider {
          margin-top: 20px;
        }

        /* ─── Avatar strip ─── */
        .avatar-strip {
          gap: 12px;
          margin-bottom: 32px;
        }

        /* ─── Card wrapper ─── */
        .testimonial-card-wrapper {
          max-width: 700px;
          margin: 0 auto;
        }

        /* ─── Decorative quote mark ─── */
        .quote-decoration {
          position: absolute;
          top: -24px;
          left: -8px;
          font-size: 130px;
        }

        /* ─── Card body padding ─── */
        .testimonial-card-body {
          padding: 28px 24px;
        }
        .stars-row {
          margin-bottom: 20px;
        }

        /* ─── Quote text ─── */
        .testimonial-quote {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(16px, 3.5vw, 22px);
          font-weight: 700;
          font-style: italic;
          color: rgba(255,240,210,0.9);
          line-height: 1.65;
          margin-bottom: 24px;
          letter-spacing: 0.005em;
        }

        /* ─── Author row ─── */
        .author-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .author-info {
          gap: 12px;
        }
        .verified-badge {
          padding: 6px 12px;
        }

        /* ─── Navigation ─── */
        .nav-controls {
          margin-top: 28px;
        }
        .nav-btn {
          /* Tailwind fill — border-radius set inline via rounded-full */
        }

        /* ─── Trust row ─── */
        .trust-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 20px 32px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(245,166,35,0.1);
        }
        .trust-stat {
          text-align: center;
          min-width: 80px;
        }

        /* ─── 480px+ ─── */
        @media (min-width: 480px) {
          .testimonials-container {
            padding: 0 24px;
          }
          .testimonial-card-body {
            padding: 32px 28px;
          }
          .avatar-strip {
            gap: 14px;
          }
          .trust-row {
            gap: 24px 40px;
          }
        }

        /* ─── 640px+ ─── */
        @media (min-width: 640px) {
          .testimonials-section {
            padding: 96px 0 80px;
          }
          .testimonials-container {
            padding: 0 32px;
          }
          .testimonials-header {
            margin-bottom: 56px;
          }
          .testimonial-card-body {
            padding: 40px 44px;
          }
          .avatar-strip {
            gap: 16px;
            margin-bottom: 40px;
          }
          .quote-decoration {
            font-size: 160px;
            top: -28px;
            left: -12px;
          }
          .trust-row {
            gap: 32px 56px;
            margin-top: 56px;
          }
        }

        /* ─── 1024px+ ─── */
        @media (min-width: 1024px) {
          .testimonials-section {
            padding: 112px 0 96px;
          }
          .testimonials-container {
            padding: 0 48px;
          }
          .testimonials-header {
            margin-bottom: 64px;
          }
          .testimonial-card-body {
            padding: 48px;
          }
          .quote-decoration {
            font-size: 180px;
            top: -32px;
            left: -16px;
          }
        }

        /* ─── < 480px (tiny screens) ─── */
        @media (max-width: 479px) {
          .quote-decoration {
            display: none;
          }
          .testimonials-section {
            padding: 56px 0 52px;
          }
          .trust-row {
            gap: 16px 24px;
          }
          .verified-badge {
            padding: 5px 10px;
          }
          .author-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  )
}