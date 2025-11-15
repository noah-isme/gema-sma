'use client'

import { useState, useEffect, useCallback, useMemo, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import Link from 'next/link'
import { studentAuth } from '@/lib/student-auth'
import FloatingChat from '@/components/chat/FloatingChat'
import StudentLayout from '@/components/student/StudentLayout'
import Breadcrumb from '@/components/ui/Breadcrumb'
import PlayfulTourGuide, { TourStep } from '@/components/student/PlayfulTourGuide'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Target,
  Sparkles,
  Trophy,
  Flame,
  TrendingUp,
  Activity,
  Rocket,
  Lightbulb,
  Code2,
  NotebookPen,
  Presentation,
  Palette
} from 'lucide-react'

// Types
interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  status: string
  maxSubmissions: number
  submissionCount: number
  instructions: string[]
}

interface DashboardStats {
  student: {
    id: string
    studentId: string
    fullName: string
    class: string
    email: string
    createdAt: string
  } | null
  totalAssignments: number
  completedAssignments: number
  pendingAssignments: number
  overdueAssignments: number
  completionPercentage: number
  totalSubmissions: number
  totalFeedbacks: number
  codingLabSubmissions: number
  codingLabTasks: number
  recentSubmissions: number
  recentFeedbacks: number
  weeklyProgress: number
  learningStreak: number
  engagementScore: number
  totalStudents: number
  totalTutorialArticles: number
  roadmapStages: number
  isActiveThisWeek: boolean
  hasOverdueAssignments: boolean
  codingLabProgress: number
  weeklyGrowth: 'increasing' | 'stable'
  status: {
    assignments: 'needs_attention' | 'in_progress' | 'up_to_date'
    codingLab: 'needs_start' | 'in_progress' | 'complete'
    engagement: 'high' | 'medium' | 'low'
  }
}

interface Submission {
  id: string
  assignmentId: string
  fileName: string
  filePath: string
  submittedAt: string
  studentId: string
  studentName: string
  status: string
  isLate: boolean
  grade?: number
  feedback?: string
}

interface AssignmentWithSubmissions extends Assignment {
  submissions: Submission[]
}

// Roadmap Types
interface RoadmapChecklistItem {
  id: string;
  text?: string;
  label?: string;
  helpText?: string;
}

interface RoadmapMaterial {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'article' | 'tutorial' | 'documentation';
}

interface RoadmapActivityGroup {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  items: RoadmapChecklistItem[];
  materials?: RoadmapMaterial[];
}

interface RoadmapStage {
  id: string;
  title: string;
  description?: string;
  goal?: string;
  icon?: string;
  color?: string;
  estimatedDuration?: string;
  skills?: string[];
  overview?: string[];
  activityGroups?: RoadmapActivityGroup[];
}

interface RoadmapProgressState {
  groups: Record<string, Record<string, boolean>>;
  reflection: string;
}

type HeroPreviewStat = {
  label: string
  helper: string
  value?: string
  valueNumber?: number
  suffix?: string
}

type AssignmentVisualMeta = {
  icon: LucideIcon
  label: string
  accentBg: string
  accentText: string
}

type DeadlineTone = 'positive' | 'warning' | 'danger' | 'neutral'

const assignmentVisualPresets = [
  {
    keywords: ['code', 'coding', 'program', 'javascript', 'python'],
    icon: Code2,
    label: 'Coding Lab',
    accentBg: 'bg-[#E0F2FF]',
    accentText: 'text-[#2364AA]'
  },
  {
    keywords: ['essay', 'esai', 'makalah', 'artikel', 'paper'],
    icon: NotebookPen,
    label: 'Esai',
    accentBg: 'bg-[#F1E8FF]',
    accentText: 'text-[#7C3AED]'
  },
  {
    keywords: ['present', 'presentasi', 'pitch'],
    icon: Presentation,
    label: 'Presentasi',
    accentBg: 'bg-[#FFE8E0]',
    accentText: 'text-[#F97316]'
  },
  {
    keywords: ['design', 'desain', 'ui', 'ux', 'ilustrasi'],
    icon: Palette,
    label: 'Desain',
    accentBg: 'bg-[#E7FFF4]',
    accentText: 'text-[#0F9D58]'
  }
]

const getAssignmentVisualMeta = (subject?: string): AssignmentVisualMeta => {
  if (!subject) {
    return {
      icon: FileText,
      label: 'Tugas',
      accentBg: 'bg-[#E5E7EB]',
      accentText: 'text-[#374151]'
    }
  }

  const normalized = subject.toLowerCase()
  const preset = assignmentVisualPresets.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  )

  if (preset) return preset

  return {
    icon: FileText,
    label: 'Tugas',
    accentBg: 'bg-[#E5E7EB]',
    accentText: 'text-[#374151]'
  }
}

const deadlineToneClass: Record<DeadlineTone, string> = {
  positive: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  danger: 'bg-rose-50 text-rose-700 border border-rose-100',
  neutral: 'bg-slate-50 text-slate-600 border border-slate-100'
}

