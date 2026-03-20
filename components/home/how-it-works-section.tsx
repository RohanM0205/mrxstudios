'use client'

import Link from 'next/link'
import { MessageSquare, Palette, Music, PartyPopper } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron  (primary)
//  Ember     #ff6b35   burnished orange
//  Crimson   #e8175d   celebration red
// ─────────────────────────────────────────────────────────────────────────────

const steps = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Connect With Us',
    description:
      'Reach out via our booking form or WhatsApp. Share your vision, event details, and any song preferences.',
    accentColor: '#f5a623',
    glowColor: 'rgba(245,166,35,0.35)',
    badgeBg: 'rgba(245,166,35,0.12)',
    badgeBorder: 'rgba(245,166,35,0.35)',
  },
  {
    icon: Palette,
    number: '02',
    title: 'Custom Planning',
    description:
      'We design a personalized choreography plan based on your skill level, group size, and event theme.',
    accentColor: '#ff6b35',
    glowColor: 'rgba(255,107,53,0.35)',
    badgeBg: 'rgba(255,107,53,0.12)',
    badgeBorder: 'rgba(255,107,53,0.35)',
  },
  {
    icon: Music,
    number: '03',
    title: 'Learn & Practice',
    description:
      'Enjoy fun, stress-free sessions at your preferred location. We break down moves for all skill levels.',
    accentColor: '#e8175d',
    glowColor: 'rgba(232,23,93,0.35)',
    badgeBg: 'rgba(232,23,93,0.12)',
    badgeBorder: 'rgba(232,23,93,0.35)',
  },
  {
    icon: PartyPopper,
    number: '04',
    title: 'Shine & Celebrate',
    description:
      'Take the stage with confidence and create memories that last a lifetime. We handle everything.',
    accentColor: '#f5a623',
    glowColor: 'rgba(245,166,35,0.35)',
    badgeBg: 'rgba(245,166,35,0.12)',
    badgeBorder: 'rgba(245,166,35,0.35)',
  },
]

