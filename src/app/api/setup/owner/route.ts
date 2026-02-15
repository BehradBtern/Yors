import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'
import { validateEmail, sanitizeObject } from '@/lib/validation'

/**
 * This endpoint sets up the initial owner
 * Security: Only works if no owner exists, or if requester is already owner
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = sanitizeObject(body)

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    // Check if any owner already exists
    const existingOwner = await db.user.findFirst({
      where: { role: 'owner' }
    })

    if (existingOwner) {
      // An owner already exists - require authentication and verify they are owner
      const authResult = await requireAuth(request)
      if (!authResult.authenticated) {
        return NextResponse.json({ 
          error: 'An owner already exists. Please log in to transfer ownership.',
          code: 'OWNER_EXISTS'
        }, { status: 403 })
      }

      const currentUser = await db.user.findUnique({
        where: { id: authResult.userId },
        select: { role: true }
      })

      if (!currentUser || currentUser.role !== 'owner') {
        return NextResponse.json({ 
          error: 'Only the current owner can transfer ownership',
          code: 'FORBIDDEN'
        }, { status: 403 })
      }
    }

    // Find the target user by email
    const targetUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!targetUser) {
      return NextResponse.json({ 
        error: 'User not found. Please create an account first.',
        code: 'USER_NOT_FOUND'
      }, { status: 404 })
    }

    // Update user to owner
    const updatedUser = await db.user.update({
      where: { email: email.toLowerCase() },
      data: { 
        role: 'owner',
        isPremium: true 
      }
    })

    return NextResponse.json({
      success: true,
      message: `${updatedUser.name} (${updatedUser.email}) is now the owner`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isPremium: updatedUser.isPremium
      }
    })
  } catch (error) {
    console.error('Setup owner error:', error)
    return NextResponse.json({ error: 'Failed to set owner' }, { status: 500 })
  }
}
