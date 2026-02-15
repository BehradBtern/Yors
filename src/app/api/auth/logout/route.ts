import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, SESSION_CONFIG } from '@/lib/auth-security'

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const token = request.cookies.get(SESSION_CONFIG.cookieName)?.value
    
    // Delete session from database
    if (token) {
      await deleteSession(token)
    }
    
    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    })
    
    // Clear session cookie
    response.cookies.set(SESSION_CONFIG.cookieName, '', {
      httpOnly: SESSION_CONFIG.httpOnly,
      secure: SESSION_CONFIG.secure,
      sameSite: SESSION_CONFIG.sameSite,
      path: SESSION_CONFIG.path,
      expires: new Date(0),
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
