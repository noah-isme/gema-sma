"use client";

import { motion } from "framer-motion";
import { Bell, Sparkles } from "lucide-react";

export default function AnnouncementsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
              }}
            >
              <Bell className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <div className="h-12 w-80 bg-gradient-to-r from-purple-200/50 to-pink-200/50 dark:from-purple-800/50 dark:to-pink-800/50 rounded-2xl animate-pulse" />
          </div>
          <div className="h-6 w-64 mx-auto bg-gray-200/50 dark:bg-gray-700/50 rounded-full animate-pulse" />
        </motion.div>

        {/* Filter Tabs Skeleton */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="h-10 rounded-full bg-white/50 dark:bg-gray-800/50"
                style={{ width: `${80 + Math.random() * 40}px` }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
          <div className="h-10 w-48 bg-white/50 dark:bg-gray-800/50 rounded-full animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative"
            >
              <div className="rounded-2xl p-6 bg-white/50 dark:bg-gray-800/50 shadow-lg overflow-hidden">
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-gray-700/30 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Icon skeleton */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-200/50 to-pink-200/50 dark:from-purple-800/50 dark:to-pink-800/50 mb-4 animate-pulse" />

                {/* Title skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-5 bg-gray-200/70 dark:bg-gray-700/70 rounded-lg animate-pulse" />
                  <div className="h-5 w-3/4 bg-gray-200/70 dark:bg-gray-700/70 rounded-lg animate-pulse" />
                </div>

                {/* Excerpt skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200/50 dark:bg-gray-700/50 rounded animate-pulse" />
                </div>

                {/* Meta skeleton */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200/50 dark:bg-gray-700/50 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200/50 dark:bg-gray-700/50 rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating sparkles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.5, 0.2],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            >
              <Sparkles className="w-6 h-6 text-purple-400/30 dark:text-purple-600/30" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
