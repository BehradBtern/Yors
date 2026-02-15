'use client'

import { motion } from 'framer-motion'
import { Vote, MessageCircleQuestion, Trophy, TrendingUp } from 'lucide-react'

interface UserStatsProps {
  questionsCount: number
  votesCount: number
  name: string
  isPremium?: boolean
  t: Record<string, unknown>
}

export function UserStats({ questionsCount, votesCount, name, isPremium, t }: UserStatsProps) {
  const stats = [
    {
      label: t.myQuestions as string,
      value: questionsCount,
      icon: MessageCircleQuestion,
      color: 'from-[#09637E] to-[#088395]',
      bgColor: 'from-[#09637E]/10 to-[#088395]/10',
    },
    {
      label: t.myVotes as string,
      value: votesCount,
      icon: Vote,
      color: 'from-[#088395] to-[#7AB2B2]',
      bgColor: 'from-[#088395]/10 to-[#7AB2B2]/10',
    },
  ]

  // Calculate engagement level
  const totalEngagement = questionsCount * 2 + votesCount
  let level = 'Beginner'
  let levelColor = 'text-muted-foreground'
  let levelBg = 'bg-muted/50'
  
  if (totalEngagement >= 50) {
    level = 'Expert'
    levelColor = 'text-amber-600'
    levelBg = 'bg-amber-500/10'
  } else if (totalEngagement >= 20) {
    level = 'Active'
    levelColor = 'text-[#09637E]'
    levelBg = 'bg-[#09637E]/10'
  } else if (totalEngagement >= 5) {
    level = 'Engaged'
    levelColor = 'text-[#088395]'
    levelBg = 'bg-[#088395]/10'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border p-4 md:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white font-bold text-lg">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${levelBg} ${levelColor}`}>
              {level}
            </span>
          </div>
        </div>
        {isPremium && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 text-sm font-medium border border-amber-500/30">
            <Trophy className="h-4 w-4" />
            Premium
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-lg p-3 bg-gradient-to-br ${stat.bgColor} border`}
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <motion.p
              key={stat.value}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {questionsCount === 0 && votesCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-3 rounded-lg bg-muted/30 text-center"
        >
          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Start engaging to unlock your stats!
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
