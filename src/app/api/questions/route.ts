import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, requirePremium, getOptionalUser } from '@/lib/api-auth'
import { 
  validateQuestionText, 
  validateOptions, 
  validateScheduleDates,
  validateUUID,
  sanitizeText,
  sanitizeObject
} from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trending = searchParams.get('trending')
    const badge = searchParams.get('badge')

    // Get optional user for vote status
    const user = await getOptionalUser(request)

    // For floating badges - just return question texts
    if (badge === 'true') {
      const questions = await db.question.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 12,
        select: { text: true }
      })
      return NextResponse.json({ questions })
    }

    let questions
    
    if (trending === 'true') {
      // Fetch trending questions (sorted by total votes, only active ones)
      questions = await db.question.findMany({
        where: { status: 'active' },
        orderBy: [
          { yesCount: 'desc' },
          { noCount: 'desc' }
        ],
        take: 6,
        include: {
          author: {
            select: { id: true, name: true, isPremium: true }
          },
          options: {
            orderBy: { order: 'asc' }
          }
        }
      })
    } else {
      // Fetch all questions for dashboard
      questions = await db.question.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, isPremium: true }
          },
          options: {
            orderBy: { order: 'asc' }
          },
          votes: user ? {
            where: { voterId: user.id },
            select: { answer: true, optionId: true }
          } : false
        }
      })
    }

    const questionsWithVoteStatus = questions.map(q => {
      const questionVotes = (q as any).votes || []
      const userVote = questionVotes.length > 0 ? questionVotes[0] : null
      
      // Calculate total votes for multiple choice
      let totalVotes = q.yesCount + q.noCount
      if (q.questionType === 'multiple' && q.options) {
        totalVotes = q.options.reduce((sum: number, opt: any) => sum + opt.voteCount, 0)
      }
      
      const result: any = {
        id: q.id,
        text: q.text,
        questionType: q.questionType,
        yesLabel: q.yesLabel,
        noLabel: q.noLabel,
        yesCount: q.yesCount,
        noCount: q.noCount,
        options: q.options,
        totalVotes,
        status: q.status,
        startDate: q.startDate?.toISOString() || null,
        endDate: q.endDate?.toISOString() || null,
        createdAt: q.createdAt.toISOString(),
        author: q.author,
        hasVoted: !!userVote
      }
      
      if (userVote) {
        if (q.questionType === 'multiple') {
          result.userVoteOptionId = userVote.optionId
        } else {
          result.userVote = userVote.answer
        }
      }
      
      return result
    })

    return NextResponse.json({ questions: questionsWithVoteStatus })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return authResult.response
    }
    
    const userId = authResult.userId
    const body = await request.json()
    const sanitizedBody = sanitizeObject(body)
    
    const { 
      text, 
      questionType = 'yesNo',
      yesLabel = 'Yes', 
      noLabel = 'No', 
      options,
      status = 'active',
      startDate,
      endDate
    } = sanitizedBody

    // Validate question text
    const textValidation = validateQuestionText(text)
    if (!textValidation.valid) {
      return NextResponse.json({ error: textValidation.error }, { status: 400 })
    }

    // Get user for premium check
    const user = await db.user.findUnique({ 
      where: { id: userId },
      select: { isPremium: true, role: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Multiple choice requires premium
    if (questionType === 'multiple') {
      if (!user.isPremium && user.role !== 'premium' && user.role !== 'owner') {
        return NextResponse.json({ 
          error: 'Multiple choice questions are a premium feature. Upgrade to Premium!',
          requiresPremium: true 
        }, { status: 403 })
      }
      
      const optionsValidation = validateOptions(options)
      if (!optionsValidation.valid) {
        return NextResponse.json({ error: optionsValidation.error }, { status: 400 })
      }
    } else {
      // Validate labels for yesNo type
      if (!yesLabel?.trim() || !noLabel?.trim()) {
        return NextResponse.json({ error: 'Both labels are required' }, { status: 400 })
      }
      
      if (yesLabel.length > 20 || noLabel.length > 20) {
        return NextResponse.json({ error: 'Labels must be 20 characters or less' }, { status: 400 })
      }
    }

    // Validate dates for scheduled questions
    if (status === 'scheduled') {
      if (!startDate || !endDate) {
        return NextResponse.json({ error: 'Start and end dates are required for scheduled questions' }, { status: 400 })
      }
      
      const datesValidation = validateScheduleDates(startDate, endDate)
      if (!datesValidation.valid) {
        return NextResponse.json({ error: datesValidation.error }, { status: 400 })
      }
    }

    // Create question with options if multiple choice
    const question = await db.question.create({
      data: {
        text: sanitizeText(text, 500),
        questionType,
        yesLabel: questionType === 'yesNo' ? sanitizeText(yesLabel, 20) : 'Yes',
        noLabel: questionType === 'yesNo' ? sanitizeText(noLabel, 20) : 'No',
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        authorId: userId,
        options: questionType === 'multiple' ? {
          create: options.map((opt: any, index: number) => ({
            text: sanitizeText(opt.text, 100),
            color: opt.color || ['#09637E', '#088395', '#7AB2B2', '#f59e0b', '#10b981', '#8b5cf6'][index % 6],
            order: index
          }))
        } : undefined
      },
      include: {
        author: {
          select: { id: true, name: true, isPremium: true }
        },
        options: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return authResult.response
    }
    
    const userId = authResult.userId
    const body = await request.json()
    const sanitizedBody = sanitizeObject(body)
    
    const { 
      questionId, 
      text, 
      yesLabel, 
      noLabel, 
      status,
      startDate,
      endDate
    } = sanitizedBody

    // Validate questionId
    if (!questionId || !validateUUID(questionId)) {
      return NextResponse.json({ error: 'Valid question ID is required' }, { status: 400 })
    }

    // Check if user owns the question
    const existingQuestion = await db.question.findUnique({
      where: { id: questionId }
    })

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    if (existingQuestion.authorId !== userId) {
      return NextResponse.json({ error: 'You can only edit your own questions' }, { status: 403 })
    }

    const updateData: any = {}
    
    if (text !== undefined) {
      const textValidation = validateQuestionText(text)
      if (!textValidation.valid) {
        return NextResponse.json({ error: textValidation.error }, { status: 400 })
      }
      updateData.text = sanitizeText(text, 500)
    }
    if (yesLabel !== undefined) updateData.yesLabel = sanitizeText(yesLabel, 20)
    if (noLabel !== undefined) updateData.noLabel = sanitizeText(noLabel, 20)
    if (status !== undefined) updateData.status = status
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null

    const question = await db.question.update({
      where: { id: questionId },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true }
        },
        options: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request)
    if (!authResult.authenticated) {
      return authResult.response
    }
    
    const userId = authResult.userId
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')

    // Validate questionId
    if (!questionId || !validateUUID(questionId)) {
      return NextResponse.json({ error: 'Valid question ID is required' }, { status: 400 })
    }

    // Check if user owns the question
    const existingQuestion = await db.question.findUnique({
      where: { id: questionId }
    })

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    if (existingQuestion.authorId !== userId) {
      return NextResponse.json({ error: 'You can only delete your own questions' }, { status: 403 })
    }

    await db.question.delete({
      where: { id: questionId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}
