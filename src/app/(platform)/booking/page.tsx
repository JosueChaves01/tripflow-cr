'use client'
import { useState, useEffect } from 'react'
import { getUserBookings } from '@/features/bookings/actions'
import { BookingList } from '@/features/bookings/components/BookingList'
import { useTripFlowStore } from '@/store'
import { useI18n } from '@/i18n'
import { type Booking } from '@/types'

export default function BookingPage() {
  const [bookings, setBookings] = useState<(Booking & { activity?: any })[]>([])
  const selectedBookings = useTripFlowStore((s) => s.selectedBookings)
  const { t } = useI18n()

  useEffect(() => {
    getUserBookings().then(setBookings)
  }, [])

  const allBookings = [...selectedBookings, ...bookings]

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">{t('myBookings')}</h1>
        <BookingList bookings={allBookings as any} />
      </div>
    </div>
  )
}