'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Menu, X, Vote, User, LogOut, Crown, Languages, Sun, Moon, Monitor,
  PlusCircle, Home, MessageCircleQuestion, Settings
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { languages, Language, getLanguageDirection } from '@/lib/translations'

interface MobileMenuProps {
  user?: { name: string; isPremium?: boolean } | null
  lang: Language
  onLanguageChange: (lang: Language) => void
  onLogout: () => void
  onUpgrade: () => void
  onSignIn: () => void
  t: Record<string, unknown>
  showAuth?: boolean
}

export function MobileMenu({ 
  user, 
  lang, 
  onLanguageChange, 
  onLogout, 
  onUpgrade, 
  onSignIn,
  t,
  showAuth = true
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const isRTL = getLanguageDirection(lang) === 'rtl'

  return (
    <>
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden hover:bg-[#09637E]/10"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: isRTL ? 300 : -300 }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? 300 : -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-[280px] bg-card border-l shadow-2xl z-50 md:hidden flex flex-col`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#09637E]/20 to-[#088395]/20">
                  <Vote className="h-5 w-5 text-[#09637E]" />
                </div>
                <span className="font-bold text-lg">Yors</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#09637E] to-[#088395] flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    {user.isPremium && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2">
              {!showLangMenu ? (
                <>
                  {user ? (
                    <>
                      {!user.isPremium && (
                        <button
                          onClick={() => {
                            onUpgrade()
                            setIsOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-amber-600"
                        >
                          <Crown className="h-5 w-5" />
                          <span>{t.upgrade as string}</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onLogout()
                          setIsOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-destructive"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>{t.logout as string}</span>
                      </button>
                    </>
                  ) : showAuth && (
                    <button
                      onClick={() => {
                        onSignIn()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>{t.signIn as string}</span>
                    </button>
                  )}

                  <div className="border-t my-2" />

                  {/* Theme Toggle */}
                  <button
                    onClick={() => {
                      cycleTheme()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    {theme === 'light' && <Sun className="h-5 w-5" />}
                    {theme === 'dark' && <Moon className="h-5 w-5" />}
                    {theme === 'system' && <Monitor className="h-5 w-5" />}
                    <span>
                      {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
                    </span>
                  </button>

                  {/* Language Selector */}
                  <button
                    onClick={() => setShowLangMenu(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <Languages className="h-5 w-5" />
                    <span>{languages.find(l => l.code === lang)?.native}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLangMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-muted-foreground"
                  >
                    <X className="h-5 w-5" />
                    <span>Back</span>
                  </button>
                  <div className="border-t" />
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        onLanguageChange(language.code)
                        setShowLangMenu(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors ${
                        lang === language.code ? 'bg-[#09637E]/10 text-[#09637E]' : ''
                      }`}
                    >
                      <span>{language.native}</span>
                      <span className="text-xs text-muted-foreground">{language.english}</span>
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t text-center text-xs text-muted-foreground">
              {t.madeWith as string}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
