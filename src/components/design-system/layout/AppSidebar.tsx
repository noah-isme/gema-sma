"use client";

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, FileText, BookOpen, Sparkles, ClipboardList, MessageSquare,
  Code, LayoutTemplate, Users, UserPlus, Megaphone, Calendar,
  Image as ImageIcon, GraduationCap, Settings, Shield, Activity,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: '',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    ]
  },
  {
    title: 'Pembelajaran',
    items: [
      { name: 'Asesmen', href: '/admin/asesmen', icon: FileText },
      { name: 'Tutorial', href: '/admin/tutorial', icon: BookOpen },
      { name: 'Prompt', href: '/admin/tutorial/prompt', icon: Sparkles },
      { name: 'Kuis', href: '/admin/tutorial/kuis', icon: ClipboardList },
      { name: 'Coding Lab', href: '/admin/coding-lab', icon: Code },
      { name: 'Web Lab', href: '/admin/web-lab', icon: LayoutTemplate },
    ]
  },
  {
    title: 'Komunitas',
    items: [
      { name: 'Diskusi', href: '/admin/tutorial/diskusi', icon: MessageSquare },
      { name: 'Pengumuman', href: '/admin/announcements', icon: Megaphone },
      { name: 'Kegiatan', href: '/admin/activities', icon: Calendar },
      { name: 'Galeri', href: '/admin/gallery', icon: ImageIcon },
    ]
  },
  {
    title: 'Pengguna',
    items: [
      { name: 'Siswa', href: '/admin/students', icon: GraduationCap },
      { name: 'Pendaftaran', href: '/admin/registrations', icon: UserPlus },
      { name: 'Admin', href: '/admin/users', icon: Users },
    ]
  },
  {
    title: 'Pengaturan Sistem',
    items: [
      { name: 'Kontak', href: '/admin/contacts', icon: MessageSquare },
      { name: 'Integrasi', href: '/admin/settings', icon: Settings },
      { name: 'Role & Permission', href: '/admin/settings/roles', icon: Shield },
      { name: 'Logs', href: '/admin/settings/logs', icon: Activity },
    ]
  }
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AppSidebar({ 
  collapsed, 
  onToggleCollapse,
  mobileOpen,
  onMobileClose
}: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className={`flex items-center justify-between px-6 py-5 border-b border-gray-100 ${
        collapsed ? 'justify-center' : ''
      }`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <Image
              src="/gema.svg"
              alt="GEMA"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <h2 className="font-bold text-gray-900">GEMA Admin</h2>
              <p className="text-xs text-gray-500">Dashboard Sistem</p>
            </div>
          </div>
        )}
        {collapsed && (
          <Image
            src="/gema.svg"
            alt="GEMA"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        )}
        
        <button
          onClick={onMobileClose}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {section.title && !collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`
                      group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative
                      ${active 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.name : undefined}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
                    )}
                    
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="hidden md:block border-t border-gray-100 p-3">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`
        hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 shadow-sm z-30
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
        <SidebarContent />
      </aside>
    </>
  );
}
