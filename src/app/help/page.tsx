'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, Search, BookOpen, MessageCircle, 
  Mail, ChevronRight, HelpCircle, CreditCard, Settings,
  Users, Shield, Zap, Clock
} from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig, formatNumber } from '@/hooks/useSiteConfig'

const categories = [
  { icon: Zap, title: 'Getting Started', articles: 12, description: 'Learn the basics of Yors' },
  { icon: Users, title: 'Account & Profile', articles: 8, description: 'Manage your account settings' },
  { icon: Shield, title: 'Privacy & Security', articles: 6, description: 'Keep your data safe' },
  { icon: CreditCard, title: 'Billing & Payments', articles: 5, description: 'Subscription and payments' },
  { icon: Settings, title: 'Features & Settings', articles: 15, description: 'Customize your experience' },
  { icon: HelpCircle, title: 'Troubleshooting', articles: 10, description: 'Solve common issues' },
]

const faqs = [
  {
    question: 'Is Yors free to use?',
    answer: 'Yes! Yors offers a free tier that includes unlimited Yes/No questions and voting. Premium features like multiple choice questions require a subscription.',
  },
  {
    question: 'How do I create a poll?',
    answer: 'Simply sign up, click "Create Question", type your question, and publish. It takes less than 30 seconds!',
  },
  {
    question: 'Can I see who voted on my poll?',
    answer: 'No, all voting is anonymous to ensure honest responses. You can only see the overall results.',
  },
  {
    question: 'How do I share my poll?',
    answer: 'Each poll has a unique URL that you can share anywhere. You can also use our built-in social sharing buttons.',
  },
]

export default function HelpPage() {
  const { config, loading } = useSiteConfig()

  // Calculate view counts based on total users
  const viewMultiplier = config.demoMode ? 1 : config.totalUsers / 50000
  const popularArticles = [
    { title: 'How to create your first poll', category: 'Getting Started', views: Math.floor(5200 * viewMultiplier) },
    { title: 'Understanding multiple choice questions', category: 'Features', views: Math.floor(3800 * viewMultiplier) },
    { title: 'How to upgrade to Premium', category: 'Billing', views: Math.floor(3100 * viewMultiplier) },
    { title: 'Sharing polls on social media', category: 'Features', views: Math.floor(2900 * viewMultiplier) },
    { title: 'Exporting poll results', category: 'Features', views: Math.floor(2400 * viewMultiplier) },
    { title: 'Managing notifications', category: 'Settings', views: Math.floor(2100 * viewMultiplier) },
  ]

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K'
    }
    return views.toString()
  }

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
      <section className="py-16 px-4 bg-gradient-to-b from-[#09637E]/5 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we <span className="bg-gradient-to-r from-[#09637E] to-[#088395] bg-clip-text text-transparent">help</span>?
            </h1>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help articles..." 
                className="pl-12 h-14 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center flex-shrink-0">
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-[#09637E] transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        <span className="text-xs text-muted-foreground">{category.articles} articles</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#09637E] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Popular Articles</h2>
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <BookOpen className="h-5 w-5 text-[#09637E]" />
                      <div>
                        <h3 className="font-medium">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{formatViews(article.views)} views</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-[#09637E]" />
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground ml-6">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-[#09637E] to-[#088395] text-white">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
              <p className="text-white/80 mb-6">
                Our support team is here to assist you
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="secondary" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Support
                </Button>
                <span className="text-white/60">or</span>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4" />
                  Response within 24 hours
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
