"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabase-browser"
import {
  Search, Filter, Plus, CheckCircle, XCircle, Clock, Loader2,
  RefreshCw, ChevronDown, ChevronLeft, ChevronRight, AlertCircle,
  AlertTriangle,
  X, Save, IndianRupee, TrendingDown, Receipt, Edit, Trash2,
} from "lucide-react"

type PaymentStatus = "pending" | "completed" | "failed"
type PaymentMode   = "cash" | "upi" | "bank_transfer" | "cheque" | "card"

interface Payment {
  id: string
  booking_id: string
  amount: number
  payment_mode: PaymentMode
  payment_status: PaymentStatus
  transaction_id: string | null
  payment_date: string
  created_at: string
  bookings?: {
    client_name: string
    event_type: string
    total_amount: number
    advance_paid: number
  } | null
}

interface Booking {
  id: string
  client_name: string
  event_type: string
  total_amount: number
  advance_paid: number
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  pending:   { label: "Pending",   bg: "rgba(245,166,35,0.12)",  color: "#f5a623", border: "rgba(245,166,35,0.3)"  },
  completed: { label: "Completed", bg: "rgba(37,211,102,0.12)",  color: "#25D366", border: "rgba(37,211,102,0.3)"  },
  failed:    { label: "Failed",    bg: "rgba(232,23,93,0.12)",   color: "#e8175d", border: "rgba(232,23,93,0.3)"   },
  paid:      { label: "Paid",      bg: "rgba(37,211,102,0.12)",  color: "#25D366", border: "rgba(37,211,102,0.3)"  },
  partial:   { label: "Partial",   bg: "rgba(163,91,255,0.12)",  color: "#a35bff", border: "rgba(163,91,255,0.3)"  },
  refunded:  { label: "Refunded",  bg: "rgba(58,134,255,0.12)",  color: "#3A86FF", border: "rgba(58,134,255,0.3)"  },
}

const MODE_LABELS: Record<PaymentMode, string> = {
  cash: "Cash", upi: "UPI", bank_transfer: "Bank Transfer", cheque: "Cheque", card: "Card",
}

const EVENT_LABELS: Record<string, string> = {
  wedding: "Wedding", corporate: "Corporate", college: "College",
  audition: "Audition", guest_performance: "Guest Perf.",
}

const STATUS_OPTIONS: PaymentStatus[] = ["pending", "completed", "failed"]
const MODE_OPTIONS:   PaymentMode[]   = ["cash", "upi", "bank_transfer", "cheque", "card"]

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  }
}

function toLocalDatetimeValue(iso: string) {
  const d = new Date(iso)
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] ?? { label: status, bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.15)" }
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 99, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: '"DM Sans",sans-serif', fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>
      {c.label}
    </span>
  )
}

function StatCard({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string; color: string; sub?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.38)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{value}</p>
        {sub && <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}>{sub}</p>}
      </div>
    </div>
  )
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

