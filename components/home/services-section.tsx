'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart, Building2, GraduationCap, Mic } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron  (primary)
//  Ember     #ff6b35   burnished orange
//  Crimson   #e8175d   celebration red
// ─────────────────────────────────────────────────────────────────────────────

const services = [
  {
    icon: Heart,
    title: 'Wedding Choreography',
    tagline: 'Your sangeet, your story.',
    description:
      'From intimate mehendis to grand reception entrances — we craft every beat to match the magic of your day.',
    href: '/services/weddings',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    features: ['Sangeet', 'Reception', 'Mehendi', 'Engagement'],
    accentColor: '#f5a623',
    glowColor: 'rgba(245,166,35,0.3)',
    badgeBg: 'rgba(245,166,35,0.15)',
    badgeBorder: 'rgba(245,166,35,0.4)',
    featured: true,
  },
  {
    icon: Building2,
    title: 'Corporate Events',
    tagline: 'Performance that moves teams.',
    description:
      'Electrify your annual day, product launch, or awards night with precision group choreography.',
    href: '/services/corporate',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    features: ['Annual Day', 'Team Building', 'Product Launch', 'Awards Night'],
    accentColor: '#ff6b35',
    glowColor: 'rgba(255,107,53,0.28)',
    badgeBg: 'rgba(255,107,53,0.15)',
    badgeBorder: 'rgba(255,107,53,0.4)',
    featured: false,
  },
  {
    icon: GraduationCap,
    title: 'College Events',
    tagline: 'Unleash the crowd.',
    description:
      'Dynamic flash mobs, group performances, and high-energy acts that become the highlight of every fest.',
    href: '/services/college',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    features: ['Freshers', 'Farewell', 'Annual Fest', 'Flash Mob'],
    accentColor: '#e8175d',
    glowColor: 'rgba(232,23,93,0.28)',
    badgeBg: 'rgba(232,23,93,0.15)',
    badgeBorder: 'rgba(232,23,93,0.4)',
    featured: false,
  },
  {
    icon: Mic,
    title: 'Audition Preparation',
    tagline: 'Get camera-ready.',
    description:
      'Expert coaching for reality shows, music videos, brand shoots, and film auditions.',
    href: '/services/auditions',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80',
    features: ['Reality Shows', 'Film', 'Music Video', 'Brand Shoots'],
    accentColor: '#f5a623',
    glowColor: 'rgba(245,166,35,0.28)',
    badgeBg: 'rgba(245,166,35,0.15)',
    badgeBorder: 'rgba(245,166,35,0.4)',
    featured: false,
  },
]

