"use client"

import type { ComponentType, ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { studentAuth } from '@/lib/student-auth'
import { WebLabAssignment, WebLabSubmission, WebLabSubmissionStatus } from '@prisma/client'
import { WEB_LAB_TEMPLATES } from '@/data/webLabTemplates'
import StudentLayout from '@/components/student/StudentLayout'
import Breadcrumb from '@/components/ui/Breadcrumb'
import CodeMirrorEditor from '@/components/CodeMirrorEditor'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Code2,
  Image as ImageIcon,
  Laptop,
  LayoutGrid,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  Play,
  Smartphone,
  Sparkles,
  SquareStack,
  Timer,
  Zap
} from 'lucide-react'

type TabType = 'html' | 'css' | 'js'
type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

type InstructionGroups = {
  structure: string[]
  interaction: string[]
}

type HintItem = {
  id: string
  text: string
  icon: ComponentType<{ className?: string }>
}

const difficultyMeta = {
  BEGINNER: {
    label: 'Pemula',
    gradient: 'from-emerald-400/25 to-teal-400/40',
    accent: 'text-emerald-600'
  },
  INTERMEDIATE: {
    label: 'Menengah',
    gradient: 'from-amber-300/25 to-orange-400/40',
    accent: 'text-amber-600'
  },
  ADVANCED: {
    label: 'Mahir',
    gradient: 'from-purple-400/25 to-cyan-400/40',
    accent: 'text-purple-600'
  }
} as const

type DifficultyKey = keyof typeof difficultyMeta

const fallbackHintsByDifficulty: Record<DifficultyKey, string[]> = {
  BEGINNER: [
    'Gunakan struktur semantic HTML agar galeri mudah dibaca screen reader',
    'Pastikan gambar berada dalam grid responsif menggunakan CSS modern',
    'Tambahkan tombol close yang jelas dan bisa diakses keyboard'
  ],
  INTERMEDIATE: [
    'Gunakan kombinasi CSS Grid + Flexbox untuk menyusun thumbnail',
    'Manfaatkan transition dan transform untuk animasi buka/tutup modal',
    'Implementasikan navigasi keyboard untuk next / prev foto'
  ],
  ADVANCED: [
    'Kelola state modal menggunakan data attribute atau class agar lebih rapi',
    'Tambahkan preloading gambar dan efek blur-up supaya transisi halus',
    'Integrasikan focus trap di dalam modal agar aksesibilitas terjaga'
  ]
}

const templateHintsMap: Record<string, string[]> = {
  'html-basic': [
    'Gunakan tag header, main, dan footer agar struktur halaman jelas',
    'Tambahkan nav list untuk berpindah antar section',
    'Latih penggunaan elemen button dan event handler sederhana'
  ],
  'portfolio-basic': [
    'Buat hero section dengan headline kuat dan CTA',
    'Susun bagian skills menggunakan card grid',
    'Gunakan anchor link untuk navigasi antar section'
  ],
  'gallery-modal': [
    'Pakai grid 3 kolom untuk thumbnail lalu adjust di layar kecil',
    'Modal perlu overlay gelap dengan transition 200-300ms',
    'Tambahkan kontrol panah untuk berpindah foto saat modal aktif'
  ]
}

const previewDeviceConfigs: Record<PreviewDevice, { frameClass: string; iframeClass: string }> = {
  desktop: {
    frameClass: 'lab-preview-frame--desktop',
    iframeClass: 'lab-preview-iframe--desktop'
  },
  tablet: {
    frameClass: 'lab-preview-frame--tablet',
    iframeClass: 'lab-preview-iframe--tablet'
  },
  mobile: {
    frameClass: 'lab-preview-frame--phone',
    iframeClass: 'lab-preview-iframe--phone'
  }
}

const parseJsonArray = (value?: unknown): string[] => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map(String)
  }

  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    if (Array.isArray(parsed)) {
      return parsed.map(String)
    }
  } catch (error) {
    console.warn('Failed to parse array field', error)
  }

  return []
}

