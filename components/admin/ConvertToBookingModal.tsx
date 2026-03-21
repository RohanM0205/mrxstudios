"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { X, Loader2, ChevronDown, IndianRupee, Users, Package, FileText } from "lucide-react"
import { createBooking } from "@/services/bookings"
import { fetchActivePackages } from "@/services/packages"
import { fetchActiveChoreographers } from "@/services/choreographers"
import { supabase } from "@/lib/supabase-browser"
import type { Lead, Package as PackageType, Choreographer } from "@/lib/types"

// ── Palette (matches existing admin UI) ──────────────────────────────────────
const C = {
  marigold:    '#f5a623',
  ember:       '#ff6b35',
  crimson:     '#e8175d',
  base:        '#0d0a1a',
  surface:     '#1a0d2e',
  border:      'rgba(245,166,35,0.18)',
  text:        '#fff',
  muted:       'rgba(255,255,255,0.42)',
  inputBg:     'rgba(255,255,255,0.04)',
  inputBorder: 'rgba(255,255,255,0.1)',
}

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({ label, error, children, required }: {
  label: string; error?: string; children: React.ReactNode; required?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: C.muted }}>
        {label}{required && <span style={{ color: C.crimson, marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: C.crimson }}>{error}</span>}
    </div>
  )
}

// ── Styled input ──────────────────────────────────────────────────────────────
function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '10px 13px', borderRadius: 10,
        background: C.inputBg,
        border: `1px solid ${error ? C.crimson : C.inputBorder}`,
        color: C.text, fontSize: 13,
        fontFamily: '"DM Sans", sans-serif',
        outline: 'none', transition: 'border-color 0.2s',
        ...(props.style ?? {}),
      }}
      onFocus={e => { e.currentTarget.style.borderColor = C.marigold }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? C.crimson : C.inputBorder }}
    />
  )
}

// ── Styled select ─────────────────────────────────────────────────────────────
function Select({ error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        {...props}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '10px 34px 10px 13px', borderRadius: 10,
          background: C.inputBg,
          border: `1px solid ${error ? C.crimson : C.inputBorder}`,
          color: props.value ? C.text : C.muted,
          fontSize: 13, fontFamily: '"DM Sans", sans-serif',
          outline: 'none', appearance: 'none',
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          opacity: props.disabled ? 0.5 : 1,
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = C.marigold }}
        onBlur={e => { e.currentTarget.style.borderColor = error ? C.crimson : C.inputBorder }}
      >
        {children}
      </select>
      <ChevronDown size={13} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '10px 13px', borderRadius: 10,
        background: C.inputBg,
        border: `1px solid ${C.inputBorder}`,
        color: C.text, fontSize: 13, lineHeight: 1.6,
        fontFamily: '"DM Sans", sans-serif',
        outline: 'none', resize: 'vertical', minHeight: 80,
        transition: 'border-color 0.2s',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = C.marigold }}
      onBlur={e => { e.currentTarget.style.borderColor = C.inputBorder }}
    />
  )
}

// ── Section title ─────────────────────────────────────────────────────────────
function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.marigold, flexShrink: 0 }}>
        {icon}
      </div>
      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ConvertToBookingModalProps {
  lead: Lead
  onClose: () => void
}

interface FormState {
  package_id: string
  assigned_choreographer_id: string
  total_amount: string
  advance_paid: string
  notes: string
}

