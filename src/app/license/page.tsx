'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, FileText, Scale, Code,
  ExternalLink, Check, Github
} from 'lucide-react'
import Link from 'next/link'

const licenses = [
  {
    name: 'Next.js',
    license: 'MIT License',
    url: 'https://github.com/vercel/next.js/blob/canary/LICENSE',
  },
  {
    name: 'React',
    license: 'MIT License',
    url: 'https://github.com/facebook/react/blob/main/LICENSE',
  },
  {
    name: 'Tailwind CSS',
    license: 'MIT License',
    url: 'https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE',
  },
  {
    name: 'shadcn/ui',
    license: 'MIT License',
    url: 'https://github.com/shadcn-ui/ui/blob/main/LICENSE',
  },
  {
    name: 'Prisma',
    license: 'Apache 2.0',
    url: 'https://github.com/prisma/prisma/blob/main/LICENSE',
  },
  {
    name: 'Framer Motion',
    license: 'MIT License',
    url: 'https://github.com/framer/motion/blob/main/LICENSE',
  },
  {
    name: 'Stripe',
    license: 'MIT License',
    url: 'https://github.com/stripe/stripe-node/blob/master/LICENSE',
  },
  {
    name: 'Lucide Icons',
    license: 'ISC License',
    url: 'https://github.com/lucide-icons/lucide/blob/main/LICENSE',
  },
]

export default function LicensePage() {
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
                <h1 className="text-3xl font-bold">License & Attribution</h1>
                <p className="text-muted-foreground">Open source licenses for Yors</p>
              </div>
            </div>

            {/* Yors License */}
            <Card className="mb-8 bg-gradient-to-r from-[#09637E]/5 to-[#088395]/5">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[#09637E]" />
                  Yors Platform License
                </h2>
                <p className="text-muted-foreground mb-4">
                  The Yors platform is proprietary software. All rights reserved. 
                  Users are granted a limited license to use the service according to our Terms of Service.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Proprietary</Badge>
                  <Badge variant="outline">All Rights Reserved</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Third-party Licenses */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-[#09637E]" />
                Third-Party Open Source Licenses
              </h2>
              <p className="text-muted-foreground mb-6">
                Yors is built on open source software. We thank the open source community 
                for their contributions. Below are the licenses for the key technologies we use.
              </p>
              
              <div className="space-y-3">
                {licenses.map((lib, index) => (
                  <motion.div
                    key={lib.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#09637E]/10 flex items-center justify-center">
                            <Check className="h-5 w-5 text-[#09637E]" />
                          </div>
                          <div>
                            <h3 className="font-medium">{lib.name}</h3>
                            <p className="text-sm text-muted-foreground">{lib.license}</p>
                          </div>
                        </div>
                        <a 
                          href={lib.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#09637E] hover:underline text-sm flex items-center gap-1"
                        >
                          View License
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* MIT License Text */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">MIT License</h2>
              <Card>
                <CardContent className="p-6">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
{`MIT License

Copyright (c) ${new Date().getFullYear()} Yors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* Open Source Contribution */}
            <section>
              <Card className="bg-gradient-to-r from-[#09637E] to-[#088395] text-white">
                <CardContent className="p-8 text-center">
                  <Github className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h2 className="text-2xl font-bold mb-4">We ❤️ Open Source</h2>
                  <p className="text-white/80 mb-6">
                    Yors is made possible by the amazing open source community. 
                    We contribute back by supporting open source projects.
                  </p>
                  <Button variant="secondary" className="gap-2">
                    <Github className="h-4 w-4" />
                    View Our GitHub
                  </Button>
                </CardContent>
              </Card>
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