const getDeadlineMeta = (dueDate: string): {
  label: string
  tone: DeadlineTone
  isUrgent: boolean
} => {
  const due = new Date(dueDate)

  if (Number.isNaN(due.getTime())) {
    return {
      label: 'Tanggal belum tersedia',
      tone: 'neutral',
      isUrgent: false
    }
  }

  const diffMs = due.getTime() - Date.now()
  const dayInMs = 24 * 60 * 60 * 1000
  const diffDays = Math.floor(diffMs / dayInMs)

  if (diffDays < 0) {
    return {
      label: `Lewat ${Math.abs(diffDays)} hari`,
      tone: 'danger',
      isUrgent: true
    }
  }

  if (diffDays === 0) {
    return {
      label: 'Jatuh tempo hari ini',
      tone: 'warning',
      isUrgent: true
    }
  }

  if (diffDays <= 3) {
    return {
      label: `Due ${diffDays} hari lagi`,
      tone: 'warning',
      isUrgent: true
    }
  }

  return {
    label: due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    tone: 'neutral',
    isUrgent: false
  }
}

const assignmentStatusStyle: Record<
  string,
  {
    label: string
    className: string
    tone: 'positive' | 'warning' | 'danger' | 'neutral'
  }
> = {
  completed: {
    label: 'Selesai',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    tone: 'positive'
  },
  in_progress: {
    label: 'Sedang dikerjakan',
    className: 'bg-sky-50 text-sky-700 border border-sky-100',
    tone: 'warning'
  },
  pending: {
    label: 'Belum dimulai',
    className: 'bg-slate-50 text-slate-700 border border-slate-100',
    tone: 'neutral'
  },
  overdue: {
    label: 'Butuh perhatian',
    className: 'bg-rose-50 text-rose-700 border border-rose-100',
    tone: 'danger'
  },
  default: {
    label: 'Status belum tersedia',
    className: 'bg-slate-50 text-slate-600 border border-slate-100',
    tone: 'neutral'
  }
}

const getAssignmentStatusStyle = (status?: string) => {
  if (!status) return assignmentStatusStyle.default
  return assignmentStatusStyle[status] ?? assignmentStatusStyle.default
}

type HeroParticle = {
  top?: string
  left?: string
  right?: string
  bottom?: string
  size: number
  delay: string
}

const heroParticlePresets: HeroParticle[] = [
  { top: '10%', left: '5%', size: 32, delay: '0s' },
  { top: '25%', left: '40%', size: 18, delay: '0.5s' },
  { top: '15%', right: '8%', size: 26, delay: '1s' },
  { bottom: '15%', left: '12%', size: 20, delay: '1.5s' },
  { bottom: '12%', right: '18%', size: 34, delay: '0.8s' }
]

const dashboardTourSteps: TourStep[] = [
  {
    selector: '#student-dashboard-hero',
    emoji: '🏠',
    title: 'Selamat datang di Dashboard!',
    subtitle: 'Markas belajar coding kamu',
    text: 'Ini halaman utama kamu! Di sini bisa liat sapaan, streak harian, target minggu ini, dan semua progres belajar dalam satu tempat.'
  },
  {
    selector: '#student-dashboard-stats',
    emoji: '📊',
    title: 'Kartu statistik kamu',
    subtitle: 'Angka-angka penting',
    text: 'Kartu warna-warni ini nunjukin tugas yang udah selesai, yang masih dikerjain, engagement score, sama pencapaian mingguan. Cek sekilas aja!'
  },
  {
    selector: '[data-tour-id="nav-assignments"]',
    emoji: '📚',
    title: 'Menu Assignments',
    subtitle: 'Kerjain tugas di sini',
    text: 'Klik menu Assignments buat liat semua tugas yang harus dikerjain. Ada deadline, status, sama instruksi lengkap buat setiap tugas.'
  },
  {
    selector: '[data-tour-id="nav-weblab"]',
    emoji: '🌐',
    title: 'Menu Web Lab',
    subtitle: 'Belajar HTML, CSS, JavaScript',
    text: 'Di Web Lab, kamu bisa latihan bikin website langsung di browser. Ada editor built-in buat nulis kode dan langsung liat hasilnya!'
  },
  {
    selector: '[data-tour-id="nav-codinglab"]',
    emoji: '🐍',
    title: 'Menu Coding Lab',
    subtitle: 'Latihan Python coding',
    text: 'Coding Lab isinya tantangan-tantangan Python dari yang mudah sampai susah. Setiap soal ada XP-nya, jadi makin seru!'
  },
  {
    selector: '[data-tour-id="nav-learningpath"]',
    emoji: '🗺️',
    title: 'Menu Learning Path',
    subtitle: 'Roadmap belajar bertahap',
    text: 'Learning Path kayak peta perjalanan belajar kamu. Ada tahapan-tahapan materi yang tersusun rapi dari dasar sampai mahir.'
  },
  {
    selector: '#student-dashboard-tabs',
    emoji: '🎨',
    title: 'Tab konten dashboard',
    subtitle: 'Pilih tampilan',
    text: 'Tab ini buat ganti tampilan dashboard: Spotlight (highlight), Assignments (tugas), atau Roadmap (peta belajar). Tinggal klik salah satu!'
  },
  {
    selector: '#student-profile-button',
    emoji: '👤',
    title: 'Foto profil kamu',
    subtitle: 'Pengaturan akun',
    text: 'Klik foto profil di kanan atas buat lihat data diri, ubah pengaturan, atau keluar dari akun. Semua kontrol ada di sini.'
  }
]

interface CountUpNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  reduceMotion?: boolean
  formatter?: (value: number) => string
}

