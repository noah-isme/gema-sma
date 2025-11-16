export type AnnouncementCategory = "kelas" | "event" | "tugas" | "nilai" | "sistem";
export type SortType = "terbaru" | "populer" | "deadline";

export interface AnnouncementAPI {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: "KELAS" | "EVENT" | "TUGAS" | "NILAI" | "SISTEM";
  isImportant: boolean;
  isActive: boolean;
  deadline: string | null;
  link: string | null;
  views: number;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: AnnouncementCategory;
  timestamp: string;
  date: Date;
  isImportant: boolean;
  isUnread: boolean;
  icon: "calendar" | "award" | "book" | "alert" | "trending";
  color: string;
  deadline?: string;
  link?: string;
  views?: number;
}
