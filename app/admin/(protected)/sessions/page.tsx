"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabase-browser"
import {
  Search, Filter, Plus, Eye, Edit, CheckCircle, XCircle,
  Calendar, Clock, MapPin, Loader2, RefreshCw, ChevronDown,
  ChevronLeft, ChevronRight, AlertCircle, X, Save, AlertTriangle, Users,
} from "lucide-react"

// ── Types ────────────────────────────────────────────────────────────────────
type SessionStatus = "scheduled" | "completed" | "cancelled" | "rescheduled"

interface Session {
  id: string
  booking_id: string
  session_date: string
  duration_minutes: number | null
  location: string | null
  notes: string | null
  status: SessionStatus
  created_at: string
  bookings?: {
    client_name: string
    event_type: string
    phone: string | null
    choreographers?: { name: string } | null
  } | null
}

interface Booking {
  id: string
  client_name: string
  event_type: string
}

// ── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<SessionStatus, { label: string; bg: string; color: string; border: string }> = {
  scheduled:   { label: "Scheduled",   bg: "rgba(58,134,255,0.12)",  color: "#3A86FF", border: "rgba(58,134,255,0.3)"  },
  completed:   { label: "Completed",   bg: "rgba(37,211,102,0.12)",  color: "#25D366", border: "rgba(37,211,102,0.3)"  },
  cancelled:   { label: "Cancelled",   bg: "rgba(232,23,93,0.12)",   color: "#e8175d", border: "rgba(232,23,93,0.3)"   },
  rescheduled: { label: "Rescheduled", bg: "rgba(245,166,35,0.12)",  color: "#f5a623", border: "rgba(245,166,35,0.3)"  },
}

const EVENT_LABELS: Record<string, string> = {
  wedding: "Wedding", corporate: "Corporate", college: "College",
  audition: "Audition", guest_performance: "Guest Perf.",
}

const STATUS_OPTIONS: SessionStatus[] = ["scheduled", "completed", "cancelled", "rescheduled"]
const PAGE_SIZE = 15

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
function fmtDuration(mins: number | null) {
  if (!mins) return "—"
  const h = Math.floor(mins / 60), m = mins % 60
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

// ── Reusable styled components ───────────────────────────────────────────────
function StatusBadge({ status }: { status: SessionStatus }) {
  const c = STATUS_CONFIG[status]
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 99, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: '"DM Sans",sans-serif', fontSize: 11, fontWeight: 600 }}>
      {c.label}
    </span>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: "rgba(255,255,255,0.38)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{value}</p>
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

