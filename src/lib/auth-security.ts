/**
 * Authentication Security Utilities
 * Provides secure session management and authentication helpers
 */

import { db } from '@/lib/db'
import { generateSecureToken, secureCompare } from './validation'
import bcrypt from 'bcryptjs'

// Session configuration
export const SESSION_CONFIG = {
  tokenLength: 64,
  defaultExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  cookieName: 'yors_session',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  httpOnly: true,
  path: '/',
}

// Session interface
export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  ipAddress?: string
  userAgent?: string
}

// Create a new session
export async function createSession(
  userId: string, 
  options?: { 
    ipAddress?: string
    userAgent?: string
    expiryMs?: number 
  }
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSecureToken(SESSION_CONFIG.tokenLength)
  const expiresAt = new Date(Date.now() + (options?.expiryMs || SESSION_CONFIG.defaultExpiry))
  
  try {
    // Store session in database
    await db.session.create({
      data: {
        id: generateSecureToken(16),
        userId,
        token: await hashToken(token), // Hash the token for storage
        expiresAt,
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
      }
    })
    
    return { token, expiresAt }
  } catch (error) {
    console.error('Failed to create session:', error)
    throw new Error('Failed to create session')
  }
}

// Validate a session token
export async function validateSession(token: string): Promise<{ userId: string } | null> {
  if (!token || token.length !== SESSION_CONFIG.tokenLength) {
    return null
  }
  
  try {
    // Find sessions that haven't expired
    const sessions = await db.session.findMany({
      where: {
        expiresAt: { gt: new Date() }
      }
    })
    
    // Compare tokens in constant time
    for (const session of sessions) {
      if (await bcrypt.compare(token, session.token)) {
        // Update last accessed time
        await db.session.update({
          where: { id: session.id },
          data: { updatedAt: new Date() }
        })
        
        return { userId: session.userId }
      }
    }
    
    return null
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

// Delete a session (logout)
export async function deleteSession(token: string): Promise<void> {
  if (!token) return
  
  try {
    const sessions = await db.session.findMany()
    
    for (const session of sessions) {
      if (await bcrypt.compare(token, session.token)) {
        await db.session.delete({ where: { id: session.id } })
        return
      }
    }
  } catch (error) {
    console.error('Failed to delete session:', error)
  }
}

// Delete all sessions for a user
export async function deleteAllUserSessions(userId: string): Promise<void> {
  try {
    await db.session.deleteMany({ where: { userId } })
  } catch (error) {
    console.error('Failed to delete user sessions:', error)
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await db.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    })
    return result.count
  } catch (error) {
    console.error('Failed to cleanup sessions:', error)
    return 0
  }
}

// Hash token for storage
async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10)
}

// Password hashing with proper work factor
export async function hashPassword(password: string): Promise<string> {
  // Use cost factor of 12 for better security
  return bcrypt.hash(password, 12)
}

// Password verification with timing-safe comparison
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Check if user is locked out due to failed attempts
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>()

export function checkLoginLockout(identifier: string): { locked: boolean; remainingMs?: number } {
  const attempt = loginAttempts.get(identifier)
  
  if (!attempt) {
    return { locked: false }
  }
  
  if (Date.now() < attempt.lockedUntil) {
    return { 
      locked: true, 
      remainingMs: attempt.lockedUntil - Date.now() 
    }
  }
  
  // Lockout expired, clear the record
  loginAttempts.delete(identifier)
  return { locked: false }
}

export function recordFailedLogin(identifier: string): void {
  const existing = loginAttempts.get(identifier)
  const count = existing ? existing.count + 1 : 1
  
  // Lock out after 5 failed attempts for 15 minutes
  if (count >= 5) {
    loginAttempts.set(identifier, {
      count,
      lockedUntil: Date.now() + 15 * 60 * 1000
    })
  } else {
    loginAttempts.set(identifier, { count, lockedUntil: 0 })
  }
}

export function clearFailedLogins(identifier: string): void {
  loginAttempts.delete(identifier)
}

// Clean up old lockout records periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, attempt] of loginAttempts.entries()) {
    if (attempt.lockedUntil > 0 && now > attempt.lockedUntil) {
      loginAttempts.delete(key)
    }
  }
}, 60 * 1000)
