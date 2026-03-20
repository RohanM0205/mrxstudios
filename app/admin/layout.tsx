import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader }  from '@/components/admin/admin-header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | MRX Studios',
  description: 'MRX Studios admin dashboard for managing leads, bookings, and operations.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}