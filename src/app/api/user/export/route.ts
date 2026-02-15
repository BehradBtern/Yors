import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        role: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's questions
    const questions = await db.question.findMany({
      where: { authorId: userId },
      include: {
        options: true,
        votes: {
          select: {
            id: true,
            createdAt: true,
            answer: true,
          }
        }
      }
    })

    // Get user's votes
    const votes = await db.vote.findMany({
      where: { voterId: userId },
      select: {
        id: true,
        questionId: true,
        answer: true,
        createdAt: true,
      }
    })

    // Get user's comments
    const comments = await db.comment.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        text: true,
        questionId: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      user,
      statistics: {
        totalQuestions: questions.length,
        totalVotes: votes.length,
        totalComments: comments.length,
        totalVotesReceived: questions.reduce((sum, q) => sum + q.yesCount + q.noCount, 0)
      },
      data: {
        questions,
        votes,
        comments
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}