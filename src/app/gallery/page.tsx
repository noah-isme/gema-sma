"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  Camera,
  Filter,
  Calendar,
  Star,
  Home,
  ArrowLeft,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  date: string;
  isVideo?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const categories = [
  { id: "semua", label: "Semua", emoji: "🌟" },
  { id: "foto", label: "Foto", emoji: "📸" },
  { id: "video", label: "Video", emoji: "🎥" },
  { id: "ekstrakurikuler", label: "Ekstrakurikuler", emoji: "🎨" },
  { id: "event", label: "Event Besar", emoji: "🎉" },
  { id: "lomba", label: "Lomba", emoji: "🏆" },
  { id: "kelas", label: "Kegiatan Kelas", emoji: "📚" },
];

const doodleShapes = [
  { type: "star", x: "10%", y: "15%", delay: 0 },
  { type: "circle", x: "85%", y: "20%", delay: 0.5 },
  { type: "spiral", x: "20%", y: "80%", delay: 1 },
  { type: "sparkle", x: "90%", y: "70%", delay: 1.5 },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowFab(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/public");
      const data = await response.json();
      if (data.success) {
        const galleryData = data.data.gallery || [];
        setGallery(galleryData);
        setFilteredGallery(galleryData);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterGallery = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      if (categoryId === "semua") {
        setFilteredGallery(gallery);
      } else if (categoryId === "foto") {
        setFilteredGallery(gallery.filter((item) => !item.isVideo));
      } else if (categoryId === "video") {
        setFilteredGallery(gallery.filter((item) => item.isVideo));
      } else {
        setFilteredGallery(
          gallery.filter(
            (item) => item.category?.toLowerCase() === categoryId
          )
        );
      }
    },
    [gallery]
  );

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, currentIndex, filteredGallery.length]);

  const getGridClass = (index: number) => {
    const pattern = index % 6;
    if (pattern === 0) return "col-span-2 row-span-2"; // Large
    if (pattern === 1) return "col-span-1 row-span-2"; // Tall
    if (pattern === 2) return "col-span-1 row-span-1"; // Small
    if (pattern === 3) return "col-span-2 row-span-1"; // Wide
    if (pattern === 4) return "col-span-2 row-span-2"; // Large
    return "col-span-1 row-span-1"; // Small
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] via-white to-[#F0F9FF] dark:from-[#050513] dark:via-[#06081C] dark:to-[#0a0c1d]">
      {/* Back to Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </motion.button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 px-6">
        {/* Animated Doodles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {doodleShapes.map((shape, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: shape.x, top: shape.y }}
              animate={{
                y: [0, -8, 0],
                x: [0, 4, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                delay: shape.delay,
                ease: "easeInOut",
              }}
            >
              {shape.type === "star" && (
                <Star className="w-8 h-8 text-[#FBBF24]/20 fill-[#FBBF24]/10" />
              )}
              {shape.type === "circle" && (
                <div className="w-12 h-12 rounded-full border-4 border-[#06B6D4]/20" />
              )}
              {shape.type === "spiral" && (
                <Sparkles className="w-10 h-10 text-[#EC4899]/20" />
              )}
              {shape.type === "sparkle" && (
                <div className="w-6 h-6 bg-gradient-to-br from-[#6366F1]/20 to-[#22D3EE]/20 rounded-lg transform rotate-45" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1]/10 to-[#EC4899]/10 border border-[#6366F1]/20 text-sm font-bold text-[#6366F1] dark:text-[#A5B4FC] mb-6">
              <Camera className="w-4 h-4" />
              Gallery GEMA
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Galeri Momen{" "}
            <span className="bg-gradient-to-r from-[#6366F1] via-[#EC4899] to-[#22D3EE] bg-clip-text text-transparent">
              GEMA
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Kumpulan kenangan yang seru dan penuh warna! 🎨✨
          </motion.p>
        </div>
      </section>

      {/* Sticky Category Filter */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                onClick={() => filterGallery(cat.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300
                  ${
                    activeCategory === cat.id
                      ? "text-white bg-gradient-to-r from-[#6366F1] to-[#EC4899] shadow-lg scale-105"
                      : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }
                `}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base">{cat.emoji}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Camera className="w-16 h-16 text-[#6366F1]" />
            </motion.div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Memuat galeri...
            </p>
          </div>
        ) : filteredGallery.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-7xl mb-6">📭</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Belum ada konten
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Foto dan video akan muncul setelah ada kegiatan
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-[200px]">
            {filteredGallery.map((item, index) => (
              <motion.div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl ${getGridClass(
                  index
                )}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.04,
                  transition: { duration: 0.3 },
                }}
                onClick={() => openLightbox(index)}
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Video Icon */}
                {item.isVideo && (
                  <motion.div
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-3"
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Play className="w-5 h-5 text-white fill-white" />
                  </motion.div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-sm line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                {/* Sparkle effect on hover */}
                <motion.div
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0, rotate: -45 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="w-5 h-5 text-[#FBBF24]" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {showFab && (
          <motion.div
            className="fixed bottom-8 right-8 z-50 flex flex-col gap-3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Scroll to Top */}
            <motion.button
              className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white p-4 rounded-full shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              title="Scroll ke atas"
            >
              <Filter className="w-6 h-6" />
            </motion.button>

            {/* Back to Home */}
            <Link href="/">
              <motion.button
                className="bg-white dark:bg-slate-800 text-[#6366F1] dark:text-[#A5B4FC] p-4 rounded-full shadow-2xl border-2 border-[#6366F1]/20"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                title="Kembali ke Beranda"
              >
                <Home className="w-6 h-6" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && filteredGallery[currentIndex] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation Buttons */}
            <motion.button
              className="absolute left-6 z-10 bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </motion.button>

            <motion.button
              className="absolute right-6 z-10 bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </motion.button>

            {/* Content */}
            <motion.div
              className="relative max-w-6xl mx-auto px-6 w-full"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Image */}
              <motion.div
                key={currentIndex}
                className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={filteredGallery[currentIndex].image}
                  alt={filteredGallery[currentIndex].title}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </motion.div>

              {/* Info */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white text-xs font-semibold mb-3">
                      {filteredGallery[currentIndex].category}
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {filteredGallery[currentIndex].title}
                    </h3>
                  </div>
                  <span className="text-sm text-white/60 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {filteredGallery[currentIndex].date}
                  </span>
                </div>
                <p className="text-white/80 leading-relaxed">
                  {filteredGallery[currentIndex].description}
                </p>
                <div className="mt-4 text-xs text-white/40">
                  {currentIndex + 1} / {filteredGallery.length}
                </div>
              </motion.div>
            </motion.div>

            {/* Confetti Effect on Open */}
            {lightboxOpen && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-[#6366F1] to-[#EC4899] rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -100, 100],
                      x: [0, Math.random() * 100 - 50],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
