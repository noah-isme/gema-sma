"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  BookOpen,
  Loader2,
  AlertTriangle,
  Sparkles,
  Info,
  ChevronDown,
  X,
  Check,
  Loader,
  ShieldCheck
} from 'lucide-react'
import { Toast } from '@/components/feedback/toast'
import { useAnimatedAuthBackground } from '@/hooks/useAnimatedAuthBackground'

const CLASS_OPTIONS = [
  'X-1', 'X-2', 'X-3', 'X-4',
  'XI-1', 'XI-2', 'XI-3', 'XI-4',
  'XII-1', 'XII-2', 'XII-3', 'XII-4',
]

const EXTRACURRICULAR_OPTIONS = [
  'Web Development',
  'Mobile Apps',
  'AI & Machine Learning',
  'Robotik',
  'UI/UX Design',
  'Data & Algoritma',
  'IoT & Hardware',
  'Cybersecurity',
  'Multimedia & Desain',
]

const GRADE_FILTERS = [
  { label: 'Kelas X', value: 'X' },
  { label: 'Kelas XI', value: 'XI' },
  { label: 'Kelas XII', value: 'XII' },
]

const STEP_DEFINITIONS = [
  { id: 'account', title: 'Informasi Akun', subtitle: 'Wajib diisi untuk membuat akun' },
  { id: 'identity', title: 'Data Identitas Siswa', subtitle: 'Pastikan sesuai data sekolah' },
  { id: 'parent', title: 'Kontak Orang Tua', subtitle: 'Memudahkan guru menghubungi wali' },
  { id: 'interest', title: 'Minat Ekstrakurikuler', subtitle: 'Opsional untuk rekomendasi konten' }
] as const

type StepId = typeof STEP_DEFINITIONS[number]['id']
type AvailabilityState = 'idle' | 'checking' | 'available' | 'taken' | 'error'

