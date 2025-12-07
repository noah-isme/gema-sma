"use client";

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { ToastProvider } from '@/components/feedback/toast'
import PageWrapper from '@/components/ui/PageWrapper'
import ModernHeader from './ModernHeader'
import ModernSidebar from './ModernSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
  loading?: boolean
}

export default function AdminLayout({ children, loading = false }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Authentication guard for admin routes
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session) {
    // Redirect to admin login
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    return null
  }

  // Check if user is admin
  if (session.user.userType !== 'admin') {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    return null
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Modern Sidebar */}
        <ModernSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content area */}
        <div className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        }`}>
          {/* Modern Header */}
          <ModernHeader onMenuClick={() => setMobileMenuOpen(true)} />
          
          {/* Page Content */}
          <main className="p-6">
            <PageWrapper loading={loading}>
              {children}
            </PageWrapper>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}