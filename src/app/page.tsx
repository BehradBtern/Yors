'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  PlusCircle, ThumbsUp, ThumbsDown, Vote, Sparkles, LogOut, User, 
  CheckCircle2, Users, BarChart3, Zap, Shield, Globe, ArrowRight,
  MessageCircleQuestion, TrendingUp, Flame, ChevronUp, Search, X, Crown, Star, Languages,
  Share2, Copy, MessageCircle, Tag, Menu, RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import { CreateQuestionDialog } from '@/components/CreateQuestionDialog'
import { translations, Language, languages, getLanguageDirection } from '@/lib/translations'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileMenu } from '@/components/mobile-menu'
import { BottomNav } from '@/components/bottom-nav'
import { Confetti } from '@/components/confetti'
import { UserStats } from '@/components/user-stats'
import { QuestionCardSkeleton, StatsSkeleton } from '@/components/skeletons'
import { PricingPlans } from '@/components/pricing-plans'
import { SponsoredQuestion, AdBanner, PremiumGate, PromoteQuestionCTA } from '@/components/monetization'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { OwnerDashboard } from '@/components/owner-dashboard'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { UserProfile } from '@/components/user-profile'
import { FAQ } from '@/components/landing/faq'
import { Testimonials } from '@/components/landing/testimonials'
import { Newsletter } from '@/components/landing/newsletter'
import { Footer } from '@/components/landing/footer'
import { SocialProof } from '@/components/landing/social-proof'
import { WelcomeModal, useWelcomeModal } from '@/components/welcome-modal'

interface Option {
  id: string
  text: string
  color: string
  voteCount: number
  order: number
}

interface Question {
  id: string
  text: string
  questionType: 'yesNo' | 'multiple'
  yesLabel: string
  noLabel: string
  yesCount: number
  noCount: number
  options?: Option[]
  totalVotes: number
  status: string
  startDate?: string | null
  endDate?: string | null
  createdAt: string
  author?: { id: string; name: string; isPremium: boolean }
  hasVoted: boolean
  userVote?: boolean
  userVoteOptionId?: string
}

interface UserData {
  id: string
  email: string
  name: string
  isPremium?: boolean
  role?: string
}

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// Scroll to top button
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-[#09637E] to-[#088395] text-white shadow-lg shadow-[#09637E]/30 hover:shadow-xl hover:shadow-[#09637E]/40 transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// Typing effect for hero
function TypewriterText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const text = texts[currentIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < text.length) {
          setCurrentText(text.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(text.slice(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex, texts])

  return (
    <span className="inline-block min-w-[200px]">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-[1em] bg-[#09637E] ml-1 align-middle"
      />
    </span>
  )
}

// Mouse position hook
function useMousePosition() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])
  
  return { mouseX, mouseY }
}

