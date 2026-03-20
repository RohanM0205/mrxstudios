'use client'

import Link from 'next/link'
import { ArrowRight, Phone, MessageCircle } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron (primary)
//  Ember     #ff6b35   burnished orange
//  Crimson   #e8175d   celebration red
// ─────────────────────────────────────────────────────────────────────────────

const trustBadges = [
  { label: '5-Star Google Reviews',       icon: '★' },
  { label: 'Featured in Wedding Magazines', icon: '✦' },
  { label: 'Celebrity Clientele',          icon: '◆' },
]

export function CTASection() {
  return (
    <section
      className="relative py-32 overflow-hidden text-white"
      style={{ background: 'linear-gradient(160deg, #0d0a1a 0%, #1a0830 40%, #200a18 70%, #0d0a1a 100%)' }}
    >
      {/* ── LARGE BACKGROUND GLOW ORBS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Marigold — centre-top bloom */}
        <div
          className="absolute rounded-full"
          style={{
            width: 900, height: 900,
            top: '-30%', left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, #f5a623 0%, transparent 60%)',
            opacity: 0.09, filter: 'blur(80px)',
          }}
        />
        {/* Crimson — bottom-left */}
        <div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            bottom: '-20%', left: '-8%',
            background: 'radial-gradient(circle, #e8175d 0%, transparent 65%)',
            opacity: 0.1, filter: 'blur(70px)',
          }}
        />
        {/* Ember — bottom-right */}
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: '-15%', right: '-8%',
            background: 'radial-gradient(circle, #ff6b35 0%, transparent 65%)',
            opacity: 0.08, filter: 'blur(70px)',
          }}
        />

        {/* ── ANIMATED FLOATING PARTICLES ── */}
        {[
          { size: 3,  top: '12%',  left: '8%',   dur: '7s',  del: '0s',   color: '#f5a623' },
          { size: 2,  top: '25%',  left: '18%',  dur: '9s',  del: '1s',   color: '#ff6b35' },
          { size: 4,  top: '8%',   left: '35%',  dur: '8s',  del: '2s',   color: '#f5a623' },
          { size: 2,  top: '18%',  right: '22%', dur: '11s', del: '0.5s', color: '#e8175d' },
          { size: 3,  top: '35%',  right: '10%', dur: '7s',  del: '3s',   color: '#f5a623' },
          { size: 2,  bottom: '30%', left: '12%',  dur: '9s',  del: '1.5s', color: '#ff6b35' },
          { size: 3,  bottom: '20%', left: '30%',  dur: '8s',  del: '2.5s', color: '#e8175d' },
          { size: 2,  bottom: '28%', right: '15%', dur: '10s', del: '0.8s', color: '#f5a623' },
          { size: 4,  top: '55%',  left: '5%',   dur: '12s', del: '1s',   color: '#ff6b35' },
          { size: 2,  top: '60%',  right: '6%',  dur: '9s',  del: '3.5s', color: '#f5a623' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size, height: p.size,
              top: p.top, left: (p as any).left, right: (p as any).right, bottom: (p as any).bottom,
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animation: `mrxParticle ${p.dur} ease-in-out ${p.del} infinite`,
              opacity: 0.7,
            }}
          />
        ))}

        {/* ── DIAGONAL LIGHT STREAK ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, left: '50%',
            width: 1, height: '100%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,166,35,0.12) 30%, rgba(255,107,53,0.08) 70%, transparent 100%)',
            filter: 'blur(8px)',
            transform: 'translateX(-50%) rotate(-15deg) scaleX(60)',
            opacity: 0.5,
          }}
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8 lg:px-12 text-center">

        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-10"
          style={{
            background: 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(232,23,93,0.12))',
            border: '1px solid rgba(245,166,35,0.38)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <span style={{ display: 'inline-block', width: 7, height: 7, background: '#f5a623', transform: 'rotate(45deg)', borderRadius: 1, boxShadow: '0 0 8px rgba(245,166,35,0.8)' }} />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.17em', textTransform: 'uppercase', color: '#f5a623' }}>
            Your Stage Awaits
          </span>
          <span style={{ display: 'inline-block', width: 7, height: 7, background: '#e8175d', transform: 'rotate(45deg)', borderRadius: 1, boxShadow: '0 0 8px rgba(232,23,93,0.8)' }} />
        </div>

        {/* ── HEADLINE ── */}
        <h2
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontWeight: 900, lineHeight: 1.08,
            letterSpacing: '-0.02em',
            marginBottom: 22,
          }}
        >
          <span
            className="block"
            style={{ fontSize: 'clamp(40px, 7vw, 78px)', color: '#fff', textShadow: '0 2px 40px rgba(13,10,26,0.8)' }}
          >
            Ready to Create Your
          </span>
          <span
            className="block"
            style={{
              fontSize: 'clamp(48px, 8.5vw, 96px)',
              background: 'linear-gradient(110deg, #f5a623 0%, #ff6b35 45%, #e8175d 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(245,166,35,0.5))',
              lineHeight: 1.0,
            }}
          >
            Dance Story?
          </span>
        </h2>

        {/* Subheading */}
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 'clamp(15px, 2.2vw, 19px)',
            color: 'rgba(255,255,255,0.62)',
            maxWidth: 560, margin: '0 auto 44px',
            lineHeight: 1.8,
          }}
        >
          Whether it&apos;s your{' '}
          <span style={{ color: '#f5a623', fontWeight: 600 }}>wedding</span>,{' '}
          a{' '}
          <span style={{ color: '#ff6b35', fontWeight: 600 }}>corporate event</span>,{' '}
          or preparing for the{' '}
          <span style={{ color: '#e8175d', fontWeight: 600 }}>stage</span>{' '}
          — we're here to make your dance dreams come true.
        </p>

        {/* ── PRIMARY CTAs ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">

          {/* Book session — crimson fire */}
          <Link
            href="/booking"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-9 py-5 text-white"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 16, fontWeight: 700,
              background: 'linear-gradient(135deg, #e8175d 0%, #c0104a 60%, #a00840 100%)',
              boxShadow: '0 0 0 1px rgba(232,23,93,0.4), 0 10px 36px rgba(232,23,93,0.5), 0 2px 8px rgba(0,0,0,0.4)',
              transition: 'all 0.25s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow = '0 0 0 1px rgba(232,23,93,0.6), 0 16px 50px rgba(232,23,93,0.7), 0 4px 12px rgba(0,0,0,0.5)'
              el.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow = '0 0 0 1px rgba(232,23,93,0.4), 0 10px 36px rgba(232,23,93,0.5), 0 2px 8px rgba(0,0,0,0.4)'
              el.style.transform = 'translateY(0)'
            }}
          >
            {/* Shimmer sweep */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.55s ease',
              }}
            />
            Book Your Session
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>

          {/* WhatsApp — marigold glass */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl px-9 py-5"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 16, fontWeight: 600,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(245,166,35,0.3)',
              color: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(14px)',
              transition: 'all 0.25s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'rgba(245,166,35,0.1)'
              el.style.borderColor = 'rgba(245,166,35,0.55)'
              el.style.color = '#f5a623'
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 8px 28px rgba(245,166,35,0.2)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'rgba(255,255,255,0.06)'
              el.style.borderColor = 'rgba(245,166,35,0.3)'
              el.style.color = 'rgba(255,255,255,0.88)'
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            {/* WhatsApp SVG icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* ── CONTACT INFO ROW ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-16"
        >
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-2 transition-all duration-200"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#f5a623')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
          >
            <Phone size={14} />
            +91 98765 43210
          </a>

          {/* Dot separator */}
          <span
            className="hidden sm:block rounded-full"
            style={{ width: 3, height: 3, background: 'rgba(245,166,35,0.4)' }}
          />

          <a
            href="mailto:hello@mrxstudios.com"
            className="transition-all duration-200"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#f5a623')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
          >
            hello@mrxstudios.com
          </a>
        </div>

        {/* ── TRUST SECTION ── */}
        <div
          className="pt-10"
          style={{ borderTop: '1px solid rgba(245,166,35,0.12)' }}
        >
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12, fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: 20,
            }}
          >
            Trusted by 500+ happy clients across India
          </p>

          <div className="flex items-center justify-center flex-wrap gap-6 sm:gap-10">
            {trustBadges.map((badge, i) => (
              <div
                key={badge.label}
                className="flex items-center gap-2.5"
              >
                <span
                  style={{
                    color: i === 0 ? '#f5a623' : i === 1 ? '#ff6b35' : '#e8175d',
                    fontSize: 14,
                    textShadow: `0 0 8px ${i === 0 ? 'rgba(245,166,35,0.8)' : i === 1 ? 'rgba(255,107,53,0.8)' : 'rgba(232,23,93,0.8)'}`,
                  }}
                >
                  {badge.icon}
                </span>
                <span
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 13, fontWeight: 500,
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes mrxParticle {
          0%, 100% { transform: translateY(0px) scale(1);   opacity: 0.7; }
          33%       { transform: translateY(-18px) scale(1.3); opacity: 1;   }
          66%       { transform: translateY(-8px)  scale(0.8); opacity: 0.4; }
        }
      `}</style>
    </section>
  )
}