export default function StudentRegisterPage() {
  useAnimatedAuthBackground()
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    class: '',
    phone: '',
    address: '',
    parentName: '',
    parentPhone: ''
  })
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [gradeFilter, setGradeFilter] = useState<'X' | 'XI' | 'XII'>('X')
  const [classInputValue, setClassInputValue] = useState('')
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false)
  const [isInterestDropdownOpen, setIsInterestDropdownOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [stepDirection, setStepDirection] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [availability, setAvailability] = useState({
    email: { status: 'idle' as AvailabilityState, message: '' },
    studentId: { status: 'idle' as AvailabilityState, message: '' }
  })
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ show: false, message: '', type: 'info' })

  const router = useRouter()
  const classDropdownRef = useRef<HTMLDivElement>(null)
  const interestDropdownRef = useRef<HTMLDivElement>(null)

  const inputBaseClass =
    'w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:bg-white focus:shadow-[0_12px_35px_rgba(59,130,246,0.15)] outline-none'

  const cardVariants = {
    enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -60 : 60 })
  }

  const filteredClassOptions = useMemo(() => CLASS_OPTIONS.filter(option =>
    option.startsWith(gradeFilter) &&
    option.replace('-', '').toLowerCase().includes(classInputValue.replace('-', '').toLowerCase())
  ), [gradeFilter, classInputValue])

  const passwordsMismatch = Boolean(
    formData.confirmPassword && formData.password && formData.confirmPassword !== formData.password
  )

  const isPasswordStrong = formData.password.length >= 8
  const isStudentIdComplete = formData.studentId.length === 7

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
        setIsClassDropdownOpen(false)
      }

      if (interestDropdownRef.current && !interestDropdownRef.current.contains(event.target as Node)) {
        setIsInterestDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!formData.email) {
      setAvailability(prev => ({
        ...prev,
        email: { status: 'idle', message: '' }
      }))
      return
    }

    const trimmedEmail = formData.email.trim()
    const emailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!emailFormatValid) {
      setAvailability(prev => ({
        ...prev,
        email: { status: 'error', message: 'Format email belum valid' }
      }))
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      setAvailability(prev => ({
        ...prev,
        email: { status: 'checking', message: 'Memeriksa ketersediaan email...' }
      }))

      try {
        const response = await fetch(`/api/auth/student-availability?email=${encodeURIComponent(trimmedEmail)}`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Failed to check email')
        }

        const data = await response.json()
        const available = typeof data.emailAvailable === 'boolean'
          ? data.emailAvailable
          : data.available

        setAvailability(prev => ({
          ...prev,
          email: {
            status: available ? 'available' : 'taken',
            message: available ? 'Email tersedia' : 'Email sudah terdaftar'
          }
        }))
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Email availability error:', err)
          setAvailability(prev => ({
            ...prev,
            email: { status: 'error', message: 'Tidak dapat memeriksa email' }
          }))
        }
      }
    }, 500)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [formData.email])

  useEffect(() => {
    if (!formData.studentId) {
      setAvailability(prev => ({
        ...prev,
        studentId: { status: 'idle', message: '' }
      }))
      return
    }

    if (formData.studentId.length < 7) {
      setAvailability(prev => ({
        ...prev,
        studentId: { status: 'error', message: 'NIS harus tepat 7 digit' }
      }))
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      setAvailability(prev => ({
        ...prev,
        studentId: { status: 'checking', message: 'Memeriksa NIS...' }
      }))

      try {
        const response = await fetch(`/api/auth/student-availability?studentId=${formData.studentId}`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Failed to check studentId')
        }

        const data = await response.json()
        const available = typeof data.studentIdAvailable === 'boolean'
          ? data.studentIdAvailable
          : data.available

        setAvailability(prev => ({
          ...prev,
          studentId: {
            status: available ? 'available' : 'taken',
            message: available ? 'NIS siap digunakan' : 'NIS sudah terdaftar'
          }
        }))
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Student ID availability error:', err)
          setAvailability(prev => ({
            ...prev,
            studentId: { status: 'error', message: 'Tidak dapat memeriksa NIS' }
          }))
        }
      }
    }, 500)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [formData.studentId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'studentId') {
      const sanitized = value.replace(/[^0-9]/g, '').slice(0, 7)
      setFormData(prev => ({ ...prev, studentId: sanitized }))
      return
    }

    if (name === 'class') {
      const normalized = value.toUpperCase()
      setClassInputValue(normalized)
      setFormData(prev => ({ ...prev, class: normalized }))
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    )
  }

  const availabilityMessageClass = (status: AvailabilityState) => {
    if (status === 'available') return 'text-emerald-600'
    if (status === 'taken' || status === 'error') return 'text-rose-500'
    if (status === 'checking') return 'text-blue-500'
    return 'text-slate-500'
  }

  const getPasswordStrength = () => {
    let score = 0
    if (formData.password.length >= 8) score += 1
    if (/[A-Z]/.test(formData.password)) score += 1
    if (/[0-9]/.test(formData.password)) score += 1
    if (/[^A-Za-z0-9]/.test(formData.password)) score += 1

    const labels = ['Lemah', 'Sedang', 'Cukup', 'Kuat']
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#34d399']

    return {
      label: labels[Math.min(score, 3)],
      color: colors[Math.min(score, 3)],
      percent: ((score + 1) / 4) * 100
    }
  }

  const validateStep = (step: StepId) => {
    switch (step) {
      case 'account':
        if (!isStudentIdComplete) {
          setError('NIS harus tepat 7 digit sesuai data sekolah.')
          return false
        }

        if (!isPasswordStrong) {
          setError('Password minimal 8 karakter agar aman.')
          return false
        }

        if (passwordsMismatch) {
          setError('Password dan konfirmasinya belum sama.')
          return false
        }

        if (availability.email.status === 'taken' || availability.studentId.status === 'taken') {
          setError('Periksa kembali NIS atau email yang sudah terdaftar.')
          return false
        }

        if (!formData.email) {
          setError('Email wajib diisi.')
          return false
        }
        break
      case 'identity':
        if (!formData.fullName.trim() || !formData.class.trim() || !formData.address.trim()) {
          setError('Lengkapi nama, kelas, dan alamat sesuai data sekolah.')
          return false
        }
        break
      case 'parent':
        if (!formData.parentName.trim() || !formData.parentPhone.trim()) {
          setError('Kontak orang tua wajib diisi untuk koordinasi guru.')
          return false
        }
        break
      default:
        break
    }

    setError('')
    return true
  }

  const goToStep = (nextStep: number) => {
    if (nextStep < 0 || nextStep >= STEP_DEFINITIONS.length) return
    setStepDirection(nextStep > currentStep ? 1 : -1)
    setCurrentStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = () => {
    const stepId = STEP_DEFINITIONS[currentStep].id
    if (!validateStep(stepId)) return
    if (currentStep < STEP_DEFINITIONS.length - 1) {
      goToStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep === 0) return
    goToStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    const currentStepId = STEP_DEFINITIONS[currentStep].id
    if (!validateStep(currentStepId)) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          extracurricularInterests: selectedInterests,
          userType: 'student'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowSuccess(true)
        setToast({
          show: true,
          message: '🎉 Registrasi berhasil! Siap ke onboarding awal GEMA.',
          type: 'success'
        })

        setTimeout(() => {
          router.push('/student/onboarding')
        }, 2000)
      } else {
        setError(data.message || 'Registrasi gagal')
        setToast({
          show: true,
          message: data.message || 'Registrasi gagal. Silakan coba lagi.',
          type: 'error'
        })
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.')
      setToast({
        show: true,
        message: 'Terjadi kesalahan sistem. Silakan coba lagi.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercentage = (currentStep / (STEP_DEFINITIONS.length - 1)) * 100
  const passwordStrength = getPasswordStrength()

  const stepContent = () => {
    const stepId = STEP_DEFINITIONS[currentStep].id

    if (stepId === 'account') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User className="h-[18px] w-[18px] text-[#9AA0B5]" />
                NIS / Student ID
                <InfoTooltip message="Gunakan nomor induk resmi sekolah" />
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  className={`${inputBaseClass} pr-12`}
                  placeholder="Contoh: 2024123"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  {availability.studentId.status === 'checking' && <Loader className="h-4 w-4 animate-spin text-blue-500" />}
                  {availability.studentId.status === 'available' && <Check className="h-4 w-4 text-emerald-600" />}
                  {(availability.studentId.status === 'taken' || availability.studentId.status === 'error') && (
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  )}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">NIS harus 7 digit sesuai data sekolah.</p>
              {availability.studentId.message && (
                <p className={`mt-1 text-xs font-medium ${availabilityMessageClass(availability.studentId.status)}`}>
                  {availability.studentId.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail className="h-[18px] w-[18px] text-[#9AA0B5]" />
                Email Aktif
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`${inputBaseClass} pr-12`}
                  placeholder="email@sekolah.sch.id"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  {availability.email.status === 'checking' && <Loader className="h-4 w-4 animate-spin text-blue-500" />}
                  {availability.email.status === 'available' && <Check className="h-4 w-4 text-emerald-600" />}
                  {(availability.email.status === 'taken' || availability.email.status === 'error') && (
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  )}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">Email akan digunakan untuk reset password.</p>
              {availability.email.message && (
                <p className={`mt-1 text-xs font-medium ${availabilityMessageClass(availability.email.status)}`}>
                  {availability.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Eye className="h-[18px] w-[18px] text-[#9AA0B5]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`${inputBaseClass} pr-12`}
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Keamanan password</span>
                  <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength.percent}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: passwordStrength.color }}
                  ></motion.div>
                </div>
                <p className="mt-2 text-xs text-slate-500">Gunakan kombinasi huruf, angka, dan simbol.</p>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Eye className="h-[18px] w-[18px] text-[#9AA0B5]" />
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`${inputBaseClass} pr-12`}
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <AnimatePresence>
                {passwordsMismatch && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-2 flex items-center gap-2 text-xs font-medium text-rose-500"
                  >
                    <AlertTriangle className="h-4 w-4" /> Password belum sama.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )
    }

    if (stepId === 'identity') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User className="h-[18px] w-[18px] text-[#9AA0B5]" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputBaseClass}
                placeholder="Nama lengkap sesuai rapor"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BookOpen className="h-[18px] w-[18px] text-[#9AA0B5]" />
                Pilih Kelas
              </label>
              <div ref={classDropdownRef} className="relative">
                <input
                  type="text"
                  name="class"
                  value={classInputValue}
                  onChange={handleChange}
                  onFocus={() => setIsClassDropdownOpen(true)}
                  autoComplete="off"
                  required
                  className={`${inputBaseClass} pr-12`}
                  placeholder="Misal: XI-2"
                />
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {GRADE_FILTERS.map(filter => (
                    <button
                      type="button"
                      key={filter.value}
                      onClick={() => {
                        setGradeFilter(filter.value as 'X' | 'XI' | 'XII')
                        setIsClassDropdownOpen(true)
                      }}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        gradeFilter === filter.value
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-slate-200 text-slate-500 hover:border-blue-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {isClassDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-2xl border border-slate-100 bg-white/95 p-3 shadow-2xl"
                    >
                      {filteredClassOptions.length ? (
                        filteredClassOptions.map(option => (
                          <li key={option}>
                            <button
                              type="button"
                              onMouseDown={event => event.preventDefault()}
                              onClick={() => {
                                setClassInputValue(option)
                                setFormData(prev => ({ ...prev, class: option }))
                                setIsClassDropdownOpen(false)
                              }}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                                formData.class === option ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'
                              }`}
                            >
                              {option}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="px-3 py-2 text-sm text-slate-500">Belum ada kelas yang cocok.</li>
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin className="h-[18px] w-[18px] text-[#9AA0B5]" />
              Alamat Lengkap
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className={`${inputBaseClass} resize-none`}
              placeholder="Nama jalan, desa/kelurahan, kecamatan"
            ></textarea>
          </div>
        </div>
      )
    }

    if (stepId === 'parent') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Users className="h-[18px] w-[18px] text-[#9AA0B5]" />
                Nama Orang Tua / Wali
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
                className={inputBaseClass}
                placeholder="Nama orang tua atau wali"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Phone className="h-[18px] w-[18px] text-[#9AA0B5]" />
                Nomor Telepon Orang Tua
              </label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                required
                className={inputBaseClass}
                placeholder="Contoh: 0812xxxxxx"
              />
              <p className="mt-2 text-xs text-slate-500">Kami menghubungi nomor ini untuk info penting sekolah.</p>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Phone className="h-[18px] w-[18px] text-[#9AA0B5]" />
              Telepon Siswa (opsional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputBaseClass}
              placeholder="08123456789"
            />
          </div>
        </div>
      )
    }

    return (
      <div ref={interestDropdownRef} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pilih ekstrakurikuler yang kamu minati (opsional)
          </label>
          <button
            type="button"
            onClick={() => setIsInterestDropdownOpen(prev => !prev)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200"
          >
            <span>
              {selectedInterests.length > 0
                ? `${selectedInterests.length} pilihan dipilih`
                : 'Klik untuk memilih minat kamu'}
            </span>
            <ChevronDown className={`h-5 w-5 transition-transform ${isInterestDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isInterestDropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-3 space-y-2 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-2xl"
              >
                {EXTRACURRICULAR_OPTIONS.map(interest => {
                  const isSelected = selectedInterests.includes(interest)
                  return (
                    <li key={interest}>
                      <button
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition ${
                          isSelected
                            ? 'bg-blue-50 text-blue-600 shadow-inner shadow-blue-100'
                            : selectedInterests.length
                              ? 'text-slate-500 opacity-80 hover:bg-slate-50'
                              : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{interest}</span>
                        <span className={`h-4 w-4 rounded-full border ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}></span>
                      </button>
                    </li>
                  )
                })}
              </motion.ul>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedInterests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/80 p-4"
              >
                <p className="flex items-center gap-2 text-sm text-blue-700">
                  <Info className="h-4 w-4" /> Pilihan ini hanya digunakan untuk rekomendasi konten & kegiatan sekolah.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AnimatePresence>
                    {selectedInterests.map(interest => (
                      <motion.span
                        key={interest}
                        layout
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow"
                      >
                        {interest}
                        <button type="button" onClick={() => handleInterestToggle(interest)} className="text-slate-400 transition hover:text-slate-600">
                          <X className="h-3 w-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden auth-gradient-bg py-12 px-4">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        duration={4000}
      />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center rounded-3xl border border-blue-100 bg-white px-10 py-12 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="mb-4 rounded-full bg-emerald-100 p-4 text-emerald-600"
              >
                <ShieldCheck className="h-10 w-10" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-slate-900">Akun berhasil dibuat!</h3>
              <p className="mt-2 text-sm text-slate-500">Menyiapkan onboarding GEMA untukmu...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="auth-background-blobs">
        <div className="auth-blob blob-1"></div>
        <div className="auth-blob blob-2"></div>
        <div className="auth-blob blob-3"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-[0_15px_45px_rgba(15,23,42,0.12)]">
            <Image src="/gema.svg" alt="Logo GEMA" width={48} height={48} className="h-12 w-12" priority />
          </div>
          <p className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
            <Sparkles className="h-4 w-4" /> Registrasi Generasi Muda
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">Daftar Siswa GEMA</h1>
          <p className="mt-3 text-lg text-slate-500">
            Form onboarding bergaya SaaS untuk memudahkan guru memverifikasi data siswa Informatika.
          </p>
        </motion.div>

        <div className="mb-6 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Langkah {currentStep + 1} dari {STEP_DEFINITIONS.length}</p>
              <h2 className="text-xl font-semibold text-slate-900">{STEP_DEFINITIONS[currentStep].title}</h2>
              <p className="text-sm text-slate-500">{STEP_DEFINITIONS[currentStep].subtitle}</p>
            </div>
            <div className="hidden gap-4 md:flex">
              {STEP_DEFINITIONS.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 text-sm font-medium">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      index < currentStep
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : index === currentStep
                          ? 'border-blue-500 text-blue-600'
                          : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className={index === currentStep ? 'text-slate-900' : 'text-slate-400'}>{step.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
            ></motion.div>
          </div>
        </div>

        <form onSubmit={e => e.preventDefault()} className="space-y-6">
          <AnimatePresence mode="wait" initial={false} custom={stepDirection}>
            <motion.section
              key={currentStep}
              custom={stepDirection}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-3xl border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            >
              {stepContent()}
            </motion.section>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/90 p-4 text-sm text-rose-600"
              >
                <AlertTriangle className="h-5 w-5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
                disabled={isLoading}
              >
                ← Kembali
              </button>
            ) : (
              <span className="text-xs text-slate-400">Step onboarding akan menyimpan otomatis.</span>
            )}

            <div className="flex flex-1 items-center justify-end gap-3">
              {currentStep < STEP_DEFINITIONS.length - 1 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(79,70,229,0.35)] md:w-auto"
                  disabled={isLoading}
                >
                  Lanjut ke Langkah Berikutnya →
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(79,70,229,0.35)] md:w-auto"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isLoading ? 'Mendaftarkan...' : 'Kirim & Buat Akun'}
                </motion.button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Sudah punya akun?
            <Link href="/student/login" className="ml-1 font-semibold text-blue-600 transition hover:text-blue-700">
              Masuk di sini
            </Link>
          </p>
          <Link href="/" className="mt-3 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-700">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

function InfoTooltip({ message }: { message: string }) {
  return (
    <span className="relative inline-flex items-center">
      <span className="group relative">
        <Info className="h-4 w-4 text-slate-400" />
        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1 text-[11px] text-white opacity-0 shadow-lg transition group-hover:translate-y-1 group-hover:opacity-100">
          {message}
        </span>
      </span>
    </span>
  )
}
