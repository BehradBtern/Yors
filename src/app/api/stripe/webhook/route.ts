import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

// Initialize Stripe
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.includes('placeholder') || secretKey === '' || secretKey === 'sk_test_placeholder') {
    return null
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-04-30.basil',
  })
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    
    // If Stripe is not configured, return success (demo mode)
    if (!stripe || !webhookSecret || webhookSecret.includes('placeholder')) {
      console.log('Stripe webhook called in demo mode - no action needed')
      return NextResponse.json({ received: true, demoMode: true })
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, plan } = session.metadata || {}

        if (userId) {
          // Update user to premium
          await db.user.update({
            where: { id: userId },
            data: {
              isPremium: true,
              premiumSince: new Date(),
              role: 'premium',
            },
          })

          console.log(`✅ User ${userId} upgraded to premium (${plan})`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription cancellation - downgrade user
        // You might want to keep them premium until the period ends
        console.log('Subscription cancelled:', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed for invoice:', invoice.id)
        // Optionally notify user or mark for follow-up
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
