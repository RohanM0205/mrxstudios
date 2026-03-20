'use client'

import Link from 'next/link'
import { ArrowRight, Phone, MessageCircle } from 'lucide-react'

const C = {
  marigold: '#f5a623',
  ember:    '#ff6b35',
  crimson:  '#e8175d',
  base:     '#0d0a1a',
  surface:  '#1a0d2e',
  border:   'rgba(245,166,35,0.18)',
  text:     '#fff',
  muted:    'rgba(255,255,255,0.52)',
}

const steps = [
  { n: 1, text: 'Our team reviews your request and event details' },
  { n: 2, text: "We'll call or WhatsApp you to discuss your vision" },
  { n: 3, text: "You'll receive a personalised plan and custom quote" },
  { n: 4, text: "Once confirmed, your dance journey begins!" },
]

interface BookingSuccessProps {
  onReset: () => void
}

export function BookingSuccess({ onReset }: BookingSuccessProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .success-card   { animation: fadeUp 0.4s ease both; }
        .success-icon   { animation: popIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .success-step   { animation: fadeUp 0.35s ease both; }
        .success-step:nth-child(1) { animation-delay: 0.25s; }
        .success-step:nth-child(2) { animation-delay: 0.33s; }
        .success-step:nth-child(3) { animation-delay: 0.41s; }
        .success-step:nth-child(4) { animation-delay: 0.49s; }
        .cta-btn { transition: all 0.25s ease; }
        .cta-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div
        className="success-card"
        style={{
          background: 'linear-gradient(160deg, rgba(26,13,46,0.9), rgba(13,10,26,0.97))',
          borderRadius: 24, padding: 'clamp(28px, 5vw, 48px)',
          border: `1px solid ${C.border}`,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        {/* ── Animated check icon ── */}
        <div className="success-icon" style={{ margin: '0 auto 28px', width: 88, height: 88, borderRadius: '50%', background: 'rgba(37,211,102,0.1)', border: '2px solid rgba(37,211,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(37,211,102,0.15)' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="#25D366" strokeWidth="2" strokeOpacity="0.4" />
            <path d="M12 20.5L17.5 26L28 15" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* ── Heading ── */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.marigold, boxShadow: `0 0 8px ${C.marigold}cc` }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.marigold }}>
              Request Received
            </span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.crimson, boxShadow: '0 0 8px rgba(232,23,93,0.8)' }} />
          </div>
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 900, color: C.text, lineHeight: 1.1, marginBottom: 14 }}>
          Your Dance Journey{' '}
          <span style={{ background: `linear-gradient(110deg, ${C.marigold}, ${C.ember}, ${C.crimson})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Starts Now!
          </span>
        </h2>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, color: C.muted, maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.75 }}>
          Thank you for choosing MRX Studios. We've received your booking request and will reach out within 24 hours.
        </p>

        {/* ── What happens next ── */}
        <div style={{ textAlign: 'left', borderRadius: 18, padding: 'clamp(18px, 3vw, 28px)', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, marginBottom: 32 }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.marigold, margin: '0 0 18px' }}>
            What happens next
          </p>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none', padding: 0, margin: 0 }}>
            {steps.map(step => (
              <li key={step.n} className="success-step" style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${C.marigold}, ${C.ember})`, boxShadow: `0 4px 12px ${C.marigold}40` }}>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 800, color: '#0d0a1a' }}>{step.n}</span>
                </div>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, paddingTop: 5 }}>
                  {step.text}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Contact CTAs ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
          <a href="tel:+919876543210" className="cta-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, color: C.text, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            <Phone size={15} style={{ color: C.marigold }} /> Call Us Now
          </a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="cta-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            <MessageCircle size={15} /> Chat on WhatsApp
          </a>
        </div>

        {/* ── Secondary actions ── */}
        <div style={{ paddingTop: 20, borderTop: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <button onClick={onReset} className="cta-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Submit Another Request
          </button>
          <Link href="/portfolio" className="cta-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'transparent', color: C.marigold, fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            Browse Our Portfolio <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}