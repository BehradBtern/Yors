'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Crown, TrendingUp, Eye, Clock, DollarSign } from 'lucide-react'

interface SponsoredQuestionProps {
  question: {
    id: string
    text: string
    yesCount: number
    noCount: number
    sponsor?: {
      name: string
      logo?: string
    }
  }
  onVote: (questionId: string, answer: boolean) => void
  hasVoted: boolean
  t: Record<string, unknown>
}

export function SponsoredQuestion({ question, onVote, hasVoted, t }: SponsoredQuestionProps) {
  const totalVotes = question.yesCount + question.noCount
  const yesPercentage = totalVotes > 0 ? Math.round((question.yesCount / totalVotes) * 100) : 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 rounded-xl border-2 border-amber-500/30 p-4 md:p-6 overflow-hidden"
    >
      {/* Sponsored Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs font-medium">
        <TrendingUp className="h-3 w-3" />
        Sponsored
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Sponsor Info */}
      {question.sponsor && (
        <div className="flex items-center gap-2 mb-3">
          {question.sponsor.logo ? (
            <img src={question.sponsor.logo} alt={question.sponsor.name} className="w-6 h-6 rounded" />
          ) : (
            <div className="w-6 h-6 rounded bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {question.sponsor.name.charAt(0)}
            </div>
          )}
          <span className="text-xs text-muted-foreground">Promoted by {question.sponsor.name}</span>
        </div>
      )}

      {/* Question */}
      <h3 className="text-lg md:text-xl font-semibold mb-4 pr-24">{question.text}</h3>

      {!hasVoted ? (
        <div className="flex gap-3">
          <Button
            onClick={() => onVote(question.id, true)}
            className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            Yes
          </Button>
          <Button
            onClick={() => onVote(question.id, false)}
            className="flex-1 h-12 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
          >
            No
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative h-10 rounded-lg overflow-hidden bg-gradient-to-r from-red-500 to-rose-500">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
              initial={{ width: 0 }}
              animate={{ width: `${yesPercentage}%` }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-white text-sm font-bold">{yesPercentage}%</span>
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{question.yesCount} Yes</span>
            <span>{question.noCount} No</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>{Math.floor(totalVotes * 3.5)} views</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Active now</span>
        </div>
      </div>
    </motion.div>
  )
}

// Ad Banner Component
export function AdBanner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizes = {
    small: 'h-16',
    medium: 'h-24',
    large: 'h-32',
  }

  return (
    <div className={`${sizes[size]} bg-muted/30 rounded-lg border border-dashed flex items-center justify-center`}>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">Advertisement</p>
        <p className="text-sm font-medium text-muted-foreground/70">Your Ad Here</p>
      </div>
    </div>
  )
}

// Premium Feature Gate
export function PremiumGate({ feature, onUpgrade }: { feature: string; onUpgrade: () => void }) {
  return (
    <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30 p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
        <Crown className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {feature} is available for premium members only
      </p>
      <Button
        onClick={onUpgrade}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
      >
        <Crown className="h-4 w-4 mr-2" />
        Upgrade Now
      </Button>
    </div>
  )
}

// Promote Question Dialog
export function PromoteQuestionCTA({ onPromote, credits }: { onPromote: () => void; credits: number }) {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/30 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">Boost Your Question</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Get more visibility by promoting your question to the top
          </p>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={onPromote}>
              <DollarSign className="h-3 w-3 mr-1" />
              Promote for $2.99
            </Button>
            {credits > 0 && (
              <span className="text-xs text-muted-foreground">
                or use {credits} promo credits
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
