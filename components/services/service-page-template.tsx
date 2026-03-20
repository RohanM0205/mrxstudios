'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Check, Sparkles, MessageCircle,
  Heart, Building2, GraduationCap, Mic,
  Star, Music, Trophy,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

const ICON_MAP = {
  Heart, Building2, GraduationCap, Mic, Star, Music, Trophy, Sparkles,
} as const

export type ServiceIconKey = keyof typeof ICON_MAP

interface ServiceFeature { title: string; description: string }
interface ServicePackage {
  name: string; price: string; sessions: number; features: string[]; popular?: boolean
}
export interface ServicePageProps {
  icon: ServiceIconKey
  title: string
  subtitle: string
  description: string
  heroImage: string
  features: ServiceFeature[]
  subtypes: { name: string; description: string }[]
  packages: ServicePackage[]
  gallery: { url: string; caption: string }[]
  color: string
}

// ── Shared section header ─────────────────────────────────────────────────────
function SectionHeader({
  eyebrow, heading, sub, accentColor = '#f5a623', light = false,
}: {
  eyebrow: string
  heading: React.ReactNode
  sub?: string
  accentColor?: string
  light?: boolean
}) {
  return (
    <div className="sph-wrap">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: accentColor, boxShadow: `0 0 8px ${accentColor}cc` }} />
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accentColor }}>
          {eyebrow}
        </span>
        <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: '#e8175d', boxShadow: '0 0 8px rgba(232,23,93,0.8)' }} />
      </div>
      <h2 style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif', fontSize: 'clamp(26px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.08, color: '#fff', letterSpacing: '-0.02em', marginBottom: sub ? 14 : 0 }}>
        {heading}
      </h2>
      {sub && (
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(14px, 2vw, 17px)', color: light ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.52)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
          {sub}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
        <div style={{ height: 1, width: 52, background: `linear-gradient(to right, transparent, ${accentColor}55)` }} />
        <div style={{ width: 6, height: 6, background: accentColor, transform: 'rotate(45deg)', borderRadius: 1 }} />
        <div style={{ height: 1, width: 52, background: `linear-gradient(to left, transparent, ${accentColor}55)` }} />
      </div>
      <style>{`.sph-wrap { text-align: center; margin-bottom: clamp(36px, 5vw, 60px); }`}</style>
    </div>
  )
}

