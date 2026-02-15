'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Users, Target, Heart, Lightbulb, Globe, Award, 
  ArrowLeft, Sparkles, Zap, Shield, CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig, formatNumber } from '@/hooks/useSiteConfig'

const team = [
  { name: 'behradbtem', role: 'CEO & Founder', image: 'BT' },
  { name: 'behradbtem', role: 'CTO', image: 'BT' },
  { name: 'behradbtem', role: 'Head of Product', image: 'BT' },
  { name: 'behradbtem', role: 'Head of Design', image: 'BT' },
]

const values = [
  { icon: Lightbulb, title: 'Innovation', description: 'We believe in pushing boundaries and exploring new ways to gather opinions.' },
  { icon: Shield, title: 'Privacy First', description: 'Your data is yours. We never sell or misuse your information.' },
  { icon: Users, title: 'Community', description: 'Building tools that bring people together to make better decisions.' },
  { icon: Heart, title: 'Simplicity', description: 'Complex problems deserve simple solutions. No clutter, just clarity.' },
]

export default function AboutPage() {
  const { config, loading } = useSiteConfig()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#09637E] to-[#088395]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Yors</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-[#09637E] to-[#088395] bg-clip-text text-transparent">Yors</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make decision-making simpler, faster, and more democratic. 
              Every voice matters, and every opinion counts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                In a world filled with complex surveys and endless options, we saw a need for simplicity. 
                Yors was born from the belief that the best decisions come from clear, straightforward questions.
              </p>
              <p className="text-muted-foreground mb-4">
                We built a platform where anyone can ask a question and get instant feedback from the community. 
                No complicated forms, no confusing interfaces — just simple Yes/No questions that get to the heart of what people think.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-[#09637E]" />
                  <span>Available in {config.languagesSupported} languages</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-[#09637E]" />
                  <span>{formatNumber(config.totalUsers)} users</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-[#09637E]">
                  {loading ? '...' : formatNumber(config.totalVotes)}
                </div>
                <div className="text-sm text-muted-foreground">Votes Cast</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-[#09637E]">
                  {loading ? '...' : formatNumber(config.totalQuestions)}
                </div>
                <div className="text-sm text-muted-foreground">Questions Asked</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-[#09637E]">
                  {loading ? '...' : config.totalCountries + '+'}
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-[#09637E]">
                  {loading ? '...' : config.uptime + '%'}
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-6">
            {config.milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < config.milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-gradient-to-b from-[#09637E] to-transparent mt-2" />
                  )}
                </div>
                <div className="pt-2 pb-8">
                  <p className="text-muted-foreground">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A passionate group of individuals dedicated to making decision-making easier for everyone.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                      {member.image}
                    </div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-r from-[#09637E] to-[#088395] text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Be part of the community that's changing how the world makes decisions.
              </p>
              <Link href="/">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Yors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