// ── Cancel Confirm Modal ──────────────────────────────────────────────────────
function CancelConfirmModal({ onConfirm, onClose }: { onConfirm: () => Promise<void>; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  return createPortal(
    <>
      <style>{`@keyframes cIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, boxSizing: "border-box" }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)" }} />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400, background: "linear-gradient(160deg,rgba(26,13,46,0.99),rgba(13,10,26,0.99))", border: "1px solid rgba(232,23,93,0.3)", borderRadius: 18, padding: "28px 28px 24px", boxShadow: "0 32px 80px rgba(0,0,0,0.7)", animation: "cIn 0.2s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ height: 2, borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg,transparent,#e8175d,transparent)", position: "absolute", top: 0, left: 0, right: 0 }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232,23,93,0.1)", border: "1px solid rgba(232,23,93,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertTriangle size={20} style={{ color: "#e8175d" }} />
            </div>
            <div>
              <h3 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Cancel Session?</h3>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>This will mark the session as cancelled. This action cannot be undone.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Keep Session</button>
            <button onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }} disabled={loading} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#e8175d,#c0104a)", color: "#fff", fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Cancelling…</> : <><XCircle size={14} /> Yes, Cancel</>}
            </button>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

// ── Session Form Modal (Add / Edit) ───────────────────────────────────────────
function SessionFormModal({ session, bookings, onClose, onSave }: {
  session?: Session
  bookings: Booking[]
  onClose: () => void
  onSave: () => void
}) {
  const isEdit = !!session
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    booking_id:       session?.booking_id ?? "",
    session_date:     session?.session_date?.slice(0, 16) ?? "",
    duration_minutes: String(session?.duration_minutes ?? ""),
    location:         session?.location ?? "",
    notes:            session?.notes ?? "",
    status:           session?.status ?? "scheduled" as SessionStatus,
  })

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.booking_id || !form.session_date) { setError("Booking and date are required."); return }
    setSaving(true); setError(null)
    const payload = {
      booking_id:       form.booking_id,
      session_date:     form.session_date,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      location:         form.location.trim() || null,
      notes:            form.notes.trim() || null,
      status:           form.status,
    }
    const query = isEdit
      ? supabase.from("sessions").update(payload).eq("id", session!.id)
      : supabase.from("sessions").insert(payload)
    const { error: err } = await query
    if (err) { setError(err.message); setSaving(false); return }
    onSave(); onClose()
  }

  return createPortal(
    <>
      <style>{`
        @keyframes fIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .sf-input:focus{border-color:#f5a623!important}
        .sf-scroll::-webkit-scrollbar{width:4px}
        .sf-scroll::-webkit-scrollbar-thumb{background:rgba(245,166,35,0.2);border-radius:99px}
        .sf-select option{background:#1a0d2e;color:#fff}
      `}</style>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, boxSizing: "border-box" }}>
        <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)" }} />
        <div className="sf-scroll" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 560, maxHeight: "calc(100vh - 32px)", overflowY: "auto", background: "linear-gradient(160deg,rgba(26,13,46,0.99),rgba(13,10,26,0.99))", border: "1px solid rgba(245,166,35,0.18)", borderRadius: 18, boxShadow: "0 40px 100px rgba(0,0,0,0.8)", animation: "fIn 0.22s cubic-bezier(0.22,1,0.36,1) both" }}>
          <div style={{ height: 2, borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg,transparent,#f5a623,#ff6b35,#e8175d,transparent)" }} />

          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>{isEdit ? "Edit Session" : "Schedule Session"}</h2>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "3px 0 0" }}>{isEdit ? "Update session details" : "Link a session to a booking"}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4, lineHeight: 0 }}><X size={18} /></button>
          </div>

          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Booking */}
            <div>
              <label style={labelStyle}>Booking *</label>
              <div style={{ position: "relative" }}>
                <select className="sf-select" value={form.booking_id} onChange={e => set("booking_id", e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: 34, cursor: "pointer" }} disabled={isEdit}>
                  <option value="">Select a booking</option>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>{b.client_name} — {EVENT_LABELS[b.event_type] ?? b.event_type}</option>
                  ))}
                </select>
                <ChevronDown size={13} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Date & Time *</label>
                <input className="sf-input" type="datetime-local" style={inputStyle} value={form.session_date} onChange={e => set("session_date", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Duration (minutes)</label>
                <input className="sf-input" type="number" min="15" step="15" placeholder="e.g. 120" style={inputStyle} value={form.duration_minutes} onChange={e => set("duration_minutes", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input className="sf-input" placeholder="Studio or venue" style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <div style={{ position: "relative" }}>
                  <select className="sf-select" value={form.status} onChange={e => set("status", e.target.value as SessionStatus)} style={{ ...inputStyle, appearance: "none", paddingRight: 34, cursor: "pointer" }}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Notes</label>
              <textarea className="sf-input" placeholder="Session plan, requirements…" style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.6 }} value={form.notes} onChange={e => set("notes", e.target.value)} />
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(232,23,93,0.08)", border: "1px solid rgba(232,23,93,0.25)", fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "#e8175d" }}>{error}</div>
            )}

            <div style={{ display: "flex", gap: 10, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: "11px", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#f5a623,#ff6b35)", color: "#fff", fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {saving ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Save size={14} /> {isEdit ? "Save Changes" : "Schedule Session"}</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SessionsPage() {
  const [sessions,      setSessions]      = useState<Session[]>([])
  const [bookings,      setBookings]      = useState<Booking[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [searchQuery,   setSearchQuery]   = useState("")
  const [statusFilter,  setStatusFilter]  = useState<SessionStatus | "all">("all")
  const [filterOpen,    setFilterOpen]    = useState(false)
  const [addOpen,       setAddOpen]       = useState(false)
  const [editSession,   setEditSession]   = useState<Session | null>(null)
  const [cancelTarget,  setCancelTarget]  = useState<Session | null>(null)
  const [dateFilter,    setDateFilter]    = useState("")
  const [page,          setPage]          = useState(1)

  const fetchSessions = useCallback(async () => {
    setLoading(true); setError(null)
    const { data, error: err } = await supabase
      .from("sessions")
      .select(`*, bookings ( client_name, event_type, phone, choreographers ( name ) )`)
      .order("session_date", { ascending: true })
    if (err) setError(err.message)
    else setSessions(data ?? [])
    setLoading(false)
  }, [])

  const fetchBookings = useCallback(async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id, client_name, event_type")
      .neq("status", "cancelled")
      .order("created_at", { ascending: false })
    setBookings(data ?? [])
  }, [])

  useEffect(() => { fetchSessions(); fetchBookings() }, [fetchSessions, fetchBookings])

  const handleStatusChange = async (id: string, status: SessionStatus) => {
    const { error: err } = await supabase
      .from("sessions")
      .update({ status })
      .eq("id", id)
    if (!err) setSessions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const resetPage = () => setPage(1)

  const filtered = sessions.filter(s => {
    const q = searchQuery.toLowerCase()
    const name = s.bookings?.client_name?.toLowerCase() ?? ""
    const loc  = s.location?.toLowerCase() ?? ""
    const matchSearch = name.includes(q) || loc.includes(q)
    const matchStatus = statusFilter === "all" || s.status === statusFilter
    const matchDate   = !dateFilter || s.session_date.slice(0, 10) === dateFilter
    return matchSearch && matchStatus && matchDate
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = {
    total:      sessions.length,
    scheduled:  sessions.filter(s => s.status === "scheduled").length,
    completed:  sessions.filter(s => s.status === "completed").length,
    cancelled:  sessions.filter(s => s.status === "cancelled").length,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        .ss-row:hover{background:rgba(255,255,255,0.03)}
        .ss-action:hover{background:rgba(255,255,255,0.1)!important}
        .ss-scroll::-webkit-scrollbar{height:4px}
        .ss-scroll::-webkit-scrollbar-thumb{background:rgba(245,166,35,0.2);border-radius:99px}
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 2px", letterSpacing: "-0.01em" }}>Sessions</h1>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              {stats.total} total · {stats.scheduled} upcoming · {stats.completed} completed
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchSessions} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(245,166,35,0.2)", background: "rgba(245,166,35,0.07)", color: "#f5a623", fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
              <RefreshCw size={13} style={loading ? { animation: "spin 1s linear infinite" } : {}} /> Refresh
            </button>
            <button onClick={() => setAddOpen(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#f5a623,#ff6b35)", color: "#fff", fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(245,166,35,0.3)" }}>
              <Plus size={14} /> Schedule Session
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
          <StatCard icon={<Calendar size={18}/>}    label="Total"     value={stats.total}     color="#3A86FF" />
          <StatCard icon={<Clock size={18}/>}        label="Upcoming"  value={stats.scheduled} color="#f5a623" />
          <StatCard icon={<CheckCircle size={18}/>}  label="Completed" value={stats.completed} color="#25D366" />
          <StatCard icon={<XCircle size={18}/>}      label="Cancelled" value={stats.cancelled} color="#e8175d" />
        </div>

        {/* Table card */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, color: "#fff", margin: 0, flex: 1 }}>All Sessions</h2>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input placeholder="Search client or location…" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); resetPage() }} style={{ padding: "7px 12px 7px 32px", borderRadius: 9, width: 230, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#fff", fontSize: 13, fontFamily: '"DM Sans",sans-serif', outline: "none" }} />
            </div>

            {/* Date filter — filters by session_date */}
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
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Loading sessions…</span>
            </div>
          )}

          {!loading && (
            <div className="ss-scroll" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Client", "Date & Time", "Duration", "Location", "Choreographer", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: '"DM Sans",sans-serif', fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: "48px 20px", textAlign: "center", fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                      {searchQuery || statusFilter !== "all" || dateFilter ? "No sessions match your filters." : "No sessions yet. Schedule one!"}
                    </td></tr>
                  ) : paginated.map(s => (
                    <tr key={s.id} className="ss-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.1s" }}>

                      {/* Client */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 700, color: "#f5a623" }}>
                            {(s.bookings?.client_name ?? "?").charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, whiteSpace: "nowrap" }}>{s.bookings?.client_name ?? "—"}</p>
                            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>{EVENT_LABELS[s.bookings?.event_type ?? ""] ?? s.bookings?.event_type ?? "—"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                          <Calendar size={12} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                          {fmtDate(s.session_date)}
                        </p>
                        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 5 }}>
                          <Clock size={10} style={{ flexShrink: 0 }} />
                          {new Date(s.session_date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </td>

                      {/* Duration */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{fmtDuration(s.duration_minutes)}</span>
                      </td>

                      {/* Location */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 5, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <MapPin size={11} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                          {s.location ?? "—"}
                        </span>
                      </td>

                      {/* Choreographer */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 5 }}>
                          <Users size={11} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                          {s.bookings?.choreographers?.name ?? "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "12px 16px" }}>
                        <StatusBadge status={s.status} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button className="ss-action" onClick={() => setEditSession(s)} title="Edit" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(58,134,255,0.08)", color: "#3A86FF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}><Edit size={13} /></button>
                          {s.status === "scheduled" && (
                            <>
                              <button className="ss-action" onClick={() => handleStatusChange(s.id, "completed")} title="Mark Completed" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(37,211,102,0.08)", color: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}><CheckCircle size={13} /></button>
                              <button className="ss-action" onClick={() => setCancelTarget(s)} title="Cancel" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(232,23,93,0.08)", color: "#e8175d", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}><XCircle size={13} /></button>
                            </>
                          )}
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
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} sessions
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

      {/* Modals */}
      {addOpen && (
        <SessionFormModal
          bookings={bookings}
          onClose={() => setAddOpen(false)}
          onSave={fetchSessions}
        />
      )}

      {editSession && (
        <SessionFormModal
          session={editSession}
          bookings={bookings}
          onClose={() => setEditSession(null)}
          onSave={fetchSessions}
        />
      )}

      {cancelTarget && (
        <CancelConfirmModal
          onConfirm={async () => { await handleStatusChange(cancelTarget.id, "cancelled"); setCancelTarget(null) }}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </>
  )
}