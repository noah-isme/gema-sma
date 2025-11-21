"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  ArrowRight,
  Clock,
  User,
  Newspaper,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  Star,
  TrendingUp,
  Sparkles,
  Tag,
  Bookmark,
  ChevronRight,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { studentAuth } from "@/lib/student-auth";
import type { DiscussionThreadDetailDTO } from "@/types/discussion";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  readTime?: number;
  views?: number;
  featured?: boolean; // From API
  isFeatured?: boolean; // Processed
  isTrending?: boolean; // Processed
  tags?: string[] | string | null;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  questionCount?: number;
  defaultPoints?: number;
  timePerQuestion?: number | null;
  replyCount?: number;
  lastReplyAt?: string;
  lastReplyBy?: string;
  lastReplyPreview?: string;
}

interface PromptFromDB {
  id: string;
  title: string;
  slug: string;
  roleDeskripsi: string;
  taskInstruksi: string;
  tags: string[] | Record<string, unknown>;
  author: string;
  status: string;
  featured: boolean;
  durasiMenit: number;
  views: number;
  publishedAt: string;
  createdAt: string;
}


interface QuizApiItem {
  id: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  tags?: unknown;
  isPublic: boolean;
  defaultPoints: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  timePerQuestion?: number | null;
  _count?: {
    questions?: number;
  };
}

type TabType = "berita" | "artikel" | "prompt" | "kuis" | "diskusi";

const categories = [
  { id: "artikel", label: "Artikel", icon: FileText, color: "#06B6D4", emoji: "📄" },
  { id: "berita", label: "Berita", icon: Newspaper, color: "#6366F1", emoji: "📰" },
];

// Category aliases for flexible matching
const categoryAliases: Record<string, string[]> = {
  'artikel': ['artikel', 'article', 'tutorial', 'guide', 'programming', 'technology'],
  'berita': ['berita', 'news', 'announcement'],
};

const quickTags = [
  { id: "html", label: "HTML", color: "#E34C26" },
  { id: "css", label: "CSS", color: "#264DE4" },
  { id: "javascript", label: "JavaScript", color: "#F7DF1E" },
  { id: "web-dev", label: "Web Development", color: "#06B6D4" },
  { id: "tools", label: "Tools", color: "#10B981" },
  { id: "ai", label: "AI", color: "#EC4899" },
  { id: "backend", label: "Backend", color: "#6366F1" },
  { id: "tips", label: "Tips Singkat", color: "#FBBF24" },
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
  if (!input) {
    return [];
  }

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
      // Fallback to comma-separated parsing
    }

    return input
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof input === "object") {
    const maybeSet = (input as { set?: unknown }).set;
    if (maybeSet) {
      return normalizeTags(maybeSet);
    }
  }

  return [];
};

const isQuizArticle = (article?: Article | null) =>
  Boolean(article?.category && article.category.toLowerCase() === "kuis");

const buildArticleLink = (article: Article) => {
  const slugOrId = article.slug || article.id;
  if (isQuizArticle(article)) {
    return slugOrId ? `/quiz/join?quizId=${slugOrId}` : "/quiz/join";
  }
  if (article.category?.toLowerCase() === "diskusi") {
    return slugOrId ? `/tutorial/discussion/${slugOrId}` : "/tutorial";
  }
  return slugOrId ? `/tutorial/articles/${slugOrId}` : "/tutorial/articles";
};

const getArticleCtaLabel = (article: Article) =>
  article.category?.toLowerCase() === "diskusi"
    ? "Ikuti diskusi"
    : isQuizArticle(article)
      ? "Ikuti kuis"
      : "Baca artikel";

