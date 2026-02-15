import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { 
  validateEmail, 
  sanitizeObject 
} from '@/lib/validation'
import { 
  verifyPassword, 
  createSession, 
  SESSION_CONFIG,
  checkLoginLockout,
  recordFailedLogin,
  clearFailedLogins
} from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = sanitizeObject(body)
    
    // Get client info for lockout and session
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || undefined

    // Check if this IP/email is locked out
    const lockoutKey = `${ipAddress}:${email?.toLowerCase() || 'unknown'}`
    const lockout = checkLoginLockout(lockoutKey)
    
    if (lockout.locked) {
      const remainingMinutes = Math.ceil((lockout.remainingMs || 0) / 60000)
      return NextResponse.json(
        { 
          error: `Too many failed attempts. Please try again in ${remainingMinutes} minute(s).`,
          locked: true
        },
        { status: 429 }
      )
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      recordFailedLogin(lockoutKey)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Use timing-safe comparison to prevent timing attacks
    // Always hash and compare even if user doesn't exist
    const dummyHash = '$2b$12$dummyhashforpassworddummydummydum'
    const passwordHash = user?.password || dummyHash
    const isPasswordValid = await verifyPassword(password, passwordHash)

    if (!user || !isPasswordValid) {
      recordFailedLogin(lockoutKey)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    // Clear failed login attempts on successful login
    clearFailedLogins(lockoutKey)

    // Auto-promote BehradBtem to owner if they have the correct name or email
    let updatedUser = user
    const isOwnerEmail = user.email === 'behradbtem@gmail.com'
    const isOwnerName = user.name === 'BehradBtem'
    if ((isOwnerEmail || isOwnerName) && user.role !== 'owner') {
      updatedUser = await db.user.update({
        where: { id: user.id },
        data: { role: 'owner', isPremium: true }
      })
    }

    // Create new session
    const session = await createSession(updatedUser.id, { ipAddress, userAgent })

    // Create response with session cookie
    const response = NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isPremium: updatedUser.isPremium,
        role: updatedUser.role
      },
      message: 'Login successful'
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
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
