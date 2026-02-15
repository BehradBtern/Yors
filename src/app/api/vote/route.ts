import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionId, answer, optionId, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to vote' }, { status: 401 })
    }

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 })
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Get the question
    const question = await db.question.findUnique({
      where: { id: questionId },
      include: { options: true }
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Check if already voted
    const existingVote = await db.vote.findUnique({
      where: {
        questionId_voterId: {
          questionId,
          voterId: userId
        }
      }
    })

    if (existingVote) {
      return NextResponse.json({ error: 'Already voted on this question' }, { status: 400 })
    }

    // Handle voting based on question type
    if (question.questionType === 'multiple') {
      // Multiple choice voting
      if (!optionId) {
        return NextResponse.json({ error: 'Option ID is required for multiple choice questions' }, { status: 400 })
      }

      const option = question.options.find(o => o.id === optionId)
      if (!option) {
        return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
      }

      // Create vote and update option count
      await db.$transaction([
        db.vote.create({
          data: {
            questionId,
            optionId,
            voterId: userId
          }
        }),
        db.option.update({
          where: { id: optionId },
          data: { voteCount: { increment: 1 } }
        })
      ])
    } else {
      // Yes/No voting
      if (typeof answer !== 'boolean') {
        return NextResponse.json({ error: 'Answer (boolean) is required for Yes/No questions' }, { status: 400 })
      }

      // Create vote and update counts
      await db.$transaction([
        db.vote.create({
          data: {
            questionId,
            answer,
            voterId: userId
          }
        }),
        db.question.update({
          where: { id: questionId },
          data: {
            yesCount: { increment: answer ? 1 : 0 },
            noCount: { increment: answer ? 0 : 1 }
          }
        })
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}