'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, PlusCircle, User, Crown, LogOut
} from 'lucide-react'

interface BottomNavProps {
  user?: { name: string; isPremium?: boolean } | null
  onLogout: () => void
  onUpgrade: () => void
  t: Record<string, unknown>
}

export function BottomNav({ user, onLogout, onUpgrade, t }: BottomNavProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Defer setState to avoid cascading renders
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-lg border-t safe-area-bottom"
    >
      <div className="flex items-center justify-around py-2 px-4">
        {/* Home */}
        <button className="flex flex-col items-center gap-1 p-2 text-[#09637E]">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Create Question - prominent */}
        <button 
          onClick={() => {
            const createBtn = document.querySelector('[data-create-question]') as HTMLButtonElement
            createBtn?.click()
          }}
          className="flex flex-col items-center gap-1 p-2 -mt-4"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#09637E] to-[#088395] flex items-center justify-center shadow-lg shadow-[#09637E]/30">
            <PlusCircle className="h-7 w-7 text-white" />
          </div>
          <span className="text-[10px] font-medium text-[#09637E]">Create</span>
        </button>

        {/* Profile / Upgrade / Logout */}
        {user?.isPremium ? (
          <button className="flex flex-col items-center gap-1 p-2 text-amber-600">
            <Crown className="h-5 w-5" />
            <span className="text-[10px] font-medium">Premium</span>
          </button>
        ) : (
          <button 
            onClick={onUpgrade}
            className="flex flex-col items-center gap-1 p-2 text-amber-600"
          >
            <Crown className="h-5 w-5" />
            <span className="text-[10px] font-medium">{t.upgrade as string}</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}
