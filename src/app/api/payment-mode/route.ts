import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get payment mode
export async function GET() {
  try {
    // Check database for demo mode setting
    const setting = await db.siteSetting.findUnique({
      where: { key: 'demoMode' }
    })
    
    // Default to demo mode if not set
    const demoMode = setting ? setting.value === 'true' : true
    
    // Also check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY
    const stripeConfigured = stripeKey && 
                             !stripeKey.includes('placeholder') && 
                             stripeKey !== '' && 
                             stripeKey !== 'sk_test_placeholder'
    
    return NextResponse.json({ 
      demoMode,
      stripeConfigured: !!stripeConfigured
    })
  } catch (error) {
    console.error('Payment mode check error:', error)
    return NextResponse.json({ demoMode: true, stripeConfigured: false })
  }
}

// Set payment mode (owner only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, demoMode } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if user is owner
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    const isOwner = user && (
      user.role === 'owner' || 
      user.name === 'BehradBtem' || 
      user.email === 'behradbtem@gmail.com'
    )

    if (!isOwner) {
      return NextResponse.json({ error: 'Unauthorized - Owner access required' }, { status: 403 })
    }

    // Save setting to database
    await db.siteSetting.upsert({
      where: { key: 'demoMode' },
      update: { value: demoMode ? 'true' : 'false' },
      create: { 
        key: 'demoMode', 
        value: demoMode ? 'true' : 'false' 
      }
    })

    return NextResponse.json({ 
      success: true,
      demoMode,
      message: demoMode 
        ? 'Demo mode enabled - users can upgrade instantly' 
        : 'Production mode enabled - real Stripe payments required'
    })
  } catch (error) {
    console.error('Payment mode error:', error)
    return NextResponse.json({ error: 'Failed to update payment mode' }, { status: 500 })
  }
}