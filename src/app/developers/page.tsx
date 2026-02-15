'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, Code, Book, Terminal, 
  FileJson, Webhook, Key, Zap, Github, ExternalLink,
  Copy, Check
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const endpoints = [
  { method: 'GET', path: '/api/questions', description: 'List all questions' },
  { method: 'POST', path: '/api/questions', description: 'Create a new question' },
  { method: 'GET', path: '/api/questions/:id', description: 'Get a specific question' },
  { method: 'POST', path: '/api/vote', description: 'Submit a vote' },
  { method: 'GET', path: '/api/stats', description: 'Get platform statistics' },
  { method: 'GET', path: '/api/user/stats', description: 'Get user statistics' },
]

const sdks = [
  { name: 'JavaScript', icon: '🟨', available: true },
  { name: 'Python', icon: '🐍', available: true },
  { name: 'Ruby', icon: '💎', available: false },
  { name: 'Go', icon: '🐹', available: false },
]

const codeExample = `// Fetch all questions
const response = await fetch('https://yors.app/api/questions', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const questions = await response.json();
console.log(questions);`

export default function DevelopersPage() {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-[#09637E] to-[#088395]">API Documentation</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Developer <span className="bg-gradient-to-r from-[#09637E] to-[#088395] bg-clip-text text-transparent">Portal</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build powerful applications with the Yors API. Simple, fast, and well-documented.
            </p>
          </motion.div>

          {/* Quick Start */}
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-[#09637E]" />
                  Quick Start
                </h2>
                <Button variant="outline" size="sm" onClick={copyCode} className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{codeExample}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Key, title: 'API Keys', description: 'Generate and manage your API keys from the dashboard' },
              { icon: Webhook, title: 'Webhooks', description: 'Get real-time notifications for votes and events' },
              { icon: FileJson, title: 'REST API', description: 'Simple REST endpoints for all operations' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">API Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'outline' : 'default'}
                        className={endpoint.method === 'POST' ? 'bg-green-500' : ''}
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Official SDKs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sdks.map((sdk, index) => (
              <motion.div
                key={sdk.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`${sdk.available ? 'hover:shadow-md cursor-pointer' : 'opacity-60'}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sdk.icon}</span>
                      <div>
                        <h3 className="font-semibold">{sdk.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sdk.available ? 'Available now' : 'Coming soon'}
                        </p>
                      </div>
                    </div>
                    {sdk.available && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Github className="h-4 w-4" />
                        View
                      </Button>
                    )}
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
              <Code className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-4">Get Your API Key</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Premium users get API access. Upgrade to start building with Yors.
              </p>
              <Button variant="secondary" size="lg" className="gap-2">
                <Key className="h-4 w-4" />
                Get API Access
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
