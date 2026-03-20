'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight } from 'lucide-react'

// ─── Midnight Marigold Palette ────────────────────────────────────────────────
//  Base      #0d0a1a   deep indigo-black
//  Surface   #1a0d2e   rich plum
//  Marigold  #f5a623   warm saffron (primary)
//  Ember     #ff6b35   burnished orange
//  Crimson   #e8175d   celebration red
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '919876543210' // ← Replace with actual number

const QUICK_MESSAGES = [
  { label: '💍 Wedding Sangeet',   text: "Hi! I'm planning a wedding sangeet and would love to know more about MRX Studios' packages." },
  { label: '🏢 Corporate Event',   text: "Hi! I need choreography for a corporate event. Can you share details?" },
  { label: '🎓 College Fest',      text: "Hi! I'm organising a college fest and looking for group choreography. Please help!" },
  { label: '🎤 Audition Coaching', text: "Hi! I need help preparing for a dance audition. Can we discuss coaching options?" },
]

export function WhatsAppButton() {
  const [open, setOpen]               = useState(false)
  const [showBubble, setShowBubble]   = useState(false)
  const [selectedMsg, setSelectedMsg] = useState(0)
  const [dismissed, setDismissed]     = useState(false)

  // Show notification bubble after 3s on first load
  useEffect(() => {
    const t = setTimeout(() => { if (!dismissed) setShowBubble(true) }, 3000)
    return () => clearTimeout(t)
  }, [dismissed])

  // Auto-hide bubble after 8s
  useEffect(() => {
    if (!showBubble) return
    const t = setTimeout(() => setShowBubble(false), 8000)
    return () => clearTimeout(t)
  }, [showBubble])

  const getWhatsAppUrl = (idx: number) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(QUICK_MESSAGES[idx].text)}`

  const handleDismissBubble = () => {
    setShowBubble(false)
    setDismissed(true)
  }

  // FAB size constant so everything aligns to it
  const FAB_SIZE = 58

  return (
    <>
      {/*
       * KEY POSITIONING FIX:
       * The outer div is fixed bottom-right and is ONLY as big as the FAB.
       * The bubble and chat card use `position:absolute; bottom: FAB_SIZE + gap`
       * so they always float directly above the button — never elsewhere on screen.
       */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 20,
          zIndex: 9999,
          width: FAB_SIZE,
          height: FAB_SIZE,
        }}
      >

        {/* ══ NOTIFICATION BUBBLE — floats above FAB, right-aligned ══ */}
        {showBubble && !open && (
          <div
            style={{
              position: 'absolute',
              bottom: FAB_SIZE + 12,   // 12px gap above FAB
              right: 0,
              width: 232,
              borderRadius: 16,
              padding: '14px 16px',
              background: 'linear-gradient(135deg, rgba(26,13,46,0.97), rgba(13,10,26,0.98))',
              border: '1px solid rgba(245,166,35,0.25)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,166,35,0.1)',
              animation: 'waBubbleIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
            }}
          >
            {/* Fire top-line */}
            <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 2, borderRadius: 999, background: 'linear-gradient(90deg, transparent, #f5a623, #ff6b35, transparent)' }} />

            {/* Close button */}
            <button
              onClick={handleDismissBubble}
              style={{
                position: 'absolute', top: -8, right: -8,
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(13,10,26,0.95)',
                border: '1px solid rgba(245,166,35,0.3)',
                color: 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 10,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#e8175d' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)' }}
              aria-label="Close"
            >
              <X size={10} />
            </button>

            {/* Online indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#25D366', boxShadow: '0 0 6px rgba(37,211,102,0.8)', animation: 'waPulseGreen 2s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, fontWeight: 700, color: '#25D366', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Online Now
              </span>
            </div>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
              Need help? Chat with us!
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>
              Ritesh typically replies within minutes.
            </p>

            {/* Small arrow pointer at bottom-right pointing to FAB */}
            <div style={{
              position: 'absolute', bottom: -7, right: 22,
              width: 12, height: 12,
              background: 'rgba(26,13,46,0.97)',
              border: '1px solid rgba(245,166,35,0.2)',
              borderTop: 'none', borderLeft: 'none',
              transform: 'rotate(45deg)',
            }} />
          </div>
        )}

        {/* ══ CHAT CARD — floats above FAB, right-aligned ══ */}
        {open && (
          <div
            style={{
              position: 'absolute',
              bottom: FAB_SIZE + 12,
              right: 0,
              width: 280,
              borderRadius: 22,
              overflow: 'hidden',
              background: 'linear-gradient(160deg, rgba(26,13,46,0.97), rgba(13,10,26,0.99))',
              border: '1px solid rgba(245,166,35,0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(245,166,35,0.08)',
              animation: 'waCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
            }}
          >
            {/* ── Card header ── */}
            <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,211,102,0.07))', borderBottom: '1px solid rgba(37,211,102,0.14)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #f5a623, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(245,166,35,0.45)', flexShrink: 0 }}>
                    <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, fontWeight: 900, color: '#0d0a1a' }}>R</span>
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, background: '#25D366', border: '2px solid #0d0a1a', borderRadius: '50%', boxShadow: '0 0 6px rgba(37,211,102,0.8)' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700, color: '#fff' }}>Ritesh More</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#25D366', boxShadow: '0 0 5px rgba(37,211,102,0.7)', animation: 'waPulseGreen 2s ease-in-out infinite' }} />
                      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, color: '#25D366', fontWeight: 600 }}>Online · replies in minutes</span>
                    </div>
                  </div>
                </div>
                {/* Close */}
                <button
                  onClick={() => setOpen(false)}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(232,23,93,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#e8175d' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)' }}
                  aria-label="Close"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* ── Card body ── */}
            <div style={{ padding: '14px 16px' }}>
              {/* Intro message bubble */}
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px 14px 14px 4px', padding: '10px 12px', marginBottom: 14, animation: 'waMsgIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.12s both' }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65 }}>
                  👋 Hi! I'm Ritesh from MRX Studios. How can I help you today?
                </p>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.28)', textAlign: 'right', marginTop: 4 }}>just now</p>
              </div>

              {/* Quick message selector */}
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 8 }}>
                Select your enquiry
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
                {QUICK_MESSAGES.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMsg(i)}
                    style={{
                      textAlign: 'left', borderRadius: 10, padding: '9px 11px',
                      fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: selectedMsg === i ? 'linear-gradient(135deg, rgba(245,166,35,0.2), rgba(255,107,53,0.14))' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selectedMsg === i ? 'rgba(245,166,35,0.45)' : 'rgba(255,255,255,0.07)'}`,
                      color: selectedMsg === i ? '#f5a623' : 'rgba(255,255,255,0.58)',
                      boxShadow: selectedMsg === i ? '0 0 12px rgba(245,166,35,0.14)' : 'none',
                    }}
                  >
                    {msg.label}
                  </button>
                ))}
              </div>

              {/* Send button */}
              <a
                href={getWhatsAppUrl(selectedMsg)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', padding: '12px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #25D366, #1da851)',
                  color: '#fff', textDecoration: 'none',
                  fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700,
                  boxShadow: '0 6px 22px rgba(37,211,102,0.4)',
                  transition: 'all 0.25s ease', letterSpacing: '0.02em',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 10px 32px rgba(37,211,102,0.6)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 22px rgba(37,211,102,0.4)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Open in WhatsApp
                <ArrowRight size={13} />
              </a>
            </div>

            {/* ── Card footer ── */}
            <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
                Powered by <span style={{ color: 'rgba(245,166,35,0.45)', fontWeight: 600 }}>MRX Studios</span>
              </p>
            </div>
          </div>
        )}

        {/* ══ FAB BUTTON ══ */}
        <button
          onClick={() => { setOpen(v => !v); setShowBubble(false) }}
          style={{
            position: 'relative',
            width: FAB_SIZE, height: FAB_SIZE,
            borderRadius: '50%',
            background: open
              ? 'linear-gradient(135deg, #e8175d, #c0104a)'
              : 'linear-gradient(135deg, #25D366, #1da851)',
            boxShadow: open
              ? '0 8px 28px rgba(232,23,93,0.5)'
              : '0 8px 28px rgba(37,211,102,0.4)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
            zIndex: 2,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1) translateY(-2px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1) translateY(0)' }}
          aria-label={open ? 'Close chat' : 'Chat on WhatsApp'}
        >
          {/* Pulse rings — only when closed */}
          {!open && (
            <>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(37,211,102,0.35)', animation: 'waPulseRing 2.5s ease-out infinite' }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(37,211,102,0.2)',  animation: 'waPulseRing 2.5s ease-out 0.65s infinite' }} />
            </>
          )}

          {/* Icon morphs WA ↔ ✕ */}
          <span style={{ position: 'relative', zIndex: 1, transition: 'transform 0.3s ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', display: 'flex' }}>
            {open ? (
              <X size={22} color="#fff" />
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            )}
          </span>

          {/* Crimson notification dot */}
          {!open && (
            <div style={{
              position: 'absolute', top: -1, right: -1,
              width: 14, height: 14,
              background: '#e8175d',
              border: '2px solid #0d0a1a',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(232,23,93,0.8)',
              animation: 'waBadgePop 0.4s cubic-bezier(0.22,1,0.36,1) 3.2s both',
              opacity: 0,
            }} />
          )}
        </button>
      </div>

      {/* ── KEYFRAMES + FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@900&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes waBubbleIn {
          from { opacity:0; transform:translateY(10px) scale(0.95); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes waCardIn {
          from { opacity:0; transform:translateY(14px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes waMsgIn {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0);    }
        }
        @keyframes waPulseRing {
          0%        { transform:scale(1);    opacity:0.7; }
          70%, 100% { transform:scale(1.55); opacity:0;   }
        }
        @keyframes waPulseGreen {
          0%, 100% { opacity:1;   }
          50%      { opacity:0.4; }
        }
        @keyframes waBadgePop {
          from { transform:scale(0); opacity:0; }
          to   { transform:scale(1); opacity:1; }
        }
      `}</style>
    </>
  )
}