const CountUpNumber = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 0.9,
  reduceMotion = false,
  formatter
}: CountUpNumberProps) => {
  const [displayValue, setDisplayValue] = useState(value)
  const lastValueRef = useRef(value)

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value)
      lastValueRef.current = value
      return
    }

    const animation = animate(lastValueRef.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(latest)
    })

    lastValueRef.current = value
    return () => animation.stop()
  }, [value, duration, reduceMotion])

  const rawValue =
    formatter?.(displayValue) ??
    (decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toString())

  return (
    <span>
      {prefix}
      {rawValue}
      {suffix}
    </span>
  )
}

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<{
    id: string;
    studentId: string;
    fullName: string;
    class: string;
    email: string;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  
  // Assignments State
  const [assignments, setAssignments] = useState<AssignmentWithSubmissions[]>([])
  const [assignmentsLoading, setAssignmentsLoading] = useState(true)
  
  // Roadmap State
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>([])
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, RoadmapProgressState>>({})
  const [roadmapStudentId, setRoadmapStudentId] = useState<string>('')
  const [roadmapStudentName, setRoadmapStudentName] = useState<string>('')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Roadmap utility functions
  const createEmptyProgress = (stages: RoadmapStage[]): Record<string, RoadmapProgressState> => {
    const progress: Record<string, RoadmapProgressState> = {};
    
    if (!Array.isArray(stages)) {
      console.warn('createEmptyProgress: stages is not an array', stages);
      return progress;
    }
    
    stages.forEach((stage) => {
      const groups: Record<string, Record<string, boolean>> = {};
      stage.activityGroups?.forEach((group) => {
        groups[group.id] = group.items.reduce<Record<string, boolean>>((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {});
      });

      progress[stage.id] = {
        groups,
        reflection: ""
      };
    });
    return progress;
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(motionQuery.matches)
    updatePreference()

    motionQuery.addEventListener('change', updatePreference)
    return () => motionQuery.removeEventListener('change', updatePreference)
  }, [])

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async (studentId: string) => {
    try {
      setStatsLoading(true)
      console.log('Fetching dashboard stats for student:', studentId)

      const response = await fetch(`/api/student/dashboard?studentId=${studentId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status}`)
      }

      const result = await response.json()
      if (result.success && result.data) {
        setDashboardStats(result.data)
        console.log('Dashboard stats loaded:', result.data)
      } else {
        console.error('Failed to load dashboard stats:', result.error)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    try {
      setAssignmentsLoading(true)

      const response = await fetch('/api/tutorial/assignments')
      const result = response.ok ? await response.json() : null
      const assignmentsPayload: Assignment[] = 
        result?.success && Array.isArray(result.data) ? result.data : []

      // For dashboard-simple, we don't need submissions since it's complex
      // Just show assignments status as "not submitted" by default
      const normalizedAssignments: AssignmentWithSubmissions[] = assignmentsPayload.map(
        (assignment: Assignment) => ({
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          subject: assignment.subject,
          dueDate: assignment.dueDate,
          status: assignment.status,
          maxSubmissions: assignment.maxSubmissions,
          submissionCount: assignment.submissionCount,
          instructions: assignment.instructions ?? [],
          submissions: [] // Keep empty for now - students can upload via assignment detail page
        })
      )

      setAssignments(normalizedAssignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setAssignmentsLoading(false)
    }
  }, [])

  // Fetch roadmap stages
  const fetchRoadmapStages = useCallback(async () => {
    try {
      const response = await fetch('/api/roadmap/stages');
      if (response.ok) {
        const result = await response.json();
        const stagesArray = result.success && Array.isArray(result.data) ? result.data : [];
        console.log('Fetched roadmap stages:', stagesArray);
        
        setRoadmapStages(stagesArray);
        setRoadmapProgress(createEmptyProgress(stagesArray));
      } else {
        console.error('Failed to fetch roadmap stages:', response.status);
        setRoadmapStages([]);
      }
    } catch (error) {
      console.error('Error fetching roadmap stages:', error);
      setRoadmapStages([]);
    }
  }, []);

  // Check authentication and load student data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // First, check if student is authenticated
        const session = studentAuth.getSession()
        
        if (!session) {
          console.log('No student session found, redirecting to login')
          const currentUrl = window.location.pathname + window.location.search
          window.location.href = `/student/login?redirect=${encodeURIComponent(currentUrl)}`
          return
        }
        
        console.log('Student session found:', session)
        
        // Set student data from session
        const studentData = {
          id: session.id,
          studentId: session.studentId,
          fullName: session.fullName,
          class: session.class,
          email: session.email
        }
        setStudent(studentData)
        setRoadmapStudentId(studentData.studentId)
        setRoadmapStudentName(studentData.fullName)
        
        // Fetch dashboard stats, assignments and roadmap
        fetchDashboardStats(studentData.studentId)
        fetchAssignments()
        fetchRoadmapStages()
        setLoading(false)
        
      } catch (error) {
        console.error('Student auth error:', error)
        // Redirect to login on any error
        const currentUrl = window.location.pathname + window.location.search
        window.location.href = `/student/login?redirect=${encodeURIComponent(currentUrl)}`
      }
    }
    
    checkAuthAndLoadData()
  }, [fetchAssignments, fetchDashboardStats, fetchRoadmapStages])

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || roadmapStages.length === 0 || !roadmapStudentId) return;

    try {
      const stored = localStorage.getItem(`gema-roadmap-${roadmapStudentId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          progress: Record<string, RoadmapProgressState>;
        };
        
        const base = createEmptyProgress(roadmapStages);
        if (parsed.progress) {
          Object.entries(parsed.progress).forEach(([stageId, stageProgress]) => {
            const baseStage = base[stageId];
            if (!baseStage) return;

            const mergedGroups: Record<string, Record<string, boolean>> = { ...baseStage.groups };
            Object.entries(baseStage.groups).forEach(([groupId, items]) => {
              const savedGroup = stageProgress.groups?.[groupId];
              if (!savedGroup) return;

              mergedGroups[groupId] = Object.keys(items).reduce<Record<string, boolean>>((acc, itemId) => {
                acc[itemId] = savedGroup[itemId] ?? items[itemId];
                return acc;
              }, {});
            });

            base[stageId] = {
              groups: mergedGroups,
              reflection: stageProgress.reflection ?? ""
            };
          });
        }
        setRoadmapProgress(base);
      }
    } catch (error) {
      console.error('Failed to load roadmap progress', error);
    }
  }, [roadmapStudentId, roadmapStages]);

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !roadmapStudentId || Object.keys(roadmapProgress).length === 0) return;

    const payload = {
      studentId: roadmapStudentId,
      studentName: roadmapStudentName,
      progress: roadmapProgress,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`gema-roadmap-${roadmapStudentId}`, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to save roadmap progress', error);
    }
  }, [roadmapProgress, roadmapStudentId, roadmapStudentName])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statCards = useMemo(() => {
    if (!dashboardStats) return []

    const engagementCopy =
      dashboardStats.status.engagement === 'high'
        ? 'Super aktif minggu ini'
        : dashboardStats.status.engagement === 'medium'
          ? 'Momentum stabil'
          : 'Yuk recharge energi'
    return [
      {
        id: 'streak',
        label: 'Learning Streak',
        valueNumber: dashboardStats.learningStreak,
        suffix: ' hari',
        subtext: 'Jaga ritme belajarmu 🔥',
        icon: Flame,
        gradient: 'from-[#FFE37F] via-[#FFD07F] to-[#FFA45B]',
        iconClass: 'stat-icon--flame'
      },
      {
        id: 'completion',
        label: 'Progress Minggu Ini',
        valueNumber: dashboardStats.completionPercentage,
        suffix: '%',
        subtext: `${dashboardStats.completedAssignments}/${dashboardStats.totalAssignments} tugas selesai`,
        icon: Trophy,
        gradient: 'from-[#7AF2C3] via-[#45C7FA] to-[#A492FF]',
        iconClass: 'stat-icon--pulse',
        progressValue: dashboardStats.completionPercentage
      },
      {
        id: 'engagement',
        label: 'Engagement Score',
        valueNumber: dashboardStats.engagementScore,
        suffix: '/100',
        subtext: engagementCopy,
        icon: Activity,
        gradient: 'from-[#FFE37F] via-[#FFB347] to-[#FF9A9E]',
        iconClass: 'stat-icon--sparkle'
      },
      {
        id: 'weekly',
        label: 'Weekly Wins',
        valueNumber: Math.abs(dashboardStats.weeklyProgress),
        prefix: dashboardStats.weeklyProgress >= 0 ? '+' : '-',
        subtext: `${dashboardStats.recentSubmissions} aktivitas baru`,
        icon: TrendingUp,
        gradient: 'from-[#A492FF] via-[#C89BFF] to-[#F0B3FF]',
        iconClass: 'stat-icon--orbit'
      }
    ]
  }, [dashboardStats])

  const spotlightStories = useMemo(() => {
    if (!dashboardStats) return []

    const stories: Array<{
      id: string
      title: string
      description: string
      icon: LucideIcon
      accent: string
    }> = [
      {
        id: 'progress',
        title: `${dashboardStats.completedAssignments} tugas kelar 🎯`,
        description:
          dashboardStats.pendingAssignments > 0
            ? `Tinggal ${dashboardStats.pendingAssignments} lagi untuk tuntaskan semua misi minggu ini.`
            : 'Semua tugas minggu ini sudah tuntas. Nikmati progresnya!',
        icon: Trophy,
        accent: 'bg-[#F5F3FF]'
      },
      {
        id: 'streak',
        title: `${dashboardStats.learningStreak} hari streak tanpa putus`,
        description: 'Consistency unlocks mastery — teruskan ritme belajarmu ya!',
        icon: Flame,
        accent: 'bg-[#FFF4E5]'
      }
    ]

    if (dashboardStats.overdueAssignments > 0) {
      stories.push({
        id: 'attention',
        title: `${dashboardStats.overdueAssignments} tugas perlu perhatian`,
        description: 'Prioritaskan tugas yang sudah lewat deadline supaya tetap on track.',
        icon: AlertCircle,
        accent: 'bg-[#FFEAE6]'
      })
    } else {
      stories.push({
        id: 'momentum',
        title: 'Momentum belajar naik 🚀',
        description: `Ada ${dashboardStats.recentSubmissions} aktivitas baru dan engagement status ${dashboardStats.status.engagement}.`,
        icon: Rocket,
        accent: 'bg-[#E8FBFF]'
      })
    }

    return stories.slice(0, 3)
  }, [dashboardStats])

  const getMotionFade = (
    delay = 0,
    options: { variant?: 'default' | 'card' | 'slide'; distance?: number } = {}
  ) => {
    if (prefersReducedMotion) return {}

    const variant = options.variant ?? 'default'
    const distance = options.distance ?? 20

    const initial =
      variant === 'card'
        ? { opacity: 0, y: 16, scale: 0.98 }
        : { opacity: 0, y: distance }

    const animate =
      variant === 'card'
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 1, y: 0 }

    return {
      initial,
      animate,
      transition: {
        delay,
        duration: variant === 'card' ? 0.38 : 0.6,
        ease: variant === 'card' ? [0.16, 1, 0.3, 1] : 'easeOut'
      }
    }
  }

  // Roadmap handlers
  const handleItemCheck = (stageId: string, groupId: string, itemId: string, checked: boolean) => {
    setRoadmapProgress(prev => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        groups: {
          ...prev[stageId]?.groups,
          [groupId]: {
            ...prev[stageId]?.groups?.[groupId],
            [itemId]: checked
          }
        }
      }
    }));
  };

  const getStageStats = (stageId: string) => {
    const stage = roadmapStages.find(s => s.id === stageId);
    if (!stage) return { completed: 0, total: 0, percentage: 0 };

    const progress = roadmapProgress[stageId];
    if (!progress) return { completed: 0, total: getTotalItems(stage), percentage: 0 };

    let completed = 0;
    let total = 0;

    stage.activityGroups?.forEach(group => {
      group.items.forEach(item => {
        total++;
        if (progress.groups?.[group.id]?.[item.id]) {
          completed++;
        }
      });
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getTotalItems = (stage: RoadmapStage): number => {
    return stage.activityGroups?.reduce((acc, group) => acc + group.items.length, 0) ?? 0;
  };

  const heroPreviewStats = useMemo<HeroPreviewStat[]>(() => {
    if (!dashboardStats) {
      return [
        { label: 'Progress minggu ini', value: '—', helper: 'Assignments' },
        { label: 'Mood belajar', value: '—', helper: 'Engagement' },
        { label: 'Roadmap', value: '—', helper: 'Tahapan' }
      ]
    }

    const engagementLabel =
      dashboardStats.status.engagement === 'high'
        ? 'Joyful Energy'
        : dashboardStats.status.engagement === 'medium'
          ? 'Stabil'
          : 'Perlu semangat'
    const roadmapCount = dashboardStats.roadmapStages || roadmapStages.length

    return [
      {
        label: 'Progress minggu ini',
        valueNumber: dashboardStats.completionPercentage,
        suffix: '%',
        helper: `${dashboardStats.completedAssignments}/${dashboardStats.totalAssignments} tugas`
      },
      {
        label: 'Mood belajar',
        value: engagementLabel,
        helper: `Score ${dashboardStats.engagementScore}`
      },
      {
        label: 'Roadmap',
        valueNumber: roadmapCount,
        suffix: ' tahap',
        helper: roadmapCount > 0 ? 'Roadmap aktif' : 'Segera hadir'
      }
    ]
  }, [dashboardStats, roadmapStages.length])

  const tabItems = useMemo(() => {
    const pending = dashboardStats?.pendingAssignments ?? 0
    const roadmapCount = roadmapStages.length || dashboardStats?.roadmapStages || 0

    return [
      {
        id: 'dashboard',
        label: 'Spotlight',
        helper: 'Cerita mingguan',
        icon: Sparkles
      },
      {
        id: 'assignments',
        label: 'Assignments',
        helper: pending > 0 ? `${pending} tugas menunggu` : 'Semua aman',
        icon: BookOpen,
        badge: pending
      },
      {
        id: 'roadmap',
        label: 'Roadmap',
        helper: roadmapCount > 0 ? `${roadmapCount} tahap aktif` : 'Segera hadir',
        icon: Target
      }
    ]
  }, [dashboardStats, roadmapStages.length])

  const firstName = useMemo(() => {
    if (!student?.fullName) return 'Sahabat'
    return student.fullName.split(' ')[0]
  }, [student?.fullName])

  const tabNavRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [tabUnderline, setTabUnderline] = useState({ width: 0, left: 0 })

  const recalcUnderline = useCallback(() => {
    if (!tabNavRef.current) return
    const activeButton = tabRefs.current[activeTab]
    if (!activeButton) return
    const navRect = tabNavRef.current.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()
    setTabUnderline({
      width: buttonRect.width,
      left: buttonRect.left - navRect.left
    })
  }, [activeTab])

  useLayoutEffect(() => {
    recalcUnderline()
  }, [recalcUnderline, tabItems])

  useEffect(() => {
    window.addEventListener('resize', recalcUnderline)
    return () => window.removeEventListener('resize', recalcUnderline)
  }, [recalcUnderline])

  if (loading) {
    return (
      <StudentLayout loading={true}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </StudentLayout>
    )
  }


  return (
    <StudentLayout loading={statsLoading || assignmentsLoading}>
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <Breadcrumb items={[{ label: 'Dashboard' }]} />
      </div>
      <div className="flex justify-end px-6 pt-4">
        <PlayfulTourGuide
          tourId="student-dashboard"
          steps={dashboardTourSteps}
          autoStartDelay={900}
          renderTrigger={({ startTour, hasSeenTutorial, storageReady }) => (
            <button type="button" className="tour-trigger-chip" onClick={startTour}>
              {storageReady && hasSeenTutorial ? 'Ulang panduan' : 'Butuh panduan?'}
              <span aria-hidden>🎧</span>
            </button>
          )}
        />
      </div>

      <div className="container mx-auto px-6 py-8 relative">
        <div className="dashboard-particles pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 8 }).map((_, particleIndex) => (
            <span
              key={`bg-particle-${particleIndex}`}
              className="dashboard-particle"
              style={{
                top: `${10 + particleIndex * 8}%`,
                left: particleIndex % 2 === 0 ? `${5 + particleIndex * 7}%` : undefined,
                right: particleIndex % 2 === 0 ? undefined : `${3 + particleIndex * 6}%`,
                animationDelay: `${particleIndex * 0.8}s`
              }}
            />
          ))}
        </div>
        <div className="space-y-10 relative z-10">
          <motion.section id="student-dashboard-hero" {...getMotionFade(0)}>
          <div className="hero-card relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#45C7FA] via-[#7AF2C3] to-[#A492FF] text-white shadow-brand-xl min-h-[260px] lg:min-h-[300px] px-8 py-10">
            <div className="hero-card__glow" aria-hidden></div>
            <div className="hero-card__veil" aria-hidden></div>
            <div className="hero-card__shimmer" aria-hidden></div>
            {heroParticlePresets.map((particle, index) => (
              <span
                key={`particle-${index}`}
                className={`hero-particle ${prefersReducedMotion ? '' : 'particle-floating'}`}
                style={{
                  top: particle.top,
                  left: particle.left,
                  right: particle.right,
                  bottom: particle.bottom,
                  width: particle.size,
                  height: particle.size,
                  animationDelay: particle.delay
                }}
              />
            ))}
            <div className="relative z-10 grid gap-10 lg:grid-cols-2 items-start">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.4em] text-white/80">Joyful learning space</p>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  Hai {firstName}! Siap belajar hal baru hari ini? <span role="img" aria-label="rocket">🚀</span>
                </h1>
                <p className="text-base text-white/85 leading-relaxed">
                  {dashboardStats
                    ? `Perjalanan minggu ini sudah ${dashboardStats.completionPercentage}% jalan dengan streak ${dashboardStats.learningStreak} hari.`
                    : 'Kami sedang menyiapkan semua progres terbaikmu.'}
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {heroPreviewStats.map((item) => (
                    <div key={item.label} className="hero-preview-pill rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">{item.label}</p>
                      <p className="text-lg font-semibold text-white mt-1">
                        {item.valueNumber !== undefined ? (
                          <CountUpNumber
                            value={item.valueNumber}
                            suffix={item.suffix ?? ''}
                            reduceMotion={prefersReducedMotion}
                          />
                        ) : (
                          item.value
                        )}
                      </p>
                      <p className="text-xs text-white/80">{item.helper}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="hero-preview-glow" aria-hidden></div>
                <div className="hero-preview-panel relative z-10 w-full max-w-sm rounded-[28px] border border-white/35 bg-white/15 p-6 backdrop-blur-2xl shadow-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                    <Sparkles className="w-4 h-4" />
                    Preview Minggu Ini
                  </div>
                  <p className="mt-4 text-2xl font-semibold">
                    {dashboardStats ? (
                      <>
                        <CountUpNumber value={dashboardStats.completedAssignments} reduceMotion={prefersReducedMotion} />
                        <span className="text-base font-medium text-white/80"> tugas selesai</span>
                      </>
                    ) : (
                      'Memuat data'
                    )}
                  </p>
                  <p className="text-sm text-white/80">
                    {dashboardStats
                      ? `Ada ${dashboardStats.pendingAssignments} tugas lagi menunggumu.`
                      : 'Tetap semangat ya!'}
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>Assignments</span>
                      <span className="font-semibold text-white">
                        {dashboardStats ? (
                          <>
                            <CountUpNumber value={dashboardStats.completedAssignments} reduceMotion={prefersReducedMotion} />/
                            <CountUpNumber value={dashboardStats.totalAssignments} reduceMotion={prefersReducedMotion} />
                          </>
                        ) : (
                          '—'
                        )}
                      </span>
                    </div>
                    <div className="progress-track hero-progress-track">
                      <div
                        className="progress-fill progress-fill--hero"
                        style={{ width: `${dashboardStats?.completionPercentage ?? 0}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>Streak</span>
                      <span>
                        {dashboardStats ? (
                          <CountUpNumber value={dashboardStats.learningStreak} suffix=" hari" reduceMotion={prefersReducedMotion} />
                        ) : (
                          '—'
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>Engagement</span>
                      <span>
                        {dashboardStats ? (
                          <CountUpNumber value={dashboardStats.engagementScore} suffix="/100" reduceMotion={prefersReducedMotion} />
                        ) : (
                          '—'
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-sm text-white/90">
                    <div
                      className={`status-dot ${dashboardStats?.status?.engagement === 'high' ? 'status-dot--active' : ''} ${
                        dashboardStats?.status?.engagement === 'high' && !prefersReducedMotion ? 'animate-softPulse' : ''
                      }`}
                    ></div>
                    <p>
                      {dashboardStats
                        ? dashboardStats.status.engagement === 'high'
                          ? 'Energi belajar lagi di puncak — pertahankan!'
                          : 'Kami bantu kamu kembali on track dengan insight terbaru.'
                        : 'Menyiapkan insight khusus untukmu.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="student-dashboard-stats" {...getMotionFade(0.15)}>
          {(statsLoading || !dashboardStats) ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={`stats-skeleton-${index}`} className="min-h-[160px]" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.id}
                    {...getMotionFade(0.08 * index, { variant: 'card', distance: 12 })}
                    className={`stat-card relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${card.gradient}`}
                    data-card={card.id}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`stat-card__icon w-6 h-6 text-white/90 ${card.iconClass ?? ''}`} />
                      <span className="text-[10px] uppercase tracking-[0.4em] text-white/70">Joy</span>
                    </div>
                    <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/80">{card.label}</p>
                    <p className="stat-card__value text-3xl font-bold mt-1">
                      <CountUpNumber
                        value={card.valueNumber ?? 0}
                        prefix={card.prefix ?? ''}
                        suffix={card.suffix ?? ''}
                        reduceMotion={prefersReducedMotion}
                      />
                    </p>
                    <p className="text-sm text-white/85 mt-2">{card.subtext}</p>
                    {card.progressValue !== undefined && (
                      <div className="progress-track mt-4 bg-white/30">
                        <div
                          className="progress-fill progress-fill--accent"
                          style={{ width: `${card.progressValue}%` }}
                        ></div>
                      </div>
                    )}
                    <span className="stat-card-glow" aria-hidden></span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.section>

        <motion.section {...getMotionFade(0.25)} className="space-y-6">
          <div id="student-dashboard-tabs" className="rounded-3xl bg-white border border-gray-100 shadow-sm p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Atur fokus dashboard</p>
                <p className="text-xs text-gray-500">Pilih cerita yang ingin kamu lihat terlebih dahulu</p>
              </div>
              {!statsLoading && dashboardStats && (
                <p className="text-xs text-gray-500">
                  Terhubung dengan{' '}
                  <span className="font-semibold text-gray-700">
                    <CountUpNumber value={dashboardStats.totalStudents} reduceMotion={prefersReducedMotion} />
                  </span>{' '}
                  siswa aktif minggu ini ✨
                </p>
              )}
            </div>
            <div className="relative mt-4" ref={tabNavRef}>
              {!prefersReducedMotion && (
                <motion.span
                  className="tab-underline"
                  initial={false}
                  animate={{ width: tabUnderline.width, x: tabUnderline.left }}
                  transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
                />
              )}
              <div className="flex flex-col gap-3 md:flex-row">
                {tabItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        tabRefs.current[item.id] = el
                      }}
                      onClick={() => setActiveTab(item.id)}
                      aria-pressed={isActive}
                      className={`tab-pill relative w-full rounded-2xl border px-4 py-3 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#45C7FA] ${
                        isActive
                          ? 'bg-[#E9FBFF] border-[#45C7FA]/40 shadow-brand-sm'
                          : 'border-transparent bg-slate-50/50 hover:border-white hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F172A]' : 'text-gray-500'}`} />
                        <span className={isActive ? 'text-[#0F172A]' : 'text-gray-600'}>{item.label}</span>
                        {item.badge ? (
                          <span className="text-[11px] rounded-full bg-white px-2 py-0.5 text-[#0F172A]">{item.badge}</span>
                        ) : null}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.helper}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-lg">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  id="student-dashboard-spotlight"
                  key="tab-dashboard"
                  initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -6 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                <div className="grid gap-4 md:grid-cols-2">
                  {spotlightStories.map((story, index) => {
                    const Icon = story.icon
                    return (
                      <motion.div
                        key={story.id}
                        {...getMotionFade(0.08 * index)}
                        className={`rounded-2xl border border-gray-100 p-5 flex gap-4 items-start ${story.accent}`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md">
                          <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{story.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{story.description}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-[#FFF9C4] via-[#FFE0F0] to-[#E0F7FF] p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">“Dashboard = cerita perjalananmu.”</p>
                    <p className="text-sm text-gray-700 mt-1">
                      {dashboardStats
                        ? `Kamu termasuk ${dashboardStats.totalStudents} siswa aktif minggu ini. Pertahankan vibes joyful ini!`
                        : 'Kami akan menampilkan insight setelah data siap.'}
                    </p>
                  </div>
                  <Link
                    href="/student/learning-path"
                    className="interactive-button inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-[#0F172A]"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Eksplor perjalanan
                  </Link>
                </div>
              </motion.div>
            )}

              {activeTab === 'assignments' && (
                <motion.div
                  key="tab-assignments"
                  initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 8, scale: prefersReducedMotion ? 1 : 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -6, scale: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Learning Assignments</h3>
                    <p className="text-sm text-gray-600">Tugas berbasis proyek dengan feedback real-time. Joyful namun terarah.</p>
                  </div>
                  {!statsLoading && dashboardStats && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        <CheckCircle className="w-4 h-4" />
                        <CountUpNumber value={dashboardStats.completedAssignments} reduceMotion={prefersReducedMotion} /> selesai
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                        <Clock className="w-4 h-4" />
                        <CountUpNumber value={dashboardStats.pendingAssignments} reduceMotion={prefersReducedMotion} /> pending
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                        <AlertCircle className="w-4 h-4" />
                        <CountUpNumber value={dashboardStats.overdueAssignments} reduceMotion={prefersReducedMotion} /> terlambat
                      </span>
                    </div>
                  )}
                </div>

                {assignmentsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-gray-600">Memuat assignments yang seru... ✨</p>
                  </div>
                ) : assignments && assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment, index) => {
                      const { icon: AssignmentIcon, label, accentBg, accentText } = getAssignmentVisualMeta(assignment.subject)
                      const statusStyle = getAssignmentStatusStyle(assignment.status)
                      const deadlineMeta = getDeadlineMeta(assignment.dueDate)
                      return (
                        <motion.div
                          key={assignment.id}
                          {...getMotionFade(0.04 * index, { variant: 'card', distance: 10 })}
                          className="assignment-card rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-1"
                        >
                          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-1 items-start gap-4">
                              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accentBg}`}>
                                <AssignmentIcon className={`w-7 h-7 ${accentText}`} />
                              </div>
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
                                    {assignment.subject}
                                  </span>
                                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                    {label}
                                  </span>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">{assignment.title}</h4>
                                <p className="text-sm text-gray-600">{assignment.description}</p>
                                {assignment.instructions && assignment.instructions.length > 0 && (
                                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                    {assignment.instructions.slice(0, 2).map((instruction, idx) => (
                                      <span key={`${assignment.id}-instruction-${idx}`} className="rounded-full bg-slate-50 px-2.5 py-0.5">
                                        {instruction}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="w-full border-t border-dashed border-slate-200 pt-4 md:w-[240px] md:border-t-0 md:border-l md:pl-6 md:pt-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-xs font-semibold rounded-full px-3 py-1 ${statusStyle.className}`}>
                                  {statusStyle.label}
                                </span>
                                <span
                                  className={`text-xs font-semibold rounded-full px-3 py-1 ${deadlineToneClass[deadlineMeta.tone]} ${
                                    deadlineMeta.isUrgent && !prefersReducedMotion ? 'deadline-pulse' : ''
                                  }`}
                                >
                                  {deadlineMeta.label}
                                </span>
                              </div>
                              <div className="mt-3 text-sm text-gray-600">
                                Deadline: <span className="font-semibold text-gray-900">{formatDate(assignment.dueDate)}</span>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                Submission {assignment.submissionCount}/{assignment.maxSubmissions}
                              </div>
                              <Link
                                href={`/student/assignments/${assignment.id}`}
                                className="interactive-button cta-gradient mt-4 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
                              >
                                Ayo Mulai Belajar 🚀
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-[#7AF2C3]/60 bg-[#F2FFFB] p-10 text-center">
                    <p className="text-gray-700 font-semibold">Belum ada tugas hari ini — kamu bebas eksplor coding dulu!</p>
                  </div>
                )}
                </motion.div>
              )}

              {activeTab === 'roadmap' && (
                <motion.div
                  key="tab-roadmap"
                  initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -6 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                {roadmapStages && roadmapStages.length > 0 ? (
                  <div className="space-y-6">
                    {roadmapStages.map((stage, index) => {
                      const stats = getStageStats(stage.id)
                      return (
                        <motion.div
                          key={stage.id}
                          {...getMotionFade(0.05 * index)}
                          className="rounded-3xl border border-[#E4E7FB] bg-gradient-to-br from-white to-[#F8FBFF] p-6 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#A492FF]/15 text-[#7C3AED] flex items-center justify-center">
                                <Target className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.3em] text-[#7C3AED]">Tahap {index + 1}</p>
                                <h4 className="text-lg font-semibold text-gray-900">{stage.title}</h4>
                                <p className="text-sm text-gray-600">{stage.description}</p>
                              </div>
                            </div>
                            <div className="md:text-right space-y-2">
                              <div className="text-sm font-semibold text-gray-900">
                                {stats.completed}/{stats.total} checklist
                              </div>
                              <div className="progress-track bg-white/60">
                                <div
                                  className="progress-fill progress-fill--accent"
                                  style={{ width: `${stats.percentage}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500">{stats.percentage}% selesai</p>
                            </div>
                          </div>

                          {stage.activityGroups && stage.activityGroups.length > 0 && (
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                              {stage.activityGroups.map((group) => (
                                <div key={group.id} className="rounded-2xl border border-white/70 bg-white/80 p-4">
                                  <p className="font-semibold text-gray-900 mb-3">{group.title}</p>
                                  <div className="space-y-2">
                                    {group.items.map((item) => {
                                      const isCompleted = roadmapProgress[stage.id]?.groups?.[group.id]?.[item.id] || false
                                      return (
                                        <label key={item.id} className="flex items-center gap-3 text-sm">
                                          <input
                                            type="checkbox"
                                            checked={isCompleted}
                                            onChange={() => handleItemCheck(stage.id, group.id, item.id, !isCompleted)}
                                            className="h-4 w-4 rounded-full border-2 border-[#A492FF] text-[#7AF2C3] focus:ring-[#7AF2C3]"
                                          />
                                          <span className={isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}>
                                            {item.text || item.label}
                                          </span>
                                        </label>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="relative rounded-3xl border-2 border-dashed border-[#A492FF]/40 bg-[#F8F7FF] p-10 text-center overflow-hidden empty-state-float">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#45C7FA]/10 via-transparent to-[#A492FF]/10" aria-hidden></div>
                    <div className="relative z-10 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-lg mx-auto flex items-center justify-center">
                        <Target className="w-8 h-8 text-[#A492FF]" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Roadmap sedang disiapkan untuk perjalanan belajarmu! 🎯</h3>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Kami sedang merangkai milestone personal supaya kamu selalu tahu langkah berikutnya. Sementara itu, lanjutkan eksplorasi materi favoritmu.
                      </p>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 font-semibold text-[#7C3AED] shadow-brand-sm">
                        <Sparkles className="w-4 h-4" /> Kami kabari begitu siap
                      </div>
                    </div>
                  </div>
                )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
        </div>
      </div>

      <FloatingChat />
    </StudentLayout>
  )
}
