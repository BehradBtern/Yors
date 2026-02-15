'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocityX: number
  velocityY: number
}

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (trigger) {
      const colors = ['#09637E', '#088395', '#7AB2B2', '#EBF4F6', '#f59e0b', '#10b981']
      const newPieces: ConfettiPiece[] = []

      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          velocityX: (Math.random() - 0.5) * 10,
          velocityY: Math.random() * 15 + 10,
        })
      }

      // Defer setState to avoid cascading renders
      const initTimer = setTimeout(() => setPieces(newPieces), 0)
      
      const clearTimer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 3000)

      return () => {
        clearTimeout(initTimer)
        clearTimeout(clearTimer)
      }
    }
  }, [trigger, onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ 
              x: piece.x, 
              y: piece.y, 
              rotate: 0,
              opacity: 1 
            }}
            animate={{ 
              x: piece.x + piece.velocityX * 20,
              y: window.innerHeight + 100,
              rotate: piece.rotation + 720,
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              position: 'absolute',
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              borderRadius: '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
