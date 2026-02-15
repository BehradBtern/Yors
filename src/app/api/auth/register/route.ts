import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  sanitizeText,
  sanitizeObject 
} from '@/lib/validation'
import { hashPassword, createSession, SESSION_CONFIG } from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, confirmPassword } = sanitizeObject(body)
    
    // Get client info for session
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || undefined

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join('. ') },
        { status: 400 }
      )
    }

    // Validate name
    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      )
    }

    // Check password confirmation
    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      // Don't reveal if email exists - use generic message
      return NextResponse.json(
        { error: 'Unable to create account. Please try again.' },
        { status: 400 }
      )
    }

    // Hash password with strong work factor
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: sanitizeText(name),
        password: hashedPassword
      }
    })

    // Create session
    const session = await createSession(user.id, { ipAddress, userAgent })

    // Create response with session cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        role: user.role
      },
      message: 'Account created successfully'
    })

    // Set secure session cookie
    response.cookies.set(SESSION_CONFIG.cookieName, session.token, {
      httpOnly: SESSION_CONFIG.httpOnly,
      secure: SESSION_CONFIG.secure,
      sameSite: SESSION_CONFIG.sameSite,
      path: SESSION_CONFIG.path,
      expires: session.expiresAt,
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
