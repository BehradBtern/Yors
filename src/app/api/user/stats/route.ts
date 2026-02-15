import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get questions count
    const questionsCount = await db.question.count({
      where: { authorId: userId }
    })

    // Get votes count
    const votesCount = await db.vote.count({
      where: { voterId: userId }
    })

    // Get total votes received on user's questions
    const userQuestions = await db.question.findMany({
      where: { authorId: userId },
      select: { yesCount: true, noCount: true }
    })

    const totalVotesReceived = userQuestions.reduce((sum, q) => sum + q.yesCount + q.noCount, 0)

    // Get Option votes for multiple choice questions
    const optionVotes = await db.option.findMany({
      where: {
        question: { authorId: userId }
      },
      select: { voteCount: true }
    })

    const totalOptionVotes = optionVotes.reduce((sum, o) => sum + o.voteCount, 0)

    return NextResponse.json({
      questionsCount,
      votesCount,
      totalVotesReceived: totalVotesReceived + totalOptionVotes,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
  }
}