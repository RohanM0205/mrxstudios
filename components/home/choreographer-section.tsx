'use client'

import Image from 'next/image'
import { Award, Users, Music, Star, Instagram, Youtube, ChevronRight } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron (primary gold)
//  Ember     #ff6b35   burnished orange (accent)
//  Crimson   #e8175d   celebration red (CTA)
// ─────────────────────────────────────────────────────────────────────────────

const credentials = [
  {
    icon: Award,
    title: 'Certified Professional',
    description: 'Trained in Bollywood, Contemporary, Hip-Hop, Classical & Latin forms',
    color: '#f5a623',
    glow: 'rgba(245,166,35,0.25)',
  },
  {
    icon: Users,
    title: '500+ Events',
    description: 'Weddings, corporate shows, college fests and celebrity functions',
    color: '#ff6b35',
    glow: 'rgba(255,107,53,0.25)',
  },
  {
    icon: Music,
    title: 'Versatile Styles',
    description: 'Adapts seamlessly to any music genre, theme, or cultural context',
    color: '#e8175d',
    glow: 'rgba(232,23,93,0.25)',
  },
  {
    icon: Star,
    title: 'Celebrity Clients',
    description: 'Worked with high-profile personalities and landmark events across India',
    color: '#f5a623',
    glow: 'rgba(245,166,35,0.25)',
  },
]

