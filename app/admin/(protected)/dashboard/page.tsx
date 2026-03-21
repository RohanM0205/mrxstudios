'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-browser'
import {
  Users, CalendarCheck, CreditCard, TrendingUp,
  ArrowUpRight, ArrowDownRight, Calendar, Clock, Loader2,
} from 'lucide-react'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Lead {
  id: string; name: string; event_type: string; status: string; created_at: string
}
type SessionBooking = { client_name: string; event_type: string }

interface Session {
  id: string; session_date: string; location: string | null; status: string
  /** Supabase may infer a one-to-one join as an object or (incorrectly) as an array */
  bookings?: SessionBooking | SessionBooking[] | null
}

function sessionBooking(s: Session): SessionBooking | undefined {
  const b = s.bookings
  if (!b) return undefined
  return Array.isArray(b) ? b[0] : b
}
interface StatsData {
  totalLeads: number; activeBookings: number
  monthRevenue: number; conversionRate: number
  leadsChange: number; bookingsChange: number
  revenueChange: number; conversionChange: number
}

const EVENT_LABELS: Record<string, string> = {
  wedding: 'Wedding', corporate: 'Corporate', college: 'College',
  audition: 'Audition', guest_performance: 'Guest Perf.',
}

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  new:       { label: 'New',       bg: 'rgba(58,134,255,0.12)',  color: '#3A86FF' },
  contacted: { label: 'Contacted', bg: 'rgba(245,166,35,0.12)', color: '#f5a623' },
  qualified: { label: 'Qualified', bg: 'rgba(163,91,255,0.12)', color: '#a35bff' },
  converted: { label: 'Converted', bg: 'rgba(37,211,102,0.12)', color: '#25D366' },
  lost:      { label: 'Lost',      bg: 'rgba(232,23,93,0.12)',  color: '#e8175d' },
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ title, value, change, trend, icon: Icon, href, color, loading }: {
  title: string; value: string; change: string; trend: 'up' | 'down'
  icon: React.ElementType; href: string; color: string; loading: boolean
}) {
  return (
    <Link href={href}>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '20px', cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
      >
        <div>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>{title}</p>
          {loading
            ? <div style={{ width: 80, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
            : <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 6px', lineHeight: 1 }}>{value}</p>
          }
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: '"DM Sans",sans-serif', fontSize: 11, fontWeight: 600, color: trend === 'up' ? '#25D366' : '#e8175d' }}>
            {trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {change} vs last month
          </div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </Link>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats,        setStats]        = useState<StatsData | null>(null)
  const [recentLeads,  setRecentLeads]  = useState<Lead[]>([])
  const [todaySessions,setTodaySessions]= useState<Session[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [sessLoading,  setSessLoading]  = useState(true)

  // ── Fetch stats ──
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true)
      const now     = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

      const [
        { count: totalLeads },
        { count: lastMonthLeads },
        { count: activeBookings },
        { count: lastMonthBookings },
        { data: thisMonthPayments },
        { data: lastMonthPayments },
        { count: totalConverted },
        { count: totalLeadsAll },
      ] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
        supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', lastMonthStart).lte('created_at', lastMonthEnd),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['confirmed', 'in_progress', 'pending']),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['confirmed', 'in_progress', 'pending']).gte('created_at', lastMonthStart).lte('created_at', lastMonthEnd),
        supabase.from('payments').select('amount').eq('payment_status', 'completed').gte('payment_date', monthStart),
        supabase.from('payments').select('amount').eq('payment_status', 'completed').gte('payment_date', lastMonthStart).lte('payment_date', lastMonthEnd),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
      ])

      const monthRev     = (thisMonthPayments ?? []).reduce((s, p) => s + (p.amount ?? 0), 0)
      const lastMonthRev = (lastMonthPayments ?? []).reduce((s, p) => s + (p.amount ?? 0), 0)

      const pct = (cur: number, prev: number) => prev === 0 ? 100 : ((cur - prev) / prev) * 100

      setStats({
        totalLeads:       totalLeads ?? 0,
        activeBookings:   activeBookings ?? 0,
        monthRevenue:     monthRev,
        conversionRate:   totalLeadsAll ? Math.round(((totalConverted ?? 0) / totalLeadsAll) * 100) : 0,
        leadsChange:      pct(totalLeads ?? 0, lastMonthLeads ?? 0),
        bookingsChange:   pct(activeBookings ?? 0, lastMonthBookings ?? 0),
        revenueChange:    pct(monthRev, lastMonthRev),
        conversionChange: 0,
      })
      setStatsLoading(false)
    }
    fetchStats()
  }, [])

  // ── Fetch recent leads ──
  useEffect(() => {
    const fetchLeads = async () => {
      setLeadsLoading(true)
      const { data } = await supabase
        .from('leads')
        .select('id, name, event_type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentLeads(data ?? [])
      setLeadsLoading(false)
    }
    fetchLeads()
  }, [])

  // ── Fetch today's sessions ──
  useEffect(() => {
    const fetchSessions = async () => {
      setSessLoading(true)
      const today     = new Date()
      const dayStart  = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
      const dayEnd    = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()
      const { data } = await supabase
        .from('sessions')
        .select('id, session_date, location, status, bookings ( client_name, event_type )')
        .gte('session_date', dayStart)
        .lte('session_date', dayEnd)
        .neq('status', 'cancelled')
        .order('session_date', { ascending: true })
        .limit(4)
      setTodaySessions(data ?? [])
      setSessLoading(false)
    }
    fetchSessions()
  }, [])

  const statCards = stats ? [
    { title: 'Total Leads',          value: String(stats.totalLeads),      change: `${stats.leadsChange >= 0 ? '+' : ''}${stats.leadsChange.toFixed(1)}%`,    trend: stats.leadsChange >= 0 ? ('up' as const) : ('down' as const),      icon: Users,        href: '/admin/leads',    color: '#3A86FF' },
    { title: 'Active Bookings',      value: String(stats.activeBookings),  change: `${stats.bookingsChange >= 0 ? '+' : ''}${stats.bookingsChange.toFixed(1)}%`, trend: stats.bookingsChange >= 0 ? ('up' as const) : ('down' as const),   icon: CalendarCheck, href: '/admin/bookings', color: '#f5a623' },
    { title: 'Revenue (This Month)', value: fmt(stats.monthRevenue),       change: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}%`,  trend: stats.revenueChange >= 0 ? ('up' as const) : ('down' as const),    icon: CreditCard,   href: '/admin/payments', color: '#25D366' },
    { title: 'Conversion Rate',      value: `${stats.conversionRate}%`,    change: '—',                                                                           trend: 'up' as const,                                        icon: TrendingUp,   href: '/admin/leads',    color: '#e8175d' },
  ] : []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .dash-card:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 3px', letterSpacing: '-0.01em' }}>Dashboard</h1>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Welcome back! Here's what's happening at MRX Studios.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', fontFamily: '"DM Sans",sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            <Calendar size={13} />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14 }}>
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, height: 110 }}>
                  <div style={{ width: 80, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite', marginBottom: 12 }} />
                  <div style={{ width: 60, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
                </div>
              ))
            : statCards.map(s => <StatCard key={s.title} {...s} loading={false} />)
          }
        </div>

        {/* Two-col content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>

          {/* Recent Leads */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Recent Leads</h2>
              <Link href="/admin/leads" style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, color: '#3A86FF', textDecoration: 'none', padding: '4px 10px', borderRadius: 8, background: 'rgba(58,134,255,0.08)' }}>View all →</Link>
            </div>
            <div style={{ padding: '8px 12px 12px' }}>
              {leadsLoading ? (
                <div style={{ padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <Loader2 size={16} style={{ color: '#f5a623', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Loading…</span>
                </div>
              ) : recentLeads.length === 0 ? (
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '24px 0', margin: 0 }}>No leads yet.</p>
              ) : recentLeads.map(lead => {
                const s = statusConfig[lead.status] ?? statusConfig.new
                return (
                  <div key={lead.id} className="dash-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 10px', borderRadius: 11, transition: 'background 0.15s', background: 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                        {lead.name.charAt(0)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{lead.name}</p>
                        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{EVENT_LABELS[lead.event_type] ?? lead.event_type}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0, marginLeft: 10 }}>
                      <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 99, background: s.bg, color: s.color, fontFamily: '"DM Sans",sans-serif', fontSize: 11, fontWeight: 600 }}>{s.label}</span>
                      <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{timeAgo(lead.created_at)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Today's Sessions */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Today's Sessions</h2>
              <Link href="/admin/sessions" style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, color: '#3A86FF', textDecoration: 'none', padding: '4px 10px', borderRadius: 8, background: 'rgba(58,134,255,0.08)' }}>View all →</Link>
            </div>
            <div style={{ padding: '12px 12px 12px' }}>
              {sessLoading ? (
                <div style={{ padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <Loader2 size={16} style={{ color: '#f5a623', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Loading…</span>
                </div>
              ) : todaySessions.length === 0 ? (
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '24px 0', margin: 0 }}>No sessions scheduled for today.</p>
              ) : todaySessions.map(session => {
                const booking = sessionBooking(session)
                return (
                <div key={session.id} className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 8, background: 'rgba(255,255,255,0.02)', transition: 'background 0.15s' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 11, background: 'rgba(58,134,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={13} style={{ color: '#3A86FF', marginBottom: 2 }} />
                    <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, fontWeight: 700, color: '#3A86FF', lineHeight: 1 }}>
                      {fmtTime(session.session_date).split(' ')[0]}
                    </span>
                    <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 9, color: '#3A86FF', opacity: 0.7, lineHeight: 1 }}>
                      {fmtTime(session.session_date).split(' ')[1]}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{booking?.client_name ?? '—'}</p>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{EVENT_LABELS[booking?.event_type ?? ''] ?? booking?.event_type ?? '—'}</p>
                  </div>
                  {session.location && (
                    <div style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 11, padding: '3px 9px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', flexShrink: 0, whiteSpace: 'nowrap', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {session.location}
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 20px 20px' }}>
          <h2 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 14px' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12 }}>
            {[
              { href: '/admin/leads',    icon: Users,        color: '#3A86FF', label: 'New Lead'         },
              { href: '/admin/bookings', icon: CalendarCheck, color: '#f5a623', label: 'New Booking'     },
              { href: '/admin/sessions', icon: Calendar,     color: '#25D366', label: 'Schedule Session' },
              { href: '/admin/payments', icon: CreditCard,   color: '#e8175d', label: 'Record Payment'   },
            ].map(({ href, icon: Icon, color, label }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '18px 12px', borderRadius: 13, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}