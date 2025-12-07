"use client"

import { useEffect, useMemo, useState } from 'react'
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  UsersRound,
  ShieldCheck
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  FilterBar,
  AdminTable,
  AdminFormModal,
  FormInput,
  FormSelect
} from '@/components/design-system'

interface Student {
  id: string
  studentId?: string | null
  username?: string | null
  fullName: string
  email?: string | null
  class?: string | null
  phone?: string | null
  address?: string | null
  parentName?: string | null
  parentPhone?: string | null
  extracurricularInterests?: string[] | null
  status: string
  isVerified: boolean
  joinedAt: string
  lastLoginAt?: string | null
  createdAt: string
  updatedAt: string
}

interface StudentFormData {
  studentId?: string
  username?: string
  fullName: string
  email?: string
  password: string
  class?: string
  phone?: string
  address?: string
  parentName?: string
  parentPhone?: string
  status: string
  isVerified: boolean
}

const initialFormState: StudentFormData = {
  studentId: '',
  username: '',
  fullName: '',
  email: '',
  password: '',
  class: '',
  phone: '',
  address: '',
  parentName: '',
  parentPhone: '',
  status: 'active',
  isVerified: true
}

const statusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' },
  { value: 'suspended', label: 'Ditangguhkan' }
]

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const [classFilter, setClassFilter] = useState<'all' | string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<StudentFormData>({ ...initialFormState })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      setErrorMessage('Gagal memuat data siswa. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const classOptions = useMemo(() => {
    const uniqueClasses = new Set<string>()
    students.forEach(student => {
      if (student.class) {
        uniqueClasses.add(student.class)
      }
    })
    return Array.from(uniqueClasses).sort()
  }, [students])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target

    if (type === 'checkbox') {
      const target = event.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const method = editingStudent ? 'PATCH' : 'POST'
      const payload: Record<string, unknown> = {
        studentId: formData.studentId?.trim() || null,
        username: formData.username?.trim() || null,
        fullName: formData.fullName.trim(),
        email: formData.email?.trim() || null,
        password: formData.password,
        class: formData.class?.trim() ? formData.class.trim() : null,
        phone: formData.phone?.trim() ? formData.phone.trim() : null,
        address: formData.address?.trim() ? formData.address.trim() : null,
        parentName: formData.parentName?.trim() ? formData.parentName.trim() : null,
        parentPhone: formData.parentPhone?.trim() ? formData.parentPhone.trim() : null,
        status: formData.status,
        isVerified: formData.isVerified
      }

      if (editingStudent) {
        payload.id = editingStudent.id
        if (!formData.password) {
          delete payload.password
        }
      }

      const response = await fetch('/api/admin/students', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Gagal menyimpan data siswa')
      }

      await fetchStudents()
      resetForm()
    } catch (error) {
      console.error('Error saving student:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan data siswa')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      studentId: student.studentId || '',
      username: student.username || '',
      fullName: student.fullName,
      email: student.email || '',
      password: '',
      class: student.class || '',
      phone: student.phone || '',
      address: student.address || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      status: student.status,
      isVerified: student.isVerified
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun siswa ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/students?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Gagal menghapus siswa')
      }

      await fetchStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menghapus siswa')
    }
  }

  const resetForm = () => {
    setFormData({ ...initialFormState })
    setEditingStudent(null)
    setShowForm(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const normalizeInterests = (value: Student['extracurricularInterests']) => {
    if (Array.isArray(value)) {
      return value.filter((interest): interest is string => typeof interest === 'string' && interest.trim().length > 0)
    }
    return []
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.phone || '').includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    const matchesVerification =
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' ? student.isVerified : !student.isVerified)
    const matchesClass = classFilter === 'all' || (student.class || '') === classFilter

    return matchesSearch && matchesStatus && matchesVerification && matchesClass
  })

  const totalStudents = students.length
  const activeStudents = students.filter(student => student.status === 'active').length
  const unverifiedStudents = students.filter(student => !student.isVerified).length

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              Manajemen Siswa
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola akun siswa yang telah terdaftar di platform GEMA.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Siswa</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <UsersRound className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Siswa Aktif</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeStudents}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Belum Terverifikasi</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{unverifiedStudents}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar - Design System Component */}
        <div className="space-y-4">
          <FilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari berdasarkan nama, email, NIS, atau telepon..."
            actionButton={{
              label: 'Tambah Siswa',
              onClick: () => {
                setShowForm(true)
                setEditingStudent(null)
                setFormData({ ...initialFormState })
              }
            }}
          />
          
          {/* Additional Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value as typeof statusFilter)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Semua Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={verificationFilter}
              onChange={event => setVerificationFilter(event.target.value as typeof verificationFilter)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Semua Verifikasi</option>
              <option value="verified">Terverifikasi</option>
              <option value="unverified">Belum Verifikasi</option>
            </select>
            <select
              value={classFilter}
              onChange={event => setClassFilter(event.target.value as typeof classFilter)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Semua Kelas</option>
              {classOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Admin Table - Design System Component */}
        <AdminTable
          data={filteredStudents}
          loading={isLoading}
          emptyMessage="Tidak ada siswa yang sesuai dengan filter"
          zebra={true}
          columns={[
            {
              key: 'fullName',
              label: 'Siswa',
              render: (student) => (
                <div>
                  <div className="font-medium text-gray-900">{student.fullName}</div>
                  <div className="text-sm text-gray-500">{student.phone || '-'}</div>
                  <div className="text-xs text-gray-400">Bergabung: {formatDate(student.joinedAt)}</div>
                </div>
              )
            },
            {
              key: 'studentId',
              label: 'NIS / Username',
              render: (student) => {
                if (student.studentId) {
                  return (
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.studentId}</div>
                      <div className="text-xs text-gray-500">NIS</div>
                    </div>
                  )
                } else if (student.username) {
                  return (
                    <div>
                      <div className="text-sm font-medium text-gray-900">@{student.username}</div>
                      <div className="text-xs text-gray-500">Username</div>
                    </div>
                  )
                }
                return <span className="text-sm text-gray-400">-</span>
              }
            },
            {
              key: 'email',
              label: 'Email',
              render: (student) => (
                <span className="text-sm">{student.email || <span className="text-gray-400">-</span>}</span>
              )
            },
            {
              key: 'class',
              label: 'Kelas',
              render: (student) => (
                <span className="text-sm">{student.class || '-'}</span>
              )
            },
            {
              key: 'extracurricularInterests',
              label: 'Ekstrakurikuler',
              render: (student) => {
                const interestList = normalizeInterests(student.extracurricularInterests)
                return interestList.length ? (
                  <div className="flex flex-wrap gap-2">
                    {interestList.map(interest => (
                      <span
                        key={`${student.id}-${interest}`}
                        className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Belum dipilih</span>
                )
              }
            },
            {
              key: 'status',
              label: 'Status',
              render: (student) => (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    student.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : student.status === 'suspended'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {statusOptions.find(option => option.value === student.status)?.label || student.status}
                </span>
              )
            },
            {
              key: 'isVerified',
              label: 'Verifikasi',
              render: (student) =>
                student.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Terverifikasi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                    <XCircle className="h-3.5 w-3.5" />
                    Belum Verifikasi
                  </span>
                )
            },
            {
              key: 'lastLoginAt',
              label: 'Login Terakhir',
              render: (student) => (
                <span className="text-sm">{formatDateTime(student.lastLoginAt)}</span>
              )
            },
            {
              key: 'actions',
              label: 'Aksi',
              align: 'right',
              render: (student) => (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )
            }
          ]}
        />

        {/* Form Modal - Design System Component */}
        <AdminFormModal
          isOpen={showForm}
          onClose={resetForm}
          onSubmit={handleSubmit}
          title={editingStudent ? 'Edit Akun Siswa' : 'Tambah Akun Siswa'}
          submitLabel={editingStudent ? 'Simpan Perubahan' : 'Simpan'}
          isSubmitting={isSubmitting}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="NIS"
                name="studentId"
                value={formData.studentId || ''}
                onChange={handleInputChange}
                placeholder="Masukkan NIS siswa"
                helperText="Opsional"
              />
              <FormInput
                label="Username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                placeholder="Username unik"
                helperText="Opsional"
              />
              <FormInput
                label="Nama Lengkap"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Masukkan nama siswa"
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="contoh@gema.sch.id"
                helperText="Opsional"
              />
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingStudent}
                placeholder="Minimal 6 karakter"
                helperText={editingStudent ? 'Kosongkan jika tidak diubah' : ''}
              />
              <FormInput
                label="Kelas"
                name="class"
                value={formData.class || ''}
                onChange={handleInputChange}
                placeholder="Contoh: XI IPA-1"
              />
              <FormInput
                label="Telepon"
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="08xxxxxxxxxx"
              />
              <FormInput
                label="Nama Orang Tua/Wali"
                name="parentName"
                value={formData.parentName || ''}
                onChange={handleInputChange}
                placeholder="Masukkan nama orang tua"
                helperText="Opsional"
              />
              <FormInput
                label="Telepon Orang Tua/Wali"
                name="parentPhone"
                type="tel"
                value={formData.parentPhone || ''}
                onChange={handleInputChange}
                placeholder="08xxxxxxxxxx"
                helperText="Opsional"
              />
              <FormSelect
                label="Status Akun"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={statusOptions}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Alamat</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Alamat lengkap siswa"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isVerified"
                name="isVerified"
                type="checkbox"
                checked={formData.isVerified}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isVerified" className="text-sm text-gray-700">
                Tandai akun sebagai sudah verifikasi email
              </label>
            </div>
          </div>
        </AdminFormModal>
      </div>
    </AdminLayout>
  )
}
