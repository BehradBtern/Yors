/**
 * Input Validation and Sanitization Utilities
 * Provides secure input handling for all API routes
 */

// XSS Prevention: Strip dangerous HTML tags and attributes
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
}

// General text sanitization
export function sanitizeText(input: string, maxLength?: number): string {
  let sanitized = input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  return sanitized
}

// Email validation with RFC 5322 compliance
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const sanitized = email.trim().toLowerCase()
  
  if (!sanitized) {
    return { valid: false, error: 'Email is required' }
  }
  
  if (sanitized.length > 254) {
    return { valid: false, error: 'Email is too long' }
  }
  
  if (!EMAIL_REGEX.test(sanitized)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  // Check for common disposable email domains (basic list)
  const disposableDomains = [
    'tempmail.com', 'throwaway.com', 'guerrillamail.com', 
    'mailinator.com', '10minutemail.com', 'fakeinbox.com'
  ]
  const domain = sanitized.split('@')[1]
  if (domain && disposableDomains.includes(domain)) {
    return { valid: false, error: 'Disposable emails are not allowed' }
  }
  
  return { valid: true }
}

// Password validation with strong requirements
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!password) {
    return { valid: false, errors: ['Password is required'] }
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (password.length > 128) {
    errors.push('Password is too long')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', 'password123', '12345678', 'qwerty123',
    'letmein', 'welcome', 'admin', 'password1'
  ]
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password is too common. Choose a stronger password')
  }
  
  return { valid: errors.length === 0, errors }
}

// Name validation
export function validateName(name: string): { valid: boolean; error?: string } {
  const sanitized = name.trim()
  
  if (!sanitized) {
    return { valid: false, error: 'Name is required' }
  }
  
  if (sanitized.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  
  if (sanitized.length > 50) {
    return { valid: false, error: 'Name is too long (max 50 characters)' }
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and common Unicode
  if (!/^[\p{L}\s\-']+$|^[a-zA-Z0-9_\-\s]+$/u.test(sanitized)) {
    return { valid: false, error: 'Name contains invalid characters' }
  }
  
  return { valid: true }
}

// Question text validation
export function validateQuestionText(text: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeText(text, 500)
  
  if (!sanitized) {
    return { valid: false, error: 'Question text is required' }
  }
  
  if (sanitized.length < 10) {
    return { valid: false, error: 'Question must be at least 10 characters' }
  }
  
  if (sanitized.length > 500) {
    return { valid: false, error: 'Question must be less than 500 characters' }
  }
  
  return { valid: true }
}

// Comment validation
export function validateComment(text: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeText(sanitizeHtml(text), 1000)
  
  if (!sanitized) {
    return { valid: false, error: 'Comment text is required' }
  }
  
  if (sanitized.length < 1) {
    return { valid: false, error: 'Comment is too short' }
  }
  
  if (sanitized.length > 1000) {
    return { valid: false, error: 'Comment must be less than 1000 characters' }
  }
  
  return { valid: true }
}

// UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function validateUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

// Option validation for multiple choice
export function validateOptions(options: { text: string; color?: string }[]): { valid: boolean; error?: string } {
  if (!Array.isArray(options)) {
    return { valid: false, error: 'Options must be an array' }
  }
  
  if (options.length < 2) {
    return { valid: false, error: 'At least 2 options are required' }
  }
  
  if (options.length > 6) {
    return { valid: false, error: 'Maximum 6 options allowed' }
  }
  
  for (let i = 0; i < options.length; i++) {
    const opt = options[i]
    if (!opt.text || typeof opt.text !== 'string') {
      return { valid: false, error: `Option ${i + 1} text is required` }
    }
    if (opt.text.trim().length > 100) {
      return { valid: false, error: `Option ${i + 1} is too long (max 100 characters)` }
    }
  }
  
  return { valid: true }
}

// Date validation for scheduled questions
export function validateScheduleDates(startDate: string, endDate: string): { valid: boolean; error?: string } {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const now = new Date()
  
  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Invalid start date' }
  }
  
  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid end date' }
  }
  
  if (start < now) {
    return { valid: false, error: 'Start date must be in the future' }
  }
  
  if (end <= start) {
    return { valid: false, error: 'End date must be after start date' }
  }
  
  // Maximum schedule duration: 1 year
  const maxDuration = 365 * 24 * 60 * 60 * 1000
  if (end.getTime() - start.getTime() > maxDuration) {
    return { valid: false, error: 'Schedule duration cannot exceed 1 year' }
  }
  
  return { valid: true }
}

// Generic input sanitizer for objects
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key of Object.keys(sanitized)) {
    const value = sanitized[key]
    
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeText(value)
    } else if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value.map(item => 
        typeof item === 'string' ? sanitizeText(item) : item
      )
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>)
    }
  }
  
  return sanitized
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomValues = new Uint8Array(length)
  
  // Use crypto.getRandomValues for secure randomness
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues)
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length]
    }
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
  }
  
  return result
}

// Constant-time string comparison (for timing-safe comparisons)
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}
