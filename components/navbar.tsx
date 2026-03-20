'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron (primary)
//  Ember     #ff6b35   burnished orange
//  Crimson   #e8175d   celebration red
// ─────────────────────────────────────────────────────────────────────────────

// ── LOGO COMPONENT ────────────────────────────────────────────────────────────
// Uses the White logo (MRXWhite.png) on the dark navbar.
// Switch to MRXBlue.png if you ever need it on a light background.
function MRXLogo({ scrolled }: { scrolled: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-0 relative" aria-label="MRX Studios Home">
      {/* Logo image */}
      <div
        className="relative transition-all duration-500"
        style={{
          width: scrolled ? 110 : 130,
          height: scrolled ? 44 : 52,
          filter: 'drop-shadow(0 0 12px rgba(245,166,35,0.25))',
          transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <Image
          // ← Place your logo at /public/images/logo-white.png
          // Use MRXWhite.png on dark backgrounds (default for this navbar)
          // Use MRXBlue.png if you ever want it on a light bg
          src="/images/1MRXWhite.png"
          alt="MRX Studios"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    </Link>
  )
}

// ── NAV LINKS ─────────────────────────────────────────────────────────────────
const navLinks = [
  { href: '/',                    label: 'Home'       },
  { href: '/services/weddings',   label: 'Weddings'   },
  { href: '/services/corporate',  label: 'Corporate'  },
  { href: '/services/college',    label: 'College'    },
  { href: '/services/auditions',  label: 'Auditions'  },
  { href: '/services/GuestPerformance',  label: 'Guest Performance'  },
  { href: '/portfolio',           label: 'Portfolio'  },
]

// ── DESKTOP NAV LINK ──────────────────────────────────────────────────────────
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative group px-4 py-2 text-sm font-medium transition-all duration-200"
      style={{
        fontFamily: '"DM Sans", sans-serif',
        color: 'rgba(255,255,255,0.72)',
        letterSpacing: '0.02em',
      }}
    >
      {/* Hover text glow */}
      <span
        className="relative z-10 transition-all duration-200 group-hover:text-white"
        style={{ display: 'block' }}
      >
        {label}
      </span>
      {/* Marigold underline — slides in from left */}
      <span
        className="absolute bottom-0 left-4 right-4 rounded-full transition-all duration-300"
        style={{
          height: 1.5,
          background: 'linear-gradient(90deg, #f5a623, #ff6b35)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
      <style>{`
        a:hover > span:last-child { transform: scaleX(1) !important; }
      `}</style>
    </Link>
  )
}

// ── MAIN NAVBAR ───────────────────────────────────────────────────────────────
export function Navbar() {
  const [scrolled, setScrolled]               = useState(false)
  const [scrollProgress, setScrollProgress]   = useState(0)
  const [mobileOpen, setMobileOpen]           = useState(false)
  const [activeLink, setActiveLink]           = useState('/')

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      const max = document.body.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? (y / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, rgba(13,10,26,0.97) 0%, rgba(26,13,46,0.97) 100%)'
            : 'linear-gradient(to bottom, rgba(13,10,26,0.85) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
          borderBottom: scrolled ? '1px solid rgba(245,166,35,0.12)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.5), 0 0 0 0 transparent' : 'none',
          transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* ── SCROLL PROGRESS BAR ── */}
        <div
          className="absolute top-0 left-0 h-[2px] pointer-events-none"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #f5a623, #ff6b35, #e8175d)',
            boxShadow: '0 0 8px rgba(245,166,35,0.6)',
            transition: 'width 0.1s linear',
            borderRadius: '0 999px 999px 0',
          }}
        />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <nav
            className="flex items-center justify-between"
            style={{
              height: scrolled ? 68 : 84,
              transition: 'height 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          >

            {/* ── LOGO ── */}
            <MRXLogo scrolled={scrolled} />

            {/* ── DESKTOP LINKS ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </div>

            {/* ── DESKTOP CTA ── */}
            <div className="hidden lg:flex items-center gap-3">
              {/* WhatsApp icon button */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full transition-all duration-250"
                style={{
                  width: 38, height: 38,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(245,166,35,0.25)',
                  color: 'rgba(255,255,255,0.6)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(245,166,35,0.12)'
                  el.style.borderColor = 'rgba(245,166,35,0.5)'
                  el.style.color = '#f5a623'
                  el.style.transform = 'scale(1.08)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'rgba(255,255,255,0.06)'
                  el.style.borderColor = 'rgba(245,166,35,0.25)'
                  el.style.color = 'rgba(255,255,255,0.6)'
                  el.style.transform = 'scale(1)'
                }}
                aria-label="WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              {/* Book Now CTA */}
              <Link
                href="/booking"
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5"
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 14, fontWeight: 700,
                  background: 'linear-gradient(135deg, #e8175d, #c0104a)',
                  color: '#fff',
                  textDecoration: 'none',
                  boxShadow: '0 0 0 1px rgba(232,23,93,0.35), 0 4px 18px rgba(232,23,93,0.4)',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.boxShadow = '0 0 0 1px rgba(232,23,93,0.6), 0 8px 28px rgba(232,23,93,0.65)'
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.boxShadow = '0 0 0 1px rgba(232,23,93,0.35), 0 4px 18px rgba(232,23,93,0.4)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                {/* Shimmer */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
                    transform: 'translateX(-100%)',
                    animation: 'navShimmer 3s ease-in-out 2s infinite',
                  }}
                />
                Book Now
              </Link>
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <button
              className="lg:hidden flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                width: 42, height: 42,
                background: mobileOpen ? 'rgba(232,23,93,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${mobileOpen ? 'rgba(232,23,93,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: mobileOpen ? '#e8175d' : 'rgba(255,255,255,0.8)',
              }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen
                ? <X size={18} />
                : <Menu size={18} />
              }
            </button>
          </nav>
        </div>

        {/* ── MOBILE MENU PANEL ── */}
        <div
          className="lg:hidden overflow-hidden"
          style={{
            maxHeight: mobileOpen ? 520 : 0,
            opacity: mobileOpen ? 1 : 0,
            transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(160deg, rgba(13,10,26,0.98), rgba(26,13,46,0.98))',
              borderTop: '1px solid rgba(245,166,35,0.1)',
              borderBottom: '1px solid rgba(245,166,35,0.08)',
              backdropFilter: 'blur(20px)',
              padding: '16px 20px 24px',
            }}
          >
            {/* Nav links */}
            <div className="flex flex-col gap-1 mb-5">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 15, fontWeight: 500,
                    color: 'rgba(255,255,255,0.72)',
                    textDecoration: 'none',
                    animationDelay: `${i * 0.04}s`,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'rgba(245,166,35,0.08)'
                    el.style.color = '#fff'
                    el.style.paddingLeft = '20px'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'transparent'
                    el.style.color = 'rgba(255,255,255,0.72)'
                    el.style.paddingLeft = '16px'
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {/* Small marigold dot indicator */}
                  <span
                    style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: i % 3 === 0 ? '#f5a623' : i % 3 === 1 ? '#ff6b35' : '#e8175d',
                      flexShrink: 0,
                      boxShadow: `0 0 5px ${i % 3 === 0 ? '#f5a623' : i % 3 === 1 ? '#ff6b35' : '#e8175d'}`,
                    }}
                  />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.2), transparent)', marginBottom: 16 }} />

            {/* Mobile CTAs */}
            <div className="flex flex-col gap-3">
              <Link
                href="/booking"
                className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-white"
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 15, fontWeight: 700,
                  background: 'linear-gradient(135deg, #e8175d, #c0104a)',
                  textDecoration: 'none',
                  boxShadow: '0 6px 22px rgba(232,23,93,0.45)',
                  letterSpacing: '0.02em',
                }}
                onClick={() => setMobileOpen(false)}
              >
                Book Your Session
              </Link>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl py-3.5"
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 15, fontWeight: 600,
                  background: 'rgba(245,166,35,0.08)',
                  border: '1px solid rgba(245,166,35,0.28)',
                  color: '#f5a623',
                  textDecoration: 'none',
                }}
                onClick={() => setMobileOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── KEYFRAMES + FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes navShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  )
}