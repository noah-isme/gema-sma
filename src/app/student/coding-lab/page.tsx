'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import StudentLayout from '@/components/student/StudentLayout'
import Breadcrumb from '@/components/ui/Breadcrumb'
import PlayfulTourGuide, { TourStep } from '@/components/student/PlayfulTourGuide'
import { studentAuth } from '@/lib/student-auth'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Flame,
  Filter,
  Layers,
  ListChecks,
  Play,
  Star,
  Target
} from 'lucide-react'

interface TestCase {
  id: string
  name: string
  input: string
  expectedOutput: string
  isHidden: boolean
  order: number
}

interface Task {
  id: string
  title: string
  slug: string
  description: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: string
  points: number
  testCases: TestCase[]
  studentStatus: {
    attempted: boolean
    attempts: number
    bestScore: number
    completed: boolean
    lastSubmittedAt: string | null
  }
}

const difficultyOrder: Array<Task['difficulty']> = ['EASY', 'MEDIUM', 'HARD']

const difficultyMeta = {
  EASY: {
    label: 'Mudah',
    accent: 'python-chip--easy',
    cardAccent: 'python-card-accent--easy',
    badge: 'python-difficulty python-difficulty--easy'
  },
  MEDIUM: {
    label: 'Sedang',
    accent: 'python-chip--medium',
    cardAccent: 'python-card-accent--medium',
    badge: 'python-difficulty python-difficulty--medium'
  },
  HARD: {
    label: 'Sulit',
    accent: 'python-chip--hard',
    cardAccent: 'python-card-accent--hard',
    badge: 'python-difficulty python-difficulty--hard'
  }
} as const

const categoryMeta: Record<string, { label: string; icon: string }> = {
  general: { label: 'General', icon: '📂' },
  algorithm: { label: 'Algorithm', icon: '⚙️' },
  'data-structure': { label: 'Data Structure', icon: '🧩' },
  string: { label: 'String', icon: '🔤' },
  math: { label: 'Math', icon: '📐' }
}

const difficultyFilters = [
  { label: 'Mudah', value: 'EASY', icon: '🔰' },
  { label: 'Sedang', value: 'MEDIUM', icon: '⚡' },
  { label: 'Sulit', value: 'HARD', icon: '🔥' }
]

const categoryFilters = [
  { label: 'General', value: 'general', icon: '📂' },
  { label: 'Algorithm', value: 'algorithm', icon: '⚙️' },
  { label: 'String', value: 'string', icon: '🔡' },
  { label: 'Math', value: 'math', icon: '📐' },
  { label: 'Data Structure', value: 'data-structure', icon: '🧩' }
]

const codingLabTourSteps: TourStep[] = [
  {
    selector: '#codinglab-hero',
    emoji: '🐍',
    title: 'Lab Python kamu',
    subtitle: 'Level + streak keliatan',
    text: 'Di sini kamu bisa liat XP, streak harian, sama badge yang udah dikumpulin. Jadi tau seberapa jauh progress ngoding minggu ini.'
  },
  {
    selector: '#codinglab-filters',
    emoji: '🎚️',
    title: 'Filter soal',
    subtitle: 'Cari yang pas sama mood',
    text: 'Pilih tingkat kesulitan atau kategori favorit biar daftar tantangannya sesuai sama yang pengen kamu kerjain hari ini.'
  },
  {
    selector: '#codinglab-progress',
    emoji: '🎯',
    title: 'Banner progres',
    subtitle: 'Target mingguan kamu',
    text: 'Banner ini nunjukin berapa banyak tantangan yang udah selesai, XP yang lagi dikumpulin, sama streak coding-mu.'
  },
  {
    selector: '#codinglab-tasks',
    emoji: '🧠',
    title: 'Daftar tantangan Python',
    subtitle: 'Detail lengkap tiap soal',
    text: 'Setiap kartu ada XP-nya, contoh input/output, tingkat kesulitan, sama tombol buat mulai. Tinggal pilih dan langsung coding deh.'
  }
]

type HeroStat = { label: string; value: string | number; icon: JSX.Element }

type ProgressSummary = {
  total: number
  completed: number
  attempted: number
  xpEarned: number
  totalXP: number
  xpPercent: number
  streakDays: number
  weeklyChallenges: number
}

const formatExample = (testCase?: TestCase) => {
  if (!testCase) return null
  const trimmedInput = testCase.input.length > 60 ? `${testCase.input.slice(0, 57)}...` : testCase.input
  const trimmedOutput = testCase.expectedOutput.length > 60 ? `${testCase.expectedOutput.slice(0, 57)}...` : testCase.expectedOutput

  return {
    input: trimmedInput || '—',
    output: trimmedOutput || '—'
  }
}

