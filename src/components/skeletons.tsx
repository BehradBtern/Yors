'use client'

import { motion } from 'framer-motion'

export function QuestionCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-4 md:p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-12 bg-muted rounded-lg" />
        <div className="flex gap-2">
          <div className="flex-1 h-12 bg-muted rounded-lg" />
          <div className="flex-1 h-12 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-3 bg-muted rounded w-24" />
        <div className="h-3 bg-muted rounded w-16" />
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-4 md:p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="h-4 bg-muted rounded w-24 mb-2" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    </div>
  )
}

export function TrendingCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-4 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
      <div className="h-8 bg-muted rounded w-full mb-3" />
      <div className="flex justify-between">
        <div className="h-3 bg-muted rounded w-20" />
        <div className="h-3 bg-muted rounded w-16" />
      </div>
    </div>
  )
}

export function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-[#09637E]"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
