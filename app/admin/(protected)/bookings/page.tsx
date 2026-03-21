"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabase-browser"
import {
  Search, Filter, Eye, Edit, Calendar, CalendarCheck, CalendarX,
  IndianRupee, Plus, MapPin, Users, Clock, Loader2, RefreshCw,
  AlertCircle, ChevronDown, ChevronLeft, ChevronRight, X, Phone,
  CheckCircle, AlertTriangle, Save, Receipt,
} from "lucide-react"

type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
type PaymentStatus = "pending" | "partial" | "paid"

interface Booking {
  id: string
  lead_id: string | null
  client_name: string
  phone: string | null
  event_type: string
  event_subtype: string | null
  event_date: string | null
  location: string | null
  package_id: string | null
  status: BookingStatus
  advance_paid: number
  total_amount: number
  payment_status: PaymentStatus
  assigned_choreographer_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  packages?: { name: string; sessions: number } | null
  choreographers?: { name: string } | null
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; color: string; border: string }> = {
  pending:     { label: "Pending",     bg: "rgba(245,166,35,0.12)",  color: "#f5a623", border: "rgba(245,166,35,0.3)"  },
  confirmed:   { label: "Confirmed",   bg: "rgba(58,134,255,0.12)",  color: "#3A86FF", border: "rgba(58,134,255,0.3)"  },
  in_progress: { label: "In Progress", bg: "rgba(163,91,255,0.12)",  color: "#a35bff", border: "rgba(163,91,255,0.3)"  },
  completed:   { label: "Completed",   bg: "rgba(37,211,102,0.12)",  color: "#25D366", border: "rgba(37,211,102,0.3)"  },
  cancelled:   { label: "Cancelled",   bg: "rgba(232,23,93,0.12)",   color: "#e8175d", border: "rgba(232,23,93,0.3)"   },
}

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "Unpaid",  color: "#e8175d" },
  partial: { label: "Partial", color: "#f5a623" },
  paid:    { label: "Paid",    color: "#25D366" },
}

const EVENT_LABELS: Record<string, string> = {
  wedding: "Wedding", corporate: "Corporate", college: "College",
  audition: "Audition", guest_performance: "Guest Perf.",
}

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "in_progress", "completed", "cancelled"]
const PAGE_SIZE = 15

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

function StatusBadge({ status }: { status: BookingStatus }) {
  const c = STATUS_CONFIG[status]
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 99, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: '"DM Sans",sans-serif', fontSize: 11, fontWeight: 600 }}>
      {c.label}
    </span>
  )
}

function StatCard({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.38)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{value}</p>
        {sub && <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}>{sub}</p>}
      </div>
    </div>
  )
}

