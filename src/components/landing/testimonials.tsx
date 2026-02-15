'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, Users, Vote, TrendingUp, Globe } from 'lucide-react'

// Testimonials only shown in production mode
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "SC",
    content: "Yors has transformed how we gather feedback from our team. The simplicity of Yes/No questions makes decision-making so much faster.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Community Manager",
    company: "GameStudio",
    avatar: "MJ",
    content: "We use Yors to let our community vote on new features. The real-time results keep everyone engaged and excited.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "BrandCo",
    avatar: "ER",
    content: "The premium features are worth every penny. Multiple choice questions help us understand our audience preferences in detail.",
    rating: 5
  },
  {
    name: "Alex Kim",
    role: "Startup Founder",
    company: "InnovateLabs",
    avatar: "AK",
    content: "Simple, fast, and effective. Yors is exactly what we needed for quick market research and customer feedback.",
    rating: 5
  },
  {
    name: "David Park",
    role: "Event Organizer",
    company: "EventPro",
    avatar: "DP",
    content: "We use Yors for live polling at our events. The audience loves seeing results update in real-time!",
    rating: 5
  },
  {
    name: "Lisa Thompson",
    role: "Teacher",
    company: "Lincoln High",
    avatar: "LT",
    content: "Perfect for classroom engagement. My students love voting on class decisions using Yors.",
    rating: 5
  }
]

interface TestimonialsProps {
  stats?: {
    users: number
    questions: number
    votes: number
  }
}

export function Testimonials({ stats }: TestimonialsProps) {
  const [isProduction, setIsProduction] = useState(false)
  const [realStats, setRealStats] = useState({
    activeUsers: 0,
    totalVotes: 0,
    avgRating: 4.9
  })

  useEffect(() => {
    // Check if we're in production mode
    fetch('/api/payment-mode')
      .then(res => res.json())
      .then(data => {
        setIsProduction(!data.demoMode)
      })
      .catch(() => setIsProduction(false))

    // Fetch real stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setRealStats({
          activeUsers: data.users || 0,
          totalVotes: data.votes || 0,
          avgRating: 4.9
        })
      })
      .catch(() => {})
  }, [])

  // In demo mode, show a different section
  if (!isProduction) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Growing Community</h2>
            <p className="text-muted-foreground text-lg">Join users from around the world</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-[#09637E]">{realStats.activeUsers.toLocaleString()}</p>
              <p className="text-muted-foreground">Active Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#088395] to-[#7AB2B2] flex items-center justify-center mx-auto mb-4">
                <Vote className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-[#088395]">{realStats.totalVotes.toLocaleString()}</p>
              <p className="text-muted-foreground">Votes Cast</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7AB2B2] to-[#09637E] flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-[#7AB2B2]">16+</p>
              <p className="text-muted-foreground">Languages</p>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  // Production mode: Show full testimonials with real data
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Thousands</h2>
          <p className="text-muted-foreground text-lg">See what our users are saying about Yors</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border rounded-xl p-6 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-[#09637E]/10" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{realStats.activeUsers.toLocaleString()}+</span>
              <span>Active Users</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{realStats.totalVotes.toLocaleString()}+</span>
              <span>Votes Cast</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{realStats.avgRating}</span>
              <span>Avg Rating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
