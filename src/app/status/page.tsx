'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Sparkles, Activity, CheckCircle, AlertTriangle,
  XCircle, Clock, Zap
} from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig } from '@/hooks/useSiteConfig'

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'degraded':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    case 'outage':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

export default function StatusPage() {
  const { config, loading } = useSiteConfig()

  // Generate incident data based on demo mode
  const now = new Date()
  const incidents = config.demoMode ? [
    {
      date: 'Feb 10, 2025',
      title: 'Email Delivery Delays',
      status: 'investigating',
      description: 'We are currently investigating delays in email delivery. Some users may experience delays in receiving notification emails.',
      updates: [
        { time: '14:30 UTC', message: 'Issue identified - working on a fix' },
        { time: '13:45 UTC', message: 'Investigating reports of delayed emails' },
      ],
    },
    {
      date: 'Feb 5, 2025',
      title: 'Scheduled Maintenance',
      status: 'resolved',
      description: 'Scheduled database maintenance completed successfully.',
      updates: [
        { time: '03:15 UTC', message: 'Maintenance completed' },
        { time: '02:00 UTC', message: 'Maintenance started' },
      ],
    },
  ] : [
    {
      date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      title: 'System Update',
      status: 'resolved',
      description: 'Successfully deployed performance improvements and bug fixes.',
      updates: [
        { time: '10:00 UTC', message: 'Deployment completed' },
        { time: '09:30 UTC', message: 'Deployment in progress' },
      ],
    },
    {
      date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      title: 'Scheduled Maintenance',
      status: 'resolved',
      description: 'Scheduled database maintenance completed successfully.',
      updates: [
        { time: '03:15 UTC', message: 'Maintenance completed' },
        { time: '02:00 UTC', message: 'Maintenance started' },
      ],
    },
  ]

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
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Activity className="h-12 w-12 mx-auto mb-4 text-[#09637E]" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System <span className="bg-gradient-to-r from-[#09637E] to-[#088395] bg-clip-text text-transparent">Status</span>
            </h1>
            
            {/* Current Status */}
            <Card className="max-w-md mx-auto mt-8">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="text-left">
                    <div className="font-semibold">All Systems Operational</div>
                    <div className="text-sm text-muted-foreground">Updated {config.demoMode ? '5 minutes ago' : 'just now'}</div>
                  </div>
                </div>
                <Badge className="bg-green-500">Live</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl font-bold mb-6">Services</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {config.services.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                      <Badge 
                        variant="outline"
                        className={service.status === 'operational' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}
                      >
                        {service.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Uptime History */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl font-bold mb-6">Uptime History</h2>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-6 gap-0">
                {config.uptimeHistory.map((month, index) => (
                  <div 
                    key={month.month}
                    className="p-4 text-center border-r last:border-r-0"
                  >
                    <div className="text-sm text-muted-foreground mb-1">{month.month}</div>
                    <div className="font-bold text-green-500">{month.uptime}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Incidents */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl font-bold mb-6">Recent Incidents</h2>
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <motion.div
                key={incident.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">{incident.date}</div>
                        <h3 className="font-semibold">{incident.title}</h3>
                      </div>
                      <Badge 
                        variant={incident.status === 'resolved' ? 'outline' : 'default'}
                        className={incident.status === 'resolved' ? 'border-green-500 text-green-500' : 'bg-yellow-500'}
                      >
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{incident.description}</p>
                    <div className="space-y-2 border-l-2 border-muted pl-4">
                      {incident.updates.map((update, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-muted-foreground">{update.time}</span>
                          <span className="ml-2">{update.message}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-r from-[#09637E] to-[#088395] text-white">
            <CardContent className="p-12">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-white/80 mb-6">
                Subscribe to receive real-time status updates
              </p>
              <Button variant="secondary" size="lg">
                Subscribe to Updates
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
