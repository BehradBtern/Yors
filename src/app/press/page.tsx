'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, Newspaper, Download, ExternalLink,
  Mail, Phone, Users, Globe, Award
} from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig, formatNumber } from '@/hooks/useSiteConfig'

const mediaKit = [
  { name: 'Yors Logo (SVG)', size: '45 KB', type: 'Logo' },
  { name: 'Yors Logo (PNG)', size: '120 KB', type: 'Logo' },
  { name: 'Product Screenshots', size: '2.4 MB', type: 'Images' },
  { name: 'Brand Guidelines', size: '890 KB', type: 'PDF' },
  { name: 'Executive Bios', size: '125 KB', type: 'PDF' },
]

const coverage = [
  { outlet: 'TechCrunch', title: 'Yors Wants to Simplify Decision Making', date: 'Jan 2025' },
  { outlet: 'Product Hunt', title: 'Featured Product of the Day', date: 'Dec 2024' },
  { outlet: 'Hacker News', title: 'Top Story: Simple Polling Done Right', date: 'Nov 2024' },
]

export default function PressPage() {
  const { config, loading } = useSiteConfig()

  const stats = [
    { value: formatNumber(config.totalVotes), label: 'Votes Cast' },
    { value: formatNumber(config.totalQuestions), label: 'Questions Created' },
    { value: config.totalCountries + '+', label: 'Countries' },
    { value: config.languagesSupported.toString(), label: 'Languages' },
  ]

  const pressReleases = config.pressReleases.map((pr, index) => {
    // Add excerpt based on title
    const excerpts: Record<string, string> = {
      'Yors Reaches 1 Million Votes Milestone': 'Community-driven polling platform celebrates major milestone with users from over 150 countries.',
      'Yors Launches Premium Features and API Access': 'New tier unlocks multiple choice questions, advanced analytics, and developer-friendly API.',
      'Yors Expands to 16 Languages': 'Platform now supports major world languages to serve global community.',
    }
    return {
      ...pr,
      excerpt: excerpts[pr.title] || 'Latest news from Yors.'
    }
  })

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
            <Badge className="mb-4 bg-gradient-to-r from-[#09637E] to-[#088395]">Press & Media</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Press <span className="bg-gradient-to-r from-[#09637E] to-[#088395] bg-clip-text text-transparent">Room</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the latest news, media resources, and contact information for Yors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#09637E]">
                  {loading ? '...' : stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">{release.date}</div>
                    <h3 className="text-lg font-semibold mb-2">{release.title}</h3>
                    <p className="text-muted-foreground">{release.excerpt}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Media Coverage</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {coverage.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-2">{item.outlet}</Badge>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Media Kit</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {mediaKit.map((file, index) => (
                  <div key={file.name} className="flex items-center justify-between p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#09637E]/10 flex items-center justify-center">
                        <Download className="h-5 w-5 text-[#09637E]" />
                      </div>
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">{file.size} • {file.type}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-r from-[#09637E] to-[#088395] text-white">
            <CardContent className="p-12">
              <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Press Contact</h2>
              <p className="text-white/80 mb-6">
                For press inquiries, interviews, or media requests
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>press@yors.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
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
