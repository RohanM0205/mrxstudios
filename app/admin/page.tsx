import { 
  Users, 
  CalendarCheck, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock
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
    color: '#E6C9A8',
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
    color: '#FF6B6B',
  },
]

const recentLeads = [
  { id: '1', name: 'Priya Sharma', event: 'Wedding Sangeet', date: '2 mins ago', status: 'new' },
  { id: '2', name: 'Vikram Industries', event: 'Corporate Annual Day', date: '1 hour ago', status: 'contacted' },
  { id: '3', name: 'IIT Mumbai', event: 'College Fest', date: '3 hours ago', status: 'qualified' },
  { id: '4', name: 'Rahul Mehta', event: 'Reception Dance', date: '5 hours ago', status: 'new' },
  { id: '5', name: 'Sneha Patel', event: 'Audition Prep', date: 'Yesterday', status: 'converted' },
]

const upcomingSessions = [
  { id: '1', client: 'Sharma Family', time: '10:00 AM', type: 'Sangeet Practice', location: 'Client Home' },
  { id: '2', client: 'TechCorp Team', time: '2:00 PM', type: 'Group Session', location: 'Studio' },
  { id: '3', client: 'Ananya College', time: '5:00 PM', type: 'Competition Prep', location: 'College Campus' },
]

const statusColors = {
  new: 'bg-[#3A86FF]/10 text-[#3A86FF]',
  contacted: 'bg-[#E6C9A8]/20 text-[#3F3D56]',
  qualified: 'bg-[#25D366]/10 text-[#25D366]',
  converted: 'bg-[#25D366]/20 text-[#25D366]',
  lost: 'bg-destructive/10 text-destructive',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening at MRX Studios.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover-lift transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      stat.trend === 'up' ? 'text-[#25D366]' : 'text-destructive'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Recent Leads</CardTitle>
            <Link href="/admin/leads" className="text-sm text-[#3A86FF] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.event}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[lead.status as keyof typeof statusColors]
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{lead.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Today&apos;s Sessions</CardTitle>
            <Link href="/admin/sessions" className="text-sm text-[#3A86FF] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 bg-[#3A86FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-[#3A86FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{session.client}</p>
                    <p className="text-xs text-muted-foreground">{session.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground text-sm">{session.time}</p>
                    <p className="text-xs text-muted-foreground">{session.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/leads" className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-[#3A86FF]" />
              <span className="text-sm font-medium text-foreground">New Lead</span>
            </Link>
            <Link href="/admin/bookings" className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors text-center">
              <CalendarCheck className="h-6 w-6 mx-auto mb-2 text-[#E6C9A8]" />
              <span className="text-sm font-medium text-foreground">New Booking</span>
            </Link>
            <Link href="/admin/sessions" className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-[#25D366]" />
              <span className="text-sm font-medium text-foreground">Schedule Session</span>
            </Link>
            <Link href="/admin/payments" className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-[#FF6B6B]" />
              <span className="text-sm font-medium text-foreground">Record Payment</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
