'use client'

import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black  (night sky)
//  Surface   #1a0d2e   rich plum          (cards / overlays)
//  Marigold  #f5a623   warm saffron       (primary gold)
//  Ember     #ff6b35   burnished orange   (mid accent)
//  Crimson   #e8175d   celebration red    (CTA energy)
//  Text      #fff / rgba(255,255,255,0.62)
// ─────────────────────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── BASE ── */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, #0d0a1a 0%, #150920 45%, #0d1220 100%)' }}
      />

      {/* ── FULL-BLEED PERFORMANCE PHOTO ── */}
      {/* Replace src with your actual performance image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          style={{ opacity: 0.35 }}
        />
      </div>

      {/* ── LAYERED OVERLAYS ── */}
      {/* Bottom-up vignette for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, #0d0a1a 0%, rgba(13,10,26,0.72) 42%, rgba(13,10,26,0.18) 100%)',
        }}
      />
      {/* Left marigold colour wash */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(100deg, rgba(245,166,35,0.18) 0%, transparent 55%)',
        }}
      />
      {/* Top nav darkening */}
      <div
        className="absolute top-0 left-0 right-0 h-36"
        style={{ background: 'linear-gradient(to bottom, rgba(13,10,26,0.9), transparent)' }}
      />

      {/* ── AMBIENT GLOW ORBS ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 560, height: 560,
            top: -120, left: -100,
            background: 'radial-gradient(circle, #f5a623 0%, transparent 68%)',
            opacity: 0.18, filter: 'blur(40px)',
            animation: 'mrxFloat 9s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 480, height: 480,
            bottom: -110, right: -80,
            background: 'radial-gradient(circle, #e8175d 0%, transparent 68%)',
            opacity: 0.16, filter: 'blur(40px)',
            animation: 'mrxFloat 11s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 320,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(ellipse, #ff6b35 0%, transparent 65%)',
            opacity: 0.07, filter: 'blur(60px)',
            animation: 'mrxFloat 14s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── SPOTLIGHT BEAM ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 130, height: '48%',
          background: 'linear-gradient(to bottom, rgba(245,166,35,0.22), transparent)',
          filter: 'blur(22px)',
        }}
      />

      {/* ═══════════════════════ MAIN CONTENT ═══════════════════════ */}
      <div className="relative z-10 mx-auto max-w-6xl w-full px-5 sm:px-8 lg:px-12 py-32 text-center">

        {/* ── BADGE ── */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-10"
          style={{
            background: 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(232,23,93,0.12))',
            border: '1px solid rgba(245,166,35,0.38)',
            backdropFilter: 'blur(14px)',
            animation: 'mrxFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          <span
            style={{
              display: 'inline-block', width: 7, height: 7,
              background: '#f5a623', transform: 'rotate(45deg)',
              borderRadius: 1, boxShadow: '0 0 8px rgba(245,166,35,0.8)',
            }}
          />
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.17em', textTransform: 'uppercase',
              color: '#f5a623',
            }}
          >
            Premium Choreography Studio
          </span>
          <span
            style={{
              display: 'inline-block', width: 7, height: 7,
              background: '#e8175d', transform: 'rotate(45deg)',
              borderRadius: 1, boxShadow: '0 0 8px rgba(232,23,93,0.8)',
            }}
          />
        </div>

        {/* ── HEADLINE ── */}
        <h1
          style={{
            marginBottom: 28,
            animation: 'mrxFadeUp 0.72s cubic-bezier(0.22,1,0.36,1) 0.1s both',
          }}
        >
          <span
            className="block"
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: 'clamp(42px, 7vw, 80px)',
              fontWeight: 700, lineHeight: 1.08,
              color: '#fff',
              textShadow: '0 2px 40px rgba(13,10,26,0.8)',
              letterSpacing: '-0.01em',
            }}
          >
            We Don't Just
          </span>

          {/* Fire gradient — the hero word */}
          <span
            className="block"
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: 'clamp(58px, 10vw, 112px)',
              fontWeight: 900, lineHeight: 1.15,
              background: 'linear-gradient(110deg, #f5a623 0%, #ff6b35 45%, #e8175d 85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 32px rgba(245,166,35,0.45))',
              letterSpacing: '-0.02em',
            }}
          >
            Choreograph
          </span>

          <span
            className="block"
            style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: 'clamp(38px, 6.5vw, 74px)',
              fontWeight: 700, lineHeight: 1.12,
              color: 'rgba(255,240,210,0.92)',
              textShadow: '0 0 50px rgba(245,166,35,0.3)',
              letterSpacing: '-0.01em',
              marginTop: 4,
            }}
          >
            We Transform You.
          </span>
        </h1>

        {/* ── SUBHEADING ── */}
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 'clamp(15px, 2.2vw, 18px)',
            color: 'rgba(255,255,255,0.62)',
            maxWidth: 580, margin: '0 auto 36px',
            lineHeight: 1.8,
            animation: 'mrxFadeUp 0.72s cubic-bezier(0.22,1,0.36,1) 0.22s both',
          }}
        >
          From intimate{' '}
          <span style={{ color: '#f5a623', fontWeight: 600 }}>wedding sangeets</span>{' '}
          to grand corporate galas — MRX Studios crafts performances that{' '}
          <span style={{ color: '#ff6b35', fontWeight: 600 }}>stop the room</span>{' '}
          and live in memory forever.
        </p>

        {/* ── CTAs ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          style={{ animation: 'mrxFadeUp 0.72s cubic-bezier(0.22,1,0.36,1) 0.34s both' }}
        >
          {/* Primary — crimson fire */}
          <Link href="/booking" className="group">
            <button
              className="relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 text-white"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 16, fontWeight: 700,
                background: 'linear-gradient(135deg, #e8175d 0%, #c0104a 60%, #a00840 100%)',
                boxShadow:
                  '0 0 0 1px rgba(232,23,93,0.35), 0 8px 28px rgba(232,23,93,0.45), 0 2px 8px rgba(0,0,0,0.4)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.boxShadow =
                  '0 0 0 1px rgba(232,23,93,0.55), 0 14px 42px rgba(232,23,93,0.65), 0 4px 12px rgba(0,0,0,0.5)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.boxShadow =
                  '0 0 0 1px rgba(232,23,93,0.35), 0 8px 28px rgba(232,23,93,0.45), 0 2px 8px rgba(0,0,0,0.4)'
                el.style.transform = 'translateY(0)'
              }}
            >
              Book Your Performance
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </button>
          </Link>

          {/* Secondary — glass + marigold hover */}
          <button
            className="inline-flex items-center gap-3 rounded-2xl px-8 py-4"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 16, fontWeight: 500,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(245,166,35,0.25)',
              color: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(14px)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(245,166,35,0.1)'
              el.style.borderColor = 'rgba(245,166,35,0.55)'
              el.style.color = '#f5a623'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = 'rgba(255,255,255,0.06)'
              el.style.borderColor = 'rgba(245,166,35,0.25)'
              el.style.color = 'rgba(255,255,255,0.85)'
            }}
          >
            <span
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: 32, height: 32,
                background: 'rgba(245,166,35,0.12)',
                border: '1px solid rgba(245,166,35,0.4)',
              }}
            >
              <Play size={12} fill="#f5a623" stroke="none" style={{ marginLeft: 2 }} />
            </span>
            Watch Showreel
          </button>
        </div>

        {/* ── STATS BAR ── */}
        <div
          className="relative rounded-2xl"
          style={{
            padding: '24px 32px',
            background:
              'linear-gradient(135deg, rgba(26,13,46,0.75) 0%, rgba(13,10,26,0.85) 100%)',
            border: '1px solid rgba(245,166,35,0.18)',
            backdropFilter: 'blur(24px)',
            boxShadow:
              '0 0 60px rgba(245,166,35,0.07), 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(245,166,35,0.1)',
            animation: 'mrxFadeUp 0.72s cubic-bezier(0.22,1,0.36,1) 0.48s both',
          }}
        >
          {/* Marigold→ember top-line accent */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              height: 2, width: '42%',
              background: 'linear-gradient(90deg, transparent, #f5a623, #ff6b35, transparent)',
            }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Events Choreographed', color: '#f5a623', glow: 'rgba(245,166,35,0.55)' },
              { value: '10+',  label: 'Years of Mastery',     color: '#ff6b35', glow: 'rgba(255,107,53,0.55)' },
              { value: '50+',  label: 'Trained Artists',      color: '#e8175d', glow: 'rgba(232,23,93,0.55)'  },
              { value: '98%',  label: 'Happy Clients',        color: '#f5a623', glow: 'rgba(245,166,35,0.55)' },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center relative">
                {i < 3 && (
                  <div
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2"
                    style={{ width: 1, height: 40, background: 'rgba(245,166,35,0.12)' }}
                  />
                )}
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(28px, 4vw, 38px)',
                    fontWeight: 900, lineHeight: 1,
                    color: stat.color,
                    textShadow: `0 0 24px ${stat.glow}`,
                    marginBottom: 6,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 11, fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.42)',
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center">
        <div
          className="flex items-start justify-center rounded-full"
          style={{
            width: 24, height: 38,
            border: '1.5px solid rgba(245,166,35,0.32)',
            padding: '6px 0 0',
          }}
        >
          <div
            style={{
              width: 4, height: 10, borderRadius: 2,
              background: 'linear-gradient(to bottom, #f5a623, #ff6b35)',
              animation: 'mrxScrollDot 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ── KEYFRAMES + FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes mrxFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes mrxFloat {
          0%,100% { transform: translate(0,0) scale(1);           }
          33%      { transform: translate(28px,-22px) scale(1.04); }
          66%      { transform: translate(-18px,16px) scale(0.97); }
        }
        @keyframes mrxBounce {
          0%,100% { transform: translateX(-50%) translateY(0);    }
          50%      { transform: translateX(-50%) translateY(-7px); }
        }
        @keyframes mrxScrollDot {
          0%,100% { transform: translateY(0);   opacity: 0.75; }
          50%      { transform: translateY(8px); opacity: 0.2;  }
        }
      `}</style>
    </section>
  )
}