// Mouse-following spotlight component
function MouseSpotlight() {
  const { mouseX, mouseY } = useMousePosition()
  const springConfig = { damping: 25, stiffness: 200 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(9, 99, 126, 0.06), transparent 40%)`,
      }}
    />
  )
}

// Mouse-following glow cursor
function CursorGlow() {
  const { mouseX, mouseY } = useMousePosition()
  const springConfig = { damping: 30, stiffness: 300 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  const scale = useMotionValue(1)
  
  useEffect(() => {
    const handleMouseDown = () => scale.set(0.8)
    const handleMouseUp = () => scale.set(1)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [scale])
  
  return (
    <>
      {/* Main glow */}
      <motion.div
        className="pointer-events-none fixed z-50 w-6 h-6 rounded-full"
        style={{
          x: x,
          y: y,
          translateX: '-50%',
          translateY: '-50%',
          scale,
          background: 'radial-gradient(circle, rgba(9, 99, 126, 0.8) 0%, rgba(8, 131, 149, 0.4) 50%, transparent 100%)',
          filter: 'blur(1px)',
        }}
      />
      {/* Trailing glow */}
      <motion.div
        className="pointer-events-none fixed z-40 w-12 h-12 rounded-full"
        style={{
          x: useSpring(x, { damping: 20, stiffness: 100 }),
          y: useSpring(y, { damping: 20, stiffness: 100 }),
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(122, 178, 178, 0.3) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
    </>
  )
}

// Floating particles that react to mouse
function FloatingParticles() {
  const { mouseX, mouseY } = useMousePosition()
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2,
  }))
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-[#09637E]/30 to-[#7AB2B2]/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}

// Magnetic button wrapper
function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.2
    const deltaY = (e.clientY - centerY) * 0.2
    x.set(deltaX)
    y.set(deltaY)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Floating Question Badge that reacts to mouse
function FloatingQuestionBadge({ 
  question, 
  initialX, 
  initialY, 
  behavior = 'flee',
  delay = 0,
  size = 'md'
}: { 
  question: string
  initialX: number
  initialY: number
  behavior?: 'flee' | 'follow' | 'rotate'
  delay?: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const { mouseX, mouseY } = useMousePosition()
  const ref = useRef<HTMLDivElement>(null)
  
  // Position state
  const x = useMotionValue(initialX)
  const y = useMotionValue(initialY)
  const rotate = useMotionValue(0)
  const scale = useMotionValue(1)
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  }

  // Update position based on mouse
  useEffect(() => {
    const unsubscribeX = mouseX.on('change', (mx) => {
      const unsubscribeY = mouseY.on('change', (my) => {
        if (!ref.current) return
        
        const currentX = x.get()
        const currentY = y.get()
        const badgeWidth = ref.current.offsetWidth || 100
        const badgeHeight = ref.current.offsetHeight || 40
        
        // Calculate distance from mouse to badge center
        const badgeCenterX = currentX + badgeWidth / 2
        const badgeCenterY = currentY + badgeHeight / 2
        const deltaX = mx - badgeCenterX
        const deltaY = my - badgeCenterY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        // React within a certain radius
        const reactRadius = 200
        
        if (distance < reactRadius) {
          const force = (reactRadius - distance) / reactRadius
          const angle = Math.atan2(deltaY, deltaX)
          
          if (behavior === 'flee') {
            // Move away from cursor
            x.set(initialX - Math.cos(angle) * force * 80)
            y.set(initialY - Math.sin(angle) * force * 80)
            rotate.set(-Math.cos(angle) * force * 15)
            scale.set(1 + force * 0.2)
          } else if (behavior === 'follow') {
            // Move toward cursor
            x.set(initialX + Math.cos(angle) * force * 40)
            y.set(initialY + Math.sin(angle) * force * 40)
            rotate.set(Math.cos(angle) * force * 10)
            scale.set(1 + force * 0.15)
          } else if (behavior === 'rotate') {
            // Just rotate toward cursor
            rotate.set(Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90)
            scale.set(1 + force * 0.1)
          }
        } else {
          // Return to original position
          x.set(initialX)
          y.set(initialY)
          rotate.set(0)
          scale.set(1)
        }
        
        return unsubscribeY
      })
      return unsubscribeY
    })
    
    return () => unsubscribeX()
  }, [mouseX, mouseY, x, y, rotate, scale, initialX, initialY, behavior])

  return (
    <motion.div
      ref={ref}
      className={`fixed z-20 pointer-events-none select-none ${sizeClasses[size]}`}
      style={{
        x,
        y,
        rotate,
        scale,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 0.5, 
        scale: 1,
        y: [initialY, initialY - 10, initialY]
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 3 + delay, repeat: Infinity, ease: 'easeInOut' }
      }}
    >
      <div className={`
        whitespace-nowrap rounded-full font-medium shadow-lg
        backdrop-blur-sm border
        ${behavior === 'flee' ? 'bg-gradient-to-r from-[#09637E]/70 to-[#088395]/70 text-white/90 border-[#09637E]/30' : ''}
        ${behavior === 'follow' ? 'bg-gradient-to-r from-[#7AB2B2]/70 to-[#EBF4F6]/70 text-[#09637E]/90 border-[#7AB2B2]/30' : ''}
        ${behavior === 'rotate' ? 'bg-gradient-to-r from-orange-500/60 to-amber-500/60 text-white/90 border-orange-400/30' : ''}
      `}>
        {question}
      </div>
    </motion.div>
  )
}

// Container for all floating question badges - uses real questions from DB
function FloatingQuestionBadges() {
  const [questions, setQuestions] = useState<string[]>([])
  
  // Fetch real questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/questions?badge=true')
        const data = await res.json()
        if (data.questions && data.questions.length > 0) {
          // Extract question texts
          const texts = data.questions.map((q: { text: string }) => q.text)
          setQuestions(texts)
        } else {
          // Fallback questions if none exist
          setQuestions([
            "Coffee or Tea?",
            "Cats vs Dogs?", 
            "iOS or Android?",
            "Pizza or Burger?",
            "Summer or Winter?",
            "Books vs Movies?",
            "AI: Yes or No?",
            "Beach Holiday?",
          ])
        }
      } catch {
        // Fallback on error
        setQuestions([
          "Coffee or Tea?",
          "Cats vs Dogs?",
          "iOS or Android?",
          "Pizza or Burger?",
          "Summer or Winter?",
          "Books vs Movies?",
          "AI: Yes or No?",
          "Beach Holiday?",
        ])
      }
    }
    fetchQuestions()
  }, [])

  // Generate positions and behaviors for each question
  const badgeConfigs = questions.map((text, i) => ({
    text,
    behavior: (['flee', 'follow', 'rotate'] as const)[i % 3],
    size: (['sm', 'md', 'lg'] as const)[i % 3],
    x: 50 + (i % 4) * 300 + Math.random() * 150,
    y: 150 + Math.floor(i / 4) * 300 + Math.random() * 100,
    delay: i * 0.15
  }))

  if (questions.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {badgeConfigs.map((badge) => (
        <FloatingQuestionBadge
          key={badge.text + badge.delay}
          question={badge.text}
          initialX={badge.x}
          initialY={badge.y}
          behavior={badge.behavior}
          size={badge.size}
          delay={badge.delay}
        />
      ))}
    </div>
  )
}

// Parallax element that moves with mouse
function MouseParallaxElement({ 
  children, 
  factor = 0.05, 
  className = "" 
}: { 
  children: React.ReactNode
  factor?: number
  className?: string 
}) {
  const { mouseX, mouseY } = useMousePosition()
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  
  const x = useSpring(useTransform(mouseX, (v) => (v - centerX) * factor), { damping: 20, stiffness: 100 })
  const y = useSpring(useTransform(mouseY, (v) => (v - centerY) * factor), { damping: 20, stiffness: 100 })
  
  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  )
}

// 3D Card Component with mouse tracking
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  )
}

// Floating 3D Shape
function FloatingShape({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        rotateX: [0, 360],
        rotateY: [0, 360],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    />
  )
}

// 3D Rotating Cube
function RotatingCube() {
  return (
    <div className="relative w-32 h-32" style={{ perspective: 1000 }}>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Cube faces */}
        <div className="absolute w-32 h-32 bg-gradient-to-br from-[#09637E]/80 to-[#088395]/80 rounded-2xl" style={{ transform: 'translateZ(64px)' }} />
        <div className="absolute w-32 h-32 bg-gradient-to-br from-[#088395]/80 to-[#7AB2B2]/80 rounded-2xl" style={{ transform: 'rotateY(180deg) translateZ(64px)' }} />
        <div className="absolute w-32 h-32 bg-gradient-to-br from-[#7AB2B2]/80 to-[#088395]/80 rounded-2xl" style={{ transform: 'rotateY(-90deg) translateZ(64px)' }} />
        <div className="absolute w-32 h-32 bg-gradient-to-br from-[#7AB2B2]/80 to-[#09637E]/80 rounded-2xl" style={{ transform: 'rotateY(90deg) translateZ(64px)' }} />
        <div className="absolute w-32 h-32 bg-gradient-to-br from-[#088395]/80 to-[#088395]/80 rounded-2xl" style={{ transform: 'rotateX(90deg) translateZ(64px)' }} />
        <div className="absolute w-32 h-32 bg-gradient-to-br from-[#7AB2B2]/80 to-[#09637E]/80 rounded-2xl" style={{ transform: 'rotateX(-90deg) translateZ(64px)' }} />
      </motion.div>
    </div>
  )
}

// 3D Sphere with gradient
function FloatingSphere({ size = 120, color = "from-[#09637E] to-[#088395]", delay = 0 }: { size?: number; color?: string; delay?: number }) {
  return (
    <motion.div
      className={`rounded-full bg-gradient-to-br ${color} shadow-2xl`}
      style={{ 
        width: size, 
        height: size,
        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)`,
      }}
      animate={{
        y: [0, -30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// Pyramid shape
function FloatingPyramid({ className }: { className: string }) {
  return (
    <motion.div
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{
        rotateY: [0, 360],
        y: [0, -15, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-[#09637E]/60"
        style={{
          filter: 'drop-shadow(0 10px 20px rgba(9, 99, 126, 0.3))'
        }}
      />
    </motion.div>
  )
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [trendingQuestions, setTrendingQuestions] = useState<Question[]>([])
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'voted' | 'not-voted'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Real stats from database
  const [stats, setStats] = useState({ questions: 0, votes: 0, users: 0, countries: 0 })

  // User stats for dashboard
  const [userStats, setUserStats] = useState({ questionsCount: 0, votesCount: 0, totalVotesReceived: 0 })
  const [userStatsLoading, setUserStatsLoading] = useState(false)

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false)

  // Pull to refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Language state
  const [lang, setLang] = useState<Language>('en')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const t = translations[lang]
  const isRTL = getLanguageDirection(lang) === 'rtl'

  // Categories
  const categories = [
    { value: 'all', label: t.allCategories },
    { value: 'entertainment', label: t.entertainment },
    { value: 'politics', label: t.politics },
    { value: 'technology', label: t.technology },
    { value: 'sports', label: t.sports },
    { value: 'lifestyle', label: t.lifestyle },
    { value: 'food', label: t.food },
    { value: 'science', label: t.science },
    { value: 'other', label: t.other },
  ]

  // Share function
  const shareQuestion = async (question: Question) => {
    const shareUrl = `${window.location.origin}?q=${question.id}`
    const shareText = `${question.text} - Vote now on Yors!`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Yors Poll',
          text: shareText,
          url: shareUrl
        })
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: t.copied, description: t.copyLink })
    }
  }

  // Toggle language dropdown
  const selectLanguage = (languageCode: Language) => {
    setLang(languageCode)
    setShowLangDropdown(false)
  }

  // Get current language info
  const currentLang = languages.find(l => l.code === lang)

  const { toast } = useToast()

  // Scroll progress for parallax
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  // View state: 'landing' | 'auth' | 'dashboard' | 'owner-dashboard' | 'profile'
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'owner-dashboard' | 'profile'>('landing')

  // Auth state
  const [user, setUser] = useState<UserData | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' })
  const [authSubmitting, setAuthSubmitting] = useState(false)

  // Check auth on mount
  useEffect(() => {
    checkAuth()
    
    // Check for payment success
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') {
      toast({
        title: '🎉 Payment Successful!',
        description: 'Welcome to Premium! Your account has been upgraded.',
      })
      // Clean up URL
      window.history.replaceState({}, '', '/')
    }
    if (params.get('upgraded') === 'true') {
      toast({
        title: '🎉 Upgraded!',
        description: 'Welcome to Premium!',
      })
      window.history.replaceState({}, '', '/')
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowLangDropdown(false)
    if (showLangDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showLangDropdown])

  // Fetch trending questions for landing page
  const fetchTrendingQuestions = useCallback(async () => {
    setTrendingLoading(true)
    try {
      const response = await fetch('/api/questions?trending=true')
      const data = await response.json()
      setTrendingQuestions(data.questions || [])
    } catch (error) {
      console.error('Failed to fetch trending questions:', error)
    } finally {
      setTrendingLoading(false)
    }
  }, [])

  // Fetch real stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats({
        questions: data.questions || 0,
        votes: data.votes || 0,
        users: data.users || 0,
        countries: data.countries || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }, [])

  useEffect(() => {
    if (view === 'landing') {
      fetchTrendingQuestions()
      fetchStats()
    }
  }, [fetchTrendingQuestions, fetchStats, view])

  const checkAuth = async () => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const userData = JSON.parse(stored)
        setUser(userData)
        setView('dashboard')
      }
    } catch {
      // Not logged in
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthSubmitting(true)

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email, password: authForm.password })
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Login failed')
        }

        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setView('dashboard')
        toast({ title: 'Welcome back!', description: `Logged in as ${data.user.name}` })
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authForm)
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setView('dashboard')
        toast({ title: 'Account created!', description: `Welcome, ${data.user.name}!` })
      }

      setAuthForm({ email: '', password: '', name: '' })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive'
      })
    } finally {
      setAuthSubmitting(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setView('landing')
    toast({ title: 'Logged out', description: 'See you next time!' })
  }

  const handleUpgradePremium = async (plan: string = 'monthly') => {
    if (!user) return
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          email: user.email, 
          name: user.name,
          plan 
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Handle demo mode (redirectUrl) vs Stripe mode (url)
        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url
        } else if (data.redirectUrl || data.demoMode) {
          // Demo mode - upgrade was instant, refresh the page
          toast({
            title: '🎉 Upgraded to Premium!',
            description: 'Welcome to Premium! Your account has been upgraded.',
          })
          // Update user state
          setUser({ ...user, isPremium: true, role: 'premium' })
          localStorage.setItem('user', JSON.stringify({ ...user, isPremium: true, role: 'premium' }))
        } else {
          throw new Error('Unexpected response from server')
        }
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout',
        variant: 'destructive'
      })
    }
  }

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await fetch(`/api/questions?voterId=${user.id}`)
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Failed to fetch questions:', error)
      toast({
        title: 'Error',
        description: 'Failed to load questions',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [user?.id, toast])

  useEffect(() => {
    if (view === 'dashboard' && user) {
      fetchQuestions()
    }
  }, [fetchQuestions, view, user])

  const handleCreateQuestion = async (data: {
    text: string
    questionType: 'yesNo' | 'multiple'
    yesLabel: string
    noLabel: string
    options?: { text: string; color: string }[]
    status: 'active' | 'scheduled' | 'draft'
    startDate?: string
    endDate?: string
  }) => {
    if (!user) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: data.text.trim(), 
          userId: user.id,
          questionType: data.questionType,
          yesLabel: data.yesLabel,
          noLabel: data.noLabel,
          options: data.options,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate
        }),
      })

      if (response.ok) {
        await fetchQuestions()
        toast({
          title: 'Success!',
          description: data.status === 'scheduled' 
            ? 'Your question has been scheduled' 
            : 'Your question has been published',
        })
      } else {
        const error = await response.json()
        if (error.requiresPremium) {
          toast({
            title: 'Premium Required',
            description: 'Upgrade to Premium to create multiple choice questions!',
            variant: 'destructive'
          })
        } else {
          throw new Error(error.error || 'Failed to create question')
        }
      }
    } catch (error) {
      console.error('Failed to create question:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create question',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (questionId: string, answer: boolean | string, question?: Question) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to vote',
        variant: 'destructive'
      })
      return
    }

    // Store previous state for rollback on error
    const previousQuestions = [...questions]

    // Handle multiple choice vs yes/no
    const isMultipleChoice = question?.questionType === 'multiple'
    const optionId = typeof answer === 'string' ? answer : null
    const boolAnswer = typeof answer === 'boolean' ? answer : false

    // OPTIMISTIC UPDATE: Immediately update UI
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        if (isMultipleChoice && q.options && optionId) {
          // Multiple choice update
          const newOptions = q.options.map(opt => 
            opt.id === optionId 
              ? { ...opt, voteCount: opt.voteCount + 1 }
              : opt
          )
          return {
            ...q,
            options: newOptions,
            totalVotes: (q.totalVotes || 0) + 1,
            hasVoted: true,
            userVoteOptionId: optionId
          }
        } else {
          // Yes/No update
          const newYesCount = boolAnswer ? q.yesCount + 1 : q.yesCount
          const newNoCount = boolAnswer ? q.noCount : q.noCount + 1
          return {
            ...q,
            yesCount: newYesCount,
            noCount: newNoCount,
            hasVoted: true,
            userVote: boolAnswer
          }
        }
      }
      return q
    }))

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId, 
          answer: isMultipleChoice ? undefined : boolAnswer,
          optionId: isMultipleChoice ? optionId : undefined,
          userId: user.id 
        }),
      })

      if (response.ok) {
        let voteText = ''
        if (isMultipleChoice && question?.options) {
          const votedOption = question.options.find(o => o.id === optionId)
          voteText = votedOption?.text || 'an option'
        } else {
          voteText = boolAnswer ? question?.yesLabel : question?.noLabel
        }
        toast({
          title: 'Vote recorded!',
          description: `You voted "${voteText}"`,
        })
      } else {
        // ROLLBACK on error
        setQuestions(previousQuestions)
        const error = await response.json()
        throw new Error(error.error || 'Failed to vote')
      }
    } catch (error) {
      // ROLLBACK on error
      setQuestions(previousQuestions)
      console.error('Failed to vote:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record your vote',
        variant: 'destructive',
      })
    }
  }

  // Multiple choice voting
  const handleMultipleVote = async (questionId: string, optionId: string, question?: Question) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to vote',
        variant: 'destructive'
      })
      return
    }

    // Store previous state for rollback on error
    const previousQuestions = [...questions]

    // OPTIMISTIC UPDATE: Immediately update UI
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: q.options.map(opt => 
            opt.id === optionId 
              ? { ...opt, voteCount: opt.voteCount + 1 }
              : opt
          ),
          totalVotes: (q.totalVotes || 0) + 1,
          hasVoted: true,
          userVoteOptionId: optionId
        }
      }
      return q
    }))

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, optionId, userId: user.id }),
      })

      if (response.ok) {
        const option = question?.options?.find(o => o.id === optionId)
        toast({
          title: 'Vote recorded!',
          description: `You voted "${option?.text}"`,
        })
      } else {
        // ROLLBACK on error
        setQuestions(previousQuestions)
        const error = await response.json()
        throw new Error(error.error || 'Failed to vote')
      }
    } catch (error) {
      // ROLLBACK on error
      setQuestions(previousQuestions)
      console.error('Failed to vote:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record your vote',
        variant: 'destructive',
      })
    }
  }

  const getTotalVotes = (question: Question) => {
    if (question.questionType === 'multiple' && question.options) {
      return question.options.reduce((sum, opt) => sum + opt.voteCount, 0)
    }
    return question.yesCount + question.noCount
  }

  const getYesPercentage = (question: Question) => {
    const total = getTotalVotes(question)
    if (total === 0) return 50
    return Math.round((question.yesCount / total) * 100)
  }

  const getOptionPercentage = (voteCount: number, totalVotes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((voteCount / totalVotes) * 100)
  }

  // Filter questions based on search, filter, and category
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'voted' 
        ? q.hasVoted 
        : !q.hasVoted
    const matchesCategory = categoryFilter === 'all' 
      ? true 
      : (q as Question & { category?: string }).category === categoryFilter
    return matchesSearch && matchesFilter && matchesCategory
  })

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#09637E] to-[#088395]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Vote className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    )
  }

  // ============ LANDING PAGE ============
  if (view === 'landing') {
    return (
      <div ref={containerRef} className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 overflow-x-hidden" style={{ perspective: '1000px' }}>
        {/* Mouse-reactive effects */}
        <MouseSpotlight />
        <CursorGlow />
        <FloatingParticles />
        <FloatingQuestionBadges />
        
        {/* 3D Floating Objects Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Large gradient spheres with mouse parallax */}
          <MouseParallaxElement factor={0.03} className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-[#09637E]/20 to-[#088395]/20 blur-3xl" />
          <MouseParallaxElement factor={-0.02} className="absolute top-1/3 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#088395]/20 to-[#7AB2B2]/20 blur-3xl" />
          <MouseParallaxElement factor={0.04} className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#7AB2B2]/15 to-[#09637E]/15 blur-3xl" />
          
          {/* 3D Rotating Cube - top right */}
          <motion.div 
            className="absolute top-32 right-[15%] hidden lg:block"
            style={{ y: y1, rotate: rotate1 }}
          >
            <RotatingCube />
          </motion.div>

          {/* Floating Spheres with mouse parallax */}
          <MouseParallaxElement factor={-0.05} className="absolute top-40 left-[20%] hidden md:block">
            <FloatingSphere size={60} color="from-[#088395]/40 to-[#088395]/40" delay={0} />
          </MouseParallaxElement>
          <MouseParallaxElement factor={0.04} className="absolute top-[60%] right-[10%] hidden md:block">
            <FloatingSphere size={80} color="from-[#7AB2B2]/40 to-[#7AB2B2]/40" delay={1} />
          </MouseParallaxElement>
          <MouseParallaxElement factor={-0.03} className="absolute bottom-32 left-[15%] hidden md:block">
            <FloatingSphere size={50} color="from-[#7AB2B2]/40 to-[#09637E]/40" delay={2} />
          </MouseParallaxElement>

          {/* 3D Card shapes */}
          <motion.div
            className="absolute top-1/2 left-5 w-20 h-28 bg-gradient-to-br from-[#09637E]/30 to-[#088395]/30 rounded-xl shadow-2xl hidden lg:block"
            style={{ 
              y: y2, 
              rotateY: 45, 
              rotateX: -15,
              transformStyle: 'preserve-3d'
            }}
            animate={{
              rotateY: [45, 55, 45],
              rotateX: [-15, -10, -15],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/3 right-8 w-16 h-24 bg-gradient-to-br from-[#7AB2B2]/30 to-[#088395]/30 rounded-xl shadow-2xl hidden lg:block"
            style={{ 
              y: y1, 
              rotateY: -30, 
              rotateX: 20,
              transformStyle: 'preserve-3d'
            }}
            animate={{
              rotateY: [-30, -40, -30],
              rotateX: [20, 25, 20],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Hero Section */}
        <header className="relative z-10">
          <nav className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="p-2 rounded-xl bg-gradient-to-br from-[#09637E]/20 to-[#088395]/20"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Vote className="h-7 w-7 text-[#09637E]" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Yors
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2"
              >
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                  {/* Language Selector Dropdown */}
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowLangDropdown(!showLangDropdown)
                      }}
                      className="gap-2 hover:bg-[#09637E]/10"
                    >
                      <Languages className="h-4 w-4" />
                      <span className="hidden sm:inline">{currentLang?.native}</span>
                    </Button>
                    
                    <AnimatePresence>
                      {showLangDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 top-full mt-2 bg-card border rounded-lg shadow-xl z-50 min-w-[180px] overflow-hidden max-h-[300px] overflow-y-auto"
                        >
                          {languages.map((language) => (
                            <button
                              key={language.code}
                              onClick={() => selectLanguage(language.code)}
                              className={`w-full px-4 py-2.5 text-left hover:bg-[#09637E]/10 flex items-center justify-between gap-2 ${
                                lang === language.code ? 'bg-[#09637E]/10 text-[#09637E] font-medium' : ''
                              }`}
                            >
                              <span>{language.native}</span>
                              <span className="text-xs text-muted-foreground">{language.english}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <ThemeToggle />
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setView('auth')}
                    className="gap-2 hover:bg-[#09637E]/10"
                  >
                    <User className="h-4 w-4" />
                    {t.signIn}
                  </Button>
                </div>

                {/* Mobile Menu */}
                <MobileMenu
                  lang={lang}
                  onLanguageChange={selectLanguage}
                  onLogout={handleLogout}
                  onUpgrade={handleUpgradePremium}
                  onSignIn={() => setView('auth')}
                  t={t}
                  showAuth={true}
                />
              </motion.div>
            </div>
          </nav>

          <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24 relative" dir={isRTL ? 'rtl' : 'ltr'}>
            <motion.div 
              className="max-w-4xl mx-auto text-center px-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ scale }}
            >
              <motion.div 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#09637E]/10 to-[#088395]/10 text-[#09637E] text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-[#09637E]/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                {t.badge}
              </motion.div>
              
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="block">{t.heroTitle1}</span>
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#09637E] via-[#088395] to-[#7AB2B2] bg-clip-text text-transparent">
                  <TypewriterText texts={t.heroTitle2} />
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t.heroDescription}
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MagneticButton>
                  <Button 
                    size="lg" 
                    onClick={() => setView('auth')}
                    className="gap-2 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-[#09637E] to-[#088395] hover:from-[#065569] hover:to-[#088395] shadow-xl shadow-[#09637E]/25 transition-transform hover:scale-105 w-full sm:w-auto"
                  >
                    <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t.createQuestionFree}
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setView('auth')}
                    className="gap-2 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 transition-transform hover:scale-105 w-full sm:w-auto"
                  >
                    {t.startVoting}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* Trending Questions Section */}
        <section className="py-16 relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 text-sm font-medium mb-4 border border-orange-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className="h-4 w-4" />
                {t.hotRightNow}
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                {t.trendingQuestions}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t.trendingDescription}
              </p>
            </motion.div>

            {trendingLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse bg-muted/50">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                      <div className="h-10 bg-muted rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : trendingQuestions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Card className="border-dashed max-w-md mx-auto bg-gradient-to-br from-muted/50 to-muted/30">
                  <CardContent className="p-8 text-center">
                    <MessageCircleQuestion className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-muted-foreground">{t.noQuestions}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
                {trendingQuestions.map((question, index) => {
                  const totalVotes = getTotalVotes(question)
                  const yesPercent = getYesPercentage(question)
                  
                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 50, rotateX: -15 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      whileHover={{ 
                        y: -10, 
                        rotateX: 5, 
                        rotateY: 5,
                        scale: 1.02
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <Card className="h-full bg-gradient-to-br from-card to-card/95 border-2 border-transparent hover:border-orange-500/30 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all">
                        <CardContent className="p-5 relative">
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-lg" />
                          
                          {/* Vote count badge */}
                          <div className="flex items-center justify-between mb-3 relative">
                            <span className="text-xs font-bold text-orange-600 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 px-3 py-1 rounded-full">
                              #{index + 1} {t.trending}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {totalVotes} {t.votes}
                            </span>
                          </div>
                          
                          {/* Question text */}
                          <h3 className="text-base font-semibold mb-4 leading-snug line-clamp-2 relative">
                            {question.text}
                          </h3>
                          
                          {/* 3D Results Bar */}
                          <div className="space-y-2 relative">
                            <div className="flex items-center justify-between text-sm font-medium">
                              <span className="text-[#09637E] flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {question.yesLabel} {yesPercent}%
                              </span>
                              <span className="text-red-600 flex items-center gap-1">
                                {question.noLabel} {100 - yesPercent}%
                                <ThumbsDown className="h-3 w-3" />
                              </span>
                            </div>
                            
                            <div className="relative h-6 rounded-lg overflow-hidden bg-gradient-to-r from-red-500 to-red-600 shadow-inner" style={{ transform: 'translateZ(10px)' }}>
                              <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#09637E] to-[#088395]"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${yesPercent}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                            </div>
                            
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{question.yesCount} {question.yesLabel}</span>
                              <span>{question.noCount} {question.noLabel}</span>
                            </div>
                          </div>

                          {/* CTA */}
                          <Button 
                            onClick={() => setView('auth')}
                            className="w-full mt-4 bg-gradient-to-r from-[#09637E] to-[#088395] hover:from-[#065569] hover:to-[#088395] shadow-lg shadow-[#09637E]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            size="sm"
                          >
                            {t.voteNow}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Features Section with 3D Cards */}
        <section className="py-20 relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.whyYors}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t.whyYorsDescription}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
              {[
                {
                  icon: Zap,
                  title: t.instantSetup,
                  description: t.instantSetupDesc,
                  color: 'from-[#09637E] to-[#088395]'
                },
                {
                  icon: BarChart3,
                  title: t.realtimeResults,
                  description: t.realtimeResultsDesc,
                  color: 'from-[#088395] to-[#7AB2B2]'
                },
                {
                  icon: CheckCircle2,
                  title: t.simpleClear,
                  description: t.simpleClearDesc,
                  color: 'from-[#7AB2B2] to-[#09637E]'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -15, 
                    rotateX: 10, 
                    rotateY: 10,
                    scale: 1.02
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Card className="h-full bg-gradient-to-br from-card to-card/95 border-2 border-transparent hover:border-primary/20 shadow-xl hover:shadow-2xl transition-all overflow-hidden">
                    <CardContent className="p-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                      <motion.div 
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                        style={{ transform: 'translateZ(20px)' }}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <feature.icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2 relative" style={{ transform: 'translateZ(15px)' }}>{feature.title}</h3>
                      <p className="text-muted-foreground relative" style={{ transform: 'translateZ(10px)' }}>{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 relative z-10 bg-gradient-to-b from-muted/30 to-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.howItWorks}</h2>
              <p className="text-muted-foreground text-lg">{t.howItWorksDesc}</p>
            </motion.div>

            <div className="max-w-5xl mx-auto" style={{ perspective: '1000px' }}>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: '1', title: t.step1Title, desc: t.step1Desc, color: 'from-[#09637E] to-[#088395]' },
                  { step: '2', title: t.step2Title, desc: t.step2Desc, color: 'from-[#088395] to-[#7AB2B2]' },
                  { step: '3', title: t.step3Title, desc: t.step3Desc, color: 'from-[#7AB2B2] to-[#7AB2B2]' }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    className="text-center"
                    initial={{ opacity: 0, y: 50, rotateY: -30 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ y: -10, rotateY: 5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <motion.div 
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#09637E]/20`}
                      style={{ transform: 'translateZ(30px)' }}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2" style={{ transform: 'translateZ(20px)' }}>{item.title}</h3>
                    <p className="text-muted-foreground" style={{ transform: 'translateZ(10px)' }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative z-10 bg-gradient-to-b from-muted/30 to-transparent" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {stats.users > 0 ? t.joinUsers.replace('{count}', stats.users.toString()).replace('{s}', stats.users !== 1 ? 's' : '') : t.beFirst}
              </h2>
              <p className="text-muted-foreground text-lg">{t.growingCommunity}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: MessageCircleQuestion, value: stats.questions, suffix: '', label: t.questionsAsked },
                { icon: Users, value: stats.votes, suffix: '', label: t.votesCast },
                { icon: Globe, value: stats.countries, suffix: '', label: t.countries },
                { icon: CheckCircle2, value: stats.users, suffix: '', label: t.registeredUsers },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/10"
                >
                  <stat.icon className="h-8 w-8 text-[#09637E] mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-[#09637E] mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 sm:py-16 md:py-20 relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{t.choosePlan}</h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                {t.choosePlanDesc}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <PricingPlans 
                user={user}
              />
            </motion.div>

            {/* Ad Banner - Only shown to free users */}
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <AdBanner size="medium" />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative z-10" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ perspective: '1000px' }}
          >
            <div className="container mx-auto px-4 text-center">
              <motion.div
                className="relative inline-block"
                whileHover={{ rotateX: 5, rotateY: 5 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#09637E] to-[#088395] rounded-3xl blur-2xl opacity-50" />
                <Card className="relative bg-gradient-to-br from-[#09637E] to-[#088395] border-0 shadow-2xl shadow-[#09637E]/30 overflow-hidden">
                  <CardContent className="p-12 md:p-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t.readyToAsk}
                      </h2>
                      <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        {t.ctaDescription}
                      </p>
                      <MagneticButton>
                        <Button 
                          size="lg" 
                          onClick={() => setView('auth')}
                          className="gap-2 text-lg px-10 py-7 bg-white text-[#09637E] hover:bg-white/90 shadow-xl transition-transform hover:scale-105"
                        >
                          <MessageCircleQuestion className="h-5 w-5" />
                          {t.getStartedItsFree}
                        </Button>
                      </MagneticButton>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ */}
        <FAQ />

        {/* Newsletter */}
        <Newsletter />

        {/* Footer */}
        <Footer />

        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    )
  }

  // ============ AUTH PAGE ============
  if (view === 'auth') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20" style={{ perspective: '1000px' }}>
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setView('landing')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <motion.div 
                  className="p-2 rounded-xl bg-gradient-to-br from-[#09637E]/20 to-[#088395]/20"
                  whileHover={{ rotate: 10 }}
                >
                  <Vote className="h-6 w-6 text-[#09637E]" />
                </motion.div>
                <span className="text-xl font-bold">Yors</span>
              </button>
              <Button variant="ghost" onClick={() => setView('landing')}>
                ← Back to Home
              </Button>
            </div>
          </div>
        </header>

        {/* Auth Form */}
        <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
          {/* Floating 3D shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FloatingSphere size={100} color="from-[#088395]/20 to-[#088395]/20" delay={0} className="absolute top-20 left-20" />
            <FloatingSphere size={80} color="from-[#7AB2B2]/20 to-[#7AB2B2]/20" delay={1} className="absolute bottom-20 right-20" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              whileHover={{ rotateX: 2, rotateY: 2 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card className="border-2 shadow-2xl bg-gradient-to-br from-card to-card/95 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#09637E]/5 to-[#088395]/5" />
                <CardHeader className="text-center pb-2 relative">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#09637E]/30"
                    style={{ transform: 'translateZ(30px)' }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <User className="h-8 w-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl" style={{ transform: 'translateZ(20px)' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </CardTitle>
                  <CardDescription style={{ transform: 'translateZ(15px)' }}>
                    {isLogin ? 'Sign in to continue voting' : 'Join Yors today'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 relative">
                  <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ transform: 'translateZ(10px)' }}
                      >
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your name"
                          value={authForm.name}
                          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          required={!isLogin}
                          className="h-11"
                        />
                      </motion.div>
                    )}
                    <div className="space-y-2" style={{ transform: 'translateZ(10px)' }}>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2" style={{ transform: 'translateZ(10px)' }}>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-[#09637E] to-[#088395] hover:from-[#065569] hover:to-[#088395] shadow-lg shadow-[#09637E]/20" 
                        disabled={authSubmitting}
                      >
                        {authSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                      </Button>
                    </motion.div>
                  </form>
                  <div className="mt-6 text-center text-sm text-muted-foreground" style={{ transform: 'translateZ(10px)' }}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-[#09637E] font-medium hover:underline"
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    )
  }

  // ============ OWNER DASHBOARD ============
  // Allow access if user is owner OR if user name/email matches owner criteria
  const isOwnerUser = user?.role === 'owner' || user?.name === 'BehradBtem' || user?.email === 'behradbtem@gmail.com'
  if (view === 'owner-dashboard' && user && isOwnerUser) {
    return <OwnerDashboard userId={user.id} onBack={() => setView('dashboard')} />
  }

  // ============ PROFILE VIEW ============
  if (view === 'profile' && user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setView('dashboard')} className="gap-2">
                ← Back to Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold mb-6">Profile & Settings</h1>
            <UserProfile 
              user={user}
              stats={userStats}
              onUpdate={(updates) => {
                const updatedUser = { ...user, ...updates }
                setUser(updatedUser)
                localStorage.setItem('user', JSON.stringify(updatedUser))
              }}
              onLogout={handleLogout}
            />
          </motion.div>
        </main>
      </div>
    )
  }

  // ============ DASHBOARD ============
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 rounded-xl bg-gradient-to-br from-[#09637E]/20 to-[#088395]/20"
                whileHover={{ rotate: 10 }}
              >
                <Vote className="h-6 w-6 text-[#09637E]" />
              </motion.div>
              <h1 className="text-xl md:text-2xl font-bold">Yors</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-3">
                {/* Language Selector */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowLangDropdown(!showLangDropdown)
                    }}
                    className="gap-1.5 hover:bg-[#09637E]/10"
                  >
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">{currentLang?.native}</span>
                  </Button>
                  
                  <AnimatePresence>
                    {showLangDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 bg-card border rounded-lg shadow-xl z-50 min-w-[150px] overflow-hidden max-h-[250px] overflow-y-auto"
                      >
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => selectLanguage(language.code)}
                            className={`w-full px-3 py-2 text-left hover:bg-[#09637E]/10 flex items-center justify-between gap-2 text-sm ${
                              lang === language.code ? 'bg-[#09637E]/10 text-[#09637E] font-medium' : ''
                            }`}
                          >
                            <span>{language.native}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <ThemeToggle />
                
                {/* Owner Dashboard Button */}
                {(user?.role === 'owner' || user?.name === 'BehradBtem' || user?.email === 'behradbtem@gmail.com') && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => setView('owner-dashboard')}
                    className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    <Crown className="h-4 w-4" />
                    <span className="hidden sm:inline">Owner Dashboard</span>
                  </Button>
                )}
                
                {/* Premium badge or upgrade button */}
                {user?.isPremium ? (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 text-sm font-medium border border-amber-500/30">
                    <Crown className="h-4 w-4" />
                    Premium
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpgradePremium()}
                    className="gap-1.5 border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
                  >
                    <Crown className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.upgrade}</span>
                  </Button>
                )}
                
                {/* Notifications */}
                {user && <NotificationBell userId={user.id} />}
                
                {/* User Menu */}
                <button
                  onClick={() => setView('profile')}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{user?.name}</span>
                </button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.logout}</span>
                </Button>
              </div>

              {/* Mobile Menu */}
              <MobileMenu
                user={user}
                lang={lang}
                onLanguageChange={selectLanguage}
                onLogout={handleLogout}
                onUpgrade={handleUpgradePremium}
                onSignIn={() => {}}
                t={t}
                showAuth={false}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {/* Create Question Form */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5 }}
          style={{ perspective: '1000px' }}
          className="flex justify-center"
        >
          <CreateQuestionDialog onSubmit={handleCreateQuestion} submitting={submitting} isPremium={user?.isPremium} />
        </motion.div>

        {/* Questions List */}
        <div className="space-y-4" style={{ perspective: '1000px' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircleQuestion className="h-5 w-5 text-[#09637E]" />
              All Questions
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-48"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              {/* Filter Tabs */}
              <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
                {(['all', 'not-voted', 'voted'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      filter === f
                        ? 'bg-[#09637E] text-white'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'voted' ? 'Voted' : 'To Vote'}
                  </button>
                ))}
              </div>
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs bg-muted/50 border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#09637E]"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {filteredQuestions.length} of {questions.length} question{questions.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <MessageCircleQuestion className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-muted-foreground mb-2">
                  {searchQuery ? 'No matching questions' : filter === 'voted' ? 'No voted questions' : filter === 'not-voted' ? 'All caught up!' : 'No questions yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try a different search term' : filter !== 'all' ? 'Try a different filter' : 'Be the first to create a question above!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredQuestions.map((question, index) => {
                const totalVotes = getTotalVotes(question)
                
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all border-2 border-transparent hover:border-[#09637E]/20">
                      <CardContent className="p-4 md:p-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#09637E]/3 to-[#088395]/3 pointer-events-none" />
                        
                        {/* Premium badge for multiple choice questions */}
                        {question.questionType === 'multiple' && (
                          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 text-xs font-medium">
                            <Crown className="h-3 w-3" />
                            Premium
                          </div>
                        )}
                        
                        <h3 className="text-lg md:text-xl font-medium mb-2 leading-relaxed relative pr-16">
                          {question.text}
                        </h3>
                        
                        {question.author && (
                          <p className="text-sm text-muted-foreground mb-4 relative flex items-center gap-2">
                            Asked by <span className="font-medium text-foreground flex items-center gap-1">
                              {question.author.name}
                              {question.author.isPremium && <Crown className="h-3 w-3 text-amber-500" />}
                            </span>
                          </p>
                        )}

                        {/* MULTIPLE CHOICE QUESTIONS */}
                        {question.questionType === 'multiple' && question.options && (
                          !question.hasVoted ? (
                            <div className="grid grid-cols-2 gap-2 relative">
                              {question.options.map((option) => (
                                <Button
                                  key={option.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleMultipleVote(question.id, option.id, question);
                                  }}
                                  className="h-14 text-white font-medium shadow-lg transition-transform active:scale-95 hover:scale-[1.02]"
                                  style={{ backgroundColor: option.color }}
                                >
                                  {option.text}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2 relative">
                              <div className="flex items-center gap-2 text-sm mb-3">
                                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-700 dark:text-amber-300 font-medium">
                                  ✓ You voted "{question.options.find(o => o.id === question.userVoteOptionId)?.text}"
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{totalVotes} total votes</span>
                              </div>
                              
                              {question.options.map((option) => {
                                const percentage = getOptionPercentage(option.voteCount, totalVotes)
                                const isUserVote = option.id === question.userVoteOptionId
                                
                                return (
                                  <div key={option.id} className="relative">
                                    <div className="flex items-center justify-between mb-1 text-sm">
                                      <span className="flex items-center gap-2 font-medium">
                                        {isUserVote && <CheckCircle2 className="h-4 w-4 text-amber-500" />}
                                        {option.text}
                                      </span>
                                      <span className="font-medium">{percentage}%</span>
                                    </div>
                                    <div className="relative h-6 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-inner">
                                      <motion.div
                                        className="absolute inset-y-0 left-0 flex items-center justify-end px-2"
                                        style={{ backgroundColor: option.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.8 }}
                                      >
                                        {percentage > 10 && (
                                          <span className="text-white text-xs font-bold">{option.voteCount}</span>
                                        )}
                                      </motion.div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        )}

                        {/* YES/NO QUESTIONS */}
                        {question.questionType === 'yesNo' && (
                          !question.hasVoted ? (
                            <div className="flex flex-col sm:flex-row gap-3 relative">
                              <Button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleVote(question.id, true, question);
                                }}
                                className="flex-1 gap-2 h-12 bg-gradient-to-r from-[#09637E] to-[#088395] hover:from-[#065569] hover:to-[#088395] text-white text-base shadow-lg shadow-[#09637E]/20 transition-transform active:scale-95 hover:scale-[1.02]"
                              >
                                <ThumbsUp className="h-5 w-5" />
                                {question.yesLabel}
                              </Button>
                              <Button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleVote(question.id, false, question);
                                }}
                                className="flex-1 gap-2 h-12 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white text-base shadow-lg shadow-red-500/20 transition-transform active:scale-95 hover:scale-[1.02]"
                              >
                                <ThumbsDown className="h-5 w-5" />
                                {question.noLabel}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3 relative">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#EBF4F6] to-[#7AB2B2] dark:from-[#09637E]/40 dark:to-[#088395]/40 text-[#09637E] dark:text-[#7AB2B2] font-medium">
                                  ✓ You voted "{question.userVote ? question.yesLabel : question.noLabel}"
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{totalVotes} total votes</span>
                              </div>

                              <div className="relative">
                                <div className="flex items-center justify-between mb-2 text-sm font-medium">
                                  <span className="text-[#09637E] flex items-center gap-1">
                                    <ThumbsUp className="h-4 w-4" />
                                    {question.yesLabel} {getYesPercentage(question)}%
                                  </span>
                                  <span className="text-red-600 flex items-center gap-1">
                                    {question.noLabel} {100 - getYesPercentage(question)}%
                                    <ThumbsDown className="h-4 w-4" />
                                  </span>
                                </div>
                                
                                <div className="relative h-10 rounded-lg overflow-hidden bg-gradient-to-r from-red-500 to-red-600 shadow-inner">
                                  <motion.div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#09637E] to-[#088395] flex items-center justify-start px-4"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getYesPercentage(question)}%` }}
                                    transition={{ duration: 0.8 }}
                                  >
                                    {getYesPercentage(question) > 15 && (
                                      <span className="text-white font-bold">{question.yesCount}</span>
                                    )}
                                  </motion.div>
                                  {getYesPercentage(question) < 85 && (
                                    <div 
                                      className="absolute inset-y-0 right-0 flex items-center justify-end px-4" 
                                      style={{ width: `${100 - getYesPercentage(question)}%` }}
                                    >
                                      <span className="text-white font-bold">{question.noCount}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}

                        <div className="flex items-center justify-between mt-4 relative">
                          <p className="text-xs text-muted-foreground">
                            {new Date(question.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', day: 'numeric', year: 'numeric' 
                            })} at {new Date(question.createdAt).toLocaleTimeString('en-US', { 
                              hour: 'numeric', minute: '2-digit' 
                            })}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              shareQuestion(question)
                            }}
                            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            <span className="text-xs">{t.share}</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
        
        {/* Bottom padding for mobile nav */}
        <div className="h-20 md:hidden" />
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav 
        user={user}
        onLogout={handleLogout}
        onUpgrade={handleUpgradePremium}
        t={t}
      />

      {/* Footer - Desktop only */}
      <footer className="hidden md:block border-t mt-auto py-4 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Yors — Simple Yes/No polling for everyone</p>
        </div>
      </footer>
    </div>
  )
}
