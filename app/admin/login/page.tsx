'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ── Spinner shown while Suspense resolves ────────────────────────────────────
function FullPageSpinner() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} style={{ color: '#f5a623', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Inner component that safely uses useSearchParams ─────────────────────────
function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  // If already logged in, skip the login screen
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const from = searchParams.get('from') ?? '/admin/dashboard'
        router.replace(from)
      } else {
        setChecking(false)
      }
    })
  }, [router, searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setLoading(false)

    if (authError) {
      setError('Invalid email or password. Please try again.')
      return
    }

    const from = searchParams.get('from')
    const destination =
      from && from !== '/admin' && from.startsWith('/admin')
        ? from
        : '/admin/dashboard'

    router.replace(destination)
  }

  if (checking) return <FullPageSpinner />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glowPulse { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        .login-card  { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .field-input { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .field-input:focus { outline: none; border-color: #f5a623 !important; box-shadow: 0 0 0 3px rgba(245,166,35,0.12); }
        .submit-btn  { transition: all 0.25s ease; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(232,23,93,0.65) !important; }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d0a1a 0%, #120a1c 50%, #0d0a1a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Ambient glows */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', borderRadius: '50%', width: 'min(600px,80vw)', height: 'min(600px,80vw)', top: '-20%', right: '-15%', background: 'radial-gradient(circle, #f5a623 0%, transparent 65%)', opacity: 0.06, filter: 'blur(80px)', animation: 'glowPulse 4s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', borderRadius: '50%', width: 'min(500px,70vw)', height: 'min(500px,70vw)', bottom: '-15%', left: '-10%', background: 'radial-gradient(circle, #e8175d 0%, transparent 65%)', opacity: 0.06, filter: 'blur(80px)', animation: 'glowPulse 4s ease-in-out infinite 2s' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(245,166,35,0.055) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Login card */}
        <div className="login-card" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

          {/* Fire top bar */}
          <div style={{ height: 2, borderRadius: '12px 12px 0 0', background: 'linear-gradient(90deg, transparent, #f5a623, #ff6b35, #e8175d, transparent)' }} />

          <div style={{
            background: 'linear-gradient(160deg, rgba(26,13,46,0.9), rgba(13,10,26,0.97))',
            borderRadius: '0 0 20px 20px',
            border: '1px solid rgba(245,166,35,0.15)', borderTop: 'none',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,166,35,0.06)',
            padding: 'clamp(28px,6vw,44px)',
          }}>

            {/* Logo + heading */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
              <div style={{ position: 'relative', width: 110, height: 42, marginBottom: 20, filter: 'drop-shadow(0 0 16px rgba(245,166,35,0.35))' }}>
                <Image src="/images/1MRXWhite.png" alt="MRX Studios" fill className="object-contain" />
              </div>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(232,23,93,0.1))', border: '1px solid rgba(245,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 0 24px rgba(245,166,35,0.15)' }}>
                <Lock size={22} style={{ color: '#f5a623' }} />
              </div>
              <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(22px,5vw,28px)', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.01em', textAlign: 'center' }}>
                Admin{' '}
                <span style={{ background: 'linear-gradient(110deg, #f5a623, #ff6b35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Portal</span>
              </h1>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.42)', margin: 0, textAlign: 'center' }}>
                MRX Studios internal dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                  <input
                    type="email" className="field-input"
                    value={email} onChange={e => { setEmail(e.target.value); setError(null) }}
                    placeholder="admin@mrxstudios.com" autoComplete="email"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px 11px 38px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(232,23,93,0.5)' : 'rgba(245,166,35,0.15)'}`, color: '#fff', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                  <input
                    type={showPw ? 'text' : 'password'} className="field-input"
                    value={password} onChange={e => { setPassword(e.target.value); setError(null) }}
                    placeholder="••••••••••" autoComplete="current-password"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '11px 42px 11px 38px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? 'rgba(232,23,93,0.5)' : 'rgba(245,166,35,0.15)'}`, color: '#fff', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 2, lineHeight: 0 }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', borderRadius: 10, background: 'rgba(232,23,93,0.08)', border: '1px solid rgba(232,23,93,0.28)' }}>
                  <AlertCircle size={14} style={{ color: '#e8175d', flexShrink: 0 }} />
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#e8175d' }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="submit-btn"
                style={{ marginTop: 4, width: '100%', padding: '13px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #e8175d, #c0104a)', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.03em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 28px rgba(232,23,93,0.4)' }}
              >
                {loading
                  ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</>
                  : <><Lock size={14} /> Sign In to Dashboard</>
                }
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(245,166,35,0.1)', textAlign: 'center' }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.22)', lineHeight: 1.7 }}>
                Credentials are managed in Supabase Auth.<br />
                Contact your system admin if you&apos;re locked out.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// ── Default export wraps LoginForm in Suspense ────────────────────────────────
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <LoginForm />
    </Suspense>
  )
}