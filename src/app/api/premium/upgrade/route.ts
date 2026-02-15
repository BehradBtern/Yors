import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, plan } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Already premium (but allow role update)
    if (user.isPremium && user.role === 'premium') {
      return NextResponse.json({ error: 'Already a premium user' }, { status: 400 })
    }

    // Update user to premium
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumSince: new Date(),
        role: 'premium',
      },
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        premiumSince: true,
        role: true,
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: `Successfully upgraded to ${plan || 'Premium'}!`
    })
  } catch (error) {
    console.error('Error upgrading to premium:', error)
    return NextResponse.json({ error: 'Failed to upgrade to premium' }, { status: 500 })
  }
}