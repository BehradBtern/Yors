import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Get sponsored questions
export async function GET() {
  try {
    // Get questions that are sponsored (featured)
    // In a real app, this would have a separate sponsored table
    const sponsoredQuestions = await db.question.findMany({
      where: {
        status: 'active',
        // Could add a sponsored field later
      },
      orderBy: [
        { yesCount: 'desc' },
        { noCount: 'desc' }
      ],
      take: 3,
      include: {
        author: { select: { name: true, isPremium: true } },
        options: true
      }
    })

    return NextResponse.json({ questions: sponsoredQuestions })
  } catch (error) {
    console.error('Sponsored questions error:', error)
    return NextResponse.json({ error: 'Failed to fetch sponsored questions' }, { status: 500 })
  }
}

// Sponsor a question (premium feature)
export async function POST(request: Request) {
  try {
    const { questionId, userId, duration } = await request.json()

    if (!questionId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user is premium
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user?.isPremium && user?.role !== 'owner') {
      return NextResponse.json({ error: 'Premium required to sponsor questions' }, { status: 403 })
    }

    // In a real app, you'd create a sponsorship record
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Question sponsored successfully!',
      sponsoredUntil: new Date(Date.now() + (duration || 7) * 24 * 60 * 60 * 1000)
    })
  } catch (error) {
    console.error('Sponsor question error:', error)
    return NextResponse.json({ error: 'Failed to sponsor question' }, { status: 500 })
  }
}