export function ChoreographerSection() {
  return (
    <section
      className="relative pt-16 pb-24 sm:pt-20 sm:pb-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #110820 0%, #0d0a1a 40%, #130a1e 100%)' }}
    >
      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Marigold — left bloom behind the photo */}
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            top: '5%', left: '-18%',
            background: 'radial-gradient(circle, #f5a623 0%, transparent 65%)',
            opacity: 0.07, filter: 'blur(60px)',
          }}
        />
        {/* Crimson — far right */}
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: '0%', right: '-10%',
            background: 'radial-gradient(circle, #e8175d 0%, transparent 65%)',
            opacity: 0.07, filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* ── SECTION HEADER ── */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-5">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5a623', boxShadow: '0 0 8px rgba(245,166,35,0.8)' }} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#f5a623',
            }}>
              Meet Your Choreographer
            </span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8175d', boxShadow: '0 0 8px rgba(232,23,93,0.8)' }} />
          </div>

          <h2 style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: 'clamp(40px, 7vw, 72px)',
            fontWeight: 900, lineHeight: 1.05,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: 14,
          }}>
            Ritesh{' '}
            <span style={{
              background: 'linear-gradient(110deg, #f5a623 0%, #ff6b35 50%, #e8175d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.4))',
            }}>
              More
            </span>
          </h2>

          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: 'rgba(255,255,255,0.52)',
            maxWidth: 500, margin: '0 auto',
            lineHeight: 1.75,
          }}>
            Founder of MRX Studios — a decade of turning ordinary moments into extraordinary performances
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(245,166,35,0.4))' }} />
            <div style={{ width: 6, height: 6, background: '#f5a623', transform: 'rotate(45deg)', borderRadius: 1 }} />
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(245,166,35,0.4))' }} />
          </div>
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ══ LEFT — PHOTO COLUMN ══ */}
          <div className="relative flex justify-center lg:justify-start">

            {/* Outer glow ring */}
            <div
              className="absolute rounded-3xl pointer-events-none"
              style={{
                inset: -2,
                background: 'linear-gradient(135deg, rgba(245,166,35,0.5), rgba(255,107,53,0.3), rgba(232,23,93,0.4))',
                borderRadius: 28,
                filter: 'blur(1px)',
                zIndex: 0,
              }}
            />

            {/* Photo frame */}
            <div
              className="relative w-full max-w-sm lg:max-w-none"
              style={{
                aspectRatio: '4/5',
                borderRadius: 24,
                overflow: 'hidden',
                zIndex: 1,
                boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.2)',
              }}
            >
              {/* Replace with Ritesh's actual photo */}
              <Image
                src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80"
                alt="Ritesh More — Founder, MRX Studios"
                fill
                className="object-cover object-top"
              />

              {/* Photo overlay gradient */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(13,10,26,0.85) 0%, rgba(13,10,26,0.2) 55%, transparent 100%)' }}
              />

              {/* Fire accent line at top of photo */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{ height: 3, background: 'linear-gradient(90deg, #f5a623, #ff6b35, #e8175d)' }}
              />

              {/* ── SOCIAL PILLS — overlaid on photo ── */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {[
                  { Icon: Instagram, label: '@mrxstudios' },
                  { Icon: Youtube,   label: 'MRX Studios' },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full px-3 py-1.5"
                    style={{
                      background: 'rgba(13,10,26,0.75)',
                      border: '1px solid rgba(245,166,35,0.25)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Icon size={12} style={{ color: '#f5a623', flexShrink: 0 }} />
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 10, fontWeight: 600,
                      color: 'rgba(255,255,255,0.7)',
                    }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── FLOATING EXPERIENCE BADGE ── */}
              <div
                className="absolute bottom-5 left-5 right-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(26,13,46,0.9), rgba(13,10,26,0.95))',
                  border: '1px solid rgba(245,166,35,0.25)',
                  backdropFilter: 'blur(16px)',
                  padding: '14px 16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                {/* Gold top-line */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    height: 2, width: '50%',
                    background: 'linear-gradient(90deg, transparent, #f5a623, transparent)',
                  }}
                />
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{
                      width: 44, height: 44,
                      background: 'linear-gradient(135deg, rgba(245,166,35,0.2), rgba(255,107,53,0.15))',
                      border: '1px solid rgba(245,166,35,0.35)',
                    }}
                  >
                    <Award size={20} style={{ color: '#f5a623' }} />
                  </div>
                  <div>
                    <p style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: 17, fontWeight: 700,
                      color: '#fff',
                    }}>
                      10+ Years of Mastery
                    </p>
                    <p style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 11, fontWeight: 500,
                      color: 'rgba(255,255,255,0.45)',
                      marginTop: 1,
                    }}>
                      Professional Choreographer · Founder
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative orblets outside the frame */}
            <div
              className="absolute -bottom-6 -left-6 rounded-full pointer-events-none"
              style={{ width: 120, height: 120, background: 'radial-gradient(circle, #f5a623 0%, transparent 70%)', opacity: 0.12, filter: 'blur(20px)' }}
            />
            <div
              className="absolute -top-6 -right-6 rounded-full pointer-events-none"
              style={{ width: 90, height: 90, background: 'radial-gradient(circle, #e8175d 0%, transparent 70%)', opacity: 0.12, filter: 'blur(16px)' }}
            />
          </div>

          {/* ══ RIGHT — CONTENT COLUMN ══ */}
          <div className="flex flex-col gap-7">

            {/* Bio paragraphs */}
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(15px, 1.8vw, 17px)',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.85,
            }}>
              With a passion for dance that ignited at the age of{' '}
              <span style={{ color: '#f5a623', fontWeight: 600 }}>8</span>, Ritesh More has dedicated
              his life to creating magical dance experiences. His journey from a young dancer to the
              founder of MRX Studios is a testament to his unwavering dedication to the art.
            </p>

            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 'clamp(15px, 1.8vw, 17px)',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.85,
            }}>
              Ritesh believes that every person has a dancer within them, waiting to be discovered.
              His teaching style focuses on making dance{' '}
              <span style={{ color: '#ff6b35', fontWeight: 600 }}>accessible, enjoyable, and unforgettable</span>
              {' '}— regardless of your experience level.
            </p>

            {/* ── SIGNATURE QUOTE ── */}
            <div
              className="relative rounded-2xl px-6 py-6 my-2"
              style={{
                background: 'linear-gradient(135deg, rgba(245,166,35,0.07), rgba(232,23,93,0.05))',
                border: '1px solid rgba(245,166,35,0.2)',
              }}
            >
              {/* Large decorative quote mark */}
              <span
                className="absolute top-0 left-5"
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 50, lineHeight: 1,
                  color: '#f5a623',
                  opacity: 0.20,
                  userSelect: 'none',
                }}
              >
                &ldquo;
              </span>
              <blockquote>
                <p style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: 'clamp(18px, 2.5vw, 22px)',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: 'rgba(255,240,210,0.92)',
                  lineHeight: 1.55,
                  marginBottom: 14,
                }}>
                  Dance is not about perfection, it&apos;s about expression. When you dance from
                  the heart, magic happens.
                </p>
                <cite style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12, fontWeight: 600,
                  fontStyle: 'normal',
                  letterSpacing: '0.08em',
                  color: '#f5a623',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ display: 'inline-block', width: 24, height: 1, background: '#f5a623', opacity: 0.6 }} />
                  RITESH MORE, FOUNDER
                </cite>
              </blockquote>
            </div>

            {/* ── CREDENTIALS GRID ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {credentials.map((cred) => (
                <div
                  key={cred.title}
                  className="group rounded-2xl p-4 transition-all duration-300"
                  style={{
                    background: 'rgba(26,13,46,0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.background = 'rgba(26,13,46,0.8)'
                    el.style.borderColor = `${cred.color}35`
                    el.style.boxShadow = `0 8px 30px ${cred.glow}`
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.background = 'rgba(26,13,46,0.5)'
                    el.style.borderColor = 'rgba(255,255,255,0.06)'
                    el.style.boxShadow = 'none'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon circle */}
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width: 40, height: 40,
                        background: `${cred.color}18`,
                        border: `1px solid ${cred.color}35`,
                      }}
                    >
                      <cred.icon size={18} style={{ color: cred.color }} />
                    </div>
                    <div>
                      <h4 style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 13, fontWeight: 700,
                        color: '#fff',
                        marginBottom: 4,
                      }}>
                        {cred.title}
                      </h4>
                      <p style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 11, fontWeight: 400,
                        color: 'rgba(255,255,255,0.45)',
                        lineHeight: 1.6,
                      }}>
                        {cred.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── BOOK CTA ── */}
            {/* ── BOOK CTA ── */}
{/* ── BOOK CTA ── */}
<div className="pt-6 border-t border-white/10">

  {/* Use SAME grid system as cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    {/* Primary CTA */}
    <a
      href="/booking"
      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl py-4"
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 15,
        fontWeight: 700,
        background: 'linear-gradient(135deg, #e8175d, #c0104a)',
        color: '#fff',
        textDecoration: 'none',
        boxShadow: '0 10px 32px rgba(232,23,93,0.45)',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 16px 48px rgba(232,23,93,0.65)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 10px 32px rgba(232,23,93,0.45)'
      }}
    >
      Book a Session with Ritesh
      <ChevronRight size={18} />
    </a>

    {/* Secondary CTA */}
    <a
      href="/portfolio"
      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl py-4"
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 14,
        fontWeight: 600,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(245,166,35,0.5)',
        color: '#f5a623',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'rgba(245,166,35,0.1)'
        el.style.borderColor = 'rgba(245,166,35,0.7)'
        el.style.boxShadow = '0 10px 28px rgba(245,166,35,0.25), inset 0 0 12px rgba(245,166,35,0.15)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.background = 'rgba(255,255,255,0.06)'
        el.style.borderColor = 'rgba(245,166,35,0.5)'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      See His Work
    </a>

  </div>

  {/* Micro-copy */}
  <p
    className="mt-3"
    style={{
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 11,
      color: 'rgba(255,255,255,0.4)',
    }}
  >

  </p>

</div>
          </div>
        </div>
      </div>

      {/* ── FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </section>
  )
}