'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Sparkles, Vote, BarChart3, Crown, ArrowRight } from 'lucide-react'

interface WelcomeModalProps {
  onClose: () => void
}

const steps = [
  {
    icon: Vote,
    title: "Create Questions",
    description: "Ask Yes/No or multiple choice questions and share them with anyone.",
    color: "from-[#09637E] to-[#088395]"
  },
  {
    icon: BarChart3,
    title: "Watch Results",
    description: "See votes roll in real-time with beautiful visualizations.",
    color: "from-[#088395] to-[#7AB2B2]"
  },
  {
    icon: Crown,
    title: "Go Premium",
    description: "Unlock multiple choice questions and advanced analytics.",
    color: "from-amber-500 to-orange-500"
  }
]

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#09637E]/10 text-[#09637E] text-sm font-medium mb-4">
              <Sparkles className="h-3 w-3" />
              Welcome to Yors!
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${steps[currentStep].color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                {(() => {
                  const Icon = steps[currentStep].icon
                  return <Icon className="h-8 w-8 text-white" />
                })()}
              </div>
              <h3 className="text-xl font-bold mb-2">{steps[currentStep].title}</h3>
              <p className="text-muted-foreground">{steps[currentStep].description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 my-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-6 bg-[#09637E]' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-[#09637E] to-[#088395] gap-2"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook to manage welcome modal
export function useWelcomeModal() {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Use a small delay to avoid synchronous setState
    const timer = setTimeout(() => {
      const hasSeenWelcome = localStorage.getItem('yors-welcome-seen')
      if (!hasSeenWelcome) {
        setShowWelcome(true)
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const closeWelcome = () => {
    setShowWelcome(false)
    localStorage.setItem('yors-welcome-seen', 'true')
  }

  return { showWelcome, closeWelcome }
}