const groupInstructions = (text: string): InstructionGroups => {
  if (!text) {
    return { structure: [], interaction: [] }
  }

  const lines = text
    .split(/\n|\r/) // split by new line
    .map(line => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return { structure: [], interaction: [] }
  }

  const structureKeywords = ['layout', 'section', 'grid', 'thumbnail', 'modal', 'image', 'struktur']
  const interactionKeywords = ['click', 'animasi', 'transition', 'keyboard', 'prev', 'next', 'interaksi']

  const buckets: InstructionGroups = { structure: [], interaction: [] }

  lines.forEach((line) => {
    const lower = line.toLowerCase()
    if (structureKeywords.some(keyword => lower.includes(keyword))) {
      buckets.structure.push(line)
      return
    }

    if (interactionKeywords.some(keyword => lower.includes(keyword))) {
      buckets.interaction.push(line)
      return
    }

    // fallback: distribute alternately for balance
    if (buckets.structure.length <= buckets.interaction.length) {
      buckets.structure.push(line)
    } else {
      buckets.interaction.push(line)
    }
  })

  return buckets
}

const pickHintIcon = (text: string) => {
  const lower = text.toLowerCase()
  if (lower.includes('grid')) return LayoutGrid
  if (lower.includes('modal') || lower.includes('overlay')) return SquareStack
  if (lower.includes('keyboard') || lower.includes('esc') || lower.includes('arrow')) return MonitorSmartphone
  if (lower.includes('transition') || lower.includes('animation')) return MousePointerClick
  if (lower.includes('image') || lower.includes('foto')) return ImageIcon
  return Sparkles
}

