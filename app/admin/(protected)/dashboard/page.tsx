'use client'

import {
  Users,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const stats = [
  {
    title: 'Total Leads',
    value: '156',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    href: '/admin/leads',
    color: '#3A86FF',
  },
  {
    title: 'Active Bookings',
    value: '23',
    change: '+5.2%',
    trend: 'up',
    icon: CalendarCheck,
    href: '/admin/bookings',
    color: '#f5a623',
  },
  {
    title: 'Revenue (This Month)',
    value: '₹4.2L',
    change: '+18.7%',
    trend: 'up',
    icon: CreditCard,
    href: '/admin/payments',
    color: '#25D366',
  },
  {
    title: 'Conversion Rate',
    value: '34%',
    change: '-2.1%',
    trend: 'down',
    icon: TrendingUp,
    href: '/admin/leads',
    color: '#e8175d',
  },
]

const recentLeads = [
  { id: '1', name: 'Priya Sharma',      event: 'Wedding Sangeet',        date: '2 mins ago',  status: 'new'       },
  { id: '2', name: 'Vikram Industries', event: 'Corporate Annual Day',   date: '1 hour ago',  status: 'contacted' },
  { id: '3', name: 'IIT Mumbai',        event: 'College Fest',           date: '3 hours ago', status: 'qualified' },
  { id: '4', name: 'Rahul Mehta',       event: 'Reception Dance',        date: '5 hours ago', status: 'new'       },
  { id: '5', name: 'Sneha Patel',       event: 'Audition Prep',          date: 'Yesterday',   status: 'converted' },
]

const upcomingSessions = [
  { id: '1', client: 'Sharma Family',  time: '10:00 AM', type: 'Sangeet Practice',  location: 'Client Home'   },
  { id: '2', client: 'TechCorp Team',  time: '2:00 PM',  type: 'Group Session',     location: 'Studio'        },
  { id: '3', client: 'Ananya College', time: '5:00 PM',  type: 'Competition Prep',  location: 'College Campus'},
]

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  new:       { label: 'New',       bg: 'rgba(58,134,255,0.12)',  color: '#3A86FF' },
  contacted: { label: 'Contacted', bg: 'rgba(245,166,35,0.12)', color: '#f5a623' },
  qualified: { label: 'Qualified', bg: 'rgba(37,211,102,0.12)', color: '#25D366' },
  converted: { label: 'Converted', bg: 'rgba(37,211,102,0.18)', color: '#25D366' },
  lost:      { label: 'Lost',      bg: 'rgba(232,23,93,0.12)',  color: '#e8175d' },
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back! Here&apos;s what&apos;s happening at MRX Studios.
          </p>
        </div>
        {/* Live date badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/50 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border border-border/60">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <div
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: stat.trend === 'up' ? '#25D366' : '#e8175d' }}
                      >
                        {stat.trend === 'up'
                          ? <ArrowUpRight className="h-3.5 w-3.5" />
                          : <ArrowDownRight className="h-3.5 w-3.5" />
                        }
                        {stat.change} vs last month
                      </div>
                    </div>
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: `${stat.color}18` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* ── Content Grid ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent Leads */}
        <Card className="border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
            <Link
              href="/admin/leads"
              className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
              style={{ color: '#3A86FF', background: 'rgba(58,134,255,0.08)' }}
            >
              View all →
            </Link>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            {recentLeads.map((lead) => {
              const s = statusConfig[lead.status] ?? statusConfig.new
              return (
                <div
                  key={lead.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                    >
                      {lead.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{lead.event}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                    <p className="text-xs text-muted-foreground">{lead.date}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Today's Sessions */}
        <Card className="border border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Today&apos;s Sessions</CardTitle>
            <Link
              href="/admin/sessions"
              className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
              style={{ color: '#3A86FF', background: 'rgba(58,134,255,0.08)' }}
            >
              View all →
            </Link>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {upcomingSessions.map((session, i) => (
              <div
                key={session.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                {/* Time bubble */}
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-center"
                  style={{ background: 'rgba(58,134,255,0.1)' }}
                >
                  <Clock className="h-3.5 w-3.5 mb-0.5" style={{ color: '#3A86FF' }} />
                  <span className="text-[10px] font-bold leading-none" style={{ color: '#3A86FF' }}>
                    {session.time.split(' ')[0]}
                  </span>
                  <span className="text-[9px] leading-none" style={{ color: '#3A86FF', opacity: 0.7 }}>
                    {session.time.split(' ')[1]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{session.client}</p>
                  <p className="text-xs text-muted-foreground">{session.type}</p>
                </div>
                <div
                  className="text-xs px-2.5 py-1 rounded-lg font-medium flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {session.location}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { href: '/admin/leads',    icon: Users,        color: '#3A86FF', label: 'New Lead'          },
              { href: '/admin/bookings', icon: CalendarCheck, color: '#f5a623', label: 'New Booking'      },
              { href: '/admin/sessions', icon: Calendar,     color: '#25D366', label: 'Schedule Session'  },
              { href: '/admin/payments', icon: CreditCard,   color: '#e8175d', label: 'Record Payment'    },
            ].map(({ href, icon: Icon, color, label }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border/40 bg-muted/30 hover:bg-muted/60 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}