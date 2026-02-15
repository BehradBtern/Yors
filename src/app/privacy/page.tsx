'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowLeft, Sparkles, Shield, Lock, Eye, 
  Database, Users, Globe, Mail
} from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig } from '@/hooks/useSiteConfig'

export default function PrivacyPage() {
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
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: {config.lastUpdated}</p>
              </div>
            </div>

            <Card className="mb-8 bg-gradient-to-r from-[#09637E]/5 to-[#088395]/5">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">TL;DR</h2>
                <p className="text-muted-foreground">
                  We collect minimal data to provide our service. We never sell your information. 
                  You can delete your account and all associated data at any time.
                </p>
              </CardContent>
            </Card>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#09637E]" />
                  Information We Collect
                </h2>
                <div className="text-muted-foreground space-y-3">
                  <p><strong>Account Information:</strong> When you sign up, we collect your name, email address, and password (encrypted). This is the minimum required to create an account.</p>
                  <p><strong>Content You Create:</strong> We store the questions you create, votes you submit, and any comments you make. This content is public unless you delete it.</p>
                  <p><strong>Usage Data:</strong> We automatically collect information about how you use our service, including your IP address, browser type, and device information for security and analytics purposes.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#09637E]" />
                  How We Use Your Information
                </h2>
                <ul className="text-muted-foreground space-y-2 list-disc pl-6">
                  <li>To provide and maintain our service</li>
                  <li>To send you notifications about your polls and votes</li>
                  <li>To improve our service based on usage patterns</li>
                  <li>To protect against spam and abuse</li>
                  <li>To communicate with you about updates and changes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#09637E]" />
                  Data Security
                </h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your data, including:
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc pl-6 mt-3">
                  <li>Encryption of data in transit (HTTPS) and at rest</li>
                  <li>Secure password hashing using bcrypt</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#09637E]" />
                  Your Rights
                </h2>
                <p className="text-muted-foreground">You have the right to:</p>
                <ul className="text-muted-foreground space-y-2 list-disc pl-6 mt-3">
                  <li><strong>Access:</strong> Request a copy of all data we have about you</li>
                  <li><strong>Correction:</strong> Update or correct your personal information</li>
                  <li><strong>Deletion:</strong> Delete your account and all associated data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#09637E]" />
                  International Data Transfers
                </h2>
                <p className="text-muted-foreground">
                  Your data may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your information in compliance 
                  with applicable data protection laws, including GDPR for EU users.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#09637E]" />
                  Contact Us
                </h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="mt-3">
                  <a href="mailto:privacy@yors.com" className="text-[#09637E] hover:underline">
                    privacy@yors.com
                  </a>
                </p>
              </section>
            </div>
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
