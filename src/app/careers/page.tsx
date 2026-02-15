'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, Briefcase, MapPin, Clock, DollarSign,
  Users, Heart, Coffee, Laptop, Globe, Zap
} from 'lucide-react'
import Link from 'next/link'

const jobs = [
  {
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120K - $160K',
    description: 'Lead our frontend development efforts and help shape the future of Yors.',
    requirements: ['5+ years React/Next.js experience', 'TypeScript expertise', 'UI/UX sensibility', 'Team leadership experience'],
  },
  {
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100K - $140K',
    description: 'Build and scale our backend infrastructure to support millions of users.',
    requirements: ['3+ years Node.js experience', 'Database design expertise', 'API development', 'Cloud platforms (AWS/GCP)'],
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90K - $130K',
    description: 'Create beautiful, intuitive interfaces that delight our users.',
    requirements: ['3+ years product design', 'Figma expertise', 'User research experience', 'Design system experience'],
  },
  {
    title: 'Developer Advocate',
    department: 'Community',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80K - $120K',
    description: 'Build and engage our developer community through content and events.',
    requirements: ['Strong communication skills', 'Developer background', 'Content creation experience', 'Public speaking'],
  },
]

const benefits = [
  { icon: Globe, title: 'Remote-First', description: 'Work from anywhere in the world' },
  { icon: DollarSign, title: 'Competitive Salary', description: 'Top-of-market compensation' },
  { icon: Heart, title: 'Health Insurance', description: 'Comprehensive medical, dental, vision' },
  { icon: Coffee, title: 'Unlimited PTO', description: 'Take the time you need' },
  { icon: Laptop, title: 'Equipment Budget', description: '$2,000 for home office setup' },
  { icon: Zap, title: 'Growth Budget', description: '$1,500/year for learning' },
]

export default function CareersPage() {
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
            <Badge className="mb-4 bg-gradient-to-r from-[#09637E] to-[#088395]">We're Hiring!</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join the <span className="bg-gradient-to-r from-[#09637E] to-[#088395] bg-clip-text text-transparent">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help us build the future of decision-making. We're looking for passionate people 
              who want to make a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.department}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <DollarSign className="h-3 w-3" />
                            {job.salary}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req) => (
                            <span key={req} className="text-xs bg-muted px-2 py-1 rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-[#09637E] to-[#088395] md:w-auto w-full">
                        Apply Now
                      </Button>
                    </div>
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
              <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
              <p className="text-white/80 mb-6">
                We're always looking for talented individuals. Send us your resume!
              </p>
              <Button variant="secondary" size="lg">
                careers@yors.com
              </Button>
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
