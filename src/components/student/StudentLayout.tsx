'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  Code,
  Code2,
  Bell,
  Sparkles
} from 'lucide-react'
import Image from 'next/image'
import { studentAuth } from '@/lib/student-auth'
import PageWrapper from '@/components/ui/PageWrapper'
import { AnimatePresence, motion } from 'framer-motion'

const MOTIVATIONAL_MESSAGES = [
  'Ayo semangat hari ini 🔥',
  'Belajar santai tapi konsisten ✨',
  'Setiap baris kode itu progres 🚀',
  'Waktu terbaik untuk belajar itu sekarang 💡'
]

interface StudentLayoutProps {
  children: React.ReactNode
  loading?: boolean
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
  badge?: number
  teacherOnly?: boolean
  iconColor: string
  iconBg: string
}

export default function StudentLayout({ children, loading = false }: StudentLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarAnimating, setSidebarAnimating] = useState(false)
  const [student, setStudent] = useState<{
    id: string
    studentId: string
    fullName: string
    class: string
    email: string
  } | null>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  // Check authentication
  useEffect(() => {
    const session = studentAuth.getSession()
    if (!session) {
      window.location.href = '/student/login'
      return
    }
    setStudent(session)
  }, [])

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/student/dashboard-simple', icon: Home, active: false, iconColor: 'text-[#45C7FA]', iconBg: 'bg-[#E7F7FF]' },
    { name: 'Assignments', href: '/student/assignments', icon: BookOpen, active: false, iconColor: 'text-[#A492FF]', iconBg: 'bg-[#F1E9FF]' },
    { name: 'Web Lab', href: '/student/web-lab', icon: Code, active: false, iconColor: 'text-[#7AF2C3]', iconBg: 'bg-[#E7FFF5]' },
    { name: 'Coding Lab', href: '/student/coding-lab', icon: Code2, active: false, iconColor: 'text-[#FFB347]', iconBg: 'bg-[#FFF3E6]' },
    { name: 'Learning Path', href: '/student/learning-path', icon: Target, active: false, iconColor: 'text-[#F78FB3]', iconBg: 'bg-[#FFE9F1]' },
  ]

  // Mark active menu item
  navigation.forEach(item => {
    item.active = pathname.startsWith(item.href)
  })

  const firstName = useMemo(() => {
    if (!student?.fullName) return 'Sahabat'
    return student.fullName.split(' ')[0]
  }, [student?.fullName])

  const motivationMessage = useMemo(() => {
    const index = new Date().getDate() % MOTIVATIONAL_MESSAGES.length
    return MOTIVATIONAL_MESSAGES[index]
  }, [])

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev)
    setSidebarAnimating(true)
    if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current)
    collapseTimeoutRef.current = setTimeout(() => setSidebarAnimating(false), 450)
  }

  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current)
    }
  }, [])

  const toggleProfileMenu = () => {
    setProfileMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = useMemo(() => {
    if (!student?.fullName) return '?'
    return student.fullName
      .split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
  }, [student?.fullName])

  const desktopOffsetClass = sidebarCollapsed
    ? 'md:ml-16 md:w-[calc(100%-4rem)]'
    : 'md:ml-64 md:w-[calc(100%-16rem)]'

  const handleLogout = () => {
    studentAuth.clearSession()
    window.location.href = '/student/login'
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${
                item.active ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className="text-xs font-medium truncate">{item.name}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <motion.button
              type="button"
              aria-label="Tutup menu"
              onClick={() => setSidebarOpen(false)}
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="drawer-panel shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Image src="/gema.svg" alt="GEMA Logo" width={40} height={40} className="h-10 w-auto" />
                  <span className="text-xl font-bold text-gray-900">GEMA Student</span>
                </div>
                <button
                  className="interactive-button text-gray-500 hover:text-gray-700 bg-white/70 rounded-full p-2"
                  onClick={() => setSidebarOpen(false)}
                  title="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`interactive-card group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      item.active
                        ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`interactive-icon mr-3 h-6 w-6 transition-colors ${
                      item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                    }`} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-base font-medium text-gray-700">{student.fullName}</p>
                    <p className="text-sm text-gray-500">{student.class} • {student.studentId}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="interactive-button text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                    title="Keluar"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'md:w-16' : 'md:w-64'
      }`}>
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white shadow-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className={`flex items-center flex-shrink-0 px-4 transition-all duration-300 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}>
              <div className={`sidebar-logo ${sidebarCollapsed ? 'sidebar-logo--compact' : ''}`}>
                <Image
                  src="/gema.svg"
                  alt="GEMA Logo"
                  width={sidebarCollapsed ? 32 : 40}
                  height={sidebarCollapsed ? 32 : 40}
                  className="logo-chip__image"
                />
              </div>
              {!sidebarCollapsed && (
                <span className="ml-2 text-xl font-bold text-gray-900 transition-opacity duration-300">
                  GEMA Student
                </span>
              )}
            </div>

            {/* Collapse/Expand Button */}
            <div className="px-4 mt-4">
                <button
                  onClick={handleSidebarToggle}
                  className={`w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 ${
                    sidebarCollapsed ? 'justify-center' : 'justify-end'
                  }`}
                  title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            </div>

            <nav className="mt-5 flex-1 px-2 space-y-1 relative">
              {navigation.map((item) => {
                const playfulIcon = item.href.includes('web-lab') || item.href.includes('coding-lab')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={item.active ? 'page' : undefined}
                    className={`group sidebar-nav-link relative flex items-center px-3 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                      item.active
                        ? 'sidebar-nav-link--active'
                        : 'text-gray-600'
                    } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    {item.active && (
                      <motion.span
                        layoutId="sidebar-active-indicator"
                        className={`sidebar-active-indicator ${sidebarCollapsed ? 'sidebar-active-indicator--compact' : ''}`}
                        transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}
                      />
                    )}
                    <div
                      className={`sidebar-icon-bubble ${item.iconBg} ${sidebarCollapsed ? 'mx-0' : 'mr-3'} ${
                        sidebarAnimating ? 'sidebar-icon-bubble--wiggle' : ''
                      }`}
                    >
                      <item.icon
                        className={`sidebar-icon ${item.iconColor} ${
                          playfulIcon ? 'sidebar-icon-playful' : ''
                        } ${sidebarCollapsed ? '' : ''}`}
                      />
                    </div>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 transition-opacity duration-200">{item.name}</span>
                        {item.badge && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </nav>
            {!sidebarCollapsed && (
              <div className="px-4 mt-6">
                <div className="user-card">
                  <div className="user-card__avatar">
                    <span>{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{student.fullName}</p>
                    <p className="text-xs text-gray-500">{student.class} • {student.studentId}</p>
                    <p className="text-[11px] text-gray-600 mt-1">{motivationMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`flex-shrink-0 flex border-t border-gray-200 p-4 transition-all duration-300 ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}>
            {!sidebarCollapsed ? (
              <div className="flex items-center w-full">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">{student.fullName}</p>
                  <p className="text-xs text-gray-500">{student.class}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 w-full ${desktopOffsetClass}`}>
        {/* Top header bar */}
        <header className={`fixed top-0 right-0 left-0 z-30 w-full ${desktopOffsetClass}`}>
          <div className="glass-header border-b border-white/40 px-4 py-3 flex items-center justify-between transition-all duration-300">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                onClick={() => setSidebarOpen(true)}
                title="Buka menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop brand & greeting */}
            <div className="hidden md:flex items-center gap-3">
              <div className="logo-chip">
                <Image src="/gema.svg" alt="GEMA" width={32} height={32} className="logo-chip__image" />
              </div>
              <Sparkles className="w-4 h-4 text-[#45C7FA]" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">GEMA Student</p>
                <h1 className="text-base font-semibold text-gray-900">Hi {firstName}! 👋 Semangat belajarnya</h1>
              </div>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3">
              <button
                className="notification-btn"
                aria-label="Notifikasi"
                data-has-unread={false}
              >
                <Bell className="w-5 h-5" />
                <span className="notification-indicator hidden"></span>
              </button>
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="avatar-button"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-4 h-4 text-white" />
                </button>
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="profile-menu"
                    >
                      <p className="text-xs text-gray-500 mb-2">Masuk sebagai {student.fullName}</p>
                      <Link href="/student/profile" className="profile-menu__item">Profil Saya</Link>
                      <button onClick={handleLogout} className="profile-menu__item text-red-500">Keluar</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-16 md:pb-0 pt-24 px-4">
          <PageWrapper loading={loading}>
            {children}
          </PageWrapper>
        </main>
      </div>
    </div>
  )
}
