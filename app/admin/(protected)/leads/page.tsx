"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabase-browser"
import { ConvertToBookingModal } from "@/components/admin/ConvertToBookingModal"
import {
  Search, Filter, Eye, CheckCircle, XCircle, Phone, Mail,
  Calendar, Users, TrendingUp, Clock, X, Loader2, RefreshCw,
  ChevronDown, ChevronLeft, ChevronRight, AlertCircle, Edit2, Save,
} from "lucide-react"

type LeadStatus   = "new" | "contacted" | "qualified" | "converted" | "lost"
type LeadPriority = "high" | "medium" | "low"

interface Lead {
  id: string
  name: string
  phone: string
  email: string | null
  event_type: string
  event_subtype: string | null
  event_date: string | null
  location: string | null
  message: string | null
  status: LeadStatus
  source: string
  follow_up_date: string | null
  notes: string | null
  priority: LeadPriority
  created_at: string
  updated_at: string
}

const statusConfig: Record<LeadStatus, { label: string; bg: string; color: string; border: string }> = {
  new:       { label: "New",       bg: "rgba(58,134,255,0.12)",  color: "#3A86FF", border: "rgba(58,134,255,0.3)"  },
  contacted: { label: "Contacted", bg: "rgba(245,166,35,0.12)",  color: "#f5a623", border: "rgba(245,166,35,0.3)"  },
  qualified: { label: "Qualified", bg: "rgba(163,91,255,0.12)",  color: "#a35bff", border: "rgba(163,91,255,0.3)"  },
  converted: { label: "Converted", bg: "rgba(37,211,102,0.12)",  color: "#25D366", border: "rgba(37,211,102,0.3)"  },
  lost:      { label: "Lost",      bg: "rgba(232,23,93,0.12)",   color: "#e8175d", border: "rgba(232,23,93,0.3)"   },
}

const priorityConfig: Record<LeadPriority, { color: string; bg: string; border: string }> = {
  high:   { color: "#e8175d", bg: "rgba(232,23,93,0.12)",  border: "rgba(232,23,93,0.3)"  },
  medium: { color: "#f5a623", bg: "rgba(245,166,35,0.12)", border: "rgba(245,166,35,0.3)" },
  low:    { color: "#25D366", bg: "rgba(37,211,102,0.12)", border: "rgba(37,211,102,0.3)" },
}

const eventLabels: Record<string, string> = {
  wedding: "Wedding", corporate: "Corporate", college: "College",
  audition: "Audition", guest_performance: "Guest Perf.",
}

const STATUS_OPTIONS:   LeadStatus[]   = ["new", "contacted", "qualified", "lost"]
const PRIORITY_OPTIONS: LeadPriority[] = ["high", "medium", "low"]
const PAGE_SIZE = 15

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const c = statusConfig[status] ?? statusConfig.new
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 99, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600 }}>
      {c.label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const c = priorityConfig[priority] ?? priorityConfig.medium
  return (
    <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 99, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>
      ● {priority}
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
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 24, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{value}</p>
      </div>
    </div>
  )
}