// ── Gallery item component ────────────────────────────────────────────────────
function GalleryItem({
  item, cellClass, color,
}: {
  item: { url: string; caption: string }
  cellClass: string
  color: string
}) {
  return (
    <div
      className={`gallery-item ${cellClass}`}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = `${color}50`
        el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${color}20`
        el.style.transform = 'scale(1.015)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = 'none'
        el.style.transform = 'scale(1)'
      }}
    >
      <Image
        src={item.url}
        alt={item.caption}
        fill
        className="object-cover gallery-img"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement
          img.style.display = 'none'
          const parent = img.closest('.gallery-item') as HTMLDivElement | null
          if (parent && !parent.querySelector('.gallery-ph')) {
            parent.style.background = 'linear-gradient(135deg, rgba(28,12,46,0.98), rgba(13,10,26,0.99))'
            const ph = document.createElement('div')
            ph.className = 'gallery-ph'
            ph.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0.25'
            ph.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span style="font-family:DM Sans,sans-serif;font-size:11px;font-weight:600;color:#fff;letter-spacing:.06em;text-transform:uppercase;text-align:center;padding:0 12px">${item.caption}</span>`
            parent.appendChild(ph)
          }
        }}
      />
      {/* Always-on gradient for caption legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,10,26,0.9) 0%, rgba(13,10,26,0.25) 45%, transparent 100%)', pointerEvents: 'none' }} />
      {/* Colour wash on hover */}
      <div className="g-tint" style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${color}28 0%, transparent 55%)`, opacity: 0, transition: 'opacity 0.35s ease', pointerEvents: 'none' }} />
      {/* Caption */}
      <div className="g-caption">
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(11px, 1.2vw, 13px)', fontWeight: 600, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.8)', margin: 0, lineHeight: 1.3 }}>
          {item.caption}
        </p>
      </div>
    </div>
  )
}

// ── Main template ─────────────────────────────────────────────────────────────
export function ServicePageTemplate({
  icon, title, subtitle, description, heroImage,
  features, subtypes, packages, gallery, color,
}: ServicePageProps) {
  const Icon = ICON_MAP[icon] ?? Sparkles

  // Bento cell classes for up to 6 items
  // Layout:
  //   Row 1: [0 wide 2×1][1 tall 1×2]
  //   Row 2: [2 norm 1×1][3 norm 1×1][1 cont.]
  //   The remaining items (4,5) fall into auto-placed 1×1 cells
  // Bento layout — 3 cols, perfectly fills 6 items with no empty cells:
  //   Row 1: [0: wide 2×1][1: norm 1×1]
  //   Row 2: [2: norm 1×1][3: norm 1×1][4: norm 1×1]
  //   Row 3: [5: wide 2×1] fills cols 1-2, col 3 stays empty for a "View all" card
  // Actually cleanest for 6 items: 2 × (wide + norm) + 1 row of 3
  //   Row 1: [0 wide 2×1][1 norm 1×1]       = 3 cols used ✓
  //   Row 2: [2 norm 1×1][3 wide 2×1]        = 3 cols used ✓
  //   Row 3: [4 norm 1×1][5 norm 1×1][cta]   = 2 items + CTA card ✓
  const cellClasses = ['g-wide', 'g-norm', 'g-norm', 'g-wide', 'g-norm', 'g-norm']

  return (
    <main style={{ minHeight: '100vh', background: '#0d0a1a' }}>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="hero-section">
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image src={heroImage} alt={title} fill className="object-cover object-center" style={{ opacity: 0.42 }} priority />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,10,26,0.97) 0%, rgba(13,10,26,0.72) 55%, rgba(13,10,26,0.15) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${color}22 0%, transparent 60%)` }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to bottom, rgba(13,10,26,0.95), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: 'linear-gradient(to top, #0d0a1a, transparent)' }} />
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', width: 'clamp(200px, 40vw, 500px)', height: 'clamp(200px, 40vw, 500px)', top: '-10%', left: '-8%', background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity: 0.1, filter: 'blur(60px)' }} />

        <div className="hero-content-wrap">
          <div className="hero-content">
            <div className="hero-badge" style={{ background: `${color}18`, border: `1px solid ${color}45` }}>
              <Icon size={15} style={{ color, flexShrink: 0 }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
                {subtitle}
              </span>
            </div>
            <h1 className="hero-title">
              {title.split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} style={{ background: `linear-gradient(110deg, ${color} 0%, #ff6b35 50%, #e8175d 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: `drop-shadow(0 0 28px ${color}60)` }}>
                    {' '}{word}
                  </span>
                ) : word + ' '
              )}
            </h1>
            <p className="hero-desc">{description}</p>
            <div className="hero-ctas">
              <Link href="/booking" className="hero-cta-primary"
                style={{ background: 'linear-gradient(135deg, #e8175d, #c0104a)', boxShadow: '0 8px 28px rgba(232,23,93,0.45)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 14px 40px rgba(232,23,93,0.65)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 28px rgba(232,23,93,0.45)' }}
              >
                Book Now <ArrowRight size={16} />
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hero-cta-secondary"
                style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}35` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `${color}14`; el.style.borderColor = `${color}60`; el.style.color = color }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(255,255,255,0.06)'; el.style.borderColor = `${color}35`; el.style.color = 'rgba(255,255,255,0.85)' }}
              >
                <MessageCircle size={15} style={{ flexShrink: 0 }} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="hero-scroll-line" style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }} />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          EVENT TYPES
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-base" style={{ background: 'linear-gradient(180deg, #0d0a1a 0%, #0f0818 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(245,166,35,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="section-inner">
          <SectionHeader
            eyebrow="What We Offer"
            heading={<>Event{' '}<span style={{ background: `linear-gradient(110deg, ${color}, #ff6b35)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Types</span></>}
            accentColor={color}
          />
          <div className="subtypes-grid">
            {subtypes.map((subtype, i) => (
              <div key={subtype.name} className="subtype-card"
                style={{ background: 'linear-gradient(160deg, rgba(26,13,46,0.7), rgba(13,10,26,0.85))', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${color}40`; el.style.boxShadow = `0 16px 40px rgba(0,0,0,0.4), 0 0 30px ${color}18`; el.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.55 }} />
                <span style={{ position: 'absolute', bottom: 10, right: 14, fontFamily: '"Cormorant Garamond", serif', fontSize: 48, fontWeight: 900, lineHeight: 1, color: '#fff', opacity: 0.045, userSelect: 'none', pointerEvents: 'none' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(17px, 2.2vw, 21px)', fontWeight: 700, color: '#fff', marginBottom: 10, lineHeight: 1.2 }}>
                  {subtype.name}
                </h3>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(12px, 1.4vw, 13px)', color: 'rgba(255,255,255,0.52)', lineHeight: 1.75, margin: 0 }}>
                  {subtype.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-base" style={{ background: 'linear-gradient(180deg, #0f0818 0%, #0d0a1a 100%)' }}>
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', width: 'clamp(200px, 40vw, 500px)', height: 'clamp(200px, 40vw, 500px)', bottom: '-15%', right: '-8%', background: `radial-gradient(circle, ${color} 0%, transparent 65%)`, opacity: 0.06, filter: 'blur(80px)' }} />
        <div className="section-inner">
          <SectionHeader
            eyebrow="Why Choose Us"
            heading={<>What Makes Us{' '}<span style={{ background: 'linear-gradient(110deg, #f5a623, #ff6b35, #e8175d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Special</span></>}
            accentColor={color}
          />
          <div className="features-grid">
            {features.map((feature, index) => {
              const ac = (['#f5a623', '#ff6b35', '#e8175d'] as const)[index % 3]
              return (
                <div key={index} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ac}15`, border: `1px solid ${ac}30` }}>
                    <Sparkles size={18} style={{ color: ac }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(13px, 1.6vw, 15px)', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(12px, 1.4vw, 13px)', color: 'rgba(255,255,255,0.52)', lineHeight: 1.75, margin: 0 }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PACKAGES
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-base" style={{ background: 'linear-gradient(180deg, #0d0a1a 0%, #130a1e 50%, #0d0a1a 100%)' }}>
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', width: 'min(60vw, 800px)', height: 'min(60vw, 800px)', top: '-15%', left: '50%', transform: 'translateX(-50%)', background: `radial-gradient(circle, ${color} 0%, transparent 65%)`, opacity: 0.06, filter: 'blur(80px)' }} />
        <div className="section-inner">
          <SectionHeader
            eyebrow="Pricing"
            heading={<>Choose Your{' '}<span style={{ background: `linear-gradient(110deg, ${color}, #ff6b35)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Package</span></>}
            sub="Flexible packages designed to meet your needs and budget."
            accentColor={color}
            light
          />
          <div className="packages-grid">
            {packages.map((pkg) => (
              <div key={pkg.name}
                className={`pkg-card${pkg.popular ? ' pkg-card--popular' : ''}`}
                style={{
                  background: pkg.popular ? `linear-gradient(160deg, ${color}25, rgba(26,13,46,0.9))` : 'linear-gradient(160deg, rgba(26,13,46,0.7), rgba(13,10,26,0.9))',
                  border: pkg.popular ? `1px solid ${color}60` : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: pkg.popular ? `0 0 50px ${color}20, 0 20px 60px rgba(0,0,0,0.5)` : '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                {pkg.popular && (
                  <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    background: `linear-gradient(135deg, ${color}, #ff6b35)`,
                    boxShadow: `0 4px 16px ${color}50`,
                    borderRadius: 999, padding: '3px 12px', whiteSpace: 'nowrap',
                    fontFamily: '"DM Sans", sans-serif', fontSize: '9px', fontWeight: 700,
                    lineHeight: '1.7', letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: '#0d0a1a',
                  }}>
                    Most Popular
                  </div>
                )}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '22px 22px 0 0', background: pkg.popular ? `linear-gradient(90deg, transparent, ${color}, #ff6b35, transparent)` : 'transparent' }} />
                <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(20px, 2.8vw, 26px)', fontWeight: 900, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
                  {pkg.name}
                </h3>
                <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: pkg.popular ? color : '#fff', textShadow: pkg.popular ? `0 0 20px ${color}60` : 'none', display: 'block', marginBottom: 4 }}>
                  {pkg.price}
                </span>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.42)', marginBottom: 20 }}>
                  {pkg.sessions} sessions included
                </p>
                <div style={{ height: 1, background: `linear-gradient(90deg, ${color}30, transparent)`, marginBottom: 18 }} />
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, listStyle: 'none', padding: 0 }}>
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: `${color}20`, border: `1px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={10} style={{ color }} />
                      </div>
                      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(12px, 1.4vw, 13px)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/booking"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.02em', background: pkg.popular ? `linear-gradient(135deg, ${color}, #c0104a)` : 'rgba(255,255,255,0.06)', border: pkg.popular ? 'none' : `1px solid ${color}35`, color: pkg.popular ? '#fff' : color, boxShadow: pkg.popular ? `0 6px 22px ${color}40` : 'none', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = pkg.popular ? `0 10px 32px ${color}60` : `0 6px 20px ${color}25` }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = pkg.popular ? `0 6px 22px ${color}40` : 'none' }}
                >
                  Get Started <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          GALLERY — Bento grid (explicit cell placement)
          Desktop 3-col layout:
            [0: wide 2×1  ][1: tall 1×2]
            [2: norm 1×1  ][3: norm 1×1][1 cont.]
            [4: norm 1×1  ][5: norm 1×1][     ]
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-base" style={{ background: 'linear-gradient(180deg, #0d0a1a 0%, #0f0818 100%)' }}>
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', width: 'clamp(300px, 50vw, 700px)', height: 'clamp(300px, 50vw, 700px)', top: '10%', left: '50%', transform: 'translateX(-50%)', background: `radial-gradient(circle, ${color} 0%, transparent 65%)`, opacity: 0.04, filter: 'blur(80px)' }} />
        <div className="section-inner">
          <SectionHeader
            eyebrow="Our Work"
            heading={<>Recent{' '}<span style={{ background: `linear-gradient(110deg, ${color}, #e8175d)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Performances</span></>}
            accentColor={color}
          />

          {/* ── BENTO GRID ──
               Row 1: [0 wide 2×1][1 norm]
               Row 2: [2 norm    ][3 wide 2×1]
               Row 3: [4 norm    ][5 norm    ][CTA tile]
               All 9 cells filled — zero empty space.           */}
          <div className="gallery-bento">
            {gallery.slice(0, 6).map((item, index) => (
              <GalleryItem
                key={index}
                item={item}
                color={color}
                cellClass={cellClasses[index] ?? 'g-norm'}
              />
            ))}

            {/* Slot 7 — CTA tile (fills the last empty cell perfectly) */}
            <Link href="/portfolio" className="gallery-cta-tile">
              <div className="gallery-cta-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${color}35 0%, transparent 70%)` }} />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, padding: 24, textAlign: 'center' }}>
                {/* Animated ring */}
                <div className="gallery-cta-ring" style={{ border: `1px solid ${color}50`, boxShadow: `0 0 20px ${color}25` }}>
                  <ArrowRight size={20} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, margin: '0 0 6px' }}>
                    View Full Portfolio
                  </p>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: color, margin: 0, opacity: 0.85 }}>
                    See all work
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: 'clamp(72px, 10vw, 120px) 0', overflow: 'hidden', background: 'linear-gradient(160deg, #0d0a1a 0%, #1a0830 40%, #200a18 70%, #0d0a1a 100%)', textAlign: 'center' }}>
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', width: 'min(60vw, 800px)', height: 'min(60vw, 800px)', top: '-30%', left: '50%', transform: 'translateX(-50%)', background: `radial-gradient(circle, ${color} 0%, transparent 60%)`, opacity: 0.08, filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', width: 'clamp(200px, 35vw, 480px)', height: 'clamp(200px, 35vw, 480px)', bottom: '-20%', left: '-8%', background: 'radial-gradient(circle, #e8175d 0%, transparent 65%)', opacity: 0.07, filter: 'blur(70px)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 999, marginBottom: 24, background: `${color}18`, border: `1px solid ${color}40`, backdropFilter: 'blur(12px)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}cc` }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color }}>
              Your Stage Awaits
            </span>
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif', fontSize: 'clamp(28px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.08, color: '#fff', letterSpacing: '-0.02em', marginBottom: 18 }}>
            Ready to Get{' '}
            <span style={{ background: `linear-gradient(110deg, ${color} 0%, #ff6b35 50%, #e8175d 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: `drop-shadow(0 0 28px ${color}55)` }}>
              Started?
            </span>
          </h2>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(14px, 2.2vw, 18px)', color: 'rgba(255,255,255,0.60)', lineHeight: 1.8, marginBottom: 36 }}>
            Book your consultation today and let&apos;s create something amazing together.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14 }}>
            <Link href="/booking"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: 'clamp(12px, 2vw, 15px) clamp(22px, 4vw, 32px)', borderRadius: 14, background: 'linear-gradient(135deg, #e8175d, #c0104a)', color: '#fff', textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(13px, 2vw, 16px)', fontWeight: 700, boxShadow: '0 8px 28px rgba(232,23,93,0.45)', transition: 'all 0.25s ease', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 14px 40px rgba(232,23,93,0.65)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 28px rgba(232,23,93,0.45)' }}
            >
              Book Your Session <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: 'clamp(12px, 2vw, 15px) clamp(22px, 4vw, 32px)', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}35`, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', fontSize: 'clamp(13px, 2vw, 16px)', fontWeight: 600, backdropFilter: 'blur(12px)', transition: 'all 0.25s ease', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `${color}14`; el.style.borderColor = `${color}60`; el.style.color = color }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(255,255,255,0.06)'; el.style.borderColor = `${color}35`; el.style.color = 'rgba(255,255,255,0.85)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ════════════ HERO ════════════ */
        .hero-section {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column; justify-content: center; overflow: hidden;
        }
        .hero-content-wrap {
          position: relative; z-index: 10; width: 100%; max-width: 1280px; margin: 0 auto;
          padding: clamp(100px, 15vw, 148px) clamp(20px, 5vw, 48px) clamp(48px, 8vw, 80px);
        }
        .hero-content { max-width: 600px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 8px 18px; border-radius: 999px; margin-bottom: 22px; backdrop-filter: blur(12px);
        }
        .hero-title {
          font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif;
          font-size: clamp(36px, 8vw, 80px); font-weight: 900; line-height: 1.05;
          color: #fff; letter-spacing: -0.02em; margin-bottom: 20px;
        }
        .hero-desc {
          font-family: "DM Sans", sans-serif; font-size: clamp(14px, 2vw, 18px);
          color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 32px; max-width: 500px;
        }
        .hero-ctas { display: flex; flex-wrap: wrap; gap: 14px; }
        .hero-cta-primary {
          display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px;
          border-radius: 14px; color: #fff; text-decoration: none;
          font-family: "DM Sans", sans-serif; font-size: clamp(13px, 1.8vw, 15px);
          font-weight: 700; transition: all 0.25s ease; letter-spacing: 0.02em; white-space: nowrap;
        }
        .hero-cta-secondary {
          display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px;
          border-radius: 14px; color: rgba(255,255,255,0.85); text-decoration: none;
          font-family: "DM Sans", sans-serif; font-size: clamp(13px, 1.8vw, 15px);
          font-weight: 600; backdrop-filter: blur(12px); transition: all 0.25s ease; white-space: nowrap;
        }
        .hero-scroll-hint {
          position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          z-index: 10; animation: scrollBob 2.4s ease-in-out infinite;
        }
        .hero-scroll-line { width: 1px; height: 36px; }
        @keyframes scrollBob {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
          50%       { transform: translateX(-50%) translateY(6px); opacity: 1; }
        }

        /* ════════════ SHARED ════════════ */
        .section-base {
          position: relative; padding: clamp(56px, 8vw, 96px) 0; overflow: hidden;
        }
        .section-inner {
          position: relative; z-index: 1; max-width: 1280px; margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 48px);
        }

        /* ════════════ EVENT TYPES ════════════ */
        .subtypes-grid {
          display: flex; flex-wrap: wrap;
          gap: clamp(12px, 2vw, 18px); justify-content: center;
        }
        .subtype-card {
          position: relative; border-radius: 18px; padding: clamp(18px, 3vw, 26px);
          backdrop-filter: blur(12px); transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden; box-sizing: border-box; min-width: 200px;
          flex: 0 0 calc((100% - clamp(12px, 2vw, 18px) * 2) / 3);
        }

        /* ════════════ FEATURES ════════════ */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
          gap: clamp(20px, 3vw, 36px);
        }

        /* ════════════ PACKAGES ════════════ */
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
          gap: clamp(16px, 2.5vw, 24px);
          max-width: 960px; margin: 0 auto; padding-top: 24px;
        }
        .pkg-card {
          position: relative; border-radius: 22px; padding: clamp(22px, 4vw, 36px);
          backdrop-filter: blur(16px); transition: all 0.3s ease; overflow: visible;
        }
        .pkg-card--popular { transform: scale(1.03); z-index: 2; }

        /* ════════════════════════════════════════════
           GALLERY BENTO GRID — 3 cols, 3 rows, 9 cells
           All cells filled, zero empty space:

             ┌──────────────────┬──────────┐
             │  0  wide  2×1    │  1  1×1  │  row 220px
             ├──────────┬───────┴──────────┤
             │  2  1×1  │  3   wide  2×1   │  row 220px
             ├──────────┼──────────┬───────┤
             │  4  1×1  │  5  1×1  │ CTA   │  row 220px
             └──────────┴──────────┴───────┘
        ════════════════════════════════════════════ */
        .gallery-bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 220px);
          gap: clamp(10px, 1.4vw, 14px);
        }
        .gallery-item {
          position: relative; border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(20, 10, 38, 0.85);
          transition: border-color 0.3s ease, box-shadow 0.3s ease,
                      transform 0.35s cubic-bezier(0.22,1,0.36,1);
          cursor: pointer;
        }
        /* Cell types — no g-tall to avoid empty cells */
        .g-wide { grid-column: span 2; }
        .g-norm { grid-column: span 1; }

        /* Hover effects */
        .gallery-img { transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        .gallery-item:hover .gallery-img { transform: scale(1.06); }
        .gallery-item:hover .g-tint      { opacity: 1 !important; }

        /* Caption */
        .g-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: clamp(10px, 1.8vw, 16px) clamp(12px, 2vw, 18px);
          transform: translateY(5px); transition: transform 0.3s ease;
          background: linear-gradient(to top, rgba(13,10,26,0.82) 0%, transparent 100%);
        }
        .gallery-item:hover .g-caption { transform: translateY(0); }

        /* ── CTA tile (fills last slot perfectly) ── */
        .gallery-cta-tile {
          position: relative; border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(160deg, rgba(26,13,46,0.8), rgba(13,10,26,0.95));
          text-decoration: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          display: block;
        }
        .gallery-cta-tile:hover {
          border-color: rgba(245,166,35,0.4);
          transform: scale(1.015);
        }
        .gallery-cta-glow {
          position: absolute; inset: 0; opacity: 0.6;
          transition: opacity 0.3s ease; pointer-events: none;
        }
        .gallery-cta-tile:hover .gallery-cta-glow { opacity: 1; }
        .gallery-cta-ring {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        .gallery-cta-tile:hover .gallery-cta-ring { transform: scale(1.1) rotate(5deg); }

        /* ════════════ RESPONSIVE ════════════ */

        /* ── Tablet ≤ 900px ── */
        @media (max-width: 900px) {
          .subtype-card {
            flex: 0 0 calc((100% - clamp(12px, 2vw, 18px)) / 2);
          }
          /* Gallery: 2-col, wide spans both, CTA tile still fits */
          .gallery-bento {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(4, 190px);
          }
          .g-wide { grid-column: span 2; }
          .g-norm { grid-column: span 1; }
          /* CTA tile takes a full row on tablet */
          .gallery-cta-tile { grid-column: span 2; }
        }

        /* ── Mobile ≤ 640px ── */
        @media (max-width: 640px) {
          .hero-scroll-hint  { display: none; }
          .pkg-card--popular { transform: none; }
          .packages-grid     { padding-top: 20px; }
          .gallery-bento {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(4, 165px);
          }
          .g-wide { grid-column: span 2; }
          .gallery-cta-tile { grid-column: span 2; }
        }

        /* ── Mobile portrait ≤ 480px ── */
        @media (max-width: 480px) {
          .subtype-card { flex: 0 0 100%; }
          .gallery-bento {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(7, 190px);
          }
          .g-wide, .g-norm { grid-column: span 1 !important; }
          .gallery-cta-tile { grid-column: span 1; }
        }
      `}</style>
    </main>
  )
}