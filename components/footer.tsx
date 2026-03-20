'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Instagram, Youtube, Phone, Mail, MapPin, ArrowRight, ChevronDown, Lock } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron (primary)
//  Ember     #ff6b35   burnished orange
//  Crimson   #e8175d   celebration red
// ─────────────────────────────────────────────────────────────────────────────

const quickLinks = [
  { href: '/services/weddings',          label: 'Wedding Choreography', color: '#f5a623' },
  { href: '/services/corporate',         label: 'Corporate Events',     color: '#ff6b35' },
  { href: '/services/college',           label: 'College Fests',        color: '#e8175d' },
  { href: '/services/auditions',         label: 'Audition Prep',        color: '#f5a623' },
  { href: '/services/guest-performance', label: 'Guest Performance',    color: '#ff6b35' },
  { href: '/portfolio',                  label: 'Portfolio',            color: '#e8175d' },
  { href: '/booking',                    label: 'Book Now',             color: '#f5a623' },
]

const studioHours = [
  { day: 'Monday – Friday', time: '9 AM – 9 PM',     highlight: false },
  { day: 'Saturday',        time: '10 AM – 8 PM',    highlight: false },
  { day: 'Sunday',          time: 'By Appointment',  highlight: true  },
]

const contactItems = [
  { icon: <Phone size={14} />, label: 'Call us at',  value: '+91 98765 43210',      href: 'tel:+919876543210',           color: '#f5a623' },
  { icon: <Mail size={14} />,  label: 'Email us at', value: 'hello@mrxstudios.com', href: 'mailto:hello@mrxstudios.com', color: '#ff6b35' },
  { icon: <MapPin size={14}/>, label: 'Visit us at', value: 'Pune, Maharashtra',    href: null,                          color: '#e8175d' },
]

// ── Collapsible section for mobile ──────────────────────────────────────────
function AccordionSection({
  title,
  accentStyle,
  children,
}: {
  title: React.ReactNode
  accentStyle: React.CSSProperties
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        className="flex items-center justify-between w-full py-4"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <h4
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 19, fontWeight: 700,
            color: '#fff', letterSpacing: '-0.01em',
            margin: 0,
            ...accentStyle,
          }}
        >
          {title}
        </h4>
        <ChevronDown
          size={16}
          style={{
            color: 'rgba(255,255,255,0.4)',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        />
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 600 : 0,
          opacity: open ? 1 : 0,
          transition: 'max-height 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
        }}
      >
        <div style={{ paddingBottom: 20 }}>{children}</div>
      </div>
    </div>
  )
}

