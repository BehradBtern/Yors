import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// This endpoint should be called by a cron job or scheduler
// For demo purposes, it can be called manually

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()

    // Simple auth check (use a proper secret in production)
    if (secret !== process.env.CRON_SECRET && secret !== 'run-scheduled') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find scheduled questions that should be activated
    const now = new Date()
    
    const scheduledQuestions = await db.question.findMany({
      where: {
        status: 'scheduled',
        startDate: {
          lte: now
        }
      }
    })

    let activated = 0

    for (const question of scheduledQuestions) {
      await db.question.update({
        where: { id: question.id },
        data: { status: 'active' }
      })
      activated++
    }

    // Find active questions that should be ended
    const endedQuestions = await db.question.findMany({
      where: {
        status: 'active',
        endDate: {
          lte: now
        }
      }
    })

    let ended = 0

    for (const question of endedQuestions) {
      await db.question.update({
        where: { id: question.id },
        data: { status: 'ended' }
      })
      ended++
    }

    return NextResponse.json({
      success: true,
      activated,
      ended,
      message: `Activated ${activated} questions, ended ${ended} questions`
    })
  } catch (error) {
    console.error('Scheduled processor error:', error)
    return NextResponse.json({ error: 'Failed to process scheduled questions' }, { status: 500 })
  }
}
