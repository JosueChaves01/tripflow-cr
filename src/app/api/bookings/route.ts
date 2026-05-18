import { getUserBookings, createBooking } from '@/features/bookings/actions'
import { NextResponse } from 'next/server'

export async function GET() {
  const bookings = await getUserBookings()
  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  const body = await request.json()
  const result = await createBooking(body)
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ data: result.data })
}