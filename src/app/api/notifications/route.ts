import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's questions with recent votes
    const questions = await db.question.findMany({
      where: { authorId: userId },
      select: { id: true, text: true, yesCount: true, noCount: true }
    })

    const questionIds = questions.map(q => q.id)

    // Get recent votes on user's questions (last 7 days)
    const recentVotes = await db.vote.findMany({
      where: {
        questionId: { in: questionIds },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        question: { select: { text: true } },
        voter: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Get total votes on user's questions
    const totalVotesReceived = questions.reduce((sum, q) => sum + q.yesCount + q.noCount, 0)

    // Get votes this week
    const votesThisWeek = recentVotes.length

    // Create notifications from recent activity
    const notifications = recentVotes.slice(0, 10).map(vote => ({
      id: vote.id,
      type: 'vote',
      message: `${vote.voter.name} voted on "${vote.question.text.slice(0, 30)}${vote.question.text.length > 30 ? '...' : ''}"`,
      createdAt: vote.createdAt,
      read: false
    }))

    return NextResponse.json({
      notifications,
      stats: {
        totalVotesReceived,
        votesThisWeek,
        questionsCount: questions.length
      }
    })
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}