import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if user is owner by looking up in database
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    // Check if user is owner - either by role, name, or email
    const isOwner = user && (
      user.role === 'owner' || 
      user.name === 'BehradBtem' || 
      user.email === 'behradbtem@gmail.com'
    )

    if (!isOwner) {
      return NextResponse.json({ error: 'Unauthorized - Owner access required' }, { status: 403 })
    }

    // Auto-promote if needed
    if (user && user.role !== 'owner') {
      await db.user.update({
        where: { id: userId },
        data: { role: 'owner', isPremium: true }
      })
    }

    // Get comprehensive website statistics
    const [
      totalUsers,
      totalQuestions,
      totalVotes,
      totalComments,
      premiumUsers,
      activeQuestions,
      scheduledQuestions,
      draftQuestions,
      recentUsers,
      recentQuestions,
      recentVotes,
      questionsByCategory,
      votesLast7Days
    ] = await Promise.all([
      db.user.count(),
      db.question.count(),
      db.vote.count(),
      db.comment.count(),
      db.user.count({ where: { isPremium: true } }),
      db.question.count({ where: { status: 'active' } }),
      db.question.count({ where: { status: 'scheduled' } }),
      db.question.count({ where: { status: 'draft' } }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true, isPremium: true, role: true }
      }),
      db.question.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true, email: true } }
        }
      }),
      db.vote.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          voter: { select: { name: true } },
          question: { select: { text: true } }
        }
      }),
      db.question.groupBy({
        by: ['category'],
        _count: { id: true }
      }),
      db.vote.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    // Calculate revenue estimate
    const monthlyRevenue = premiumUsers * 9.99

    // Get votes per day for last 7 days
    const last7Days: { date: string; votes: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const count = await db.vote.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      })
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        votes: count
      })
    }

    // Get top questions
    const topQuestions = await db.question.findMany({
      take: 5,
      orderBy: [
        { yesCount: 'desc' }
      ],
      where: { status: 'active' }
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalQuestions,
        totalVotes,
        totalComments,
        premiumUsers,
        activeQuestions,
        scheduledQuestions,
        draftQuestions,
        votesLast7Days,
        monthlyRevenue: monthlyRevenue.toFixed(2)
      },
      charts: {
        votesPerDay: last7Days,
        questionsByCategory: questionsByCategory.map(c => ({
          category: c.category,
          count: c._count.id
        }))
      },
      recent: {
        users: recentUsers,
        questions: recentQuestions,
        votes: recentVotes
      },
      topQuestions
    })
  } catch (error) {
    console.error('Owner stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

// Set user role
export async function POST(request: NextRequest) {
  try {
    const { userId, targetEmail, role } = await request.json()

    if (!userId || !targetEmail || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if requesting user is owner
    const requestingUser = await db.user.findUnique({
      where: { id: userId }
    })

    if (!requestingUser || requestingUser.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized - Owner access required' }, { status: 403 })
    }

    // Update target user's role
    const updatedUser = await db.user.update({
      where: { email: targetEmail },
      data: { role }
    })

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        name: updatedUser.name, 
        role: updatedUser.role 
      } 
    })
  } catch (error) {
    console.error('Role update error:', error)
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}