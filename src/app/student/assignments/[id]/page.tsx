'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { studentAuth } from '@/lib/student-auth'
import { motion } from 'framer-motion'
import {
  Upload,
  File as FileIcon,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Sparkles,
  ClipboardCheck,
  Layers,
  Image as ImageIcon,
  FileText,
  Presentation,
  PenLine,
  FolderClock,
  Shield,
  Laptop
} from 'lucide-react'
import StudentLayout from '@/components/student/StudentLayout'
import Breadcrumb from '@/components/ui/Breadcrumb'

type Assignment = {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  status: string
  maxSubmissions?: number
  instructions?: string[]
}

type Submission = {
  id: string
  fileName: string
  filePath: string
  submittedAt: string
  status?: string
  grade?: number
  feedback?: string
}

type AssignmentType = 'presentation' | 'paper' | 'essay' | 'coding' | 'review' | 'quiz'

const typeDisplayMap: Record<AssignmentType, { chip: string; cta: string; descriptionLabel: string }> = {
  presentation: {
    chip: 'Presentasi',
    cta: 'Mulai Menyusun Presentasi →',
    descriptionLabel: 'Ringkasan singkat & to the point'
  },
  paper: {
    chip: 'Makalah',
    cta: 'Mulai Kerjakan Makalah →',
    descriptionLabel: 'Highlight inti makalahmu'
  },
  essay: {
    chip: 'Esai',
    cta: 'Mulai Menulis Esai →',
    descriptionLabel: 'Sorotan utama esai'
  },
  coding: {
    chip: 'Coding Lab',
    cta: 'Mulai Coding Sekarang →',
    descriptionLabel: 'Tujuan praktik coding'
  },
  review: {
    chip: 'Review',
    cta: 'Mulai Review →',
    descriptionLabel: 'Poin inti yang perlu dikupas'
  },
  quiz: {
    chip: 'Quiz',
    cta: 'Mulai Quiz →',
    descriptionLabel: 'Ringkasan materi quiz'
  }
}

const detectAssignmentType = (assignment?: Assignment | null): AssignmentType => {
  if (!assignment) return 'presentation'
  const title = assignment.title.toLowerCase()
  if (title.includes('makalah')) return 'paper'
  if (title.includes('esai')) return 'essay'
  if (title.includes('presentasi') || title.includes('presentasi')) return 'presentation'
  return 'presentation'
}

