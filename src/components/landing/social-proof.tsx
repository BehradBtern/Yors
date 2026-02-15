'use client'

import { motion } from 'framer-motion'
import { Users, Vote, TrendingUp, Globe } from 'lucide-react'

interface SocialProofProps {
  stats: {
    users: number
    questions: number
    votes: number
    countries: number
  }
}

export function SocialProof({ stats }: SocialProofProps) {
  const items = [
    { icon: Users, value: stats.users.toLocaleString(), label: 'Active Users', suffix: '+' },
    { icon: Vote, value: stats.votes.toLocaleString(), label: 'Votes Cast', suffix: '+' },
    { icon: TrendingUp, value: stats.questions.toLocaleString(), label: 'Questions', suffix: '+' },
    { icon: Globe, value: stats.countries.toString(), label: 'Countries', suffix: '' },
  ]

  return (
    <section className="py-4 border-y bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      
      {/* Scrolling container */}
      <div className="relative">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...items, ...items].map((item, index) => (
            <div key={index} className="flex items-center gap-3 whitespace-nowrap">
              <div className="p-2 rounded-lg bg-[#09637E]/10">
                <item.icon className="h-4 w-4 text-[#09637E]" />
              </div>
              <div>
                <span className="font-bold text-lg">{item.value}{item.suffix}</span>
                <span className="text-muted-foreground text-sm ml-2">{item.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
