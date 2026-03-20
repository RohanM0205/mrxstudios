'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Package,
  Image as ImageIcon,
  Music,
  UserCog,
  Calendar,
  CreditCard,
  FileText,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, color: '#3A86FF', glow: 'rgba(58,134,255,0.35)' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { name: 'Leads',    href: '/admin/leads',    icon: Users,        color: '#f5a623', glow: 'rgba(245,166,35,0.35)' },
      { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck, color: '#25D366', glow: 'rgba(37,211,102,0.35)' },
      { name: 'Sessions', href: '/admin/sessions', icon: Calendar,     color: '#3A86FF', glow: 'rgba(58,134,255,0.35)' },
      { name: 'Payments', href: '/admin/payments', icon: CreditCard,   color: '#e8175d', glow: 'rgba(232,23,93,0.35)' },
    ],
  },
  {
    label: 'Studio',
    items: [
      { name: 'Choreographers',  href: '/admin/choreographers',   icon: UserCog,  color: '#f5a623', glow: 'rgba(245,166,35,0.35)' },
      { name: 'Packages',        href: '/admin/packages',         icon: Package,  color: '#ff6b35', glow: 'rgba(255,107,53,0.35)' },
      { name: 'Dance Plan Rules',href: '/admin/dance-plan-rules', icon: FileText, color: '#3A86FF', glow: 'rgba(58,134,255,0.35)' },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Media', href: '/admin/media', icon: ImageIcon, color: '#e8175d', glow: 'rgba(232,23,93,0.35)' },
      { name: 'Songs', href: '/admin/songs', icon: Music,     color: '#f5a623', glow: 'rgba(245,166,35,0.35)' },
    ],
  },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Logo ── */}
      <div style={{
        padding: '22px 18px 18px',
        borderBottom: '1px solid rgba(245,166,35,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Ambient glow behind logo */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 80,
          background: 'radial-gradient(ellipse at 40% 0%, rgba(245,166,35,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Link href="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <div style={{
            position: 'relative', width: 92, height: 34,
            filter: 'drop-shadow(0 0 12px rgba(245,166,35,0.3))',
          }}>
            <Image src="/images/1MRXWhite.png" alt="MRX Studios" fill className="object-contain object-left" />
          </div>
          <span style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(245,166,35,0.55)',
            marginTop: 1,
          }}>
            Admin
          </span>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 7, cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
              padding: 5, lineHeight: 0, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navGroups.map((group, gi) => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            {/* Group label */}
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 9, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)',
              padding: '8px 10px 4px',
              margin: 0,
            }}>
              {group.label}
            </p>

            {group.items.map(item => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))
              const isHovered = hoveredHref === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 10px 7px 8px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    position: 'relative',
                    marginBottom: 1,
                    transition: 'all 0.18s ease',
                    background: isActive
                      ? `linear-gradient(105deg, ${item.color}14 0%, ${item.color}06 100%)`
                      : isHovered
                        ? 'rgba(255,255,255,0.04)'
                        : 'transparent',
                    border: `1px solid ${isActive ? `${item.color}28` : isHovered ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
                    boxShadow: isActive ? `inset 0 0 20px ${item.color}08` : 'none',
                  }}
                >
                  {/* Active indicator pill */}
                  {isActive && (
                    <span style={{
                      position: 'absolute', left: 0, top: '18%', bottom: '18%',
                      width: 3, borderRadius: '0 4px 4px 0',
                      background: `linear-gradient(180deg, ${item.color}, ${item.color}88)`,
                      boxShadow: `0 0 10px ${item.glow}, 0 0 4px ${item.color}`,
                    }} />
                  )}

                  {/* Icon container */}
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: isActive
                      ? `linear-gradient(135deg, ${item.color}28, ${item.color}10)`
                      : isHovered
                        ? 'rgba(255,255,255,0.07)'
                        : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? `${item.color}35` : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.18s',
                    boxShadow: isActive ? `0 0 12px ${item.color}22` : 'none',
                  }}>
                    <Icon
                      size={14}
                      style={{
                        color: isActive ? item.color : isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                        transition: 'color 0.18s',
                        filter: isActive ? `drop-shadow(0 0 4px ${item.glow})` : 'none',
                      }}
                    />
                  </div>

                  {/* Label */}
                  <span style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 13, fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#fff' : isHovered ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.42)',
                    transition: 'color 0.18s',
                    letterSpacing: isActive ? '-0.01em' : '0',
                  }}>
                    {item.name}
                  </span>

                  {/* Active dot on right */}
                  {isActive && (
                    <span style={{
                      marginLeft: 'auto',
                      width: 5, height: 5, borderRadius: '50%',
                      background: item.color,
                      boxShadow: `0 0 6px ${item.color}`,
                      flexShrink: 0,
                    }} />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div style={{
        margin: '0 12px',
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.12), transparent)',
      }} />

      {/* ── Footer ── */}
      <div style={{ padding: '12px 10px 14px', flexShrink: 0 }}>
        <BackLink />
      </div>
    </div>
  )
}

function BackLink() {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '9px 12px', borderRadius: 10,
        textDecoration: 'none',
        background: hovered ? 'rgba(245,166,35,0.07)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? 'rgba(245,166,35,0.18)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: 7,
        background: hovered ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.06)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        <ArrowLeft size={12} style={{ color: hovered ? 'rgba(245,166,35,0.8)' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }} />
      </div>
      <span style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 12, fontWeight: 500,
        color: hovered ? 'rgba(245,166,35,0.75)' : 'rgba(255,255,255,0.3)',
        transition: 'color 0.2s',
      }}>
        Back to Website
      </span>
    </Link>
  )
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Lock body scroll when mobile nav open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        .admin-sb::-webkit-scrollbar { width: 3px; }
        .admin-sb::-webkit-scrollbar-track { background: transparent; }
        .admin-sb::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.18); border-radius: 99px; }

        @keyframes sb-in { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes overlay-in { from { opacity: 0; } to { opacity: 1; } }
        .sb-mobile { animation: sb-in 0.22s cubic-bezier(0.22,1,0.36,1) both; }
        .sb-overlay { animation: overlay-in 0.2s ease both; }
        .sb-hamburger { display: flex; }
        @media (min-width: 1024px) { .sb-hamburger { display: none !important; } }
      `}</style>

      {/* ── Desktop ── */}
      <aside
        className="hidden lg:flex admin-sb"
        style={{
          position: 'fixed', inset: '0 auto 0 0', zIndex: 50,
          width: 228, flexDirection: 'column',
          background: 'linear-gradient(170deg, #0f0c20 0%, #0b0917 55%, #0d0a1c 100%)',
          borderRight: '1px solid rgba(245,166,35,0.09)',
          boxShadow: '1px 0 0 rgba(255,255,255,0.03), 6px 0 32px rgba(0,0,0,0.5)',
          overflowY: 'auto',
        }}
      >
        {/* Subtle noise texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
          opacity: 0.4,
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SidebarContent />
        </div>
      </aside>

      {/* ── Mobile hamburger ── */}
      <button
        className="sb-hamburger lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        style={{
          position: 'fixed', top: 14, left: 14, zIndex: 50,
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(11,9,23,0.92)',
          border: '1px solid rgba(245,166,35,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', backdropFilter: 'blur(16px)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
        }}
      >
        <Menu size={16} style={{ color: 'rgba(245,166,35,0.85)' }} />
      </button>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="sb-overlay lg:hidden"
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 55,
              background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            }}
          />
          <aside
            className="sb-mobile admin-sb lg:hidden"
            style={{
              position: 'fixed', inset: '0 auto 0 0', zIndex: 60,
              width: 228,
              background: 'linear-gradient(170deg, #0f0c20 0%, #0b0917 55%, #0d0a1c 100%)',
              borderRight: '1px solid rgba(245,166,35,0.1)',
              boxShadow: '8px 0 48px rgba(0,0,0,0.7)',
              overflowY: 'auto',
            }}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  )
}