import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

// Initialize Stripe
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.includes('placeholder') || secretKey === '' || secretKey === 'sk_test_placeholder') {
    return null
  }
  return new Stripe(secretKey)
}

// Check if demo mode is enabled (from database)
const isDemoMode = async (): Promise<boolean> => {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: 'demoMode' }
    })
    return setting ? setting.value === 'true' : true
  } catch {
    return true
  }
}

// Pricing plans
const PLANS = {
  monthly: {
    name: 'Premium Monthly',
    price: 999,
    interval: 'month' as const,
  },
  yearly: {
    name: 'Premium Yearly',
    price: 9999,
    interval: 'year' as const,
  },
  lifetime: {
    name: 'Premium Lifetime',
    price: 19999,
    interval: undefined,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, plan, email, name } = await request.json()

    if (!userId || !plan || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS]
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if demo mode is enabled (from database)
    const demoMode = await isDemoMode()
    
    if (demoMode) {
      // Demo mode: instantly upgrade user without payment
      await db.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          premiumSince: new Date(),
          role: 'premium',
        },
      })

      return NextResponse.json({ 
        demoMode: true,
        success: true,
        message: 'Demo upgrade successful!',
        redirectUrl: '/?upgraded=true'
      })
    }

    // Production mode: use Stripe
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add your Stripe API keys.' },
        { status: 503 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
              description: plan === 'lifetime' 
                ? 'One-time payment for lifetime premium access'
                : `Premium subscription billed ${selectedPlan.interval}ly`,
            },
            unit_amount: selectedPlan.price,
            recurring: selectedPlan.interval ? {
              interval: selectedPlan.interval,
            } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: selectedPlan.interval ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?payment=cancelled`,
      metadata: {
        userId,
        plan,
        userName: name || '',
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
      demoMode: false
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}