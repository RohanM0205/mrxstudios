// app/admin/(protected)/layout.tsx
// All admin pages that need the sidebar/header live inside this route group.
// /admin/login is a sibling outside this group and therefore gets no shell.

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader }  from '@/components/admin/admin-header'

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}