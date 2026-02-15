'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowLeft, Sparkles, FileText, Scale, AlertCircle,
  CheckCircle, XCircle, RefreshCw, Mail
} from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig } from '@/hooks/useSiteConfig'

export default function TermsPage() {
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
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: {config.lastUpdated}</p>
              </div>
            </div>

            <Card className="mb-8 bg-gradient-to-r from-[#09637E]/5 to-[#088395]/5">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">Agreement Summary</h2>
                <p className="text-muted-foreground">
                  By using Yors, you agree to use our service responsibly, respect other users, 
                  and understand that we are not liable for content created by users.
                </p>
              </CardContent>
            </Card>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[#09637E]" />
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground">
                  By accessing or using Yors ("the Service"), you agree to be bound by these Terms of Service 
                  and all applicable laws and regulations. If you do not agree with any of these terms, 
                  you are prohibited from using or accessing this Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#09637E]" />
                  2. Use License
                </h2>
                <p className="text-muted-foreground">
                  Permission is granted to temporarily use Yors for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="text-muted-foreground space-y-2 list-disc pl-6 mt-3">
                  <li>Modify or copy the Service's source code</li>
                  <li>Use the Service for any commercial purpose without a premium subscription</li>
                  <li>Attempt to reverse engineer any software contained on the Service</li>
                  <li>Remove any copyright or proprietary notations</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#09637E]" />
                  3. User Conduct
                </h2>
                <p className="text-muted-foreground">You agree not to:</p>
                <ul className="text-muted-foreground space-y-2 list-disc pl-6 mt-3">
                  <li>Create polls that contain illegal, harmful, or offensive content</li>
                  <li>Impersonate another person or entity</li>
                  <li>Attempt to manipulate poll results through automated means</li>
                  <li>Spam or harass other users</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-[#09637E]" />
                  4. Content Policy
                </h2>
                <p className="text-muted-foreground">
                  You retain ownership of content you create. By posting content, you grant Yors a worldwide, 
                  non-exclusive, royalty-free license to use, display, and distribute your content through our Service.
                </p>
                <p className="text-muted-foreground mt-3">
                  We reserve the right to remove any content that violates these terms or is otherwise objectionable.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-[#09637E]" />
                  5. Subscription and Payments
                </h2>
                <p className="text-muted-foreground">
                  Premium subscriptions are billed in advance on a monthly or yearly basis. You may cancel at any time, 
                  and your subscription will remain active until the end of the current billing period. All payments are non-refundable except as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Disclaimer</h2>
                <p className="text-muted-foreground">
                  The Service is provided "as is" without any warranties, expressed or implied. Yors does not warrant 
                  that the Service will be uninterrupted, secure, or error-free. We are not responsible for any decisions 
                  made based on poll results.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. Limitations</h2>
                <p className="text-muted-foreground">
                  In no event shall Yors or its operators be liable for any damages arising out of the use or inability 
                  to use the Service, even if we have been notified of the possibility of such damages.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may revise these Terms of Service at any time. By using the Service, you agree to be bound by the 
                  current version of the Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#09637E]" />
                  9. Contact Information
                </h2>
                <p className="text-muted-foreground">
                  Questions about the Terms of Service should be sent to us at:
                </p>
                <p className="mt-3">
                  <a href="mailto:legal@yors.com" className="text-[#09637E] hover:underline">
                    legal@yors.com
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