export default function TutorialPage() {
  const [activeTab, setActiveTab] = useState<TabType>("artikel");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchArticles();
    
    // Check student session for personalization (future use)
    studentAuth.getSession();

    // Show sidebar on desktop
    if (window.innerWidth >= 1024) {
      setShowSidebar(true);
    }
  }, []);

  // Refetch when category changes (optional - for server-side filtering)
  useEffect(() => {
    // You can fetch filtered data from API here
    // For now, we use client-side filtering
  }, [activeTab]);

  const fetchArticles = async () => {
    try {
      setLoading(true);

      // Only fetch articles (tutorial & news) - no prompts, quizzes, or discussions
      const articleRes = await fetch("/api/tutorial/articles?status=published");

      let articlesData: Article[] = [];
      if (articleRes.ok) {
        const articlePayload = await articleRes.json();
        articlesData = Array.isArray(articlePayload?.data)
          ? (articlePayload.data as Article[])
          : [];
      } else {
        console.error("Failed to fetch tutorial articles:", articleRes.statusText);
      }

      // Process articles: mark featured and trending
      const processedArticles = articlesData.map((article: Article) => {
        const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
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

      setArticles(processedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  // Filter articles based on active tab
  const filteredArticles = useMemo(() => {
    let filtered = articles;
    
    // Filter by category based on active tab
    if (activeTab === 'artikel') {
      // Show only tutorial articles
      filtered = articles.filter((article) => {
        const articleCategory = article.category?.toLowerCase() || '';
        return articleCategory === 'tutorial' || articleCategory === 'article' || articleCategory === 'artikel';
      });
    } else if (activeTab === 'berita') {
      // Show only news articles
      filtered = articles.filter((article) => {
        const articleCategory = article.category?.toLowerCase() || '';
        return articleCategory === 'news' || articleCategory === 'berita';
      });
    }

    // Apply tag filter if tags are selected
    if (selectedTags.length > 0) {
      filtered = filtered.filter((article) => {
        const articleTags = normalizeTags(article.tags).map((tag) => tag.toLowerCase());
        return articleTags.some((tag) => selectedTags.includes(tag));
      });
    }

    return filtered;
  }, [articles, activeTab, selectedTags]);

  // Get featured article
  const featuredArticle = useMemo(
    () => filteredArticles.find((a) => a.isFeatured) || filteredArticles[0],
    [filteredArticles]
  );

  const featuredArticleIsQuiz = isQuizArticle(featuredArticle);
  const featuredArticleIsDiscussion =
    featuredArticle?.category?.toLowerCase() === "diskusi";

  // Get recommended articles (simulated)
  const recommendedArticles = useMemo(
    () => filteredArticles.slice(0, 3),
    [filteredArticles]
  );

  // Get trending articles
  const trendingArticles = useMemo(
    () => filteredArticles.filter((a) => a.isTrending).slice(0, 4),
    [filteredArticles]
  );

  // Get remaining articles for grid
  const gridArticles = useMemo(
    () =>
      filteredArticles.filter(
        (a) => a.id !== featuredArticle?.id && !recommendedArticles.includes(a) && !trendingArticles.includes(a)
      ),
    [filteredArticles, featuredArticle, recommendedArticles, trendingArticles]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] via-white to-[#F8FAFC] dark:from-[#050513] dark:via-[#06081C] dark:to-[#0a0c1d]">
      {/* Back to Home Button */}
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

      {/* Smart Header - Compact & Living */}
      <section className="relative overflow-hidden pt-24 pb-12 px-6">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-[#06B6D4]/20 to-[#10B981]/20"
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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#06B6D4]/10 to-[#10B981]/10 border border-[#06B6D4]/20">
              <BookOpen className="w-6 h-6 text-[#06B6D4]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Tutorial & Sumber Belajar
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl"
          >
            Artikel, Prompt, Kuis, dan Diskusi — terus berkembang tiap minggu ✨
          </motion.p>
        </div>
      </section>

      {/* Adaptive Category Tabs */}
      <div id="diskusi" className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as TabType)}
                  className={`
                    relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300
                    ${
                      isActive
                        ? "text-white shadow-lg scale-105"
                        : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }
                  `}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${cat.color}, ${cat.color}CC)`,
                        }
                      : undefined
                  }
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <Icon className="w-4 h-4" />
                  {cat.label}

                  {/* Glowing indicator for active */}
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

      {/* Quick Filters (Tags) */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Tag className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Filter Cepat:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickTags.map((tag, index) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <motion.button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`
                  relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300
                  ${
                    isSelected
                      ? "text-white shadow-md scale-105"
                      : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }
                `}
                style={
                  isSelected
                    ? { backgroundColor: tag.color, borderColor: tag.color }
                    : undefined
                }
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag.label}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className={`grid gap-8 ${showSidebar ? "lg:grid-cols-[1fr_300px]" : ""}`}>
          {/* Main Content */}
          <div className="space-y-12">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <BookOpen className="w-16 h-16 text-[#06B6D4]" />
                </motion.div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Memuat konten pembelajaran...
                </p>
              </div>
            )}

            {!loading && filteredArticles.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-7xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Belum ada konten {activeTab}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Konten kategori &quot;{activeTab}&quot; akan segera tersedia
                </p>
                {articles.length > 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    💡 Tip: Coba tab lain atau cek console browser untuk debug
                  </p>
                )}
              </motion.div>
            )}

            {!loading && filteredArticles.length > 0 && (
              <>
                {/* Featured Article (Hero Card) */}
                {featuredArticle && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Link href={buildArticleLink(featuredArticle)}>
                      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06B6D4]/10 to-[#10B981]/10 border border-[#06B6D4]/20 p-8 md:p-12 cursor-pointer transition-all duration-500 hover:shadow-2xl">
                        {/* Background gradient shift on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/5 to-[#10B981]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Shine effect */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <div className="relative z-10">
                          {/* Featured Badge */}
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white text-xs font-bold mb-6 shadow-lg">
                            <Star className="w-3 h-3 fill-white" />
                            FEATURED
                          </div>

                          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:translate-x-1 transition-transform duration-300">
                            {featuredArticle.title}
                          </h2>

                          {featuredArticle.excerpt && (
                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-3xl line-clamp-2">
                              {featuredArticle.excerpt}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                            {featuredArticle.author && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {featuredArticle.author}
                              </div>
                            )}
                            {featuredArticleIsDiscussion &&
                              typeof featuredArticle.replyCount === "number" && (
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  {featuredArticle.replyCount} balasan
                                </div>
                              )}
                            {featuredArticleIsQuiz && typeof featuredArticle.questionCount === "number" && (
                              <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                {featuredArticle.questionCount} soal
                              </div>
                            )}
                            {featuredArticle.readTime && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {featuredArticle.readTime} menit
                              </div>
                            )}
                            {!featuredArticleIsDiscussion && !featuredArticleIsQuiz && featuredArticle.views && (
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                {featuredArticle.views} views
                              </div>
                            )}
                          </div>

                          {featuredArticleIsDiscussion && featuredArticle.lastReplyBy && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                              Terakhir dibalas oleh <span className="font-medium">{featuredArticle.lastReplyBy}</span>
                              {featuredArticle.lastReplyAt && ` • ${formatDate(featuredArticle.lastReplyAt)}`}
                            </p>
                          )}

                          <motion.button
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-white font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {getArticleCtaLabel(featuredArticle)}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </motion.button>
                        </div>
                      </div>
                    </Link>
                  </motion.section>
                )}

                {/* Recommended Section */}
                {recommendedArticles.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-5 h-5 text-[#EC4899]" />
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Rekomendasi untuk Kamu
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {recommendedArticles.map((article, index) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          index={index}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Trending Section */}
                {trendingArticles.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Trending Minggu Ini
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {trendingArticles.map((article, index) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          index={index}
                          compact
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Tutorial Grid */}
                {gridArticles.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-5 h-5 text-[#6366F1]" />
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Semua Tutorial
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gridArticles.map((article, index) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          index={index}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* Sidebar (Optional but Powerful) */}
          {showSidebar && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block space-y-6"
            >
              {/* Progress Card */}
              <div className="sticky top-24 space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FBBF24]" />
                    Progress Belajar
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">
                          Artikel Dibaca
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          5/20
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#06B6D4] to-[#10B981] rounded-full transition-all duration-500"
                          style={{ width: "25%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved Articles */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#EC4899]" />
                    Artikel Tersimpan
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Belum ada artikel yang disimpan
                  </p>
                </div>

                {/* Next Up */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#6366F1]/10 to-[#EC4899]/10 border border-[#6366F1]/20">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6366F1]" />
                    Artikel Selanjutnya
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Lanjutkan belajar dengan topik yang relevan
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </div>
      </div>
    </div>
  );
}

// Article Card Component
interface ArticleCardProps {
  article: Article;
  index: number;
  compact?: boolean;
}

function ArticleCard({ article, index, compact = false }: ArticleCardProps) {
  const isQuiz = isQuizArticle(article);
  const isDiscussion = article.category?.toLowerCase() === "diskusi";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={buildArticleLink(article)}>
        <div className="group h-full p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          {/* Category & Status Badges */}
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#06B6D4]/10 to-[#10B981]/10 text-[#06B6D4] text-xs font-semibold">
              {article.category}
            </div>
            {article.status === 'draft' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                Draft
              </div>
            )}
          </div>

          {/* Title */}
          <h4
            className={`font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#06B6D4] transition-colors duration-300 ${
              compact ? "text-base" : "text-lg"
            }`}
          >
            {article.title}
          </h4>

          {/* Excerpt */}
          {!compact && article.excerpt && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {article.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {isQuiz && typeof article.questionCount === "number" && (
              <div className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {article.questionCount} soal
              </div>
            )}
            {isDiscussion && typeof article.replyCount === "number" && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {article.replyCount} balasan
              </div>
            )}
            {article.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime} menit
              </div>
            )}
            {!isQuiz && !isDiscussion && article.views && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views}
              </div>
            )}
          </div>

          {isDiscussion && article.lastReplyBy && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Terakhir oleh <span className="font-semibold">{article.lastReplyBy}</span>
              {article.lastReplyAt && ` • ${formatDate(article.lastReplyAt)}`}
            </p>
          )}

          {/* CTA Arrow */}
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#06B6D4] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>{getArticleCtaLabel(article)}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
