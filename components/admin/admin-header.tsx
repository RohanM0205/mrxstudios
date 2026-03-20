'use client'

import { useState } from 'react'
import { Bell, Search, User, LogOut, Settings, UserCircle, X, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const notifications = [
  {
    id: 1,
    type: 'lead',
    title: 'New Lead Received',
    body: 'Priya Sharma — Wedding Sangeet',
    time: '2 min ago',
    unread: true,
    color: '#3A86FF',
    dot: '#3A86FF',
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    body: 'Advance of ₹15,000 from Mehta Family',
    time: '1 hr ago',
    unread: true,
    color: '#25D366',
    dot: '#25D366',
  },
  {
    id: 3,
    type: 'session',
    title: 'Session Completed',
    body: 'TechCorp Annual Day — Session 3/6',
    time: '3 hrs ago',
    unread: true,
    color: '#f5a623',
    dot: '#f5a623',
  },
]

const typeIcon: Record<string, string> = {
  lead:    '👤',
  payment: '💰',
  session: '🎵',
}

export function AdminHeader() {
  const router = useRouter()
  const [notifOpen,  setNotifOpen]  = useState(false)
  const [userOpen,   setUserOpen]   = useState(false)
  const [searchFocus, setSearchFocus] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .hdr-dropdown { animation: slideDown 0.2s cubic-bezier(0.22,1,0.36,1) both; }
        .hdr-search-input::placeholder { color: rgba(255,255,255,0.3); }
        .hdr-search-input:focus { outline: none; }
        .notif-row:hover { background: rgba(255,255,255,0.05); }
        .user-item:hover { background: rgba(255,255,255,0.06); }
        .signout-item:hover { background: rgba(232,23,93,0.1); }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: 64,
        background: 'rgba(13,10,26,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(245,166,35,0.1)',
        boxShadow: '0 1px 0 rgba(245,166,35,0.06), 0 4px 24px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px',
        gap: 12,
      }}>

        {/* ── Search ── */}
        <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
          <Search size={15} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: searchFocus ? '#f5a623' : 'rgba(255,255,255,0.3)',
            pointerEvents: 'none',
            transition: 'color 0.2s',
          }} />
          <input
            className="hdr-search-input"
            placeholder="Search leads, bookings..."
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '8px 14px 8px 36px',
              borderRadius: 10,
              background: searchFocus ? 'rgba(245,166,35,0.07)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${searchFocus ? 'rgba(245,166,35,0.35)' : 'rgba(255,255,255,0.08)'}`,
              color: '#fff', fontSize: 13,
              fontFamily: '"DM Sans", sans-serif',
              transition: 'all 0.2s ease',
              boxShadow: searchFocus ? '0 0 0 3px rgba(245,166,35,0.08)' : 'none',
            }}
          />
          {/* kbd shortcut hint */}
          <kbd style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            padding: '2px 6px', borderRadius: 5,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 10, color: 'rgba(255,255,255,0.25)',
            fontFamily: 'monospace',
            opacity: searchFocus ? 0 : 1,
            transition: 'opacity 0.15s',
            pointerEvents: 'none',
          }}>⌘K</kbd>
        </div>

        {/* ── Right controls ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

          {/* ── Notification bell ── */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifOpen(v => !v); setUserOpen(false) }}
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: notifOpen ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${notifOpen ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!notifOpen) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(245,166,35,0.1)'
                  el.style.borderColor = 'rgba(245,166,35,0.25)'
                }
              }}
              onMouseLeave={e => {
                if (!notifOpen) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(255,255,255,0.05)'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                }
              }}
            >
              <Bell size={16} style={{ color: notifOpen ? '#f5a623' : 'rgba(255,255,255,0.6)' }} />
              {/* Unread badge */}
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 18, height: 18, borderRadius: '50%',
                background: 'linear-gradient(135deg, #e8175d, #c0104a)',
                border: '2px solid #0d0a1a',
                fontSize: 9, fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"DM Sans", sans-serif',
              }}>3</span>
            </button>

            {/* Notification dropdown */}
            {notifOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setNotifOpen(false)} />
                <div className="hdr-dropdown" style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: 320, zIndex: 50,
                  background: 'linear-gradient(160deg, rgba(26,13,46,0.98), rgba(13,10,26,0.99))',
                  border: '1px solid rgba(245,166,35,0.15)',
                  borderRadius: 14,
                  boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
                  overflow: 'hidden',
                }}>
                  {/* Header */}
                  <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Notifications</p>
                      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0' }}>3 unread</p>
                    </div>
                    <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4, lineHeight: 0 }}>
                      <X size={14} />
                    </button>
                  </div>

                  {/* Items */}
                  <div>
                    {notifications.map((n, i) => (
                      <div key={n.id} className="notif-row" style={{
                        padding: '12px 16px',
                        borderBottom: i < notifications.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start',
                        transition: 'background 0.15s',
                      }}>
                        {/* Icon bubble */}
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${n.color}15`, border: `1px solid ${n.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>
                          {typeIcon[n.type]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, color: '#fff', margin: 0 }}>{n.title}</p>
                            {n.unread && <span style={{ width: 6, height: 6, borderRadius: '50%', background: n.dot, flexShrink: 0 }} />}
                          </div>
                          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.body}</p>
                          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: '3px 0 0' }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, color: '#3A86FF' }}>
                      View all notifications →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />

          {/* ── User menu ── */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setUserOpen(v => !v); setNotifOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px 5px 5px', borderRadius: 10,
                background: userOpen ? 'rgba(58,134,255,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${userOpen ? 'rgba(58,134,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!userOpen) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(58,134,255,0.08)'
                  el.style.borderColor = 'rgba(58,134,255,0.2)'
                }
              }}
              onMouseLeave={e => {
                if (!userOpen) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'rgba(255,255,255,0.05)'
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                }
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #3A86FF, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
                fontFamily: '"DM Sans", sans-serif',
                boxShadow: '0 2px 8px rgba(58,134,255,0.4)',
              }}>A</div>
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', display: 'none' }} className="sm:inline">
                Admin
              </span>
              <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.35)', transform: userOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {/* User dropdown */}
            {userOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setUserOpen(false)} />
                <div className="hdr-dropdown" style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: 210, zIndex: 50,
                  background: 'linear-gradient(160deg, rgba(26,13,46,0.98), rgba(13,10,26,0.99))',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                  overflow: 'hidden',
                }}>
                  {/* Account info */}
                  <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #3A86FF, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 2px 10px rgba(58,134,255,0.4)' }}>A</div>
                      <div>
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Admin</p>
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '1px 0 0' }}>admin@mrxstudios.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '6px 8px' }}>
                    {[
                      { icon: <UserCircle size={14} />, label: 'Profile',  color: 'rgba(255,255,255,0.55)' },
                      { icon: <Settings  size={14} />, label: 'Settings', color: 'rgba(255,255,255,0.55)' },
                    ].map(item => (
                      <button key={item.label} className="user-item" style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                        padding: '8px 10px', borderRadius: 8, border: 'none',
                        background: 'none', cursor: 'pointer',
                        fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500,
                        color: 'rgba(255,255,255,0.7)',
                        transition: 'background 0.15s',
                      }}>
                        <span style={{ color: item.color }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ padding: '4px 8px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                      className="signout-item"
                      onClick={handleSignOut}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                        padding: '8px 10px', borderRadius: 8, border: 'none',
                        background: 'none', cursor: 'pointer',
                        fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600,
                        color: '#e8175d',
                        transition: 'background 0.15s',
                      }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}