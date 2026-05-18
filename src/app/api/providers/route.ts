import { createActivity, getProviderBookings } from '@/features/providers/actions'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const result = await createActivity(body)
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ data: result.data })
}

export async function GET() {
  const bookings = await getProviderBookings()
  return NextResponse.json(bookings)
}