export default function StudentAssignmentDetail() {
  const router = useRouter()
  const params = useParams()
  const assignmentId = (params as { id?: string }).id || ''

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const fetchAssignmentDetails = useCallback(async () => {
    const studentSession = studentAuth.getSession()
    if (!studentSession) {
      router.push('/student/login')
      return
    }

    try {
      setLoading(true)

      const assignmentResponse = await fetch(`/api/tutorial/assignments/${assignmentId}`)
      if (assignmentResponse.ok) {
        const assignmentData = await assignmentResponse.json()
        setAssignment(assignmentData.data)
      }

      const submissionsResponse = await fetch(`/api/tutorial/submissions?assignmentId=${assignmentId}&studentId=${studentSession.studentId}`)
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json()
        setSubmissions(submissionsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching assignment details:', error)
      setError('Gagal memuat detail tugas')
    } finally {
      setLoading(false)
    }
  }, [assignmentId, router])

  useEffect(() => {
    const studentSession = studentAuth.getSession()

    if (!studentSession) {
      router.push('/student/login?redirectTo=' + encodeURIComponent(`/student/assignments/${assignmentId}`))
      return
    }

    fetchAssignmentDetails()
  }, [router, assignmentId, fetchAssignmentDetails])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'graded':
        return 'text-green-600 bg-green-50'
      case 'submitted':
        return 'text-blue-600 bg-blue-50'
      case 'late':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getProgressStatus = () => {
    if (!assignment) return null

    const now = new Date()
    const dueDate = new Date(assignment.dueDate)
    const hasSubmission = submissions.length > 0
    const hasGradedSubmission = submissions.some((s) => s.status === 'graded')

    if (hasGradedSubmission) {
      return { status: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    } else if (hasSubmission) {
      return { status: 'Sedang Berjalan', color: 'bg-blue-100 text-blue-800', icon: Clock }
    } else if (now > dueDate) {
      return { status: 'Terlambat', color: 'bg-red-100 text-red-800', icon: AlertCircle }
    } else {
      return { status: 'Belum Mulai', color: 'bg-gray-100 text-gray-800', icon: BookOpen }
    }
  }

  const progressStatus = getProgressStatus()
  const hasSubmissions = submissions.length > 0
  const studentSession = studentAuth.getSession()

  const deadlineMeta = useMemo(() => {
    if (!assignment) return null
    const now = new Date()
    const due = new Date(assignment.dueDate)
    const diffMs = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    if (diffMs < 0) {
      return { tone: 'late', label: 'Sudah Melewati Batas', chip: 'Terlambat', subtext: `${Math.abs(diffDays)} hari lalu` }
    }
    if (diffDays <= 3) {
      return { tone: 'urgent', label: 'Mendekati Deadline', chip: 'Segera', subtext: `${diffDays} hari lagi` }
    }
    return { tone: 'safe', label: 'Masih Ada Waktu', chip: 'On Track', subtext: `${diffDays} hari lagi` }
  }, [assignment])

  const descriptionParagraphs = useMemo(() => {
    if (!assignment?.description) return []
    return assignment.description.split(/\n+/).filter((paragraph) => paragraph.trim().length > 0)
  }, [assignment])

  const assignmentType = useMemo(() => detectAssignmentType(assignment), [assignment])
  const typeDisplay = typeDisplayMap[assignmentType]

  const summaryChips = useMemo(() => {
    if (!assignment) return []
    const chips = [
      { label: 'Jenis Tugas', value: typeDisplay.chip, icon: Layers },
      { label: 'Mata Pelajaran', value: assignment.subject || 'Umum', icon: BookOpen },
      { label: 'Status', value: progressStatus?.status || 'Belum Mulai', icon: Shield }
    ]
    if (deadlineMeta) {
      chips.push({ label: 'Deadline', value: deadlineMeta.subtext, icon: Calendar })
    }
    return chips
  }, [assignment, typeDisplay, progressStatus, deadlineMeta])

  type InstructionGroup = {
    id: string
    title: string
    icon: React.ElementType
    items: string[]
  }

  const instructionGroups: InstructionGroup[] = useMemo(() => {
    if (!assignment) return []
    const assignmentType = detectAssignmentType(assignment)

    const baseByType: Record<AssignmentType, InstructionGroup[]> = {
      presentation: [
        { id: 'format', title: 'Format Presentasi', icon: FileText, items: [] },
        { id: 'content', title: 'Konten Wajib', icon: ClipboardCheck, items: [] },
        { id: 'media', title: 'Media Pendukung', icon: ImageIcon, items: [] },
        { id: 'delivery', title: 'Penyampaian', icon: Presentation, items: [] }
      ],
      paper: [
        { id: 'format', title: 'Format Penulisan', icon: FileText, items: [] },
        { id: 'references', title: 'Referensi & Kutipan', icon: ClipboardCheck, items: [] },
        { id: 'file', title: 'Persyaratan File', icon: FolderClock, items: [] },
        { id: 'notes', title: 'Catatan Pengumpulan', icon: BookOpen, items: [] }
      ],
      essay: [
        { id: 'format', title: 'Format Esai', icon: PenLine, items: [] },
        { id: 'structure', title: 'Struktur Esai', icon: Layers, items: [] },
        { id: 'insight', title: 'Insight & Referensi', icon: ClipboardCheck, items: [] },
        { id: 'file', title: 'File Upload', icon: FileIcon, items: [] }
      ],
      coding: [
        { id: 'setup', title: 'Setup Lingkungan', icon: Laptop, items: [] },
        { id: 'tasks', title: 'Tugas Coding', icon: ClipboardCheck, items: [] },
        { id: 'submit', title: 'Cara Submit', icon: Upload, items: [] },
        { id: 'notes', title: 'Catatan', icon: BookOpen, items: [] }
      ],
      review: [
        { id: 'format', title: 'Format Review', icon: FileText, items: [] },
        { id: 'content', title: 'Konten Analisis', icon: ClipboardCheck, items: [] },
        { id: 'media', title: 'Bukti Pendukung', icon: ImageIcon, items: [] },
        { id: 'file', title: 'Pengumpulan', icon: Upload, items: [] }
      ],
      quiz: [
        { id: 'info', title: 'Info Quiz', icon: Shield, items: [] },
        { id: 'scope', title: 'Lingkup Materi', icon: Layers, items: [] },
        { id: 'technical', title: 'Ketentuan Teknis', icon: Laptop, items: [] },
        { id: 'notes', title: 'Catatan Penting', icon: BookOpen, items: [] }
      ]
    }

    const base = baseByType[assignmentType].map((group) => ({ ...group, items: [] as string[] }))

    const instructions = assignment.instructions ?? []
    if (!instructions.length) {
      base[0].items.push('5–8 slide ratio 16:9', 'Gunakan font sans-serif 20–28pt')
      base[1].items.push('Cover + profil aplikasi', 'UI/UX review, fitur unggulan, rating pribadi')
      base[2].items.push('Minimal 3 screenshot berkualitas', 'File PDF/PPTX, maksimal 10MB')
      base[3].items.push('Durasi presentasi 3–5 menit', 'Gunakan visual dominan, minim teks')
      return base
    }

    const keywordMap: Record<string, string> = {
      format: 'format',
      slide: 'format',
      font: 'format',
      konten: 'content',
      wajib: 'content',
      referensi: 'content',
      screenshot: 'media',
      file: 'media',
      pdf: 'media',
      ppt: 'media',
      presentasi: 'delivery',
      durasi: 'delivery'
    }

    instructions.forEach((instruction) => {
      const lower = instruction.toLowerCase()
      const groupKey = Object.entries(keywordMap).find(([keyword]) => lower.includes(keyword))?.[1] || base[1]?.id || 'content'
      const group = base.find((g) => g.id === groupKey)
      group?.items.push(instruction)
    })

    return base.filter((group) => group.items.length > 0)
  }, [assignment])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('File terlalu besar. Maksimal 10MB.')
      return
    }
    setSelectedFile(file)
    setError('')
  }

  const handleFileUpload = async () => {
    if (!selectedFile || !assignment) return

    const session = studentAuth.getSession()
    if (!session) {
      router.push('/student/login')
      return
    }

    try {
      setUploading(true)
      setError('')
      setMessage('')

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('assignmentId', assignment.id)
      formData.append('studentId', (session as { studentId?: string }).studentId || '')

      const response = await fetch('/api/tutorial/submissions', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (response.ok) {
        setMessage('File berhasil diupload!')
        setSelectedFile(null)
        const fileInput = document.getElementById('file-upload') as HTMLInputElement | null
        if (fileInput) fileInput.value = ''
        fetchAssignmentDetails()
      } else {
        setError(result.error || 'Gagal mengupload file')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Terjadi kesalahan saat mengupload file')
    } finally {
      setUploading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Daftar Tugas', href: '/student/assignments' },
    { label: assignment ? assignment.title : 'Detail Tugas' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!studentSession || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tugas Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Tugas yang Anda cari tidak dapat ditemukan.</p>
          <button
            onClick={() => router.push('/student/dashboard-simple')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <StudentLayout loading={loading}>
      <div className="task-detail-page max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <motion.section
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="task-detail-hero-card"
        >
          <div className="task-detail-hero-card__content">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="task-detail-chip">{typeDisplay.chip}</span>
              {assignment.subject && <span className="task-detail-chip">{assignment.subject}</span>}
              {deadlineMeta && (
                <span className={`task-detail-chip task-detail-chip--${deadlineMeta.tone}`}>
                  {deadlineMeta.label}
                </span>
              )}
            </div>
            <h1 className="task-detail-title">{assignment.title}</h1>
            {descriptionParagraphs.length > 0 && (
              <p className="task-detail-subtitle">{descriptionParagraphs[0]}</p>
            )}
            <div className="task-detail-status-row">
              {deadlineMeta && (
                <div className="task-detail-deadline">
                  <p className="task-detail-deadline__label">Deadline</p>
                  <p className="task-detail-deadline__value">{formatDate(assignment.dueDate)}</p>
                  <p className="task-detail-deadline__meta">{deadlineMeta.subtext}</p>
                </div>
              )}
              {progressStatus && (
                <div className="task-detail-status-badge">
                  <progressStatus.icon className="w-5 h-5" />
                  {progressStatus.status}
                </div>
              )}
              <button className="task-detail-primary-cta">
                {progressStatus?.status === 'Selesai' ? 'Lihat Hasil →' : typeDisplay.cta}
              </button>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="task-summary-chips"
        >
          {summaryChips.map((chip, index) => {
            const ChipIcon = chip.icon
            return (
              <motion.div
                key={`${chip.label}-${chip.value}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="task-summary-chip"
              >
                <ChipIcon className="w-4 h-4" />
                <div>
                  <p>{chip.label}</p>
                  <span>{chip.value}</span>
                </div>
              </motion.div>
            )
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="task-section-card"
        >
          <div className="task-section-header">
            <div>
              <p className="task-section-label">Deskripsi Tugas</p>
              <h3 className="task-section-title">{typeDisplay.descriptionLabel}</h3>
            </div>
            <Sparkles className="w-5 h-5 text-[#A492FF]" />
          </div>
          <div className="task-description-content">
            {(descriptionParagraphs.length ? descriptionParagraphs : [assignment.description]).map((paragraph, index) => (
              <p key={`desc-${index}`} className="task-description-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="task-instruction-card"
        >
          <div className="task-section-header">
            <div>
              <p className="task-section-label">{instructionHeading[assignmentType].label}</p>
              <h3 className="task-section-title">{instructionHeading[assignmentType].subtitle}</h3>
            </div>
          </div>
          <div className="task-instruction-grid">
            {instructionGroups.map((group) => {
              const Icon = group.icon
              return (
                <div key={group.id} className="task-instruction-group">
                  <motion.div
                    className="task-instruction-icon"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <h4>{group.title}</h4>
                    <ul>
                      {group.items.map((item, index) => (
                        <motion.li
                          key={`${group.id}-${index}`}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="task-upload-card"
        >
          <div className="task-section-header">
            <div>
              <p className="task-section-label">Upload Presentasi</p>
              <h3 className="task-section-title">{uploadTextMap[assignmentType].title}</h3>
            </div>
          </div>

          {message && (
            <div className="task-upload-alert task-upload-alert--success">
              <CheckCircle className="w-5 h-5" />
              {message}
            </div>
          )}

          {error && (
            <div className="task-upload-alert task-upload-alert--error">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="task-upload-dropzone">
            <div className="task-upload-dropzone__icon">
              <Upload className="w-10 h-10" />
            </div>
            <div>
              <p className="task-upload-dropzone__title">Seret & lepaskan file, atau klik pilih dokumen</p>
              <p className="task-upload-dropzone__subtitle">{uploadTextMap[assignmentType].subtitle}</p>
            </div>
            <label htmlFor="file-upload" className="task-upload-dropzone__button">
              Pilih File
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              />
            </label>
          </div>
          <div className="task-upload-meta">
            <span>Format: PDF, DOC, PPTX</span>
            <span>Max 10MB</span>
            <span>Nama file: NIS_Nama_Tugas.pdf</span>
          </div>

          {selectedFile && (
            <div className="task-upload-file">
              <div className="flex items-center gap-3">
                <FileIcon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={handleFileUpload}
                disabled={uploading}
                className="task-detail-primary-cta"
              >
                {uploading ? 'Mengupload...' : 'Upload Sekarang'}
              </button>
            </div>
          )}
        </motion.section>

        {hasSubmissions && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="task-section-card"
          >
            <div className="task-section-header">
              <div>
                <p className="task-section-label">Riwayat Submission</p>
                <h3 className="task-section-title">Lacak semua pengumpulanmu</h3>
              </div>
            </div>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="task-submission-card">
                  <div>
                    <p className="task-submission-title">{submission.fileName}</p>
                    <p className="task-submission-meta">Diupload: {formatDate(submission.submittedAt)}</p>
                    {submission.feedback && (
                      <div className="task-submission-feedback">
                        <p>Feedback:</p>
                        <span>{submission.feedback}</span>
                      </div>
                    )}
                  </div>
                  <div className="task-submission-right">
                    {submission.grade && <span className="task-submission-grade">Nilai: {submission.grade}</span>}
                    <span className={`task-submission-status ${getStatusColor(submission.status)}`}>
                      {submission.status === 'graded' ? 'Dinilai' : submission.status === 'submitted' ? 'Terkirim' : submission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </StudentLayout>
  )
}
const instructionHeading: Record<AssignmentType, { label: string; subtitle: string }> = {
  presentation: { label: 'Instruksi Pengumpulan', subtitle: 'Ikuti struktur berikut supaya presentasimu siap' },
  paper: { label: 'Panduan Penulisan Makalah', subtitle: 'Checklist format & referensi wajib' },
  essay: { label: 'Panduan Penulisan Esai', subtitle: 'Struktur poin dan insight penting' },
  coding: { label: 'Instruksi Coding Lab', subtitle: 'Langkah pengerjaan & aturan submit' },
  review: { label: 'Panduan Review', subtitle: 'Sorotan analisis dan bukti pendukung' },
  quiz: { label: 'Instruksi Quiz', subtitle: 'Ketentuan teknis dan lingkup materi' }
}

const uploadTextMap: Record<AssignmentType, { title: string; subtitle: string }> = {
  presentation: {
    title: 'Unggah file presentasimu 📤',
    subtitle: 'Dokumen akan langsung tersimpan, tanpa perlu refresh.'
  },
  paper: {
    title: 'Unggah makalah kamu 📄',
    subtitle: 'Pastikan format sesuai ketentuan sebelum upload.'
  },
  essay: {
    title: 'Unggah esai finalmu ✏️',
    subtitle: 'Kami simpan otomatis tanpa perlu refresh.'
  },
  coding: {
    title: 'Unggah hasil codingmu 💻',
    subtitle: 'Sertakan file zip atau dokumen sesuai instruksi.'
  },
  review: {
    title: 'Unggah dokumen review 📑',
    subtitle: 'Lampirkan screenshot pendukung jika diperlukan.'
  },
  quiz: {
    title: 'Unggah bukti pengerjaan 📝',
    subtitle: 'Gunakan format dokumen yang diperbolehkan.'
  }
}
