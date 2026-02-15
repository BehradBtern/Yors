import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  const payment = searchParams.get('payment')
  const upgraded = searchParams.get('upgraded')

  // Handle demo mode upgrade
  if (upgraded === 'true') {
    return NextResponse.json({
      success: true,
      message: 'Demo upgrade successful!',
      demoMode: true
    })
  }

  // Handle payment cancellation
  if (payment === 'cancelled') {
    return NextResponse.json({
      success: false,
      message: 'Payment was cancelled'
    })
  }

  // Handle payment success
  if (payment === 'success' && sessionId) {
    return NextResponse.json({
      success: true,
      message: 'Payment successful!',
      sessionId
    })
  }

  return NextResponse.json({
    success: false,
    message: 'Unknown payment status'
  })
}
