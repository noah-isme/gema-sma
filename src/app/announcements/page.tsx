"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Calendar,
  Award,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Clock,
  ChevronDown,
  X,
  Plus,
  Sparkles,
  Star,
  Heart,
} from "lucide-react";
import Link from "next/link";

type AnnouncementCategory = "all" | "kelas" | "event" | "tugas" | "nilai" | "sistem";
type SortType = "terbaru" | "populer" | "deadline";

interface AnnouncementAPI {
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

interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Exclude<AnnouncementCategory, "all">;
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

const categoryConfig = {
  kelas: { label: "Kelas", icon: BookOpen, color: "#A5E8D3" },
  event: { label: "Event", icon: Calendar, color: "#FFD485" },
  tugas: { label: "Tugas", icon: Award, color: "#D8C7FF" },
  nilai: { label: "Nilai", icon: TrendingUp, color: "#97D6FF" },
  sistem: { label: "Sistem", icon: Bell, color: "#FFC7DD" },
};

// Helper functions
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  if (minutes > 0) return `${minutes} menit yang lalu`;
  return "Baru saja";
}

function formatDeadline(deadline: string | null): string | undefined {
  if (!deadline) return undefined;
  const date = new Date(deadline);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function transformAnnouncementFromAPI(item: AnnouncementAPI): Announcement {
  const category = item.category.toLowerCase() as Exclude<AnnouncementCategory, "all">;
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt || item.content.substring(0, 120) + "...",
    content: item.content,
    category,
    timestamp: formatRelativeTime(new Date(item.publishDate)),
    date: new Date(item.publishDate),
    isImportant: item.isImportant,
    isUnread: false, // Will be tracked client-side
    icon: "calendar",
    color: categoryConfig[category].color,
    deadline: formatDeadline(item.deadline),
    link: item.link || undefined,
    views: item.views,
  };
}

const FloatingDoodle = ({ type }: { type: "star" | "heart" | "zigzag" }) => {
  const paths = {
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    zigzag: "M2 6l4 4 4-4 4 4 4-4 4 4",
  };

  return (
    <motion.svg
      className="absolute pointer-events-none"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.2, 0],
        scale: [0, 1, 0],
        y: [-10, -30],
        x: [0, (Math.random() - 0.5) * 20],
      }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <path d={paths[type]} />
    </motion.svg>
  );
};

