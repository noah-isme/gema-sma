"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Eye,
  Share2,
  Newspaper,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: string;
  featured: boolean;
  imageUrl?: string;
  readTime: number;
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface RelatedNews {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  readTime?: number;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const splitContentIntoParagraphs = (content?: string) => {
  if (!content) return [];
  return content
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
};

const extractCodeSamples = (content?: string) => {
  if (!content) return [];
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const samples: Array<{ language: string; code: string }> = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    samples.push({
      language: match[1] || "code",
      code: match[2].trim(),
    });
  }
  return samples;
};

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
      recordView();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${slug}`);

      if (response.ok) {
        const data = await response.json();
        setArticle(data.data);

        // Fetch related news
        if (data.data?.tags?.length > 0) {
          fetchRelatedNews(data.data.tags[0]);
        }
      } else {
        console.error("Failed to fetch article");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async (tag: string) => {
    try {
      const response = await fetch(`/api/news?tags=${tag}&limit=3`);
      if (response.ok) {
        const data = await response.json();
        const articles = (data.data || []).filter(
          (a: RelatedNews) => a.slug !== slug
        );
        setRelatedNews(articles.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching related news:", error);
    }
  };

  const recordView = async () => {
    try {
      await fetch(`/api/news/${slug}/view`, { method: "POST" });
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: string) => {
    const title = article?.title || "";
    const url = shareUrl;

    let shareLink = "";
    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400");
    }
  };

  const paragraphs = splitContentIntoParagraphs(article?.content);
  const codeSamples = extractCodeSamples(article?.content);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] via-white to-[#F8FAFC] dark:from-[#050513] dark:via-[#06081C] dark:to-[#0a0c1d] flex items-center justify-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Newspaper className="w-16 h-16 text-[#6366F1]" />
        </motion.div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] via-white to-[#F8FAFC] dark:from-[#050513] dark:via-[#06081C] dark:to-[#0a0c1d] flex flex-col items-center justify-center">
        <div className="text-7xl mb-6">📰</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Berita Tidak Ditemukan
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Berita yang Anda cari tidak tersedia
        </p>
        <Link href="/news">
          <motion.button
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Kembali ke Berita
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] via-white to-[#F8FAFC] dark:from-[#050513] dark:via-[#06081C] dark:to-[#0a0c1d]">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/news">
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Berita</span>
          </motion.button>
        </Link>
      </div>

      {/* Article Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-24 pb-12 px-6"
      >
        <div className="max-w-4xl mx-auto">
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white text-sm font-semibold">
              <Newspaper className="w-4 h-4" />
              {article.category}
            </div>
            {article.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.readTime} menit baca
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.views} views
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mt-8">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              <Share2 className="w-4 h-4 inline mr-2" />
              Bagikan:
            </span>
            <motion.button
              onClick={() => handleShare("facebook")}
              className="p-2 rounded-full bg-[#1877F2] text-white hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Facebook className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => handleShare("twitter")}
              className="p-2 rounded-full bg-[#1DA1F2] text-white hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Twitter className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => handleShare("linkedin")}
              className="p-2 rounded-full bg-[#0A66C2] text-white hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => handleShare("copy")}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Article Content */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-slate dark:prose-invert prose-lg max-w-none"
          >
            {/* Featured Image */}
            {article.imageUrl && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Content Paragraphs */}
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}

            {/* Code Samples */}
            {codeSamples.map((sample, index) => (
              <div
                key={index}
                className="my-8 rounded-xl overflow-hidden bg-slate-900 dark:bg-slate-950"
              >
                <div className="px-4 py-2 bg-slate-800 dark:bg-slate-900 text-slate-300 text-sm font-mono">
                  {sample.language}
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="text-slate-100 text-sm font-mono">
                    {sample.code}
                  </code>
                </pre>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-[#6366F1]" />
              Berita Terkait
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((news) => (
                <Link key={news.id} href={`/news/${news.slug}`}>
                  <motion.div
                    className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                      {news.title}
                    </h4>
                    {news.excerpt && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {news.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(news.publishedAt)}
                      </div>
                      {news.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {news.readTime} min
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
