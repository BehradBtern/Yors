import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Upgrade to premium (in demo mode)
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumSince: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        name: updatedUser.name,
        isPremium: updatedUser.isPremium 
      } 
    })
  } catch (error) {
    console.error('Error upgrading to premium:', error)
    return NextResponse.json({ error: 'Failed to upgrade to premium' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({ 
      where: { id: userId },
      select: { id: true, email: true, name: true, isPremium: true, premiumSince: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error checking premium status:', error)
    return NextResponse.json({ error: 'Failed to check premium status' }, { status: 500 })
  }
}