const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            x: [(Math.random() - 0.5) * 100],
            y: [-50 - Math.random() * 50],
            rotate: [0, Math.random() * 360],
          }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: ["#FFD485", "#A5E8D3", "#D8C7FF", "#97D6FF", "#FFC7DD"][
                i % 5
              ],
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function AnnouncementsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<AnnouncementCategory>("all");
  const [sortBy, setSortBy] = useState<SortType>("terbaru");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [readCount, setReadCount] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch announcements from API
  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/announcements?isActive=true');
      if (!response.ok) throw new Error('Failed to fetch announcements');
      
      const data: AnnouncementAPI[] = await response.json();
      const transformed = data.map(transformAnnouncementFromAPI);
      setAnnouncements(transformed);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Gagal memuat pengumuman. Silakan refresh halaman.');
      // Fallback to mock data for development
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const filteredAndSortedAnnouncements = useMemo(() => {
    let filtered = announcements;

    if (activeCategory !== "all") {
      filtered = filtered.filter((a) => a.category === activeCategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "terbaru") return b.date.getTime() - a.date.getTime();
      if (sortBy === "populer") return (b.views || 0) - (a.views || 0);
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

    return sorted;
  }, [activeCategory, sortBy]);

  const importantAnnouncements = useMemo(
    () => announcements.filter((a) => a.isImportant),
    [announcements]
  );

  const handleAnnouncementClick = useCallback((announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    
    if (announcement.isImportant) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }

    const newReadCount = readCount + 1;
    setReadCount(newReadCount);

    if (newReadCount === 10) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  }, [readCount]);

  // Show loading on first render to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20" suppressHydrationWarning>
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-purple-200/20 dark:from-pink-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-teal-200/20 dark:from-blue-500/10 dark:to-teal-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Bell className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
              Pengumuman Terbaru
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tetap update, tetap semangat! ✨
          </p>
        </motion.div>

        {/* Important Announcements Banner */}
        {importantAnnouncements.length > 0 && (
          <motion.div
            className="mb-8 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 dark:from-orange-600 dark:via-pink-600 dark:to-purple-600 rounded-2xl p-6 shadow-xl">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 dark:from-orange-600 dark:via-pink-600 dark:to-purple-600 opacity-50"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              />
              <div className="relative flex items-start gap-4">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <AlertTriangle className="w-8 h-8 text-white flex-shrink-0" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    🔥 Pengumuman Penting!
                  </h3>
                  <div className="space-y-2">
                    {importantAnnouncements.slice(0, 2).map((announcement) => (
                      <button
                        key={announcement.id}
                        onClick={() => handleAnnouncementClick(announcement)}
                        className="block w-full text-left text-white/90 hover:text-white hover:translate-x-1 transition-all duration-200"
                      >
                        • {announcement.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {(["all", ...Object.keys(categoryConfig)] as AnnouncementCategory[]).map(
              (category) => {
                const isActive = activeCategory === category;
                const Icon = category === "all" ? Sparkles : categoryConfig[category as keyof typeof categoryConfig]?.icon;

                return (
                  <motion.button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`relative px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                      isActive
                        ? "text-white shadow-lg scale-105"
                        : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:scale-105 hover:shadow-md"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? category === "all"
                          ? "#6C63FF"
                          : categoryConfig[category as keyof typeof categoryConfig]?.color
                        : undefined,
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        layoutId="activeTab"
                        style={{
                          backgroundColor:
                            category === "all"
                              ? "#6C63FF"
                              : categoryConfig[category as keyof typeof categoryConfig]?.color,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      {category === "all"
                        ? "Semua"
                        : categoryConfig[category as keyof typeof categoryConfig]?.label}
                    </span>
                  </motion.button>
                );
              }
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
            >
              <option value="terbaru">Terbaru</option>
              <option value="populer">Paling Populer</option>
              <option value="deadline">Deadline Terdekat</option>
            </select>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-100">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchAnnouncements}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white/50 dark:bg-gray-800/50 shadow-lg animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4" />
                <div className="space-y-2 mb-4">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Announcements Grid */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredAndSortedAnnouncements.map((announcement, index) => {
            const Icon = categoryConfig[announcement.category].icon;

            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                }}
                className="group relative"
              >
                <button
                  onClick={() => handleAnnouncementClick(announcement)}
                  className="w-full text-left"
                >
                  <div
                    className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/50"
                    style={{
                      backgroundColor: announcement.color + "20",
                    }}
                  >
                    {/* Unread Badge */}
                    {announcement.isUnread && (
                      <motion.div
                        className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 4,
                        }}
                      />
                    )}

                    {/* Doodle Elements */}
                    <div className="absolute top-2 right-12 opacity-20 dark:opacity-10">
                      <Star className="w-4 h-4" style={{ color: announcement.color }} />
                    </div>

                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: announcement.color }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {announcement.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {announcement.timestamp}
                      </div>
                      {announcement.deadline && (
                        <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {announcement.deadline}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                        Lihat Selengkapnya
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAndSortedAnnouncements.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Belum Ada Pengumuman
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada pengumuman untuk kategori ini saat ini.
            </p>
          </motion.div>
        )}
      
      </div>

      {/* Detail Modal - Bottom Sheet */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAnnouncement(null)}
            />

            {/* Bottom Sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-w-3xl mx-auto">
                {/* Handle */}
                <div className="pt-3 pb-2 flex justify-center">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </div>

                {/* Confetti */}
                {showConfetti && <Confetti />}

                {/* Content */}
                <div className="px-6 pb-8 overflow-y-auto max-h-[calc(85vh-60px)]">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white mb-3"
                        style={{
                          backgroundColor:
                            categoryConfig[selectedAnnouncement.category].color,
                        }}
                      >
                        {categoryConfig[selectedAnnouncement.category].label}
                        {selectedAnnouncement.isImportant && (
                          <Sparkles className="w-3 h-3" />
                        )}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedAnnouncement.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {selectedAnnouncement.timestamp}
                        </div>
                        {selectedAnnouncement.deadline && (
                          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
                            <Calendar className="w-4 h-4" />
                            Deadline: {selectedAnnouncement.deadline}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAnnouncement(null)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="prose dark:prose-invert max-w-none mb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedAnnouncement.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {selectedAnnouncement.link && (
                      <Link
                        href={selectedAnnouncement.link}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium text-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                        Lihat Detail
                      </Link>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 bg-white dark:bg-gray-700 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-purple-50 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      Tambahkan ke Kalender
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reward Toast */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🔥
              </motion.div>
              <span className="font-bold text-lg">Kamu super update hari ini!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
