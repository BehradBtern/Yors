import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.length < 2) {
      return NextResponse.json({ questions: [], users: [] })
    }

    // Search questions
    const questions = await db.question.findMany({
      where: {
        status: 'active',
        text: {
          contains: query,
          mode: 'insensitive'
        },
        ...(category && category !== 'all' ? { category } : {})
      },
      include: {
        author: { select: { name: true, isPremium: true } },
        options: true
      },
      orderBy: [
        { yesCount: 'desc' },
        { noCount: 'desc' }
      ],
      take: limit
    })

    // Search users (only names)
    const users = await db.user.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        isPremium: true,
        role: true
      },
      take: 5
    })

    return NextResponse.json({
      questions,
      users,
      query
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