export function HowItWorksSection() {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d0a1a 0%, #14091f 50%, #0d0a1a 100%)',
      }}
    >
      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            top: '-15%', left: '-12%',
            background: 'radial-gradient(circle, #f5a623 0%, transparent 65%)',
            opacity: 0.055, filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            bottom: '-10%', right: '-10%',
            background: 'radial-gradient(circle, #e8175d 0%, transparent 65%)',
            opacity: 0.06, filter: 'blur(80px)',
          }}
        />
        {/* Faint dot-grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(245,166,35,0.07) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* ── SECTION HEADER ── */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-5">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5a623', boxShadow: '0 0 8px rgba(245,166,35,0.8)' }} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#f5a623',
            }}>
              Simple Process
            </span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8175d', boxShadow: '0 0 8px rgba(232,23,93,0.8)' }} />
          </div>

          <h2
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 900, lineHeight: 1.08,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: 14,
            }}
          >
            From First Call to{' '}
            <span
              style={{
                background: 'linear-gradient(110deg, #f5a623 0%, #ff6b35 50%, #e8175d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.35))',
              }}
            >
              Final Bow
            </span>
          </h2>

          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(15px, 2vw, 17px)',
              color: 'rgba(255,255,255,0.52)',
              maxWidth: 500, margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            We make the journey as enjoyable as the performance itself — four simple steps, zero stress.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(245,166,35,0.4))' }} />
            <div style={{ width: 6, height: 6, background: '#f5a623', transform: 'rotate(45deg)', borderRadius: 1 }} />
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(245,166,35,0.4))' }} />
          </div>
        </div>

        {/* ── STEPS ── */}
        <div className="relative">

          {/* ── DESKTOP CONNECTOR LINE ── runs behind all 4 cards ── */}
          <div
            className="hidden lg:block absolute"
            style={{
              top: 52,
              left: '12.5%',
              right: '12.5%',
              height: 2,
              background: 'linear-gradient(90deg, #f5a623, #ff6b35, #e8175d, #f5a623)',
              opacity: 0.2,
              borderRadius: 999,
            }}
          />
          {/* Animated shimmer on top of connector */}
          <div
            className="hidden lg:block absolute"
            style={{
              top: 52,
              left: '12.5%',
              right: '12.5%',
              height: 2,
              background: 'linear-gradient(90deg, transparent 0%, rgba(245,166,35,0.9) 30%, rgba(255,107,53,0.9) 60%, transparent 100%)',
              borderRadius: 999,
              animation: 'shimmerLine 3s linear infinite',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group relative flex flex-col"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* ── STEP CARD ── */}
                <div
                  className="relative flex flex-col h-full rounded-3xl p-6 transition-all duration-400"
                  style={{
                    background: 'linear-gradient(160deg, rgba(26,13,46,0.7), rgba(13,10,26,0.85))',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = step.badgeBorder
                    el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${step.glowColor}`
                    el.style.transform = 'translateY(-6px)'
                    el.style.background = 'linear-gradient(160deg, rgba(26,13,46,0.9), rgba(13,10,26,0.95))'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(255,255,255,0.07)'
                    el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
                    el.style.transform = 'translateY(0)'
                    el.style.background = 'linear-gradient(160deg, rgba(26,13,46,0.7), rgba(13,10,26,0.85))'
                  }}
                >
                  {/* Accent top-bar — revealed on hover */}
                  <div
                    className="absolute top-0 left-5 right-5 rounded-full"
                    style={{
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${step.accentColor}, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />

                  {/* ── NUMBER BADGE ── floating top-right ── */}
                  <div
                    className="absolute -top-4 -right-2 flex items-center justify-center rounded-2xl shadow-lg"
                    style={{
                      width: 48, height: 48,
                      background: `linear-gradient(135deg, ${step.accentColor}, ${step.accentColor}bb)`,
                      boxShadow: `0 6px 20px ${step.glowColor}`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: 16, fontWeight: 900,
                        color: '#0d0a1a',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* ── ICON ── */}
                  <div
                    className="flex items-center justify-center rounded-2xl mb-6"
                    style={{
                      width: 60, height: 60,
                      background: step.badgeBg,
                      border: `1px solid ${step.badgeBorder}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <step.icon
                      size={26}
                      style={{ color: step.accentColor, transition: 'transform 0.3s ease' }}
                      className="group-hover:scale-110"
                    />
                  </div>

                  {/* ── TITLE ── */}
                  <h3
                    style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: 22, fontWeight: 900,
                      color: '#fff',
                      letterSpacing: '-0.01em',
                      marginBottom: 10,
                      lineHeight: 1.2,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* ── DESCRIPTION ── */}
                  <p
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.52)',
                      lineHeight: 1.75,
                      flexGrow: 1,
                    }}
                  >
                    {step.description}
                  </p>

                  {/* ── BOTTOM ACCENT LINE ── */}
                  <div
                    className="mt-6"
                    style={{
                      height: 2, borderRadius: 999,
                      background: `linear-gradient(90deg, ${step.accentColor}, transparent)`,
                      opacity: 0.3,
                      transition: 'opacity 0.3s ease, width 0.4s ease',
                    }}
                  />

                  {/* ── STEP LABEL ── bottom-left micro text ── */}
                  <p
                    className="mt-3"
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 10, fontWeight: 600,
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: step.accentColor,
                      opacity: 0.6,
                    }}
                  >
                    Step {index + 1} of {steps.length}
                  </p>
                </div>

                {/* ── MOBILE CONNECTOR (visible sm, hidden lg) ── */}
                {index < steps.length - 1 && (
                  <div
                    className="lg:hidden flex justify-center py-2"
                    style={{ marginTop: 4 }}
                  >
                    <div
                      style={{
                        width: 2, height: 28,
                        background: `linear-gradient(to bottom, ${step.accentColor}, ${steps[index + 1].accentColor})`,
                        opacity: 0.35,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="text-center mt-20">
          {/* Decorative quote */}
          <p
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(17px, 2.5vw, 22px)',
              fontStyle: 'italic',
              fontWeight: 700,
              color: 'rgba(255,240,210,0.55)',
              marginBottom: 24,
              letterSpacing: '0.01em',
            }}
          >
            "Every great performance starts with a single conversation."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 rounded-2xl px-8 py-4"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 15, fontWeight: 700,
                background: 'linear-gradient(135deg, #e8175d, #c0104a)',
                color: '#fff',
                textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(232,23,93,0.4)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 14px 40px rgba(232,23,93,0.6)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 8px 28px rgba(232,23,93,0.4)'
              }}
            >
              Start Your Journey
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="https://wa.me/91XXXXXXXXXX"
              className="inline-flex items-center gap-3 rounded-2xl px-8 py-4"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 15, fontWeight: 600,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(245,166,35,0.28)',
                color: '#f5a623',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(245,166,35,0.1)'
                el.style.borderColor = 'rgba(245,166,35,0.5)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(255,255,255,0.05)'
                el.style.borderColor = 'rgba(245,166,35,0.28)'
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* WhatsApp icon */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes shimmerLine {
          0%   { transform: translateX(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}