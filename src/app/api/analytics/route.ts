import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')
    const userId = searchParams.get('userId')

    if (!questionId && !userId) {
      return NextResponse.json({ error: 'Question ID or User ID required' }, { status: 400 })
    }

    // Question analytics
    if (questionId) {
      const question = await db.question.findUnique({
        where: { id: questionId },
        include: {
          options: true,
          votes: {
            select: {
              createdAt: true,
              answer: true,
              optionId: true
            }
          },
          author: { select: { name: true } }
        }
      })

      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 })
      }

      // Calculate analytics
      const totalVotes = question.yesCount + question.noCount
      const yesPercentage = totalVotes > 0 ? Math.round((question.yesCount / totalVotes) * 100) : 0
      
      // Votes per hour (last 24 hours)
      const now = new Date()
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      const recentVotes = question.votes.filter(v => new Date(v.createdAt) >= last24h)
      
      // Group by hour
      const votesPerHour: number[] = Array(24).fill(0)
      recentVotes.forEach(vote => {
        const hour = new Date(vote.createdAt).getHours()
        votesPerHour[hour]++
      })

      // Calculate engagement rate
      const engagementRate = totalVotes > 0 ? Math.min(100, Math.round((totalVotes / 10) * 100)) : 0

      return NextResponse.json({
        question: {
          id: question.id,
          text: question.text,
          type: question.questionType,
          author: question.author.name
        },
        analytics: {
          totalVotes,
          yesCount: question.yesCount,
          noCount: question.noCount,
          yesPercentage,
          votesLast24h: recentVotes.length,
          votesPerHour,
          engagementRate,
          options: question.options.map(opt => ({
            text: opt.text,
            votes: opt.voteCount,
            percentage: totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0
          }))
        }
      })
    }

    // User analytics
    if (userId) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          isPremium: true,
          createdAt: true
        }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Get user's questions
      const questions = await db.question.findMany({
        where: { authorId: userId },
        select: {
          id: true,
          yesCount: true,
          noCount: true,
          createdAt: true
        }
      })

      // Get user's votes
      const votes = await db.vote.findMany({
        where: { voterId: userId },
        select: {
          createdAt: true
        }
      })

      const totalVotesReceived = questions.reduce((sum, q) => sum + q.yesCount + q.noCount, 0)
      const totalVotesCast = votes.length

      // Activity streak
      const last7Days = Array(7).fill(0)
      const now = new Date()
      votes.forEach(vote => {
        const daysDiff = Math.floor((now.getTime() - new Date(vote.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff < 7) {
          last7Days[6 - daysDiff]++
        }
      })

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          isPremium: user.isPremium,
          memberSince: user.createdAt
        },
        analytics: {
          questionsCreated: questions.length,
          totalVotesReceived,
          totalVotesCast,
          activityLast7Days: last7Days,
          averageVotesPerQuestion: questions.length > 0 ? Math.round(totalVotesReceived / questions.length) : 0
        }
      })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}