// ── CARD COMPONENT ────────────────────────────────────────────────────────────
function ServiceCard({
  service,
  index,
  forceFull,
}: {
  service: (typeof services)[number]
  index: number
  forceFull?: boolean
}) {
  const isFeatured = service.featured || forceFull

  return (
    <Link
      href={service.href}
      className={`group block relative rounded-3xl overflow-hidden service-card${isFeatured ? ' service-card--featured' : ''}`}
      style={{
        background: 'rgba(26,13,46,0.55)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.borderColor = `${service.accentColor}45`
        el.style.boxShadow = `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${service.glowColor}`
        el.style.transform = 'translateY(-5px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* ── IMAGE ── */}
      <div className={`relative overflow-hidden service-card__image${isFeatured ? ' service-card__image--featured' : ''}`}>
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
        />

        {/* Multi-layer gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(13,10,26,0.95) 0%, rgba(13,10,26,0.5) 45%, rgba(13,10,26,0.15) 100%)`,
          }}
        />
        {/* Accent colour wash from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${service.accentColor}22 0%, transparent 50%)`,
          }}
        />

        {/* ── ACCENT TOP BAR ── */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${service.accentColor}, ${service.accentColor}44, transparent)`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* ── ICON BADGE ── */}
        <div
          className="absolute top-4 left-4 flex items-center justify-center rounded-2xl"
          style={{
            width: 46, height: 46,
            background: service.badgeBg,
            border: `1px solid ${service.badgeBorder}`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 4px 20px ${service.glowColor}`,
            flexShrink: 0,
          }}
        >
          <service.icon size={20} style={{ color: service.accentColor }} />
        </div>

        {/* ── NUMBER WATERMARK ── */}
        <div
          className="absolute bottom-4 right-4"
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 72, fontWeight: 900,
            lineHeight: 1,
            color: '#fff',
            opacity: 0.04,
            userSelect: 'none',
            transition: 'opacity 0.3s ease',
          }}
        >
          0{index + 1}
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className={`relative service-card__body${isFeatured ? ' service-card__body--featured' : ''}`}>
        {/* Tagline */}
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: service.accentColor,
            marginBottom: 6,
            opacity: 0.9,
          }}
        >
          {service.tagline}
        </p>

        {/* Title */}
        <h3
          className={`service-card__title${isFeatured ? ' service-card__title--featured' : ''}`}
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            marginBottom: 10,
            transition: 'color 0.2s ease',
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            color: 'rgba(255,255,255,0.52)',
            lineHeight: 1.75,
            marginBottom: 16,
            maxWidth: isFeatured ? 560 : '100%',
          }}
        >
          {service.description}
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {service.features.map(f => (
            <span
              key={f}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.08em',
                padding: '4px 12px',
                borderRadius: 999,
                background: `${service.accentColor}12`,
                border: `1px solid ${service.accentColor}30`,
                color: service.accentColor,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${service.accentColor}30, transparent)`,
            marginBottom: 16,
          }}
        />

        {/* CTA link */}
        <div
          className="inline-flex items-center gap-2"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13, fontWeight: 700,
            color: service.accentColor,
            letterSpacing: '0.04em',
          }}
        >
          Explore {service.title.split(' ')[0]}
          <ArrowRight
            size={15}
            style={{ transition: 'transform 0.2s ease' }}
            className="group-hover:translate-x-2"
          />
        </div>
      </div>

      <style>{`
        .group:hover img { transform: scale(1.07); }
        .group:hover .top-bar { opacity: 1 !important; }
        .group:hover .num-wm { opacity: 0.08 !important; }
      `}</style>
    </Link>
  )
}

// ── MAIN SECTION ─────────────────────────────────────────────────────────────
export function ServicesSection() {
  return (
    <section
      className="relative overflow-hidden services-section"
      style={{ background: 'linear-gradient(180deg, #0d0a1a 0%, #0f0818 50%, #0d0a1a 100%)' }}
    >
      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 'min(650px, 120vw)',
            height: 'min(650px, 120vw)',
            top: '-5%', right: '-10%',
            background: 'radial-gradient(circle, #f5a623 0%, transparent 65%)',
            opacity: 0.05, filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 'min(500px, 100vw)',
            height: 'min(500px, 100vw)',
            bottom: '-5%', left: '-8%',
            background: 'radial-gradient(circle, #e8175d 0%, transparent 65%)',
            opacity: 0.06, filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl services-container">

        {/* ── SECTION HEADER ── */}
        <div className="text-center services-header">
          <div className="inline-flex items-center gap-2 services-eyebrow">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f5a623', boxShadow: '0 0 8px rgba(245,166,35,0.8)', flexShrink: 0 }} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#f5a623',
            }}>
              Our Services
            </span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8175d', boxShadow: '0 0 8px rgba(232,23,93,0.8)', flexShrink: 0 }} />
          </div>

          <h2 className="services-heading">
            Choreography for{' '}
            <span
              style={{
                background: 'linear-gradient(110deg, #f5a623 0%, #ff6b35 50%, #e8175d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.35))',
              }}
            >
              Every Occasion
            </span>
          </h2>

          <p className="services-subtext">
            From intimate celebrations to grand stages — expert choreography tailored to your vision, your people, your moment.
          </p>

          <div className="flex items-center justify-center gap-3 services-divider">
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(245,166,35,0.4))' }} />
            <div style={{ width: 6, height: 6, background: '#f5a623', transform: 'rotate(45deg)', borderRadius: 1, flexShrink: 0 }} />
            <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(245,166,35,0.4))' }} />
          </div>
        </div>

        {/* ── SERVICES GRID ── */}
        <div className="services-grid">
          {services.map((service, i) => {
            const isLast = i === services.length - 1
            return (
              <ServiceCard
                key={service.title}
                service={service}
                index={i}
                forceFull={isLast}
              />
            )
          })}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="text-center services-cta">
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 18,
              letterSpacing: '0.02em',
            }}
          >
            Not sure which service fits? Let's talk.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 rounded-2xl"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #e8175d, #c0104a)',
              color: '#fff',
              textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(232,23,93,0.4)',
              transition: 'all 0.25s ease',
              padding: '14px 28px',
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
            Book a Free Consultation
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── FONTS + RESPONSIVE STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ── Section ── */
        .services-section {
          padding: 56px 0 52px;
        }
        .services-container {
          padding: 0 16px;
        }

        /* ── Header ── */
        .services-header {
          margin-bottom: 40px;
        }
        .services-eyebrow {
          margin-bottom: 16px;
        }
        .services-heading {
          font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
          font-size: clamp(28px, 7vw, 64px);
          font-weight: 900;
          line-height: 1.08;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .services-subtext {
          font-family: "DM Sans", sans-serif;
          font-size: clamp(14px, 3vw, 17px);
          color: rgba(255,255,255,0.52);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.75;
        }
        .services-divider {
          margin-top: 20px;
        }

        /* ── Grid: single column on mobile ── */
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        /* ── Card defaults (mobile = all full width) ── */
        .service-card {
          /* no span override needed — single column */
        }
        .service-card__image {
          height: 200px;
        }
        .service-card__image--featured {
          height: 220px;
        }
        .service-card__body {
          padding: 20px 18px 22px;
        }
        .service-card__body--featured {
          padding: 20px 18px 22px;
        }
        .service-card__title {
          font-size: clamp(18px, 5vw, 24px);
        }
        .service-card__title--featured {
          font-size: clamp(20px, 5.5vw, 26px);
        }

        /* ── CTA ── */
        .services-cta {
          margin-top: 40px;
        }

        /* ── sm: 480px+ ── */
        @media (min-width: 480px) {
          .services-container {
            padding: 0 20px;
          }
          .services-grid {
            gap: 18px;
          }
          .service-card__image {
            height: 220px;
          }
          .service-card__image--featured {
            height: 250px;
          }
        }

        /* ── md: 640px+ — 2 columns, featured spans both ── */
        @media (min-width: 640px) {
          .services-section {
            padding: 72px 0 64px;
          }
          .services-container {
            padding: 0 28px;
          }
          .services-header {
            margin-bottom: 48px;
          }
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .service-card--featured {
            grid-column: span 2;
          }
          .service-card__image {
            height: 220px;
          }
          .service-card__image--featured {
            height: 300px;
          }
          .service-card__body {
            padding: 22px 24px 24px;
          }
          .service-card__body--featured {
            padding: 24px 28px 26px;
          }
          .service-card__title {
            font-size: clamp(19px, 2.5vw, 24px);
          }
          .service-card__title--featured {
            font-size: clamp(22px, 3vw, 30px);
          }
          .services-cta {
            margin-top: 48px;
          }
        }

        /* ── lg: 1024px+ ── */
        @media (min-width: 1024px) {
          .services-section {
            padding: 112px 0 96px;
          }
          .services-container {
            padding: 0 48px;
          }
          .services-header {
            margin-bottom: 56px;
          }
          .services-grid {
            gap: 24px;
          }
          .service-card__image {
            height: 240px;
          }
          .service-card__image--featured {
            height: 340px;
          }
          .service-card__body {
            padding: 20px 22px 22px;
          }
          .service-card__body--featured {
            padding: 24px 28px 26px;
          }
          .service-card__title {
            font-size: clamp(20px, 2.5vw, 26px);
          }
          .service-card__title--featured {
            font-size: clamp(24px, 3vw, 32px);
          }
          .services-cta {
            margin-top: 56px;
          }
        }

        /* ── xl: 1280px+ ── */
        @media (min-width: 1280px) {
          .services-container {
            padding: 0 48px;
          }
          .services-grid {
            gap: 28px;
          }
        }
      `}</style>
    </section>
  )
}