// ── Main Footer ───────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0a1a 0%, #0c0818 40%, #09060f 100%)' }}
    >
      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 600, height: 600, bottom: '-20%', left: '-10%', background: 'radial-gradient(circle, #f5a623 0%, transparent 65%)', opacity: 0.05, filter: 'blur(80px)' }} />
        <div className="absolute rounded-full" style={{ width: 500, height: 500, top: '-10%', right: '-8%',  background: 'radial-gradient(circle, #e8175d 0%, transparent 65%)', opacity: 0.05, filter: 'blur(80px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(245,166,35,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── TOP FIRE BORDER ── */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, #f5a623 25%, #ff6b35 50%, #e8175d 75%, transparent 100%)' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* ══ BRAND ROW — always full-width on mobile ══ */}
        <div className="pt-10 pb-8 lg:pt-14" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

            {/* Logo + tagline */}
            <div className="flex flex-col gap-4" style={{ maxWidth: 320 }}>
              <Link href="/" aria-label="MRX Studios Home">
                <div
                  className="relative"
                  style={{ width: 130, height: 50, filter: 'drop-shadow(0 0 14px rgba(245,166,35,0.28))', transition: 'filter 0.3s ease' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.filter = 'drop-shadow(0 0 22px rgba(245,166,35,0.5))')}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.filter = 'drop-shadow(0 0 14px rgba(245,166,35,0.28))')}
                >
                  <Image src="/images/1MRXWhite.png" alt="MRX Studios" fill className="object-contain object-left" />
                </div>
              </Link>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.52)', lineHeight: 1.8 }}>
                Transform your special moments into{' '}
                <span style={{ color: '#f5a623', fontWeight: 600 }}>unforgettable dance experiences</span>{' '}
                with India's premium choreography studio.
              </p>
            </div>

            {/* Social icons + mini CTA (right side on sm+) */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                {[
                  { href: 'https://instagram.com/mrxstudios', label: 'Instagram', color: '#e8175d',
                    icon: <Instagram size={16} /> },
                  { href: 'https://youtube.com/@mrxstudios', label: 'YouTube',   color: '#ff6b35',
                    icon: <Youtube size={16} /> },
                  { href: 'https://wa.me/919876543210',      label: 'WhatsApp',  color: '#f5a623',
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    )},
                ].map(s => (
                  <a
                    key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="flex items-center justify-center rounded-xl transition-all duration-200"
                    style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `${s.color}18`; el.style.borderColor = `${s.color}50`; el.style.color = s.color; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 6px 20px ${s.color}30` }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(255,255,255,0.05)'; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.color = 'rgba(255,255,255,0.55)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Inline Book CTA — visible alongside socials on sm+ */}
              <Link
                href="/booking"
                className="group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 self-start"
                style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, #e8175d, #c0104a)', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 16px rgba(232,23,93,0.35)', transition: 'all 0.25s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 8px 24px rgba(232,23,93,0.55)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 4px 16px rgba(232,23,93,0.35)' }}
              >
                Book a Session
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* ══ MOBILE: ACCORDION SECTIONS ══ */}
        {/* Shown below lg, hidden on desktop */}
        <div className="lg:hidden">

          <AccordionSection
            title={<>Quick <span style={{ background: 'linear-gradient(110deg, #f5a623, #ff6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Links</span></>}
            accentStyle={{}}
          >
            {/* 2-column grid on mobile for quick links */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {quickLinks.map(link => (
                <Link
                  key={link.href} href={link.href}
                  className="inline-flex items-center gap-2"
                  style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = link.color)}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)')}
                >
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: link.color, flexShrink: 0, boxShadow: `0 0 5px ${link.color}` }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection
            title={<>Get in <span style={{ background: 'linear-gradient(110deg, #ff6b35, #e8175d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Touch</span></>}
            accentStyle={{}}
          >
            <div className="flex flex-col gap-4">
              {contactItems.map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 36, height: 36, background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = item.color)}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.8)')}
                      >{item.value}</a>
                    ) : (
                      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection
            title={<>Studio <span style={{ background: 'linear-gradient(110deg, #e8175d, #f5a623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hours</span></>}
            accentStyle={{}}
          >
            <div className="flex flex-col gap-2 mb-4">
              {studioHours.map(h => (
                <div key={h.day} className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ background: h.highlight ? 'rgba(245,166,35,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${h.highlight ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.05)'}` }}
                >
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.52)' }}>{h.day}</span>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, color: h.highlight ? '#f5a623' : 'rgba(255,255,255,0.82)' }}>{h.time}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl px-4 py-3" style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(232,23,93,0.06))', border: '1px solid rgba(245,166,35,0.18)' }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                <span style={{ color: '#f5a623', fontWeight: 700 }}>✦ </span>
                Home visits available for wedding clients across Pune & Mumbai.
              </p>
            </div>
          </AccordionSection>
        </div>

        {/* ══ DESKTOP: 3-COL GRID (hidden on mobile) ══ */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-10 py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Col: Quick Links */}
          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20, letterSpacing: '-0.01em' }}>
              Quick <span style={{ background: 'linear-gradient(110deg, #f5a623, #ff6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Links</span>
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="inline-flex items-center gap-2 transition-all duration-200"
                    style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.52)', textDecoration: 'none' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = link.color; el.style.paddingLeft = '4px' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'rgba(255,255,255,0.52)'; el.style.paddingLeft = '0' }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: link.color, opacity: 0.65, flexShrink: 0, boxShadow: `0 0 5px ${link.color}` }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col: Contact */}
          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20, letterSpacing: '-0.01em' }}>
              Get in <span style={{ background: 'linear-gradient(110deg, #ff6b35, #e8175d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Touch</span>
            </h4>
            <ul className="flex flex-col gap-4">
              {contactItems.map(item => (
                <li key={item.label} className="flex items-start gap-3">
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0 mt-0.5"
                    style={{ width: 34, height: 34, background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.38)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = item.color)}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.8)')}
                      >{item.value}</a>
                    ) : (
                      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col: Hours */}
          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20, letterSpacing: '-0.01em' }}>
              Studio <span style={{ background: 'linear-gradient(110deg, #e8175d, #f5a623)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hours</span>
            </h4>
            <ul className="flex flex-col gap-2 mb-5">
              {studioHours.map(h => (
                <li key={h.day} className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ background: h.highlight ? 'rgba(245,166,35,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${h.highlight ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.05)'}` }}
                >
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.52)' }}>{h.day}</span>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, color: h.highlight ? '#f5a623' : 'rgba(255,255,255,0.82)' }}>{h.time}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-xl px-4 py-3 mb-5" style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(232,23,93,0.06))', border: '1px solid rgba(245,166,35,0.18)' }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                <span style={{ color: '#f5a623', fontWeight: 700 }}>✦ </span>
                Home visits available for wedding clients across Pune & Mumbai.
              </p>
            </div>
            <Link href="/booking" className="group flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: 'linear-gradient(135deg, rgba(232,23,93,0.18), rgba(192,16,74,0.12))', border: '1px solid rgba(232,23,93,0.3)', textDecoration: 'none', transition: 'all 0.25s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'linear-gradient(135deg, rgba(232,23,93,0.28), rgba(192,16,74,0.22))'; el.style.borderColor = 'rgba(232,23,93,0.55)'; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 6px 22px rgba(232,23,93,0.25)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'linear-gradient(135deg, rgba(232,23,93,0.18), rgba(192,16,74,0.12))'; el.style.borderColor = 'rgba(232,23,93,0.3)'; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
            >
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>Book a Session</span>
              <ArrowRight size={15} style={{ color: '#e8175d', transition: 'transform 0.2s ease' }} className="group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <div
          className="py-5 flex flex-col sm:flex-row items-center gap-3"
          style={{ borderTop: '1px solid rgba(245,166,35,0.1)' }}
        >
          {/* Logo + copyright — stacked on mobile, row on sm+ */}
          <div className="flex items-center gap-2.5 flex-1">
            <div style={{ width: 24, height: 24, position: 'relative', flexShrink: 0 }}>
              <Image src="/images/1MRXWhite.png" alt="" fill className="object-contain" />
            </div>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
              © {new Date().getFullYear()} MRX Studios. All rights reserved.
            </p>
          </div>

          {/* Heart — hidden on very small screens */}
          <p className="hidden sm:block" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em', flexShrink: 0 }}>
            Crafted with <span style={{ color: '#e8175d', filter: 'drop-shadow(0 0 4px rgba(232,23,93,0.6))' }}>♥</span> for every stage
          </p>

          {/* Legal links + admin login */}
          <div className="flex items-center gap-4 sm:gap-5">
            {[{ href: '/privacy', label: 'Privacy' }, { href: '/terms', label: 'Terms' }].map(l => (
              <Link key={l.href} href={l.href}
                style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.32)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#f5a623')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.32)')}
              >{l.label}</Link>
            ))}

            {/* ── Admin login — intentionally subtle, not promotional ── */}
            <Link
              href="/admin/login"
              title="Admin"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.22)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'rgba(245,166,35,0.7)'
                el.style.borderColor = 'rgba(245,166,35,0.25)'
                el.style.background = 'rgba(245,166,35,0.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'rgba(255,255,255,0.22)'
                el.style.borderColor = 'rgba(255,255,255,0.08)'
                el.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              <Lock size={9} />
              Admin
            </Link>
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </footer>
  )
}