// ── Main component ────────────────────────────────────────────────────────────
export function ConvertToBookingModal({ lead, onClose }: ConvertToBookingModalProps) {
  const router = useRouter()

  const [packages,       setPackages]       = useState<PackageType[]>([])
  const [choreographers, setChoreographers] = useState<Choreographer[]>([])
  const [loadingData,    setLoadingData]    = useState(true)
  const [submitting,     setSubmitting]     = useState(false)
  const [submitError,    setSubmitError]    = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    package_id:                '',
    assigned_choreographer_id: '',
    total_amount:              '',
    advance_paid:              '0',
    notes:                     '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const set = (key: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  // Auto-fill total amount when package is selected
  const handlePackageChange = (packageId: string) => {
    set('package_id', packageId)
    if (packageId) {
      const pkg = packages.find(p => p.id === packageId)
      if (pkg) set('total_amount', String(pkg.price))
    }
  }

  // Load packages and choreographers
  useEffect(() => {
    async function load() {
      setLoadingData(true)
      const [pkgRes, chorRes] = await Promise.all([
        fetchActivePackages(),
        fetchActiveChoreographers(),
      ])
      if (pkgRes.data)  setPackages(pkgRes.data)
      if (chorRes.data) setChoreographers(chorRes.data)
      setLoadingData(false)
    }
    load()
  }, [])

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.total_amount || isNaN(Number(form.total_amount)) || Number(form.total_amount) < 0)
      e.total_amount = 'Enter a valid amount'
    if (form.advance_paid && (isNaN(Number(form.advance_paid)) || Number(form.advance_paid) < 0))
      e.advance_paid = 'Enter a valid advance amount'
    if (Number(form.advance_paid) > Number(form.total_amount))
      e.advance_paid = 'Advance cannot exceed total amount'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)

    const totalAmount  = Number(form.total_amount)
    const advancePaid  = Number(form.advance_paid) || 0
    const paymentStatus =
      advancePaid === 0           ? 'pending'
      : advancePaid >= totalAmount ? 'paid'
      : 'partial'

    const bookingPayload = {
      lead_id:                   lead.id,
      client_name:               lead.name,
      phone:                     lead.phone,
      event_type:                lead.event_type,
      event_subtype:             lead.event_subtype || undefined,
      event_date:                lead.event_date    || undefined,
      location:                  lead.location      || undefined,
      package_id:                form.package_id    || undefined,
      assigned_choreographer_id: form.assigned_choreographer_id || undefined,
      total_amount:              totalAmount,
      advance_paid:              advancePaid,
      payment_status:            paymentStatus as 'pending' | 'partial' | 'paid',
      status:                    'confirmed' as const,
      notes:                     form.notes.trim() || undefined,
    }

    const { data: booking, error: bookingError } = await createBooking(bookingPayload)

    if (bookingError || !booking) {
      setSubmitError('Failed to create booking. Please try again.')
      setSubmitting(false)
      return
    }

    // Update lead status to converted
    await supabase
      .from('leads')
      .update({ status: 'converted', updated_at: new Date().toISOString() })
      .eq('id', lead.id)

    // Navigate to bookings page
    router.push('/admin/bookings')
  }

  const selectedPkg = packages.find(p => p.id === form.package_id)
  const balance = Number(form.total_amount || 0) - Number(form.advance_paid || 0)

  return createPortal(
    <>
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ctb-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(37,211,102,0.55) !important; }
        .ctb-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        select option { background: #1a0d2e; color: #fff; }
        .ctb-scroll::-webkit-scrollbar { width: 4px; }
        .ctb-scroll::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.2); border-radius: 99px; }
      `}</style>

      {/* Full viewport flex overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', boxSizing: 'border-box',
      }}>
        {/* Backdrop */}
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }} />

        {/* Modal */}
        <div className="ctb-scroll" style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 620,
          maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
          background: 'linear-gradient(160deg, rgba(22,11,40,0.99), rgba(10,8,20,0.99))',
          border: '1px solid rgba(245,166,35,0.2)', borderRadius: 20,
          boxShadow: '0 48px 120px rgba(0,0,0,0.8)',
          animation: 'modalIn 0.28s cubic-bezier(0.22,1,0.36,1) both',
        }}>
        {/* Fire bar */}
        <div style={{ height: 2, borderRadius: '20px 20px 0 0', background: 'linear-gradient(90deg, transparent, #f5a623, #ff6b35, #e8175d, transparent)' }} />

        {/* Header */}
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 6, padding: '3px 10px', borderRadius: 99, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366' }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: 700, color: '#25D366', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Converting Lead</span>
            </div>
            <h2 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
              {lead.name}
            </h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: C.muted, margin: '3px 0 0' }}>
              {lead.event_type.replace('_', ' ')} · {lead.event_date ? new Date(lead.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'} · {lead.location || 'Location TBD'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4, lineHeight: 0, marginTop: 2 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {loadingData ? (
            <div style={{ padding: '32px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Loader2 size={18} style={{ color: C.marigold, animation: 'spin 1s linear infinite' }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.muted }}>Loading packages & choreographers…</span>
            </div>
          ) : (
            <>
              {/* Package & Choreographer */}
              <div>
                <SectionTitle icon={<Package size={13} />}>Package & Team</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Package">
                    <Select value={form.package_id} onChange={e => handlePackageChange(e.target.value)}>
                      <option value="">No package</option>
                      {packages.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — ₹{p.price.toLocaleString('en-IN')}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Choreographer">
                    <Select value={form.assigned_choreographer_id} onChange={e => set('assigned_choreographer_id', e.target.value)}>
                      <option value="">Assign later</option>
                      {choreographers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Select>
                  </Field>
                </div>

                {/* Package info pill */}
                {selectedPkg && (
                  <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div>
                      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: C.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Sessions</p>
                      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 700, color: C.marigold, margin: 0 }}>{selectedPkg.sessions}</p>
                    </div>
                    <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)' }} />
                    <div>
                      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: C.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Price</p>
                      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 700, color: '#25D366', margin: 0 }}>₹{selectedPkg.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div>
                <SectionTitle icon={<IndianRupee size={13} />}>Payment</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Total Amount" error={errors.total_amount} required>
                    <Input
                      type="number" min="0" placeholder="0"
                      value={form.total_amount}
                      onChange={e => set('total_amount', e.target.value)}
                      error={!!errors.total_amount}
                    />
                  </Field>
                  <Field label="Advance Paid" error={errors.advance_paid}>
                    <Input
                      type="number" min="0" placeholder="0"
                      value={form.advance_paid}
                      onChange={e => set('advance_paid', e.target.value)}
                      error={!!errors.advance_paid}
                    />
                  </Field>
                </div>

                {/* Balance summary */}
                {form.total_amount && (
                  <div style={{ marginTop: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 24 }}>
                    {[
                      { label: 'Total',   value: `₹${Number(form.total_amount || 0).toLocaleString('en-IN')}`,  color: '#fff'     },
                      { label: 'Advance', value: `₹${Number(form.advance_paid || 0).toLocaleString('en-IN')}`,  color: '#25D366'  },
                      { label: 'Balance', value: `₹${balance.toLocaleString('en-IN')}`,                         color: balance > 0 ? C.marigold : '#25D366' },
                    ].map(f => (
                      <div key={f.label}>
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: C.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{f.label}</p>
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 700, color: f.color, margin: 0 }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <SectionTitle icon={<FileText size={13} />}>Notes</SectionTitle>
                <Textarea
                  placeholder="Any special requirements, costume notes, or internal notes…"
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                />
              </div>

              {/* Error */}
              {submitError && (
                <div style={{ padding: '11px 14px', borderRadius: 10, background: 'rgba(232,23,93,0.08)', border: '1px solid rgba(232,23,93,0.25)', fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: C.crimson }}>
                  {submitError}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="ctb-submit"
                  style={{
                    flex: 2, padding: '12px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #25D366, #1da850)',
                    color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {submitting
                    ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating Booking…</>
                    : '✓ Confirm & Create Booking'
                  }
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </>
  , document.body)
}