export default function PythonCodingLabPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const session = studentAuth.getSession()
      if (!session) {
        router.push('/student/login')
        return
      }

      const params = new URLSearchParams()
      params.append('studentId', session.id)
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/coding-lab-python/tasks?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memuat data')
      }

      setTasks(data.tasks || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }, [router, selectedCategory, selectedDifficulty])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const progressSummary: ProgressSummary = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.studentStatus.completed).length
    const attempted = tasks.filter(task => task.studentStatus.attempted && !task.studentStatus.completed).length
    const xpEarned = tasks.reduce((sum, task) => sum + (task.studentStatus.bestScore || 0), 0)
    const totalXP = tasks.reduce((sum, task) => sum + task.points, 0)
    const xpPercent = totalXP ? Math.min(100, Math.round((xpEarned / totalXP) * 100)) : 0

    const submissionDates = tasks
      .map(task => task.studentStatus.lastSubmittedAt)
      .filter(Boolean)
      .map(date => new Date(date as string).toDateString())
    const uniqueRecentDates = Array.from(new Set(submissionDates)).slice(-7)

    return {
      total,
      completed,
      attempted,
      xpEarned,
      totalXP,
      xpPercent,
      streakDays: uniqueRecentDates.length,
      weeklyChallenges: Math.min(uniqueRecentDates.length, completed)
    }
  }, [tasks])

  const groupedTasks = useMemo(() => {
    return tasks.reduce<Record<string, Task[]>>((acc, task) => {
      const key = task.difficulty
      acc[key] = acc[key] ? [...acc[key], task] : [task]
      return acc
    }, {})
  }, [tasks])

  const heroStats: HeroStat[] = [
    { label: 'Total Soal', value: progressSummary.total, icon: <Target className="h-4 w-4 text-indigo-500" /> },
    { label: 'Selesai', value: progressSummary.completed, icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" /> },
    { label: 'Dicoba', value: progressSummary.attempted, icon: <ListChecks className="h-4 w-4 text-amber-500" /> },
    { label: 'Total XP', value: progressSummary.totalXP, icon: <Star className="h-4 w-4 text-sky-500" /> }
  ]

  const breadcrumbItems = useMemo(() => (
    [
      { label: 'Dashboard', href: '/student/dashboard' },
      { label: 'Coding Lab', href: '/student/coding-lab' }
    ]
  ), [])

  const renderProgressBadge = (task: Task) => {
    if (task.studentStatus.completed) {
      return <span className="python-progress-pill python-progress-pill--done">✔ Selesai</span>
    }

    if (task.studentStatus.attempted) {
      const percent = Math.min(100, Math.round((task.studentStatus.bestScore / task.points) * 100))
      return <span className="python-progress-pill python-progress-pill--in">Dicoba · {percent}%</span>
    }

    return <span className="python-progress-pill">Belum dimulai</span>
  }

  const noTasksState = (
    <div className="python-empty-state">
      <div className="python-empty-illustration">🐍</div>
      <h3>Tidak ada tantangan di filter ini</h3>
      <p>Coba kategori atau tingkat lain. Ada banyak misi Python seru buatmu ✨</p>
      <button
        type="button"
        onClick={() => {
          setSelectedCategory('')
          setSelectedDifficulty('')
        }}
        className="python-chip python-chip--clear"
      >
        Reset filter
      </button>
    </div>
  )

  return (
    <StudentLayout loading={loading}>
      <div className="python-lab-page space-y-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-end">
          <PlayfulTourGuide
            tourId="student-codinglab"
            steps={codingLabTourSteps}
            autoStartDelay={1300}
            renderTrigger={({ startTour, hasSeenTutorial, storageReady }) => (
              <button type="button" className="tour-trigger-chip" onClick={startTour}>
                {storageReady && hasSeenTutorial ? 'Ulang panduan' : 'Butuh panduan?'}
                <span aria-hidden>🐍</span>
              </button>
            )}
          />
        </div>

        {error && (
          <div className="python-alert">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Gagal memuat data</p>
              <p className="text-sm">{error}</p>
            </div>
            <button type="button" onClick={fetchTasks}>Coba lagi</button>
          </div>
        )}

        <section id="codinglab-hero" className="python-hero">
          <div className="python-hero__grid">
            <div className="python-hero__main">
              <div className="python-hero__badge">
                <span role="img" aria-label="Python">🐍</span>
                Python Coding Lab
              </div>
              <h1>Python Coding Lab</h1>
              <p>Tingkatkan skill programming dengan latihan interaktif</p>
              <div className="python-xp">
                <div className="python-xp__header">
                  <span>XP Progress</span>
                  <span>{progressSummary.xpEarned} / {progressSummary.totalXP || 0} XP</span>
                </div>
                <div className="python-xp__track">
                  <div className="python-xp__fill" style={{ width: `${progressSummary.xpPercent}%` }}></div>
                </div>
              </div>
              <div className="python-streak">
                <div className="python-streak__icon">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p>Streak Coding</p>
                  <span>{progressSummary.streakDays} Hari • {progressSummary.weeklyChallenges} Tantangan pekan ini</span>
                </div>
              </div>
            </div>
            <div className="python-hero__stats">
              {heroStats.map(stat => (
                <div key={stat.label} className="python-hero-card">
                  <div className="python-hero-card__icon">{stat.icon}</div>
                  <p className="python-hero-card__value">{stat.value}</p>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="codinglab-filters" className="python-filter-card">
          <div className="python-filter-card__header">
            <div>
              <p className="python-filter-card__title">Filter Tantangan</p>
              <p className="python-filter-card__subtitle">{tasks.length} tugas tersedia</p>
            </div>
            {(selectedCategory || selectedDifficulty) && (
              <button
                type="button"
                className="python-chip python-chip--clear"
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedDifficulty('')
                }}
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="python-filter-chip-group">
            <span className="group-label"><Filter className="h-4 w-4" /> Tingkat</span>
            {difficultyFilters.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedDifficulty(prev => prev === option.value ? '' : option.value)}
                className={`python-chip ${selectedDifficulty === option.value ? 'python-chip--active ' + (difficultyMeta[option.value as Task['difficulty']].accent) : ''}`}
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
          <div className="python-filter-chip-group">
            <span className="group-label"><Layers className="h-4 w-4" /> Kategori</span>
            {categoryFilters.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedCategory(prev => prev === option.value ? '' : option.value)}
                className={`python-chip ${selectedCategory === option.value ? 'python-chip--active' : ''}`}
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section id="codinglab-progress" className="python-progress-banner">
          <div className="banner-icon">🎯</div>
          <div className="banner-text">
            <p>Progress: {progressSummary.completed}/{progressSummary.total} Tantangan</p>
            <span>XP terkumpul {progressSummary.xpEarned} • Streak {progressSummary.streakDays} hari</span>
          </div>
          <button type="button" className="banner-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Lihat detail
            <ChevronRight className="h-4 w-4" />
          </button>
        </section>

        {loading ? (
          <div className="python-loading">
            <div className="spinner" />
            <p>Memuat tantangan Python...</p>
          </div>
        ) : tasks.length === 0 ? (
          noTasksState
        ) : (
          <div id="codinglab-tasks" className="space-y-6">
            {difficultyOrder.map(difficulty => {
              const bucket = groupedTasks[difficulty] || []
              if (bucket.length === 0) return null

              const meta = difficultyMeta[difficulty]

              return (
              <section key={difficulty} className="python-group">
                <header className="python-group__header">
                  <div>
                    <p className="group-title">{meta.label}</p>
                    <span>{bucket.length} tantangan</span>
                  </div>
                </header>
                <div className="python-task-grid">
                  {bucket.map(task => {
                    const example = formatExample(task.testCases?.find(tc => !tc.isHidden))
                    const progressPercent = task.points ? Math.min(100, Math.round((task.studentStatus.bestScore / task.points) * 100)) : 0
                    const categoryInfo = categoryMeta[task.category] || { label: task.category, icon: '📂' }

                    return (
                      <article key={task.id} className={`python-task-card ${meta.cardAccent}`}>
                        <div className="python-task-card__accent" aria-hidden></div>
                        <div className="python-task-card__head">
                          <div className="python-labels">
                            <span className={meta.badge}>{meta.label}</span>
                            <span className="python-category">
                              {categoryInfo.icon} {categoryInfo.label}
                            </span>
                            {renderProgressBadge(task)}
                          </div>
                          <button
                            type="button"
                            className="python-card-cta"
                            onClick={() => router.push(`/student/coding-lab/${task.slug}`)}
                          >
                            Mulai
                            <Play className="h-4 w-4" />
                          </button>
                        </div>
                        <h3>{task.title}</h3>
                        <p className="python-description">{task.description}</p>
                        <div className="python-meta-row">
                          <span className="python-xp-chip">
                            <Star className="h-4 w-4" /> {task.points} XP
                          </span>
                          <span className="python-score-chip">
                            Skor terbaik {task.studentStatus.bestScore}/{task.points}
                          </span>
                          <span className="python-attempt-chip">
                            {task.studentStatus.attempts || 0} attempt
                          </span>
                        </div>
                        {example && (
                          <div className="python-example">
                            <div className="python-example__header">Example</div>
                            <div className="python-example__body">
                              <div>
                                <span>Input</span>
                                <p>{example.input}</p>
                              </div>
                              <div>
                                <span>Output</span>
                                <p>{example.output}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="python-progress">
                          <div className="python-progress__header">
                            <span>{task.studentStatus.completed ? 'Misi selesai' : task.studentStatus.attempted ? 'Sedang dikerjakan' : 'Belum dimulai'}</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="python-progress__track">
                            <div
                              className={`python-progress__fill ${task.studentStatus.completed ? 'is-done' : task.studentStatus.attempted ? 'is-active' : ''}`}
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
