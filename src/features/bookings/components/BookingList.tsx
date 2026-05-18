import { BookingCard } from './BookingCard'
import { type Booking } from '@/types'
import { Card } from '@/components/ui/Card'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'

interface BookingListProps {
  bookings: (Booking & { activity?: any })[]
  className?: string
}

export function BookingList({ bookings, className }: BookingListProps) {
  const { t } = useI18n()

  if (bookings.length === 0) {
    return (
      <Card className={cn('flex flex-col items-center justify-center py-12 text-slate-500', className)}>
        <p>{t('noBookingsYet')}</p>
        <a href="/dashboard" className="mt-2 text-emerald-600 hover:underline">{t('browseActivities')}</a>
      </Card>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}