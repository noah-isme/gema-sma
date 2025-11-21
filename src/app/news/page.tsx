"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Newspaper,
  ArrowRight,
  Clock,
  User,
  TrendingUp,
  Sparkles,
  Tag,
  Eye,
  ArrowLeft,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { studentAuth } from "@/lib/student-auth";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  readTime?: number;
  views?: number;
  featured?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  tags?: string[];
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const newsCategories = [
  { id: "all", label: "Semua Berita", color: "#6366F1" },
  { id: "sekolah", label: "Sekolah", color: "#10B981" },
  { id: "prestasi", label: "Prestasi", color: "#FBBF24" },
  { id: "kegiatan", label: "Kegiatan", color: "#06B6D4" },
  { id: "pengumuman", label: "Pengumuman", color: "#EC4899" },
  { id: "teknologi", label: "Teknologi", color: "#8B5CF6" },
];

const floatingParticles = [
  { x: "10%", y: "20%", size: 8, delay: 0 },
  { x: "85%", y: "15%", size: 6, delay: 1 },
  { x: "20%", y: "70%", size: 10, delay: 2 },
  { x: "90%", y: "60%", size: 7, delay: 1.5 },
  { x: "50%", y: "30%", size: 5, delay: 0.5 },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const normalizeTags = (input: unknown): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter(Boolean);
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed
          .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
          .filter(Boolean);
      }
    } catch {
      // Fallback
    }
    return input.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
};

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews();
    studentAuth.getSession();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      
      // Fetch berita from API (category=news or category=berita)
      const response = await fetch("/api/news?status=published");
      
      if (response.ok) {
        const data = await response.json();
        const articles = Array.isArray(data?.data) ? data.data : [];
        
        // Process articles
        const processed = articles.map((article: NewsArticle) => {
          const publishedDate = article.publishedAt 
            ? new Date(article.publishedAt) 
            : new Date();
          const daysSincePublished =
            (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);

          const isTrending =
            (daysSincePublished <= 7 && (article.views || 0) > 50) ||
            (article.views || 0) > 100;

          const tags = normalizeTags(article.tags);

          return {
            ...article,
            tags,
            isFeatured: article.featured || false,
            isTrending,
          };
        });

        setNewsArticles(processed);
      } else {
        console.error("Failed to fetch news:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter news by category and search
  const filteredNews = useMemo(() => {
    let filtered = newsArticles;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => {
        const articleTags = normalizeTags(article.tags).map((t) => t.toLowerCase());
        return articleTags.includes(selectedCategory.toLowerCase());
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [newsArticles, selectedCategory, searchQuery]);

  const featuredNews = useMemo(
    () => filteredNews.find((a) => a.isFeatured) || filteredNews[0],
    [filteredNews]
  );

  const trendingNews = useMemo(
    () => filteredNews.filter((a) => a.isTrending).slice(0, 3),
    [filteredNews]
  );

  const recentNews = useMemo(
    () =>
      filteredNews
        .filter((a) => a.id !== featuredNews?.id && !trendingNews.includes(a))
        .slice(0, 9),
    [filteredNews, featuredNews, trendingNews]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] via-white to-[#F8FAFC] dark:from-[#050513] dark:via-[#06081C] dark:to-[#0a0c1d]">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Beranda</span>
          </motion.button>
        </Link>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden pt-24 pb-12 px-6">
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-[#6366F1]/20 to-[#EC4899]/20"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6366F1]/10 to-[#EC4899]/10 border border-[#6366F1]/20">
              <Newspaper className="w-6 h-6 text-[#6366F1]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Berita GEMA
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl"
          >
            Informasi terkini seputar kegiatan, prestasi, dan perkembangan SMA Wahidiyah 📰
          </motion.p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            {newsCategories.map((cat, index) => {
              const isActive = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300
                    ${
                      isActive
                        ? "text-white shadow-lg scale-105"
                        : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }
                  `}
                  style={
                    isActive
                      ? { backgroundColor: cat.color }
                      : undefined
                  }
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.label}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: `${cat.color}40` }}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Newspaper className="w-16 h-16 text-[#6366F1]" />
            </motion.div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Memuat berita...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNews.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-7xl mb-6">📰</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Belum ada berita
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Berita untuk kategori ini akan segera tersedia
            </p>
          </motion.div>
        )}

        {/* Content Grid */}
        {!loading && filteredNews.length > 0 && (
          <div className="space-y-12">
            {/* Featured News */}
            {featuredNews && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link href={`/news/${featuredNews.slug}`}>
                  <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6366F1]/10 to-[#EC4899]/10 border border-[#6366F1]/20 p-8 md:p-12 cursor-pointer transition-all duration-500 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-[#EC4899]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white text-xs font-bold mb-6 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        BERITA UTAMA
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:translate-x-1 transition-transform duration-300">
                        {featuredNews.title}
                      </h2>

                      {featuredNews.excerpt && (
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-3xl line-clamp-2">
                          {featuredNews.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                        {featuredNews.author && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {featuredNews.author}
                          </div>
                        )}
                        {featuredNews.publishedAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featuredNews.publishedAt)}
                          </div>
                        )}
                        {featuredNews.readTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {featuredNews.readTime} menit
                          </div>
                        )}
                        {featuredNews.views && (
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {featuredNews.views} views
                          </div>
                        )}
                      </div>

                      <motion.button
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Baca Selengkapnya
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.section>
            )}

            {/* Trending News */}
            {trendingNews.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Berita Trending
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {trendingNews.map((article, index) => (
                    <NewsCard key={article.id} article={article} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Recent News */}
            {recentNews.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Newspaper className="w-5 h-5 text-[#6366F1]" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Berita Terbaru
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {recentNews.map((article, index) => (
                    <NewsCard key={article.id} article={article} index={index} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// News Card Component
interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

function NewsCard({ article, index }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/news/${article.slug}`}>
        <div className="group h-full p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-[#6366F1]/10 to-[#EC4899]/10 text-[#6366F1] text-xs font-semibold"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#6366F1] transition-colors duration-300">
            {article.title}
          </h4>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
              {article.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {article.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(article.publishedAt)}
              </div>
            )}
            {article.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime} min
              </div>
            )}
            {article.views && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views}
              </div>
            )}
          </div>

          {/* CTA Arrow */}
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#6366F1] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Baca berita</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