const formatTime = (timestamp?: string | null) => {
  if (!timestamp) return null
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function WebLabAssignmentPage() {
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.id as string

  const [assignment, setAssignment] = useState<WebLabAssignment | null>(null)
  const [submission, setSubmission] = useState<WebLabSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [js, setJs] = useState('')
  const [previewDoc, setPreviewDoc] = useState('')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  const [activeTab, setActiveTab] = useState<TabType>('html')
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop')
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)

  const headerRef = useRef<HTMLElement | null>(null)

  const difficultyKey = (assignment?.difficulty as DifficultyKey) ?? 'INTERMEDIATE'

  const requirements = useMemo(() => parseJsonArray(assignment?.requirements), [assignment?.requirements])
  const rawHints = useMemo(() => parseJsonArray(assignment?.hints), [assignment?.hints])
  const templateHints = useMemo(() => (assignment?.template ? templateHintsMap[assignment.template] ?? [] : []), [assignment?.template])
  const resolvedHints = rawHints.length > 0
    ? rawHints
    : templateHints.length > 0
      ? templateHints
      : fallbackHintsByDifficulty[difficultyKey]
  const instructionGroups = useMemo(() => groupInstructions(assignment?.instructions ?? ''), [assignment?.instructions])
  const hintItems: HintItem[] = useMemo(
    () => resolvedHints.map((hint, index) => ({ id: `hint-${index}`, text: hint, icon: pickHintIcon(hint) })),
    [resolvedHints]
  )
  const heroHighlights = useMemo(() => {
    if (!assignment) return []

    const diffKey = (assignment.difficulty as DifficultyKey) ?? 'INTERMEDIATE'
    const difficultyLabel = difficultyMeta[diffKey]?.label ?? 'Menengah'

    const highlights: Array<{ label: string; value: string; icon: ReactNode }> = [
      { label: 'Level Tugas', value: difficultyLabel, icon: <Sparkles className="h-4 w-4" /> },
      { label: 'Poin', value: `${assignment.points} XP`, icon: <Zap className="h-4 w-4" /> }
    ]

    if (assignment.timeLimit) {
      highlights.push({ label: 'Durasi', value: `${assignment.timeLimit} menit`, icon: <Timer className="h-4 w-4" /> })
    }

    return highlights
  }, [assignment])

  const updatePreview = useCallback(() => {
    setIsPreviewLoading(true)

    const previewHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Web Lab Preview</title>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${js}
        </script>
      </body>
      </html>
    `

    setPreviewDoc(previewHtml)
  }, [html, css, js])

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const session = studentAuth.getSession()
        if (!session) {
          router.push('/student/login')
          return
        }

        const assignmentResponse = await fetch(`/api/student/web-lab?studentId=${session.studentId}`)
        if (!assignmentResponse.ok) {
          throw new Error('Gagal memuat tugas Web Lab')
        }

        const assignmentData = await assignmentResponse.json()
        const currentAssignment = assignmentData.data?.find((a: WebLabAssignment) => a.id === assignmentId)

        if (!currentAssignment) {
          throw new Error('Tugas tidak ditemukan')
        }

        setAssignment(currentAssignment)

        const templateData = WEB_LAB_TEMPLATES.find(t => t.id === currentAssignment.template)
        let initialHtml = templateData?.html ?? ''
        let initialCss = templateData?.css ?? ''
        let initialJs = templateData?.js ?? ''

        const submissionResponse = await fetch(`/api/student/web-lab/submissions?studentId=${session.studentId}&assignmentId=${assignmentId}`)
        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json()
          if (submissionData.success && submissionData.data) {
            setSubmission(submissionData.data)
            initialHtml = submissionData.data.html ?? initialHtml
            initialCss = submissionData.data.css ?? initialCss
            initialJs = submissionData.data.js ?? initialJs
            if (submissionData.data.updatedAt) {
              setLastSavedAt(submissionData.data.updatedAt)
            }
          }
        }

        setHtml(initialHtml)
        setCss(initialCss)
        setJs(initialJs)
      } catch (err) {
        console.error('Error fetching assignment:', err)
        setError(err instanceof Error ? err.message : 'Gagal memuat tugas')
      } finally {
        setLoading(false)
      }
    }

    fetchAssignment()
  }, [assignmentId, router])

  useEffect(() => {
    updatePreview()
    const timer = setTimeout(() => setIsPreviewLoading(false), 450)
    return () => clearTimeout(timer)
  }, [updatePreview])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPreviewFullscreen) {
        setIsPreviewFullscreen(false)
      }
    }

    if (isPreviewFullscreen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isPreviewFullscreen])

  useEffect(() => {
    const headerElement = headerRef.current
    if (!headerElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting)
      },
      { threshold: 0.05 }
    )

    observer.observe(headerElement)

    return () => observer.disconnect()
  }, [assignment])

  const saveDraft = async () => {
    try {
      setSaving(true)
      setError(null)

      const session = studentAuth.getSession()
      if (!session) {
        router.push('/student/login')
        return
      }

      const response = await fetch('/api/student/web-lab/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: session.studentId,
          assignmentId,
          html,
          css,
          js,
          status: WebLabSubmissionStatus.DRAFT
        })
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan draft')
      }

      const result = await response.json()
      setSubmission(result.data)
      setMessage('Draft berhasil disimpan!')
      setLastSavedAt(new Date().toISOString())
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error('Error saving draft:', err)
      setError(err instanceof Error ? err.message : 'Gagal menyimpan draft')
    } finally {
      setSaving(false)
    }
  }

  const submitAssignment = async () => {
    try {
      setSubmitting(true)
      setError(null)

      const session = studentAuth.getSession()
      if (!session) {
        router.push('/student/login')
        return
      }

      const response = await fetch('/api/student/web-lab/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: session.studentId,
          assignmentId,
          html,
          css,
          js,
          status: WebLabSubmissionStatus.SUBMITTED
        })
      })

      if (!response.ok) {
        throw new Error('Gagal mengumpulkan tugas')
      }

      const result = await response.json()
      setSubmission(result.data)
      setMessage('Tugas berhasil dikumpulkan!')
      setTimeout(() => setMessage(null), 5000)
    } catch (err) {
      console.error('Error submitting assignment:', err)
      setError(err instanceof Error ? err.message : 'Gagal mengumpulkan tugas')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyCode = async () => {
    const codeByTab = {
      html,
      css,
      js
    }

    try {
      await navigator.clipboard.writeText(codeByTab[activeTab])
      setMessage(`Kode ${activeTab.toUpperCase()} disalin`)
      setTimeout(() => setMessage(null), 2500)
    } catch (err) {
      console.error('Clipboard error:', err)
      setError('Gagal menyalin kode')
      setTimeout(() => setError(null), 2500)
    }
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-purple-200 border-t-purple-500"></div>
          <p className="text-sm text-slate-500">Menyiapkan ruang Web Lab...</p>
        </div>
      </StudentLayout>
    )
  }

  if (!assignment) {
    return (
      <StudentLayout>
        <div className="py-12 text-center text-slate-500">Tugas tidak ditemukan.</div>
      </StudentLayout>
    )
  }

  const difficultyStyles = difficultyMeta[difficultyKey] ?? difficultyMeta.INTERMEDIATE
  const formattedSavedTime = formatTime(lastSavedAt)

  const editorTabs: Array<{ id: TabType; label: string; icon: ReactNode; accent: string }> = [
    { id: 'html', label: 'HTML', icon: <Code2 className="h-4 w-4" />, accent: 'text-orange-500' },
    { id: 'css', label: 'CSS', icon: <Palette className="h-4 w-4" />, accent: 'text-blue-500' },
    { id: 'js', label: 'JavaScript', icon: <Zap className="h-4 w-4" />, accent: 'text-yellow-500' }
  ]

  const deviceOptions: Array<{ id: PreviewDevice; label: string; icon: ReactNode }> = [
    { id: 'desktop', label: 'Laptop', icon: <Laptop className="h-4 w-4" /> },
    { id: 'tablet', label: 'Tablet', icon: <MonitorSmartphone className="h-4 w-4" /> },
    { id: 'mobile', label: 'Phone', icon: <Smartphone className="h-4 w-4" /> }
  ]

  const activePreviewConfig = previewDeviceConfigs[previewDevice] ?? previewDeviceConfigs.desktop

  const submissionStatus = submission?.status === WebLabSubmissionStatus.SUBMITTED
  return (
    <StudentLayout>
      <div className="bg-white/80 px-4 py-3 shadow-sm sm:px-6">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/student/dashboard-simple' },
            { label: 'Web Lab', href: '/student/web-lab' },
            { label: assignment.title }
          ]}
        />
      </div>

      <div className="lab-task-page space-y-8 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <section ref={headerRef} className="lab-task-hero">
          <div className="lab-task-hero__bg"></div>
          <div className="lab-task-hero__content">
            <div>
              <span className="lab-task-badge">
                <Sparkles className="h-4 w-4" /> Web Lab Mission
              </span>
              <h1 className="mt-4 text-3xl font-semibold text-white md:text-4xl">{assignment.title}</h1>
              <p className="mt-3 max-w-2xl text-base text-white/80">{assignment.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className={`lab-difficulty-chip ${difficultyStyles.accent}`}>
                  ⚡ {assignment.difficulty}
                </span>
                <span className="lab-meta-chip">
                  <Sparkles className="h-4 w-4" /> {assignment.classLevel ?? 'Semua Kelas'}
                </span>
                <span className="lab-meta-chip">
                  <Timer className="h-4 w-4" /> {assignment.timeLimit ?? 90} menit fokus
                </span>
              </div>
            </div>

            <div className="lab-hero-panel">
              <div className="space-y-3">
                {heroHighlights.map((highlight) => (
                  <div key={highlight.label} className="lab-hero-stat">
                    <div className="lab-hero-icon">{highlight.icon}</div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/70">{highlight.label}</p>
                      <p className="text-lg font-semibold text-white">{highlight.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={saveDraft}
                  disabled={saving}
                  className="lab-hero-btn lab-hero-btn--ghost"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
                <button
                  onClick={submitAssignment}
                  disabled={submitting || submissionStatus}
                  className="lab-hero-btn lab-hero-btn--primary"
                >
                  {submitting ? 'Mengumpulkan...' : submissionStatus ? 'Sudah Dikumpulkan' : 'Kumpulkan Tugas'}
                  <Play className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="lab-info-card">
            <header className="lab-info-card__header">
              <div className="lab-info-icon">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Instruksi</p>
                <p className="text-xs text-slate-500">Ikuti struktur lalu fokus pada interaksi</p>
              </div>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="lab-info-label">Structure</p>
                <ul className="lab-info-list">
                  {instructionGroups.structure.length > 0 ? (
                    instructionGroups.structure.map((item, index) => (
                      <li key={`structure-${index}`}>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">Tidak ada instruksi struktur spesifik</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="lab-info-label">Interaction</p>
                <ul className="lab-info-list">
                  {instructionGroups.interaction.length > 0 ? (
                    instructionGroups.interaction.map((item, index) => (
                      <li key={`interaction-${index}`}>
                        <CheckCircle2 className="h-4 w-4 text-sky-500" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">Tidak ada instruksi interaksi spesifik</li>
                  )}
                </ul>
              </div>
            </div>
          </article>

          <article className="lab-info-card">
            <header className="lab-info-card__header">
              <div className="lab-info-icon">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Persyaratan</p>
                <p className="text-xs text-slate-500">Centang semua checklist sebelum submit</p>
              </div>
            </header>
            {requirements.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {requirements.map((req, index) => (
                  <div key={`req-${index}`} className="lab-requirement-item">
                    <div className="lab-requirement-icon">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <p>{req}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Belum ada persyaratan khusus untuk tugas ini.</p>
            )}
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="lab-editor">
            <div className="lab-editor__tabs">
              {editorTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`lab-editor-tab ${activeTab === tab.id ? 'lab-editor-tab--active' : ''}`}
                >
                  <span className={`${tab.accent}`}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              <div className="lab-editor__actions">
                <button onClick={handleCopyCode} className="lab-editor-action">
                  <Clipboard className="h-4 w-4" /> Salin kode
                </button>
              </div>
            </div>
            <div className="lab-editor__body">
              {activeTab === 'html' && <CodeMirrorEditor value={html} onChange={setHtml} language="html" />}
              {activeTab === 'css' && <CodeMirrorEditor value={css} onChange={setCss} language="css" />}
              {activeTab === 'js' && <CodeMirrorEditor value={js} onChange={setJs} language="javascript" />}
            </div>
          </div>

          <aside className="lab-preview">
            <header className="lab-preview__header">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Live Preview</p>
                <p className="text-sm font-semibold text-slate-900">Sesuai viewport perangkat</p>
              </div>
              <button className="lab-preview-full" onClick={() => setIsPreviewFullscreen(true)}>
                Full Screen
              </button>
            </header>
            <div className="lab-preview__toolbar">
              {deviceOptions.map((device) => (
                <button
                  key={device.id}
                  onClick={() => setPreviewDevice(device.id)}
                  className={`lab-device-btn ${previewDevice === device.id ? 'lab-device-btn--active' : ''}`}
                >
                  {device.icon}
                  {device.label}
                </button>
              ))}
            </div>
            <div className="lab-preview__body">
              {isPreviewLoading && (
                <div className="lab-preview__loading">
                  <div className="preview-shimmer"></div>
                  <p>Rendering preview...</p>
                </div>
              )}
              <div className={`lab-preview-frame ${activePreviewConfig.frameClass}`}>
                <iframe
                  key={previewDevice}
                  srcDoc={previewDoc}
                  className={`lab-preview-iframe ${activePreviewConfig.iframeClass}`}
                  title="Web Lab Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </aside>
        </section>

        {hintItems.length > 0 && (
          <section className="lab-accordion">
            <div className="lab-info-card">
              <header className="lab-info-card__header">
                <div className="lab-info-icon">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Petunjuk Teknis</p>
                  <p className="text-xs text-slate-500">Gunakan sebagai modul referensi</p>
                </div>
              </header>
              <div className="space-y-3">
                {hintItems.map((hint) => {
                  const Icon = hint.icon
                  return (
                    <details key={hint.id} className="lab-accordion-item">
                      <summary>
                        <span className="lab-accordion-icon">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1 text-sm font-medium text-slate-800">{hint.text.split('.')[0]}</span>
                        <ChevronDown className="lab-accordion-chevron h-4 w-4 text-slate-400" />
                      </summary>
                      <p className="text-sm text-slate-600">{hint.text}</p>
                    </details>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      {message && (
        <div className="lab-toast lab-toast--success">
          <CheckCircle2 className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="lab-toast lab-toast--error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {showStickyBar && (
        <div className="lab-sticky-cta">
          <div>
            <p className="text-sm font-semibold text-slate-900">Siap submit?</p>
            <p className="text-xs text-slate-500">
              {formattedSavedTime ? `Draft tersimpan pukul ${formattedSavedTime}` : 'Belum ada draft tersimpan'}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={saveDraft} disabled={saving} className="lab-sticky-btn lab-sticky-btn--ghost">
              {saving ? 'Menyimpan...' : 'Simpan Draft'}
            </button>
            <button
              onClick={submitAssignment}
              disabled={submitting || submissionStatus}
              className="lab-sticky-btn lab-sticky-btn--primary"
            >
              {submitting ? 'Mengirim...' : submissionStatus ? 'Sudah Dikumpulkan' : 'Kumpulkan Tugas'}
            </button>
          </div>
        </div>
      )}

      {isPreviewFullscreen && (
        <div className="lab-preview-modal" role="dialog" aria-modal="true">
          <div className="lab-preview-modal__content">
            <div className="lab-preview-modal__header">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Live Preview</p>
                <p className="text-sm font-semibold text-slate-900">Full Screen Mode</p>
              </div>
              <button onClick={() => setIsPreviewFullscreen(false)} className="rounded-full bg-slate-100 p-2 text-slate-500">
                ✕
              </button>
            </div>
            <div className="lab-preview-modal__body">
              <div className={`lab-preview-frame lab-preview-frame--modal ${activePreviewConfig.frameClass}`}>
                <iframe
                  srcDoc={previewDoc}
                  className={`lab-preview-iframe lab-preview-iframe--modal ${activePreviewConfig.iframeClass}`}
                  title="Web Lab Preview - Full Screen"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  )
}