// ── Record / Edit Payment Modal ───────────────────────────────────────────────
function PaymentFormModal({ payment, bookings, onClose, onSave }: {
  payment?: Payment
  bookings: Booking[]
  onClose: () => void
  onSave: () => void
}) {
  const isEdit = !!payment
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  const defaultDatetime = payment
    ? toLocalDatetimeValue(payment.payment_date)
    : new Date().toISOString().slice(0, 16)

  const [form, setForm] = useState({
    booking_id:     payment?.booking_id ?? "",
    amount:         payment ? String(payment.amount) : "",
    payment_mode:   (payment?.payment_mode ?? "upi") as PaymentMode,
    transaction_id: payment?.transaction_id ?? "",
    payment_date:   defaultDatetime,
    payment_status: (payment?.payment_status ?? "completed") as PaymentStatus,
  })

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  const selectedBooking = bookings.find(b => b.id === form.booking_id)
    ?? (isEdit ? { id: payment!.booking_id, client_name: payment!.bookings?.client_name ?? "", event_type: payment!.bookings?.event_type ?? "", total_amount: payment!.bookings?.total_amount ?? 0, advance_paid: payment!.bookings?.advance_paid ?? 0 } : undefined)
  const balance = selectedBooking ? selectedBooking.total_amount - selectedBooking.advance_paid : 0

  const handleSave = async () => {
    if (!form.booking_id || !form.amount) { setError("Booking and amount are required."); return }
    if (Number(form.amount) <= 0) { setError("Amount must be greater than 0."); return }
    setSaving(true); setError(null)

    const payload = {
      booking_id:     form.booking_id,
      amount:         Number(form.amount),
      payment_mode:   form.payment_mode,
      transaction_id: form.transaction_id.trim() || null,
      payment_date:   new Date(form.payment_date).toISOString(),
      payment_status: form.payment_status,
    }

    let err: any
    if (isEdit) {
      const res = await supabase.from("payments").update(payload).eq("id", payment!.id)
      err = res.error
    } else {
      const res = await supabase.from("payments").insert(payload)
      err = res.error
    }

    if (err) { setError(err.message); setSaving(false); return }

    // Update booking advance_paid if completed
    if (form.payment_status === "completed" && selectedBooking) {
      const amountDiff = isEdit
        ? Number(form.amount) - (payment?.amount ?? 0)
        : Number(form.amount)
      const newAdvance = Math.max(0, selectedBooking.advance_paid + amountDiff)
      const newStatus = newAdvance >= selectedBooking.total_amount ? "paid" : newAdvance > 0 ? "partial" : "pending"
      await supabase.from("bookings").update({
        advance_paid: newAdvance,
        payment_status: newStatus,
        updated_at: new Date().toISOString(),
      }).eq("id", form.booking_id)
    }

    onSave(); onClose()
  }

  return createPortal(
    <>
      <style>{`
        @keyframes pfIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .pf-inp:focus{border-color:#f5a623!important}
        .pf-sel option{background:#1a0d2e;color:#fff}
        .pf-scr::-webkit-scrollbar{width:4px}
        .pf-scr::-webkit-scrollbar-thumb{background:rgba(245,166,35,0.2);border-radius:99px}
      `}</style>
      <div style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,boxSizing:"border-box" }}>
        <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.78)",backdropFilter:"blur(8px)" }} />
        <div className="pf-scr" style={{ position:"relative",zIndex:1,width:"100%",maxWidth:540,maxHeight:"calc(100vh - 32px)",overflowY:"auto",background:"linear-gradient(160deg,rgba(26,13,46,0.99),rgba(13,10,26,0.99))",border:"1px solid rgba(245,166,35,0.18)",borderRadius:18,boxShadow:"0 40px 100px rgba(0,0,0,0.8)",animation:"pfIn 0.22s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ height:2,borderRadius:"18px 18px 0 0",background:"linear-gradient(90deg,transparent,#f5a623,#ff6b35,#e8175d,transparent)" }} />

          <div style={{ padding:"20px 24px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div>
              <h2 style={{ fontFamily:'"DM Sans",sans-serif',fontSize:17,fontWeight:700,color:"#fff",margin:0 }}>{isEdit ? "Edit Payment" : "Record Payment"}</h2>
              <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"rgba(255,255,255,0.35)",margin:"3px 0 0" }}>{isEdit ? payment!.bookings?.client_name : "Log a new payment against a booking"}</p>
            </div>
            <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",padding:4,lineHeight:0 }}><X size={18}/></button>
          </div>

          <div style={{ padding:"20px 24px",display:"flex",flexDirection:"column",gap:16 }}>

            {/* Booking selector */}
            <div>
              <label style={labelStyle}>Booking *</label>
              <div style={{ position:"relative" }}>
                <select className="pf-sel" value={form.booking_id} onChange={e => set("booking_id", e.target.value)} disabled={isEdit} style={{ ...inputStyle,appearance:"none",paddingRight:34,cursor:isEdit?"not-allowed":"pointer",opacity:isEdit?0.6:1 }}>
                  <option value="">Select a booking</option>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>{b.client_name} — {EVENT_LABELS[b.event_type] ?? b.event_type} (Bal: {fmt(b.total_amount - b.advance_paid)})</option>
                  ))}
                  {isEdit && !bookings.find(b => b.id === payment!.booking_id) && (
                    <option value={payment!.booking_id}>{payment!.bookings?.client_name ?? "Unknown booking"}</option>
                  )}
                </select>
                <ChevronDown size={13} style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",pointerEvents:"none" }} />
              </div>
              {selectedBooking && (
                <div style={{ marginTop:8,padding:"10px 14px",borderRadius:10,background:"rgba(245,166,35,0.06)",border:"1px solid rgba(245,166,35,0.15)",display:"flex",gap:20 }}>
                  {[
                    { label:"Total",   value:fmt(selectedBooking.total_amount) },
                    { label:"Paid",    value:fmt(selectedBooking.advance_paid) },
                    { label:"Balance", value:fmt(balance), hi:true },
                  ].map(f => (
                    <div key={f.label}>
                      <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"rgba(255,255,255,0.35)",margin:"0 0 2px",textTransform:"uppercase",letterSpacing:"0.07em" }}>{f.label}</p>
                      <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:700,color:f.hi?"#f5a623":"#fff",margin:0 }}>{f.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              <div>
                <label style={labelStyle}>Amount (₹) *</label>
                <input className="pf-inp" type="number" min="1" placeholder="Enter amount" style={inputStyle} value={form.amount} onChange={e => set("amount", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Payment Mode</label>
                <div style={{ position:"relative" }}>
                  <select className="pf-sel" value={form.payment_mode} onChange={e => set("payment_mode", e.target.value as PaymentMode)} style={{ ...inputStyle,appearance:"none",paddingRight:34,cursor:"pointer" }}>
                    {MODE_OPTIONS.map(m => <option key={m} value={m}>{MODE_LABELS[m]}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",pointerEvents:"none" }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Date & Time *</label>
                <input className="pf-inp" type="datetime-local" style={inputStyle} value={form.payment_date} onChange={e => set("payment_date", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <div style={{ position:"relative" }}>
                  <select className="pf-sel" value={form.payment_status} onChange={e => set("payment_status", e.target.value as PaymentStatus)} style={{ ...inputStyle,appearance:"none",paddingRight:34,cursor:"pointer" }}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",pointerEvents:"none" }} />
                </div>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Transaction ID (optional)</label>
              <input className="pf-inp" placeholder="UPI ref, NEFT number, cheque no…" style={inputStyle} value={form.transaction_id} onChange={e => set("transaction_id", e.target.value)} />
            </div>

            {error && <div style={{ padding:"10px 14px",borderRadius:10,background:"rgba(232,23,93,0.08)",border:"1px solid rgba(232,23,93,0.25)",fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#e8175d" }}>{error}</div>}

            <div style={{ display:"flex",gap:10,paddingTop:4,borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:11,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.5)",fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:600,cursor:"pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ flex:2,padding:"11px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#25D366,#1da850)",color:"#fff",fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer",opacity:saving?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                {saving ? <><Loader2 size={15} style={{ animation:"spin 1s linear infinite" }}/> Saving…</> : <><Save size={14}/> {isEdit ? "Save Changes" : "Record Payment"}</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({ payment, onConfirm, onClose }: {
  payment: Payment
  onConfirm: () => Promise<void>
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  return createPortal(
    <>
      <style>{`@keyframes dcIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,boxSizing:"border-box" }}>
        <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.78)",backdropFilter:"blur(8px)" }} />
        <div style={{ position:"relative",zIndex:1,width:"100%",maxWidth:400,background:"linear-gradient(160deg,rgba(26,13,46,0.99),rgba(13,10,26,0.99))",border:"1px solid rgba(232,23,93,0.3)",borderRadius:18,padding:"28px 28px 24px",boxShadow:"0 32px 80px rgba(0,0,0,0.7)",animation:"dcIn 0.2s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ height:2,borderRadius:"18px 18px 0 0",background:"linear-gradient(90deg,transparent,#e8175d,transparent)",position:"absolute",top:0,left:0,right:0 }} />
          <div style={{ display:"flex",alignItems:"flex-start",gap:16,marginBottom:20 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:"rgba(232,23,93,0.1)",border:"1px solid rgba(232,23,93,0.25)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <AlertTriangle size={20} style={{ color:"#e8175d" }} />
            </div>
            <div>
              <h3 style={{ fontFamily:'"DM Sans",sans-serif',fontSize:16,fontWeight:700,color:"#fff",margin:"0 0 6px" }}>Delete Payment?</h3>
              <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6 }}>
                Delete <strong style={{ color:"#fff" }}>{fmt(payment.amount)}</strong> payment from <strong style={{ color:"#fff" }}>{payment.bookings?.client_name}</strong>? This cannot be undone and will not auto-update the booking balance.
              </p>
            </div>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:11,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.5)",fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:600,cursor:"pointer" }}>Keep It</button>
            <button onClick={async()=>{setLoading(true);await onConfirm();setLoading(false)}} disabled={loading} style={{ flex:1,padding:"11px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#e8175d,#c0104a)",color:"#fff",fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
              {loading ? <><Loader2 size={14} style={{ animation:"spin 1s linear infinite" }}/> Deleting…</> : <><Trash2 size={14}/> Delete</>}
            </button>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

// ── Mark Received Confirm ────────────────────────────────────────────────────
function MarkReceivedModal({ payment, onConfirm, onClose }: {
  payment: Payment
  onConfirm: () => Promise<void>
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  return createPortal(
    <>
      <style>{`@keyframes mrIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:16,boxSizing:"border-box" }}>
        <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.78)",backdropFilter:"blur(8px)" }} />
        <div style={{ position:"relative",zIndex:1,width:"100%",maxWidth:400,background:"linear-gradient(160deg,rgba(26,13,46,0.99),rgba(13,10,26,0.99))",border:"1px solid rgba(37,211,102,0.3)",borderRadius:18,padding:"28px 28px 24px",boxShadow:"0 32px 80px rgba(0,0,0,0.7)",animation:"mrIn 0.2s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ height:2,borderRadius:"18px 18px 0 0",background:"linear-gradient(90deg,transparent,#25D366,transparent)",position:"absolute",top:0,left:0,right:0 }} />
          <div style={{ display:"flex",alignItems:"flex-start",gap:16,marginBottom:20 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.25)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <CheckCircle size={20} style={{ color:"#25D366" }} />
            </div>
            <div>
              <h3 style={{ fontFamily:'"DM Sans",sans-serif',fontSize:16,fontWeight:700,color:"#fff",margin:"0 0 6px" }}>Mark as Received?</h3>
              <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"rgba(255,255,255,0.5)",margin:0,lineHeight:1.6 }}>
                Confirm receipt of <strong style={{ color:"#fff" }}>{fmt(payment.amount)}</strong> from <strong style={{ color:"#fff" }}>{payment.bookings?.client_name}</strong>. This will update the booking's advance paid.
              </p>
            </div>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:11,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.5)",fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:600,cursor:"pointer" }}>Cancel</button>
            <button onClick={async()=>{setLoading(true);await onConfirm();setLoading(false)}} disabled={loading} style={{ flex:1,padding:"11px",borderRadius:11,border:"none",background:"linear-gradient(135deg,#25D366,#1da850)",color:"#fff",fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
              {loading ? <><Loader2 size={14} style={{ animation:"spin 1s linear infinite" }}/> Saving…</> : <><CheckCircle size={14}/> Confirm</>}
            </button>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [payments,      setPayments]      = useState<Payment[]>([])
  const [bookings,      setBookings]      = useState<Booking[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [searchQuery,   setSearchQuery]   = useState("")
  const [statusFilter,  setStatusFilter]  = useState<PaymentStatus | "all">("all")
  const [filterOpen,    setFilterOpen]    = useState(false)
  const [addOpen,       setAddOpen]       = useState(false)
  const [editPayment,   setEditPayment]   = useState<Payment | null>(null)
  const [deletePayment, setDeletePayment] = useState<Payment | null>(null)
  const [markReceived,  setMarkReceived]  = useState<Payment | null>(null)
  const [dateFilter,    setDateFilter]    = useState("")
  const [page,          setPage]          = useState(1)
  const PAGE_SIZE = 15

  const fetchPayments = useCallback(async () => {
    setLoading(true); setError(null)
    const { data, error: err } = await supabase
      .from("payments")
      .select(`*, bookings ( client_name, event_type, total_amount, advance_paid )`)
      .order("payment_date", { ascending: false })
    if (err) setError(err.message)
    else setPayments(data ?? [])
    setLoading(false)
  }, [])

  const fetchBookings = useCallback(async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id, client_name, event_type, total_amount, advance_paid")
      .neq("status", "cancelled")
      .order("created_at", { ascending: false })
    setBookings(data ?? [])
  }, [])

  useEffect(() => { fetchPayments(); fetchBookings() }, [fetchPayments, fetchBookings])

  const handleMarkReceived = async (payment: Payment) => {
    await supabase.from("payments").update({ payment_status: "completed", payment_date: new Date().toISOString() }).eq("id", payment.id)
    if (payment.bookings) {
      const newAdvance = payment.bookings.advance_paid + payment.amount
      const newStatus = newAdvance >= payment.bookings.total_amount ? "paid" : newAdvance > 0 ? "partial" : "pending"
      await supabase.from("bookings").update({ advance_paid: newAdvance, payment_status: newStatus, updated_at: new Date().toISOString() }).eq("id", payment.booking_id)
    }
    setMarkReceived(null); fetchPayments(); fetchBookings()
  }

  const handleDelete = async (payment: Payment) => {
    await supabase.from("payments").delete().eq("id", payment.id)
    setDeletePayment(null); fetchPayments()
  }

  const filtered = payments.filter(p => {
    const q = searchQuery.toLowerCase()
    const name = p.bookings?.client_name?.toLowerCase() ?? ""
    const matchSearch = name.includes(q) || p.id.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || p.payment_status === statusFilter
    const matchDate = !dateFilter || p.payment_date.slice(0, 10) === dateFilter
    return matchSearch && matchStatus && matchDate
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page when filters change
  const resetPage = () => setPage(1)

  const stats = {
    received: payments.filter(p => p.payment_status === "completed").reduce((s, p) => s + p.amount, 0),
    pending:  payments.filter(p => p.payment_status === "pending").reduce((s, p) => s + p.amount, 0),
    failed:   payments.filter(p => p.payment_status === "failed").reduce((s, p) => s + p.amount, 0),
    count:    payments.length,
  }

  const pendingPayments = payments.filter(p => p.payment_status === "pending")

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        .py-row:hover{background:rgba(255,255,255,0.03)}
        .py-action:hover{background:rgba(255,255,255,0.1)!important}
        .py-scroll::-webkit-scrollbar{height:4px}
        .py-scroll::-webkit-scrollbar-thumb{background:rgba(245,166,35,0.2);border-radius:99px}
      `}</style>

      <div style={{ display:"flex",flexDirection:"column",gap:20 }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
          <div>
            <h1 style={{ fontFamily:'"Cormorant Garamond",Georgia,serif',fontSize:26,fontWeight:700,color:"#fff",margin:"0 0 2px",letterSpacing:"-0.01em" }}>Payments</h1>
            <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"rgba(255,255,255,0.4)",margin:0 }}>
              {stats.count} transactions · {fmt(stats.received)} received · {fmt(stats.pending)} pending
            </p>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={fetchPayments} disabled={loading} style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 14px",borderRadius:10,border:"1px solid rgba(245,166,35,0.2)",background:"rgba(245,166,35,0.07)",color:"#f5a623",fontFamily:'"DM Sans",sans-serif',fontSize:12,fontWeight:600,cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1 }}>
              <RefreshCw size={13} style={loading?{animation:"spin 1s linear infinite"}:{}} /> Refresh
            </button>
            <button onClick={() => setAddOpen(true)} style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#25D366,#1da850)",color:"#fff",fontFamily:'"DM Sans",sans-serif',fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(37,211,102,0.3)" }}>
              <Plus size={14} /> Record Payment
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12 }}>
          <StatCard icon={<IndianRupee size={18}/>} label="Total Received" value={fmt(stats.received)} color="#25D366" />
          <StatCard icon={<Clock size={18}/>}        label="Pending"        value={fmt(stats.pending)}  color="#f5a623" sub={`${pendingPayments.length} payment${pendingPayments.length !== 1 ? "s" : ""}`} />
          <StatCard icon={<TrendingDown size={18}/>} label="Failed"         value={fmt(stats.failed)}   color="#e8175d" />
          <StatCard icon={<Receipt size={18}/>}      label="Transactions"   value={String(stats.count)} color="#3A86FF" />
        </div>

        {/* Pending highlight */}
        {pendingPayments.length > 0 && (
          <div style={{ background:"rgba(245,166,35,0.05)",border:"1px solid rgba(245,166,35,0.2)",borderRadius:16,padding:"16px 20px" }}>
            <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:11,fontWeight:700,color:"#f5a623",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 12px" }}>
              Pending Payments ({pendingPayments.length})
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {pendingPayments.map(p => (
                <div key={p.id} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderRadius:12,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",flexWrap:"wrap",gap:10 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ width:36,height:36,borderRadius:10,background:"rgba(245,166,35,0.1)",border:"1px solid rgba(245,166,35,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <Clock size={16} style={{ color:"#f5a623" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:13,fontWeight:600,color:"#fff",margin:0 }}>{p.bookings?.client_name ?? "—"}</p>
                      <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"rgba(255,255,255,0.4)",margin:0 }}>
                        {MODE_LABELS[p.payment_mode]} · {fmtDateTime(p.payment_date).date} {fmtDateTime(p.payment_date).time}
                      </p>
                    </div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                    <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:16,fontWeight:700,color:"#f5a623",margin:0 }}>{fmt(p.amount)}</p>
                    <button onClick={() => setMarkReceived(p)} style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#25D366,#1da850)",color:"#fff",fontFamily:'"DM Sans",sans-serif',fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:"0 3px 10px rgba(37,211,102,0.3)" }}>
                      <CheckCircle size={13} /> Mark Received
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden" }}>
          <div style={{ padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
            <h2 style={{ fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:700,color:"#fff",margin:0,flex:1 }}>Payment History</h2>
            <div style={{ position:"relative" }}>
              <Search size={14} style={{ position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.3)",pointerEvents:"none" }} />
              <input placeholder="Search client…" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); resetPage() }} style={{ padding:"7px 12px 7px 32px",borderRadius:9,width:210,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"#fff",fontSize:13,fontFamily:'"DM Sans",sans-serif',outline:"none" }} />
            </div>
            {/* Date filter */}
            <div style={{ position:"relative" }}>
              <input
                type="date"
                value={dateFilter}
                onChange={e => { setDateFilter(e.target.value); resetPage() }}
                style={{ padding:"7px 12px",borderRadius:9,background: dateFilter ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.05)",border:`1px solid ${dateFilter ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.09)"}`,color: dateFilter ? "#f5a623" : "rgba(255,255,255,0.4)",fontSize:13,fontFamily:'"DM Sans",sans-serif',outline:"none",cursor:"pointer" }}
              />
              {dateFilter && (
                <button onClick={() => { setDateFilter(""); resetPage() }} style={{ position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",padding:2,lineHeight:0 }}>
                  <X size={12} />
                </button>
              )}
            </div>
            <div style={{ position:"relative" }}>
              <button onClick={() => setFilterOpen(v => !v)} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:9,background:statusFilter!=="all"?"rgba(245,166,35,0.1)":"rgba(255,255,255,0.05)",border:`1px solid ${statusFilter!=="all"?"rgba(245,166,35,0.3)":"rgba(255,255,255,0.09)"}`,color:statusFilter!=="all"?"#f5a623":"rgba(255,255,255,0.55)",fontFamily:'"DM Sans",sans-serif',fontSize:12,fontWeight:600,cursor:"pointer" }}>
                <Filter size={13} />
                {statusFilter === "all" ? "All Status" : STATUS_CONFIG[statusFilter].label}
                <ChevronDown size={12} style={{ transform:filterOpen?"rotate(180deg)":"none",transition:"transform 0.2s" }} />
              </button>
              {filterOpen && (
                <>
                  <div style={{ position:"fixed",inset:0,zIndex:10 }} onClick={() => setFilterOpen(false)} />
                  <div style={{ position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:20,background:"linear-gradient(160deg,rgba(26,13,46,0.98),rgba(13,10,26,0.99))",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,boxShadow:"0 16px 40px rgba(0,0,0,0.5)",overflow:"hidden",minWidth:140 }}>
                    {(["all",...STATUS_OPTIONS] as const).map(s => (
                      <button key={s} onClick={() => { setStatusFilter(s); setFilterOpen(false); resetPage() }} style={{ display:"block",width:"100%",textAlign:"left",padding:"9px 14px",border:"none",background:"none",fontFamily:'"DM Sans",sans-serif',fontSize:13,fontWeight:500,color:s===statusFilter?"#f5a623":"rgba(255,255,255,0.65)",cursor:"pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background="rgba(255,255,255,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.background="none")}
                      >{s === "all" ? "All Status" : STATUS_CONFIG[s].label}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div style={{ padding:"14px 20px",display:"flex",alignItems:"center",gap:10,background:"rgba(232,23,93,0.08)",borderBottom:"1px solid rgba(232,23,93,0.2)" }}>
              <AlertCircle size={15} style={{ color:"#e8175d",flexShrink:0 }} />
              <span style={{ fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#e8175d" }}>{error}</span>
            </div>
          )}

          {loading && (
            <div style={{ padding:"48px 20px",display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
              <Loader2 size={20} style={{ color:"#f5a623",animation:"spin 1s linear infinite" }} />
              <span style={{ fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"rgba(255,255,255,0.4)" }}>Loading payments…</span>
            </div>
          )}

          {!loading && (
            <div className="py-scroll" style={{ overflowX:"auto" }}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    {["Client","Amount","Mode","Transaction ID","Date & Time","Status","Actions"].map(h => (
                      <th key={h} style={{ padding:"10px 16px",textAlign:"left",fontFamily:'"DM Sans",sans-serif',fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.08em",whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding:"48px 20px",textAlign:"center",fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"rgba(255,255,255,0.3)" }}>
                      {searchQuery || statusFilter !== "all" ? "No payments match your filters." : "No payments recorded yet."}
                    </td></tr>
                  ) : paginated.map(p => {
                    const dt = fmtDateTime(p.payment_date)
                    return (
                      <tr key={p.id} className="py-row" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)",transition:"background 0.1s" }}>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                            <div style={{ width:32,height:32,borderRadius:8,flexShrink:0,background:"rgba(37,211,102,0.12)",border:"1px solid rgba(37,211,102,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:'"DM Sans",sans-serif',fontSize:12,fontWeight:700,color:"#25D366" }}>
                              {(p.bookings?.client_name ?? "?").charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:13,fontWeight:600,color:"#fff",margin:0,whiteSpace:"nowrap" }}>{p.bookings?.client_name ?? "—"}</p>
                              <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"rgba(255,255,255,0.35)",margin:0 }}>{EVENT_LABELS[p.bookings?.event_type ?? ""] ?? p.bookings?.event_type ?? "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:14,fontWeight:700,color:p.payment_status==="completed"?"#25D366":p.payment_status==="failed"?"#e8175d":"#f5a623",margin:0 }}>{fmt(p.amount)}</p>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"rgba(255,255,255,0.6)",padding:"2px 9px",borderRadius:6,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)" }}>
                            {MODE_LABELS[p.payment_mode]}
                          </span>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ fontFamily:"monospace",fontSize:12,color:p.transaction_id?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.2)" }}>
                            {p.transaction_id ?? "—"}
                          </span>
                        </td>
                        <td style={{ padding:"12px 16px",whiteSpace:"nowrap" }}>
                          <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"rgba(255,255,255,0.7)",margin:0,fontWeight:500 }}>{dt.date}</p>
                          <p style={{ fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"rgba(255,255,255,0.35)",margin:"2px 0 0",display:"flex",alignItems:"center",gap:4 }}>
                            <Clock size={10} style={{ flexShrink:0 }} />{dt.time}
                          </p>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <StatusBadge status={p.payment_status} />
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                            <button className="py-action" onClick={() => setEditPayment(p)} title="Edit" style={{ width:30,height:30,borderRadius:7,border:"none",background:"rgba(58,134,255,0.08)",color:"#3A86FF",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.15s" }}><Edit size={13}/></button>
                            {p.payment_status === "pending" && (
                              <button className="py-action" onClick={() => setMarkReceived(p)} title="Mark Received" style={{ width:30,height:30,borderRadius:7,border:"none",background:"rgba(37,211,102,0.08)",color:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.15s" }}><CheckCircle size={13}/></button>
                            )}
                            <button className="py-action" onClick={() => setDeletePayment(p)} title="Delete" style={{ width:30,height:30,borderRadius:7,border:"none",background:"rgba(232,23,93,0.08)",color:"#e8175d",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.15s" }}><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div style={{ padding:"12px 20px",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
              <span style={{ fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"rgba(255,255,255,0.25)" }}>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} payments
                {dateFilter && <span style={{ color:"#f5a623",marginLeft:6 }}>· filtered by date</span>}
              </span>
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width:30,height:30,borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:page===1?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.6)",display:"flex",alignItems:"center",justifyContent:"center",cursor:page===1?"not-allowed":"pointer" }}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce<(number | "…")[]>((acc, n, i, arr) => {
                    if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("…")
                    acc.push(n); return acc
                  }, [])
                  .map((n, i) => n === "…"
                    ? <span key={`e${i}`} style={{ fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"rgba(255,255,255,0.3)",padding:"0 4px" }}>…</span>
                    : <button key={n} onClick={() => setPage(n as number)} style={{ width:30,height:30,borderRadius:8,border:`1px solid ${page===n?"rgba(245,166,35,0.4)":"rgba(255,255,255,0.1)"}`,background:page===n?"rgba(245,166,35,0.12)":"rgba(255,255,255,0.04)",color:page===n?"#f5a623":"rgba(255,255,255,0.5)",fontFamily:'"DM Sans",sans-serif',fontSize:12,fontWeight:600,cursor:"pointer" }}>{n}</button>
                  )
                }
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width:30,height:30,borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:page===totalPages?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.6)",display:"flex",alignItems:"center",justifyContent:"center",cursor:page===totalPages?"not-allowed":"pointer" }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {addOpen && <PaymentFormModal bookings={bookings} onClose={() => setAddOpen(false)} onSave={() => { fetchPayments(); fetchBookings() }} />}
      {editPayment && <PaymentFormModal payment={editPayment} bookings={bookings} onClose={() => setEditPayment(null)} onSave={() => { fetchPayments(); fetchBookings() }} />}
      {deletePayment && <DeleteConfirmModal payment={deletePayment} onConfirm={() => handleDelete(deletePayment)} onClose={() => setDeletePayment(null)} />}
      {markReceived && <MarkReceivedModal payment={markReceived} onConfirm={() => handleMarkReceived(markReceived)} onClose={() => setMarkReceived(null)} />}
    </>
  )
}