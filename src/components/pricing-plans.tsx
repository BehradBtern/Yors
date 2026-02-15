'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, Crown, Zap, Building2, Star, Sparkles, Shield, Loader2, CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PricingPlansProps {
  currentPlan?: 'free' | 'monthly' | 'yearly' | 'lifetime'
  user?: { id: string; email: string; name: string } | null
}

export function PricingPlans({ currentPlan, user }: PricingPlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      icon: Sparkles,
      color: 'from-gray-400 to-gray-500',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-300',
      features: [
        'Yes/No questions',
        'Custom labels',
        'Unlimited voting',
        'Real-time results',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      id: 'monthly',
      name: 'Premium',
      price: { monthly: 9.99, yearly: 99 },
      description: 'Best for power users',
      icon: Crown,
      color: 'from-[#09637E] to-[#088395]',
      bgColor: 'bg-[#09637E]/10',
      borderColor: 'border-[#09637E]',
      features: [
        'Everything in Free',
        'Multiple choice questions',
        'Advanced analytics',
        'Export to CSV/PDF',
        'Remove branding',
        'Priority support',
        'Sponsored questions',
      ],
      cta: 'Subscribe Now',
      popular: true,
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: { monthly: 199, yearly: 199 },
      description: 'One-time payment, forever',
      icon: Star,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500',
      features: [
        'Everything in Premium',
        'Pay once, use forever',
        'All future updates',
        'VIP support',
        'Custom branding',
        'API access',
      ],
      cta: 'Get Lifetime Access',
      popular: false,
    },
  ]

  const handleCheckout = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please sign in to upgrade your plan',
        variant: 'destructive'
      })
      return
    }

    setLoading(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name,
          plan: planId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Handle demo mode vs production
      if (data.demoMode) {
        // Demo mode: show success and reload
        toast({
          title: '🎉 Demo Upgrade Successful!',
          description: 'Your account has been upgraded to Premium.',
        })
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else if (data.url) {
        // Production mode: redirect to Stripe
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout',
        variant: 'destructive'
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
          className="relative w-14 h-7 rounded-full bg-muted transition-colors"
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#09637E] to-[#088395]"
            animate={{ left: billingPeriod === 'monthly' ? 4 : 32 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
          Yearly
          <span className="ml-1.5 text-xs text-green-600 font-medium">Save 17%</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl border-2 ${plan.borderColor} ${plan.bgColor} p-6 flex flex-col ${
              plan.popular ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-background' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
              <plan.icon className="h-6 w-6 text-white" />
            </div>

            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold">
                ${plan.id === 'monthly' 
                  ? (billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly)
                  : plan.price.monthly
                }
              </span>
              {plan.price.monthly > 0 && plan.id !== 'lifetime' && (
                <span className="text-muted-foreground">
                  /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </span>
              )}
              {plan.id === 'lifetime' && (
                <span className="text-muted-foreground text-sm ml-1">one-time</span>
              )}
              {billingPeriod === 'yearly' && plan.id === 'monthly' && (
                <div className="text-xs text-green-600 font-medium mt-1">
                  Save $20/year
                </div>
              )}
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleCheckout(plan.id)}
              disabled={plan.id === 'free' || currentPlan === plan.id || loading !== null}
              className={`w-full gap-2 ${
                plan.popular
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                  : plan.id === 'free'
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-gradient-to-r from-[#09637E] to-[#088395] hover:from-[#065569] hover:to-[#088395]'
              }`}
              variant={plan.id === 'free' ? 'outline' : 'default'}
            >
              {loading === plan.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {plan.id !== 'free' && <CreditCard className="h-4 w-4" />}
                  {currentPlan === plan.id ? 'Current Plan' : plan.cta}
                </>
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Payment Info */}
      <div className="mt-8 text-center space-y-3">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          Secure payment powered by Stripe • 30-day money-back guarantee
        </p>
        <p className="text-xs text-muted-foreground">
          Cancel anytime • No hidden fees • Instant access
        </p>
      </div>
    </div>
  )
}
