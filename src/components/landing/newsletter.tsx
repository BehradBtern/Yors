'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Bell, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubscribed(true)
    setLoading(false)
    toast({
      title: '🎉 Subscribed!',
      description: 'You\'ll receive updates about new features and tips.',
    })
  }

  return (
    <section className="py-16 bg-gradient-to-r from-[#09637E]/5 via-[#088395]/5 to-[#7AB2B2]/5">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#09637E]/10 text-[#09637E] text-sm font-medium mb-4">
            <Bell className="h-4 w-4" />
            Stay Updated
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Get the Latest Updates
          </h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for new features, tips, and community highlights.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-green-600"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <span className="font-medium">You're subscribed!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-6 bg-gradient-to-r from-[#09637E] to-[#088395] hover:from-[#065569] hover:to-[#088395]"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