// ── Record Payment Modal ──────────────────────────────────────────────────────
function RecordPaymentModal({ booking, onClose, onSave }: {
  booking: Booking
  onClose: () => void
  onSave: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)
  const balance = booking.total_amount - booking.advance_paid
  const [form, setForm] = useState({
    amount:         String(balance > 0 ? balance : ""),
    payment_mode:   "upi" as const,
    transaction_id: "",
    payment_date:   new Date().toISOString().slice(0, 10),
    payment_status: "completed" as const,
  })

  type PM = "cash" | "upi" | "bank_transfer" | "cheque" | "card"
  type PS = "pending" | "completed" | "failed"
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  const inputS: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", padding: "10px 13px", borderRadius: 10,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", fontSize: 13, fontFamily: '"DM Sans",sans-serif', outline: "none",
  }
  const labelS: React.CSSProperties = {
    fontFamily: '"DM Sans",sans-serif', fontSize: 10, fontWeight: 700,
    color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
    letterSpacing: "0.08em", display: "block", marginBottom: 6,
  }

  const handleSave = async () => {
    if (!form.amount || Number(form.amount) <= 0) { setError("Enter a valid amount."); return }
    setSaving(true); setError(null)
    const { error: err } = await supabase.from("payments").insert({
      booking_id:     booking.id,
      amount:         Number(form.amount),
      payment_mode:   form.payment_mode,
      transaction_id: form.transaction_id.trim() || null,
      payment_date:   form.payment_date,
      payment_status: form.payment_status,
    })
    if (err) { setError(err.message); setSaving(false); return }

    if (form.payment_status === "completed") {
      const newAdvance = booking.advance_paid + Number(form.amount)
      const newStatus = newAdvance >= booking.total_amount ? "paid" : newAdvance > 0 ? "partial" : "pending"
      await supabase.from("bookings").update({
        advance_paid: newAdvance, payment_status: newStatus,
        updated_at: new Date().toISOString(),
      }).eq("id", booking.id)
    }
    onSave(); onClose()
  }

  return createPortal(
    <>
      <style>{`
        @keyframes rpIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        .rp-inp:focus{border-color:#f5a623!important}
        .rp-sel option{background:#1a0d2e;color:#fff}
        .rp-scr::-webkit-scrollbar{width:4px}
        .rp-scr::-webkit-scrollbar-thumb{background:rgba(245,166,35,0.2);border-radius:99px}
      `}</style>
      <div style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,boxSizing:"border-box" }}>
        <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.78)",backdropFilter:"blur(8px)" }} />
        <div className="rp-scr" style={{ position:"relative",zIndex:1,width:"100%",maxWidth:500,maxHeight:"calc(100vh - 32px)",overflowY:"auto",background:"linear-gradient(160deg,rgba(26,13,46,0.99),rgba(13,10,26,0.99))",border:"1px solid rgba(37,211,102,0.25)",borderRadius:18,boxShadow:"0 40px 100px rgba(0,0,0,0.8)",animation:"rpIn 0.22s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ height:2,borderRadius:"18px 18px 0 0",background:"linear-gradient(90deg,transparent,#25D366,transparent)" }} />
          <div style={{ padding:"20px 24px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div>
              <h2 style={{ fontFamily:'"DM Sans",sans-serif',fontSize:17,fontWeight:700,color:"#fff",margin:0 }}>Record Payment</h2>
              <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"rgba(255,255,255,0.35)",margin:"3px 0 0" }}>{booking.client_name}</p>
            </div>
            <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",padding:4,lineHeight:0 }}><X size={18}/></button>
          </div>
          <div style={{ padding:"20px 24px",display:"flex",flexDirection:"column",gap:16 }}>
            <div style={{ display:"flex",gap:20,padding:"12px 16px",borderRadius:10,background:"rgba(37,211,102,0.05)",border:"1px solid rgba(37,211,102,0.15)" }}>
              {[
                { label:"Total",   value: fmt(booking.total_amount), color:"#fff"     },
                { label:"Paid",    value: fmt(booking.advance_paid), color:"#25D366"  },
                { label:"Balance", value: fmt(balance),              color:"#f5a623"  },
              ].map(f => (
                <div key={f.label}>
                  <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"rgba(255,255,255,0.35)",margin:"0 0 2px",textTransform:"uppercase",letterSpacing:"0.07em" }}>{f.label}</p>
                  <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:700,color:f.color,margin:0 }}>{f.value}</p>
                </div>
              ))}
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <div>
                <label style={labelS}>Amount (₹) *</label>
                <input className="rp-inp" type="number" min="1" style={inputS} value={form.amount} onChange={e => set("amount", e.target.value)} />
              </div>
              <div>
                <label style={labelS}>Payment Mode</label>
                <div style={{ position:"relative" }}>
                  <select className="rp-sel" value={form.payment_mode} onChange={e => set("payment_mode", e.target.value as PM)} style={{ ...inputS, appearance:"none", paddingRight:34, cursor:"pointer" }}>
                    {(["cash","upi","bank_transfer","cheque","card"] as PM[]).map(m => (
                      <option key={m} value={m}>{m === "bank_transfer" ? "Bank Transfer" : m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",pointerEvents:"none" }} />
                </div>
              </div>
              <div>
                <label style={labelS}>Payment Date</label>
                <input className="rp-inp" type="date" style={inputS} value={form.payment_date} onChange={e => set("payment_date", e.target.value)} />
              </div>
              <div>
                <label style={labelS}>Status</label>
                <div style={{ position:"relative" }}>
                  <select className="rp-sel" value={form.payment_status} onChange={e => set("payment_status", e.target.value as PS)} style={{ ...inputS, appearance:"none", paddingRight:34, cursor:"pointer" }}>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <ChevronDown size={13} style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",pointerEvents:"none" }} />
                </div>
              </div>
            </div>
            <div>
              <label style={labelS}>Transaction ID (optional)</label>
              <input className="rp-inp" placeholder="UPI ref, NEFT, cheque no…" style={inputS} value={form.transaction_id} onChange={e => set("transaction_id", e.target.value)} />
            </div>

            {error && <div style={{ padding:"10px 14px",borderRadius:10,background:"rgba(232,23,93,0.08)",border:"1px solid rgba(232,23,93,0.25)",fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#e8175d" }}>{error}</div>}

            <div style={{ display:"flex",gap:10,paddingTop:4,borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:11,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.5)",fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:600,cursor:"pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ flex:2,padding:"11px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#25D366,#1da850)",color:"#fff",fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer",opacity:saving?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                {saving ? <><Loader2 size={15} style={{ animation:"spin 1s linear infinite" }}/> Saving…</> : <><Receipt size={14}/> Record Payment</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

// ── Cancel Confirmation Modal ─────────────────────────────────────────────────
function CancelConfirmModal({ bookingName, onConfirm, onClose }: {
  bookingName: string
  onConfirm: () => Promise<void>
  onClose: () => void
}) {
  const [confirming, setConfirming] = useState(false)

  const handleConfirm = async () => {
    setConfirming(true)
    await onConfirm()
    setConfirming(false)
  }

  return createPortal(
    <>
      <style>{`@keyframes confirmIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }`}</style>
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", boxSizing: "border-box",
      }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }} />
        <div style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: 420,
          background: "linear-gradient(160deg, rgba(26,13,46,0.99), rgba(13,10,26,0.99))",
          border: "1px solid rgba(232,23,93,0.3)", borderRadius: 18,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          animation: "confirmIn 0.2s cubic-bezier(0.22,1,0.36,1) both",
          padding: "28px 28px 24px",
        }}>
          <div style={{ height: 2, borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg, transparent, #e8175d, transparent)", position: "absolute", top: 0, left: 0, right: 0 }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232,23,93,0.1)", border: "1px solid rgba(232,23,93,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertTriangle size={20} style={{ color: "#e8175d" }} />
            </div>
            <div>
              <h3 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Cancel Booking?</h3>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>
                Are you sure you want to cancel the booking for <strong style={{ color: "rgba(255,255,255,0.8)" }}>{bookingName}</strong>? This action cannot be undone.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Keep Booking
            </button>
            <button onClick={handleConfirm} disabled={confirming} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#e8175d,#c0104a)", color: "#fff", fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, cursor: confirming ? "not-allowed" : "pointer", opacity: confirming ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              {confirming ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Cancelling…</> : <><CalendarX size={14} /> Yes, Cancel</>}
            </button>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

// ── Edit Booking Modal ────────────────────────────────────────────────────────
function EditBookingModal({ booking, onClose, onSave }: {
  booking: Booking
  onClose: () => void
  onSave: (updated: Partial<Booking>) => Promise<void>
}) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    client_name: booking.client_name,
    phone:       booking.phone ?? "",
    event_date:  booking.event_date ?? "",
    location:    booking.location ?? "",
    total_amount: String(booking.total_amount),
    advance_paid: String(booking.advance_paid),
    notes:        booking.notes ?? "",
  })

  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    const totalAmount = Number(form.total_amount) || 0
    const advancePaid = Number(form.advance_paid) || 0
    const paymentStatus: PaymentStatus =
      advancePaid === 0 ? "pending"
      : advancePaid >= totalAmount ? "paid"
      : "partial"

    await onSave({
      client_name:   form.client_name.trim(),
      phone:         form.phone.trim() || undefined,
      event_date:    form.event_date || undefined,
      location:      form.location.trim() || undefined,
      total_amount:  totalAmount,
      advance_paid:  advancePaid,
      payment_status: paymentStatus,
      notes:         form.notes.trim() || undefined,
    })
    setSaving(false)
    onClose()
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", padding: "10px 13px", borderRadius: 10,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", fontSize: 13, fontFamily: '"DM Sans",sans-serif',
    outline: "none", transition: "border-color 0.2s",
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: '"DM Sans",sans-serif', fontSize: 10, fontWeight: 700,
    color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
    letterSpacing: "0.08em", display: "block", marginBottom: 6,
  }

  return createPortal(
    <>
      <style>{`
        @keyframes editIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .edit-input:focus { border-color: #f5a623 !important; }
        .edit-scroll::-webkit-scrollbar { width: 4px; }
        .edit-scroll::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.2); border-radius: 99px; }
      `}</style>
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", boxSizing: "border-box",
      }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)" }} />
        <div className="edit-scroll" style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: 600,
          maxHeight: "calc(100vh - 32px)", overflowY: "auto",
          background: "linear-gradient(160deg, rgba(26,13,46,0.99), rgba(13,10,26,0.99))",
          border: "1px solid rgba(245,166,35,0.18)", borderRadius: 18,
          boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
          animation: "editIn 0.22s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <div style={{ height: 2, borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg,transparent,#f5a623,#ff6b35,#e8175d,transparent)" }} />

          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>Edit Booking</h2>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "3px 0 0" }}>{booking.client_name}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4, lineHeight: 0 }}><X size={18} /></button>
          </div>

          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Client Name</label>
                <input className="edit-input" style={inputStyle} value={form.client_name} onChange={e => set("client_name", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input className="edit-input" style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Event Date</label>
                <input className="edit-input" type="date" style={inputStyle} value={form.event_date} onChange={e => set("event_date", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input className="edit-input" style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} placeholder="City or venue" />
              </div>
              <div>
                <label style={labelStyle}>Total Amount (₹)</label>
                <input className="edit-input" type="number" min="0" style={inputStyle} value={form.total_amount} onChange={e => set("total_amount", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Advance Paid (₹)</label>
                <input className="edit-input" type="number" min="0" style={inputStyle} value={form.advance_paid} onChange={e => set("advance_paid", e.target.value)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Notes</label>
              <textarea className="edit-input" style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.6 }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Internal notes…" />
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: "11px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#f5a623,#ff6b35)", color: "#fff", fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {saving ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function BookingDetailModal({ booking, onClose, onStatusChange, onEdit, onRecordPayment }: {
  booking: Booking
  onClose: () => void
  onStatusChange: (id: string, status: BookingStatus) => Promise<void>
  onEdit: (booking: Booking) => void
  onRecordPayment: (booking: Booking) => void
}) {
  const [updating, setUpdating] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const balance = booking.total_amount - booking.advance_paid

  const handleStatus = async (s: BookingStatus) => {
    if (s === "cancelled") { setCancelTarget(booking.id); return }
    setUpdating(true)
    await onStatusChange(booking.id, s)
    setUpdating(false)
  }

  const confirmCancel = async () => {
    setUpdating(true)
    await onStatusChange(booking.id, "cancelled")
    setCancelTarget(null)
    setUpdating(false)
  }

  return createPortal(
    <>
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .bk-modal-scroll::-webkit-scrollbar { width: 4px; }
        .bk-modal-scroll::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.2); border-radius: 99px; }
      `}</style>

      <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        zIndex: 99998, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", boxSizing: "border-box",
      }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} />

        <div className="bk-modal-scroll" style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 720,
          maxHeight: "calc(100vh - 32px)", overflowY: "auto",
          background: "linear-gradient(160deg,rgba(26,13,46,0.98),rgba(13,10,26,0.99))",
          border: "1px solid rgba(245,166,35,0.18)", borderRadius: 18,
          boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
          animation: "modalIn 0.25s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <div style={{ height: 2, borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg,transparent,#f5a623,#ff6b35,#e8175d,transparent)" }} />

          {/* Header */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>{booking.client_name}</h2>
                <StatusBadge status={booking.status} />
              </div>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                Created {new Date(booking.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4, lineHeight: 0 }}><X size={18} /></button>
          </div>

          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Two-col grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px" }}>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, fontWeight: 700, color: "#f5a623", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Client</p>
                {[
                  { label: "Name",  value: booking.client_name },
                  { label: "Phone", value: booking.phone ?? "—" },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 10 }}>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{f.label}</p>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px" }}>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, fontWeight: 700, color: "#3A86FF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Event</p>
                {[
                  { label: "Type",     value: EVENT_LABELS[booking.event_type] ?? booking.event_type },
                  { label: "Date",     value: booking.event_date ? new Date(booking.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "TBD" },
                  { label: "Location", value: booking.location ?? "—" },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 10 }}>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{f.label}</p>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: "rgba(37,211,102,0.04)", border: "1px solid rgba(37,211,102,0.15)", borderRadius: 12, padding: "16px" }}>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, fontWeight: 700, color: "#25D366", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Payment</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { label: "Total",   value: fmt(booking.total_amount), color: "#fff" },
                  { label: "Advance", value: fmt(booking.advance_paid), color: "#25D366" },
                  { label: "Balance", value: fmt(balance), color: balance > 0 ? "#f5a623" : "#25D366" },
                ].map(f => (
                  <div key={f.label} style={{ textAlign: "center", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: 9 }}>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{f.label}</p>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 16, fontWeight: 700, color: f.color, margin: 0 }}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Payment status:</span>
                <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, fontWeight: 700, color: PAYMENT_CONFIG[booking.payment_status]?.color ?? "#f5a623", textTransform: "capitalize" }}>
                  {PAYMENT_CONFIG[booking.payment_status]?.label ?? booking.payment_status}
                </span>
              </div>
            </div>

            {/* Package + choreographer */}
            {(booking.packages || booking.choreographers) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {booking.packages && (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px" }}>Package</p>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{booking.packages.name}</p>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "3px 0 0" }}>{booking.packages.sessions} sessions</p>
                  </div>
                )}
                {booking.choreographers && (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px" }}>Choreographer</p>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{booking.choreographers.name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {booking.notes && (
              <div>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Notes</p>
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.15)", fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                  {booking.notes}
                </div>
              </div>
            )}

            {/* Status update */}
            <div>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Update Status</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {STATUS_OPTIONS.map(s => {
                  const c = STATUS_CONFIG[s]
                  const isActive = booking.status === s
                  return (
                    <button key={s} disabled={updating || isActive} onClick={() => handleStatus(s)} style={{
                      padding: "6px 14px", borderRadius: 99,
                      border: `1px solid ${isActive ? c.border : "rgba(255,255,255,0.1)"}`,
                      background: isActive ? c.bg : "transparent",
                      color: isActive ? c.color : "rgba(255,255,255,0.45)",
                      fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600,
                      cursor: isActive || updating ? "default" : "pointer",
                      opacity: updating && !isActive ? 0.5 : 1, transition: "all 0.15s",
                    }}>{c.label}</button>
                  )
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {booking.phone && (
                <a href={`tel:${booking.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, textDecoration: "none", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: "#25D366" }}>
                  <Phone size={13} /> Call
                </a>
              )}
              <button onClick={() => { onClose(); onEdit(booking) }} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(58,134,255,0.25)", background: "rgba(58,134,255,0.1)", fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: "#3A86FF", cursor: "pointer" }}>
                <Edit size={13} /> Edit Booking
              </button>
              <button onClick={() => { onClose(); onRecordPayment(booking) }} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#25D366,#1da850)", fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", marginLeft: "auto", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
                <IndianRupee size={13} /> Record Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {cancelTarget && (
        <CancelConfirmModal
          bookingName={booking.client_name}
          onConfirm={confirmCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </>
  , document.body)
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookingsPage() {
  const [bookings,        setBookings]        = useState<Booking[]>([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState<string | null>(null)
  const [searchQuery,     setSearchQuery]     = useState("")
  const [statusFilter,    setStatusFilter]    = useState<BookingStatus | "all">("all")
  const [filterOpen,      setFilterOpen]      = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [editingBooking,  setEditingBooking]  = useState<Booking | null>(null)
  const [cancelTarget,    setCancelTarget]    = useState<Booking | null>(null)
  const [recordingPayment, setRecordingPayment] = useState<Booking | null>(null)
  const [dateFilter,      setDateFilter]      = useState("")
  const [page,            setPage]            = useState(1)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from("bookings")
      .select(`*, packages ( name, sessions ), choreographers ( name )`)
      .order("created_at", { ascending: false })
    if (err) setError(err.message)
    else setBookings(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    const { error: err } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (!err) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      if (selectedBooking?.id === id) setSelectedBooking(prev => prev ? { ...prev, status } : prev)
    }
  }

  const handleEdit = async (updated: Partial<Booking>) => {
    if (!editingBooking) return
    const { error: err } = await supabase
      .from("bookings")
      .update({ ...updated, updated_at: new Date().toISOString() })
      .eq("id", editingBooking.id)
    if (!err) {
      const merged = { ...editingBooking, ...updated }
      setBookings(prev => prev.map(b => b.id === editingBooking.id ? merged : b))
      if (selectedBooking?.id === editingBooking.id) setSelectedBooking(merged)
    }
  }

  const handleTableCancel = async () => {
    if (!cancelTarget) return
    await handleStatusChange(cancelTarget.id, "cancelled")
    setCancelTarget(null)
  }

  const resetPage = () => setPage(1)

  const filtered = bookings.filter(b => {
    const q = searchQuery.toLowerCase()
    const matchSearch =
      b.client_name.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      (b.location ?? "").toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || b.status === statusFilter
    const matchDate   = !dateFilter || b.created_at.slice(0, 10) === dateFilter
    return matchSearch && matchStatus && matchDate
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = {
    total:       bookings.length,
    confirmed:   bookings.filter(b => b.status === "confirmed").length,
    inProgress:  bookings.filter(b => b.status === "in_progress").length,
    revenue:     bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.total_amount, 0),
    outstanding: bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + (b.total_amount - b.advance_paid), 0),
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        .bk-row:hover{background:rgba(255,255,255,0.03)}
        .bk-action:hover{background:rgba(255,255,255,0.1)!important}
        .bk-scroll::-webkit-scrollbar{height:4px}
        .bk-scroll::-webkit-scrollbar-thumb{background:rgba(245,166,35,0.2);border-radius:99px}
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 2px", letterSpacing: "-0.01em" }}>Bookings</h1>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              {bookings.length} total · {stats.confirmed} confirmed · {stats.inProgress} in progress
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchBookings} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(245,166,35,0.2)", background: "rgba(245,166,35,0.07)", color: "#f5a623", fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
              <RefreshCw size={13} style={loading ? { animation: "spin 1s linear infinite" } : {}} /> Refresh
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#e8175d,#c0104a)", color: "#fff", fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(232,23,93,0.3)" }}>
              <Plus size={14} /> New Booking
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          <StatCard icon={<Calendar size={18}/>}     label="Total"       value={stats.total}        color="#3A86FF" />
          <StatCard icon={<CalendarCheck size={18}/>} label="Confirmed"   value={stats.confirmed}    color="#f5a623" />
          <StatCard icon={<Clock size={18}/>}         label="In Progress" value={stats.inProgress}   color="#a35bff" />
          <StatCard icon={<IndianRupee size={18}/>}   label="Revenue"     value={fmt(stats.revenue)} color="#25D366" sub={`${fmt(stats.outstanding)} outstanding`} />
        </div>

        {/* Table */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, color: "#fff", margin: 0, flex: 1 }}>All Bookings</h2>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input placeholder="Search bookings…" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); resetPage() }} style={{ padding: "7px 12px 7px 32px", borderRadius: 9, width: 220, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#fff", fontSize: 13, fontFamily: '"DM Sans",sans-serif', outline: "none" }} />
            </div>

            {/* Date filter */}
            <div style={{ position: "relative" }}>
              <input
                type="date"
                value={dateFilter}
                onChange={e => { setDateFilter(e.target.value); resetPage() }}
                style={{ padding: "7px 12px", borderRadius: 9, background: dateFilter ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${dateFilter ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.09)"}`, color: dateFilter ? "#f5a623" : "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: '"DM Sans",sans-serif', outline: "none", cursor: "pointer" }}
              />
              {dateFilter && (
                <button onClick={() => { setDateFilter(""); resetPage() }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2, lineHeight: 0 }}>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setFilterOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, background: statusFilter !== "all" ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${statusFilter !== "all" ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.09)"}`, color: statusFilter !== "all" ? "#f5a623" : "rgba(255,255,255,0.55)", fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <Filter size={13} />
                {statusFilter === "all" ? "All Status" : STATUS_CONFIG[statusFilter].label}
                <ChevronDown size={12} style={{ transform: filterOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {filterOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setFilterOpen(false)} />
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 20, background: "linear-gradient(160deg,rgba(26,13,46,0.98),rgba(13,10,26,0.99))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", overflow: "hidden", minWidth: 150 }}>
                    {(["all", ...STATUS_OPTIONS] as const).map(s => (
                      <button key={s} onClick={() => { setStatusFilter(s); setFilterOpen(false); resetPage() }} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", border: "none", background: "none", fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 500, color: s === statusFilter ? "#f5a623" : "rgba(255,255,255,0.65)", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >{s === "all" ? "All Status" : STATUS_CONFIG[s].label}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, background: "rgba(232,23,93,0.08)", borderBottom: "1px solid rgba(232,23,93,0.2)" }}>
              <AlertCircle size={15} style={{ color: "#e8175d", flexShrink: 0 }} />
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "#e8175d" }}>{error}</span>
            </div>
          )}

          {loading && (
            <div style={{ padding: "48px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <Loader2 size={20} style={{ color: "#f5a623", animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Loading bookings…</span>
            </div>
          )}

          {!loading && (
            <div className="bk-scroll" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Client", "Event", "Package", "Payment", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: '"DM Sans",sans-serif', fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                      {searchQuery || statusFilter !== "all" || dateFilter ? "No bookings match your filters." : "No bookings yet."}
                    </td></tr>
                  ) : paginated.map(b => (
                    <tr key={b.id} className="bk-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.1s", cursor: "pointer" }} onClick={() => setSelectedBooking(b)}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "rgba(58,134,255,0.12)", border: "1px solid rgba(58,134,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 700, color: "#3A86FF" }}>{b.client_name.charAt(0)}</div>
                          <div>
                            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, whiteSpace: "nowrap" }}>{b.client_name}</p>
                            {b.phone && <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>{b.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div>
                          <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                            {EVENT_LABELS[b.event_type] ?? b.event_type}
                          </span>
                          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                            <Calendar size={10} style={{ flexShrink: 0 }} />
                            {b.event_date ? new Date(b.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "TBD"}
                          </p>
                          {b.location && (
                            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 4, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <MapPin size={10} style={{ flexShrink: 0 }} />{b.location}
                            </p>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {b.packages ? (
                          <div>
                            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: 0 }}>{b.packages.name}</p>
                            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                              <Users size={10} /> {b.packages.sessions} sessions
                            </p>
                          </div>
                        ) : <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, color: "rgba(255,255,255,0.25)" }}>—</span>}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{fmt(b.total_amount)}</p>
                        {b.total_amount - b.advance_paid > 0 && (
                          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "#f5a623", margin: 0 }}>{fmt(b.total_amount - b.advance_paid)} due</p>
                        )}
                        {b.total_amount - b.advance_paid === 0 && (
                          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "#25D366", margin: 0, display: "flex", alignItems: "center", gap: 3 }}>
                            <CheckCircle size={10} /> Paid
                          </p>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                        <StatusBadge status={b.status} />
                      </td>
                      <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button className="bk-action" onClick={() => setSelectedBooking(b)} title="View" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}><Eye size={13} /></button>
                          <button className="bk-action" onClick={() => setEditingBooking(b)} title="Edit" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(58,134,255,0.08)", color: "#3A86FF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}><Edit size={13} /></button>
                          <button className="bk-action" onClick={() => setCancelTarget(b)} title="Cancel" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(232,23,93,0.08)", color: "#e8175d", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}><CalendarX size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination footer */}
          {!loading && filtered.length > 0 && (
            <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} bookings
                {dateFilter && <span style={{ color: "#f5a623", marginLeft: 6 }}>· filtered by date</span>}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "not-allowed" : "pointer" }}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce<(number | "…")[]>((acc, n, i, arr) => {
                    if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("…")
                    acc.push(n); return acc
                  }, [])
                  .map((n, i) => n === "…"
                    ? <span key={`e${i}`} style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "0 4px" }}>…</span>
                    : <button key={n} onClick={() => setPage(n as number)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${page === n ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}`, background: page === n ? "rgba(245,166,35,0.12)" : "rgba(255,255,255,0.04)", color: page === n ? "#f5a623" : "rgba(255,255,255,0.5)", fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{n}</button>
                  )
                }
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "not-allowed" : "pointer" }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          onEdit={(b) => { setSelectedBooking(null); setEditingBooking(b) }}
          onRecordPayment={(b) => { setSelectedBooking(null); setRecordingPayment(b) }}
        />
      )}

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleEdit}
        />
      )}

      {cancelTarget && !selectedBooking && (
        <CancelConfirmModal
          bookingName={cancelTarget.client_name}
          onConfirm={handleTableCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}

      {recordingPayment && (
        <RecordPaymentModal
          booking={recordingPayment}
          onClose={() => setRecordingPayment(null)}
          onSave={fetchBookings}
        />
      )}
    </>
  )
}