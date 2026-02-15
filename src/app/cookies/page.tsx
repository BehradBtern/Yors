'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, Cookie, Settings, Info,
  Check, X, BarChart3, Shield
} from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const cookieTypes = [
  {
    name: 'Essential Cookies',
    required: true,
    purpose: 'Enable core functionality like login, session management, and security',
    duration: 'Session',
  },
  {
    name: 'Preference Cookies',
    required: false,
    purpose: 'Remember your settings like language, theme, and notification preferences',
    duration: '1 year',
  },
  {
    name: 'Analytics Cookies',
    required: false,
    purpose: 'Help us understand how you use our service to improve the experience',
    duration: '2 years',
  },
  {
    name: 'Marketing Cookies',
    required: false,
    purpose: 'Used to deliver relevant advertisements (only with your consent)',
    duration: '90 days',
  },
]

export default function CookiesPage() {
  const { config } = useSiteConfig()

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

      {/* Content */}
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center">
                <Cookie className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Cookie Policy</h1>
                <p className="text-muted-foreground">Last updated: {config.lastUpdated}</p>
              </div>
            </div>

            <Card className="mb-8 bg-gradient-to-r from-[#09637E]/5 to-[#088395]/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-[#09637E] mt-0.5" />
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to provide, secure, and improve our service. 
                    By continuing to use Yors, you consent to our use of cookies as described in this policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What are Cookies */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files stored on your device when you visit our website. They help us 
                remember your preferences, keep you logged in, understand how you use our service, and 
                provide a better experience.
              </p>
            </section>

            {/* Cookie Types */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                {cookieTypes.map((cookie, index) => (
                  <motion.div
                    key={cookie.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            {cookie.required ? (
                              <Shield className="h-4 w-4 text-[#09637E]" />
                            ) : (
                              <Settings className="h-4 w-4 text-muted-foreground" />
                            )}
                            {cookie.name}
                          </h3>
                          <Badge variant={cookie.required ? 'default' : 'outline'}>
                            {cookie.required ? 'Required' : 'Optional'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{cookie.purpose}</p>
                        <div className="text-sm text-muted-foreground">
                          Duration: {cookie.duration}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* How to Manage */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">How to Manage Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in several ways:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Settings className="h-5 w-5 text-[#09637E]" />
                      <h3 className="font-medium">Browser Settings</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Most browsers allow you to block or delete cookies through settings. 
                      Check your browser's help section for instructions.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="h-5 w-5 text-[#09637E]" />
                      <h3 className="font-medium">Opt-out Tools</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use tools like optout.aboutads.info or youronlinechoices.com to 
                      manage advertising cookies.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Impact */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Impact of Disabling Cookies</h2>
              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                <CardContent className="p-6">
                  <p className="text-amber-800 dark:text-amber-200">
                    If you disable essential cookies, some features of Yors may not work properly. 
                    You may not be able to log in, create polls, or vote. Non-essential cookies 
                    can be disabled without affecting core functionality.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Updates */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time. Any changes will be posted on this 
                page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies, please contact us at:
              </p>
              <p className="mt-3">
                <a href="mailto:privacy@yors.com" className="text-[#09637E] hover:underline">
                  privacy@yors.com
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Yors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
