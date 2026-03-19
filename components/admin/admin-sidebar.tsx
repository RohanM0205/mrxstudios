'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Package, 
  Image, 
  Music, 
  UserCog, 
  Calendar, 
  CreditCard,
  Sparkles,
  FileText,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Packages', href: '/admin/packages', icon: Package },
  { name: 'Media', href: '/admin/media', icon: Image },
  { name: 'Songs', href: '/admin/songs', icon: Music },
  { name: 'Dance Plan Rules', href: '/admin/dance-plan-rules', icon: FileText },
  { name: 'Choreographers', href: '/admin/choreographers', icon: UserCog },
  { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-sidebar-border">
        <Sparkles className="h-8 w-8 text-[#E6C9A8]" />
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground font-serif">
            MRX Admin
          </span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-sidebar-foreground/60">
            Dashboard
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Back to Website */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle Button (in header) */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <LayoutDashboard className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-sidebar-foreground"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
