"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, Code2, Zap, Users2, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  participants: number;
  category: string;
}

const categoryConfig = {
  Workshop: {
    gradient: "from-indigo-500 to-cyan-400",
    bgGradient: "from-indigo-500/20 to-cyan-400/10",
    glowColor: "rgba(99, 102, 241, 0.3)",
    icon: Code2,
    emoji: "💻",
  },
  Bootcamp: {
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-400/20 to-orange-500/10",
    glowColor: "rgba(251, 191, 36, 0.3)",
    icon: Zap,
    emoji: "⚡",
  },
  Community: {
    gradient: "from-pink-500 to-violet-500",
    bgGradient: "from-pink-500/20 to-violet-500/10",
    glowColor: "rgba(236, 72, 153, 0.3)",
    icon: Users2,
    emoji: "🤝",
  },
  Competition: {
    gradient: "from-blue-500 to-purple-500",
    bgGradient: "from-blue-500/20 to-purple-500/10",
    glowColor: "rgba(59, 130, 246, 0.3)",
    icon: Trophy,
    emoji: "🏆",
  },
};

interface ActivitiesSectionProps {
  activities: Activity[];
  loading: boolean;
}

export function ActivitiesSection({ activities, loading }: ActivitiesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const categories = ["Semua", "Workshop", "Bootcamp", "Community", "Competition"];
  
  const filteredActivities = activeFilter === "Semua" 
    ? activities 
    : activities.filter(a => a.category === activeFilter);

  const getUrgencyMessage = (participants: number, capacity: number) => {
    const percentage = (participants / capacity) * 100;
    if (percentage >= 90) return { text: "🔥 Slot hampir penuh!", color: "text-red-500" };
    if (percentage >= 70) return { text: "⚡ Buruan daftar!", color: "text-orange-500" };
    return { text: `👥 ${participants} siswa sudah bergabung!`, color: "text-blue-500" };
  };

  return (
    <section
      id="activities"
      data-reveal
      className="relative z-10 px-6 py-16 sm:px-10 md:py-24 overflow-hidden"
      aria-labelledby="activities-heading"
    >
      {/* Gradient background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-500/10 to-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 border border-indigo-500/20">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Learning Playground
            </span>
          </div>
          <h2
            id="activities-heading"
            className="inline-block bg-gradient-to-r from-[#6C63FF] to-[#5EEAD4] bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl leading-tight"
          >
            Ayo Gabung di Kegiatan Seru!
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-200/80 leading-relaxed">
            Temukan kegiatan seru tiap pekan. Belajar bareng, bikin proyek, dan tunjukkan ide kamu 💡
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                ${activeFilter === category
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30 scale-105'
                  : 'bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                }
              `}
            >
              {category === "Semua" ? "🌟 Semua" : categoryConfig[category as keyof typeof categoryConfig]?.emoji + " " + category}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-block h-80 w-full animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {filteredActivities.slice(0, 6).map((activity, index) => {
              const config = categoryConfig[activity.category as keyof typeof categoryConfig] || categoryConfig.Workshop;
              const Icon = config.icon;
              const urgency = getUrgencyMessage(activity.participants, activity.capacity);
              const isFull = activity.participants >= activity.capacity;
              
              return (
                <motion.article
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-3xl overflow-hidden"
                  role="listitem"
                  style={{
                    boxShadow: `0 20px 40px -12px ${config.glowColor}`,
                  }}
                >
                  {/* Card Container */}
                  <div className="relative h-full bg-white/90 dark:bg-white/5 backdrop-blur border border-white/20 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500">
                    
                    {/* Thumbnail/Banner with Gradient Overlay */}
                    <div className={`
                      relative h-36 bg-gradient-to-br ${config.gradient} 
                      flex items-center justify-center overflow-hidden
                    `}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative z-10">
                        <Icon className="w-16 h-16 text-white/90 group-hover:rotate-12 transition-transform duration-500" />
                      </div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150" />
                        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`
                          inline-flex items-center gap-2 rounded-xl bg-gradient-to-br ${config.bgGradient} 
                          px-3 py-1.5 text-xs font-bold uppercase tracking-wider
                          bg-clip-text text-transparent bg-gradient-to-r ${config.gradient}
                        `}>
                          <span className="text-base">{config.emoji}</span>
                          <span>{activity.category}</span>
                        </div>
                        
                        {isFull && (
                          <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-full">
                            PENUH
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-[3.5rem]">
                        {activity.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-4 text-sm text-slate-600 dark:text-slate-200/80 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                        {activity.description}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-200/70 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                          <time dateTime={activity.date} className="flex-1">
                            {new Date(activity.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            · {activity.time}
                          </time>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                          <span className="truncate">{activity.location}</span>
                        </div>
                      </div>

                      {/* Participants Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-slate-500" />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {activity.participants}/{activity.capacity} peserta
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {Math.round((activity.participants / activity.capacity) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ 
                              width: `${Math.min((activity.participants / activity.capacity) * 100, 100)}%` 
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                            aria-label={`${Math.round((activity.participants / activity.capacity) * 100)}% terisi`}
                          />
                        </div>
                      </div>

                      {/* Urgency Message */}
                      <div className={`mt-3 text-xs font-semibold ${urgency.color} flex items-center gap-1`}>
                        <span>{urgency.text}</span>
                      </div>

                      {/* CTA Button - appears on hover */}
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        whileHover={{ opacity: 1, height: "auto" }}
                        className="mt-4 overflow-hidden"
                      >
                        <Link
                          href={`/activities/${activity.id}`}
                          className={`
                            block w-full text-center py-2.5 rounded-xl font-semibold text-sm
                            bg-gradient-to-r ${config.gradient} text-white
                            transform transition-all duration-300
                            hover:shadow-lg hover:scale-[1.02]
                            ${isFull ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                          onClick={isFull ? (e) => e.preventDefault() : undefined}
                        >
                          {isFull ? "Sudah Penuh" : "Ikuti Sekarang →"}
                        </Link>
                      </motion.div>
                    </div>

                    {/* Glow effect on hover */}
                    <div 
                      className={`
                        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                        bg-gradient-to-r ${config.gradient}
                      `}
                      style={{
                        filter: 'blur(40px)',
                        transform: 'translateZ(0)',
                        zIndex: -1,
                      }}
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/90 p-12 text-center backdrop-blur dark:bg-white/5"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Belum ada kegiatan {activeFilter !== "Semua" ? activeFilter : ""} saat ini
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-200/80">
              Pantau terus update terbaru atau coba filter lain!
            </p>
          </motion.div>
        )}

        {/* View All CTA */}
        {filteredActivities.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link
              href="/activities"
              className="
                group inline-flex items-center gap-3 rounded-full 
                bg-gradient-to-r from-[#6C63FF] to-[#5EEAD4] 
                px-10 py-4 text-base font-bold text-white shadow-2xl 
                transition-all duration-300 
                hover:shadow-indigo-500/50 hover:scale-105
                relative overflow-hidden
              "
            >
              <span className="relative z-10">Jelajahi Semua Kegiatan</span>
              <span className="relative z-10 text-xl group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>
          </motion.div>
        )}
        
        {/* Bottom CTA - Join Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 sm:p-12 text-center border border-indigo-500/20"
        >
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Belum Gabung di GEMA?
          </h3>
          <p className="text-slate-600 dark:text-slate-200/80 mb-6 max-w-xl mx-auto">
            Daftar sekarang dan dapatkan akses ke semua kegiatan, workshop eksklusif, dan komunitas developer muda!
          </p>
          <Link
            href="/student/register"
            className="
              inline-flex items-center gap-2 rounded-full 
              bg-gradient-to-r from-pink-500 to-violet-500 
              px-8 py-3 text-sm font-semibold text-white shadow-lg 
              transition-all duration-300 
              hover:shadow-pink-500/50 hover:scale-105
            "
          >
            <Users2 className="w-4 h-4" />
            Daftar Jadi Member GEMA
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
