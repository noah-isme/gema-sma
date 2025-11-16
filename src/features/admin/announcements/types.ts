export type AnnouncementType = 'info' | 'warning' | 'success' | 'error'
export type AnnouncementCategory = 'KELAS' | 'EVENT' | 'TUGAS' | 'NILAI' | 'SISTEM'

export interface Announcement {
  id: string
  title: string
  excerpt: string | null
  content: string
  category: AnnouncementCategory
  type: AnnouncementType
  isImportant: boolean
  isActive: boolean
  showOnHomepage: boolean
  deadline: string | null
  link: string | null
  views: number
  publishDate: string
  createdAt: string
  updatedAt: string
}

export interface AnnouncementFormData {
  title: string
  excerpt: string
  content: string
  category: AnnouncementCategory
  type: AnnouncementType
  isImportant: boolean
  isActive: boolean
  showOnHomepage: boolean
  deadline: string | null
  link: string | null
}

export interface AnnouncementTypeOption {
  value: AnnouncementType
  label: string
  badgeClass: string
}

export interface AnnouncementCategoryOption {
  value: AnnouncementCategory
  label: string
  icon: string
  color: string
}
