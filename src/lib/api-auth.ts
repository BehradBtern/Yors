/**
 * API Authentication Helper
 * Provides utilities for authenticating API requests
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateSession, SESSION_CONFIG } from './auth-security'
import { validateUUID } from './validation'

// Extend NextRequest to include user info
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name: string
    isPremium: boolean
    role: string
  }
}

// Result type for withAuth
export type AuthResult = 
  | { authenticated: true; userId: string }
  | { authenticated: false; response: NextResponse }

/**
 * Middleware to require authentication for API routes
 * Returns userId if authenticated, or error response if not
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get session token from cookie
    const token = request.cookies.get(SESSION_CONFIG.cookieName)?.value
    
    if (!token) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: 'Authentication required', code: 'UNAUTHORIZED' },
          { status: 401 }
        )
      }
    }
    
    // Validate session
    const session = await validateSession(token)
    
    if (!session) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: 'Session expired. Please log in again.', code: 'SESSION_EXPIRED' },
          { status: 401 }
        )
      }
    }
    
    return { authenticated: true, userId: session.userId }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Authentication failed', code: 'AUTH_ERROR' },
        { status: 500 }
      )
    }
  }
}

/**
 * Get user from request (optional auth - returns null if not authenticated)
 */
export async function getOptionalUser(request: NextRequest): Promise<{ id: string; email: string; name: string; isPremium: boolean; role: string } | null> {
  try {
    const token = request.cookies.get(SESSION_CONFIG.cookieName)?.value
    
    if (!token) {
      return null
    }
    
    const session = await validateSession(token)
    
    if (!session) {
      return null
    }
    
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        role: true
      }
    })
    
    return user
  } catch {
    return null
  }
}

/**
 * Validate that userId matches the authenticated user
 */
export async function validateUserOwnership(request: NextRequest, resourceUserId: string): Promise<boolean | NextResponse> {
  const authResult = await requireAuth(request)
  
  if (!authResult.authenticated) {
    return authResult.response
  }
  
  if (authResult.userId !== resourceUserId) {
    return NextResponse.json(
      { error: 'You do not have permission to access this resource', code: 'FORBIDDEN' },
      { status: 403 }
    )
  }
  
  return true
}

/**
 * Check if user has premium access
 */
export async function requirePremium(request: NextRequest): Promise<{ valid: true; userId: string } | { valid: false; response: NextResponse }> {
  const authResult = await requireAuth(request)
  
  if (!authResult.authenticated) {
    return { valid: false, response: authResult.response }
  }
  
  const user = await db.user.findUnique({
    where: { id: authResult.userId },
    select: { isPremium: true, role: true }
  })
  
  if (!user || (!user.isPremium && user.role !== 'premium' && user.role !== 'owner')) {
    return {
      valid: false,
      response: NextResponse.json(
        { 
          error: 'This feature requires a Premium subscription',
          code: 'PREMIUM_REQUIRED',
          requiresPremium: true 
        },
        { status: 403 }
      )
    }
  }
  
  return { valid: true, userId: authResult.userId }
}

/**
 * Check if user is owner/admin
 */
export async function requireOwner(request: NextRequest): Promise<{ valid: true; userId: string } | { valid: false; response: NextResponse }> {
  const authResult = await requireAuth(request)
  
  if (!authResult.authenticated) {
    return { valid: false, response: authResult.response }
  }
  
  const user = await db.user.findUnique({
    where: { id: authResult.userId },
    select: { role: true }
  })
  
  if (!user || user.role !== 'owner') {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Admin access required', code: 'ADMIN_REQUIRED' },
        { status: 403 }
      )
    }
  }
  
  return { valid: true, userId: authResult.userId }
}

/**
 * Validate request body against a schema
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  validators: Record<keyof T, (value: unknown) => { valid: boolean; error?: string }>
): Promise<{ valid: true; data: T } | { valid: false; response: NextResponse }> {
  try {
    const body = await request.json()
    
    const errors: string[] = []
    const validatedData: Partial<T> = {}
    
    for (const [key, validator] of Object.entries(validators)) {
      const result = validator(body[key])
      if (!result.valid) {
        errors.push(result.error || `Invalid ${key}`)
      } else {
        (validatedData as Record<string, unknown>)[key] = body[key]
      }
    }
    
    if (errors.length > 0) {
      return {
        valid: false,
        response: NextResponse.json(
          { error: errors.join('. '), code: 'VALIDATION_ERROR' },
          { status: 400 }
        )
      }
    }
    
    return { valid: true, data: validatedData as T }
  } catch {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_BODY' },
        { status: 400 }
      )
    }
  }
}