function LeadDetailModal({ lead, onClose, onStatusChange, onPriorityChange, onFollowUpChange, onConvert }: {
  lead: Lead
  onClose: () => void
  onStatusChange:  (id: string, status: LeadStatus) => Promise<void>
  onPriorityChange:(id: string, priority: LeadPriority) => Promise<void>
  onFollowUpChange:(id: string, followUp: string | null) => Promise<void>
  onConvert:       (lead: Lead) => void
}) {
  const [updating,        setUpdating]        = useState(false)
  const [editingFollowUp, setEditingFollowUp] = useState(false)
  const [followUpValue,   setFollowUpValue]   = useState(
    lead.follow_up_date ? lead.follow_up_date.slice(0, 16) : ""
  )

  const handle = async (fn: () => Promise<void>) => {
    setUpdating(true)
    await fn()
    setUpdating(false)
  }

  const saveFollowUp = async () => {
    await handle(() => onFollowUpChange(lead.id, followUpValue || null))
    setEditingFollowUp(false)
  }

  return createPortal(
    <>
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        .lead-modal-scroll::-webkit-scrollbar { width: 4px; }
        .lead-modal-scroll::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.2); border-radius: 99px; }
      `}</style>

      {/* Full viewport overlay — flex centers the modal */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box",
      }}>
        {/* Backdrop */}
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Modal panel */}
        <div
          className="lead-modal-scroll"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 720,
            maxHeight: "calc(100vh - 32px)",
            overflowY: "auto",
            background: "linear-gradient(160deg, rgba(26,13,46,0.99), rgba(13,10,26,0.99))",
            border: "1px solid rgba(245,166,35,0.18)",
            borderRadius: 18,
            boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
            animation: "modalIn 0.22s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          {/* Fire bar */}
          <div style={{ height: 2, borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg, transparent, #f5a623, #ff6b35, #e8175d, transparent)" }} />

          {/* Header */}
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>{lead.name}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <StatusBadge status={lead.status} />
                <PriorityBadge priority={lead.priority} />
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                  Created {fmtDateTime(lead.created_at)}
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4, lineHeight: 0, flexShrink: 0 }}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
              {[
                { label: "Phone",      value: lead.phone,                                          icon: <Phone size={12} />    },
                { label: "Email",      value: lead.email ?? "—",                                   icon: <Mail size={12} />     },
                { label: "Event Type", value: eventLabels[lead.event_type] ?? lead.event_type,     icon: <Calendar size={12} /> },
                { label: "Event Date", value: lead.event_date ? fmtDate(lead.event_date) : "TBD", icon: <Calendar size={12} /> },
                { label: "Location",   value: lead.location ?? "—",                                icon: null },
                { label: "Source",     value: lead.source,                                         icon: null },
                { label: "Created At", value: fmtDateTime(lead.created_at),                        icon: <Clock size={12} />    },
                { label: "Updated At", value: fmtDateTime(lead.updated_at),                        icon: <Clock size={12} />    },
              ].map(f => (
                <div key={f.label}>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>{f.label}</p>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, display: "flex", alignItems: "center", gap: 5, textTransform: f.label === "Source" ? "capitalize" : undefined }}>
                    {f.icon && <span style={{ color: "rgba(255,255,255,0.3)" }}>{f.icon}</span>}
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Follow-up date editor */}
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(58,134,255,0.05)", border: "1px solid rgba(58,134,255,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingFollowUp ? 10 : 0 }}>
                <div>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>Follow-up Date & Time</p>
                  {!editingFollowUp && (
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: lead.follow_up_date ? "#3A86FF" : "rgba(255,255,255,0.3)", margin: 0 }}>
                      {lead.follow_up_date ? fmtDateTime(lead.follow_up_date) : "Not set"}
                    </p>
                  )}
                </div>
                {!editingFollowUp ? (
                  <button onClick={() => setEditingFollowUp(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 7, border: "1px solid rgba(58,134,255,0.25)", background: "rgba(58,134,255,0.08)", color: "#3A86FF", fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    <Edit2 size={11} /> Edit
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => setEditingFollowUp(false)} style={{ padding: "5px 11px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontFamily: '"DM Sans", sans-serif', fontSize: 12, cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button onClick={saveFollowUp} disabled={updating} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, border: "none", background: "#3A86FF", color: "#fff", fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      <Save size={11} /> Save
                    </button>
                  </div>
                )}
              </div>
              {editingFollowUp && (
                <input
                  type="datetime-local"
                  value={followUpValue}
                  onChange={e => setFollowUpValue(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(58,134,255,0.3)", color: "#fff", fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: "none" }}
                />
              )}
            </div>

            {/* Message */}
            {lead.message && (
              <div>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Message</p>
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                  {lead.message}
                </div>
              </div>
            )}

            {/* Notes */}
            {lead.notes && (
              <div>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Notes</p>
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.15)", fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                  {lead.notes}
                </div>
              </div>
            )}

            {/* Priority editor */}
            <div>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Set Priority</p>
              <div style={{ display: "flex", gap: 6 }}>
                {PRIORITY_OPTIONS.map(p => {
                  const c = priorityConfig[p]
                  const isActive = lead.priority === p
                  return (
                    <button key={p} disabled={updating || isActive} onClick={() => handle(() => onPriorityChange(lead.id, p))} style={{
                      padding: "6px 14px", borderRadius: 99,
                      border: `1px solid ${isActive ? c.border : "rgba(255,255,255,0.1)"}`,
                      background: isActive ? c.bg : "transparent",
                      color: isActive ? c.color : "rgba(255,255,255,0.45)",
                      fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 700,
                      cursor: isActive || updating ? "default" : "pointer",
                      textTransform: "capitalize", transition: "all 0.15s",
                    }}>{p}</button>
                  )
                })}
              </div>
            </div>

            {/* Status editor */}
            <div>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>Update Status</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {STATUS_OPTIONS.map(s => {
                  const c = statusConfig[s]
                  const isActive = lead.status === s
                  return (
                    <button key={s} disabled={updating || isActive} onClick={() => handle(() => onStatusChange(lead.id, s))} style={{
                      padding: "6px 14px", borderRadius: 99,
                      border: `1px solid ${isActive ? c.border : "rgba(255,255,255,0.1)"}`,
                      background: isActive ? c.bg : "transparent",
                      color: isActive ? c.color : "rgba(255,255,255,0.45)",
                      fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600,
                      cursor: isActive || updating ? "default" : "pointer",
                      opacity: updating && !isActive ? 0.5 : 1, transition: "all 0.15s",
                    }}>{c.label}</button>
                  )
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <a href={`tel:${lead.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, textDecoration: "none", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: "#25D366" }}>
                <Phone size={14} /> Call
              </a>
              {lead.email && (
                <a href={`mailto:${lead.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, textDecoration: "none", background: "rgba(58,134,255,0.1)", border: "1px solid rgba(58,134,255,0.25)", fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: "#3A86FF" }}>
                  <Mail size={14} /> Email
                </a>
              )}
              <button onClick={() => { onClose(); onConvert(lead) }} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #25D366, #1da850)", fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", marginLeft: "auto", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
                <CheckCircle size={14} /> Convert to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  , document.body)
}

export default function LeadsPage() {
  const [leads,          setLeads]          = useState<Lead[]>([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState<string | null>(null)
  const [searchQuery,    setSearchQuery]    = useState("")
  const [statusFilter,   setStatusFilter]   = useState<LeadStatus | "all">("all")
  const [selectedLead,   setSelectedLead]   = useState<Lead | null>(null)
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null)
  const [filterOpen,     setFilterOpen]     = useState(false)
  const [dateFilter,     setDateFilter]     = useState("")
  const [page,           setPage]           = useState(1)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
    if (err) setError(err.message)
    else setLeads(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    const { error: err } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (!err) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
      setSelectedLead(prev => prev?.id === id ? { ...prev, status } : prev)
    }
  }

  const handlePriorityChange = async (id: string, priority: LeadPriority) => {
    const { error: err } = await supabase
      .from("leads")
      .update({ priority, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (!err) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, priority } : l))
      setSelectedLead(prev => prev?.id === id ? { ...prev, priority } : prev)
    }
  }

  const handleFollowUpChange = async (id: string, follow_up_date: string | null) => {
    const { error: err } = await supabase
      .from("leads")
      .update({ follow_up_date, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (!err) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, follow_up_date } : l))
      setSelectedLead(prev => prev?.id === id ? { ...prev, follow_up_date } : prev)
    }
  }

  const resetPage = () => setPage(1)

  const filtered = leads.filter(l => {
    const q = searchQuery.toLowerCase()
    const matchSearch =
      l.name.toLowerCase().includes(q) ||
      (l.email ?? "").toLowerCase().includes(q) ||
      l.phone.includes(q)
    const matchStatus = statusFilter === "all" || l.status === statusFilter
    const matchDate   = !dateFilter || l.created_at.slice(0, 10) === dateFilter
    return matchSearch && matchStatus && matchDate
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const stats = {
    total:     leads.length,
    new:       leads.filter(l => l.status === "new").length,
    qualified: leads.filter(l => l.status === "qualified").length,
    converted: leads.filter(l => l.status === "converted").length,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .leads-row:hover { background: rgba(255,255,255,0.03); }
        .action-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .leads-scroll::-webkit-scrollbar { height: 4px; }
        .leads-scroll::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.2); border-radius: 99px; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 2px", letterSpacing: "-0.01em" }}>Leads</h1>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>{leads.length} total · {stats.new} new</p>
          </div>
          <button onClick={fetchLeads} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(245,166,35,0.2)", background: "rgba(245,166,35,0.07)", color: "#f5a623", fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
            <RefreshCw size={13} style={loading ? { animation: "spin 1s linear infinite" } : {}} /> Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          <StatCard icon={<Users size={18} />}      label="Total Leads" value={stats.total}     color="#3A86FF" />
          <StatCard icon={<Clock size={18} />}       label="New"         value={stats.new}       color="#f5a623" />
          <StatCard icon={<TrendingUp size={18} />}  label="Qualified"   value={stats.qualified} color="#a35bff" />
          <StatCard icon={<CheckCircle size={18} />} label="Converted"   value={stats.converted} color="#25D366" />
        </div>

        {/* Table card */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 700, color: "#fff", margin: 0, flex: 1 }}>All Leads</h2>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input placeholder="Search leads…" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); resetPage() }} style={{ padding: "7px 12px 7px 32px", borderRadius: 9, width: 220, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#fff", fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: "none" }} />
            </div>

            {/* Date filter */}
            <div style={{ position: "relative" }}>
              <input
                type="date"
                value={dateFilter}
                onChange={e => { setDateFilter(e.target.value); resetPage() }}
                style={{ padding: "7px 12px", borderRadius: 9, background: dateFilter ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${dateFilter ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.09)"}`, color: dateFilter ? "#f5a623" : "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: '"DM Sans", sans-serif', outline: "none", cursor: "pointer" }}
              />
              {dateFilter && (
                <button onClick={() => { setDateFilter(""); resetPage() }} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2, lineHeight: 0 }}>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setFilterOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, background: statusFilter !== "all" ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${statusFilter !== "all" ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.09)"}`, color: statusFilter !== "all" ? "#f5a623" : "rgba(255,255,255,0.55)", fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <Filter size={13} />
                {statusFilter === "all" ? "All Status" : statusConfig[statusFilter].label}
                <ChevronDown size={12} style={{ transform: filterOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {filterOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setFilterOpen(false)} />
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 20, background: "linear-gradient(160deg, rgba(26,13,46,0.98), rgba(13,10,26,0.99))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", overflow: "hidden", minWidth: 140 }}>
                    {(["all", ...STATUS_OPTIONS] as const).map(s => (
                      <button key={s} onClick={() => { setStatusFilter(s); setFilterOpen(false); resetPage() }} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", border: "none", background: "none", fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500, color: s === statusFilter ? "#f5a623" : "rgba(255,255,255,0.65)", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >{s === "all" ? "All Status" : statusConfig[s].label}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10, background: "rgba(232,23,93,0.08)", borderBottom: "1px solid rgba(232,23,93,0.2)" }}>
              <AlertCircle size={15} style={{ color: "#e8175d", flexShrink: 0 }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#e8175d" }}>{error}</span>
            </div>
          )}

          {loading && (
            <div style={{ padding: "48px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <Loader2 size={20} style={{ color: "#f5a623", animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Loading leads…</span>
            </div>
          )}

          {!loading && (
            <div className="leads-scroll" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Name", "Contact", "Event", "Date", "Status", "Priority", "Follow-up", "Created At", ""].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: "48px 20px", textAlign: "center", fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                      {searchQuery || statusFilter !== "all" || dateFilter ? "No leads match your filters." : "No leads yet."}
                    </td></tr>
                  ) : paginated.map(lead => (
                    <tr key={lead.id} className="leads-row" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.1s", cursor: "pointer" }} onClick={() => setSelectedLead(lead)}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 700, color: "#f5a623" }}>{lead.name.charAt(0)}</div>
                          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>{lead.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 5 }}>
                            <Phone size={11} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} /> {lead.phone}
                          </span>
                          {lead.email && (
                            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 5 }}>
                              <Mail size={11} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                              <span style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.email}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", padding: "3px 9px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {eventLabels[lead.event_type] ?? lead.event_type}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 5 }}>
                          <Calendar size={11} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                          {lead.event_date ? new Date(lead.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "TBD"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                        <PriorityBadge priority={lead.priority} />
                      </td>
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: lead.follow_up_date ? "#3A86FF" : "rgba(255,255,255,0.25)" }}>
                          {lead.follow_up_date ? fmtDateTime(lead.follow_up_date) : "—"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                          {fmtDateTime(lead.created_at)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button className="action-btn" onClick={() => setSelectedLead(lead)} title="View Details" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}><Eye size={13} /></button>
                          <a href={`tel:${lead.phone}`} className="action-btn" title="Call" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(37,211,102,0.08)", color: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", textDecoration: "none", transition: "background 0.15s" }}><Phone size={13} /></a>
                          <button className="action-btn" onClick={() => handleStatusChange(lead.id, "lost")} title="Mark Lost" style={{ width: 30, height: 30, borderRadius: 7, border: "none", background: "rgba(232,23,93,0.08)", color: "#e8175d", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}><XCircle size={13} /></button>
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
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} leads
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
                    ? <span key={`e${i}`} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "0 4px" }}>…</span>
                    : <button key={n} onClick={() => setPage(n as number)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${page === n ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.1)"}`, background: page === n ? "rgba(245,166,35,0.12)" : "rgba(255,255,255,0.04)", color: page === n ? "#f5a623" : "rgba(255,255,255,0.5)", fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{n}</button>
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

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onFollowUpChange={handleFollowUpChange}
          onConvert={(lead) => { setSelectedLead(null); setConvertingLead(lead) }}
        />
      )}

      {convertingLead && (
        <ConvertToBookingModal
          lead={convertingLead as any}
          onClose={() => setConvertingLead(null)}
        />
      )}
    </>
  )
}