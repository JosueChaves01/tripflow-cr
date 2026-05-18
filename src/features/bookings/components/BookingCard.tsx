'use client'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cancelBooking } from '@/features/bookings/actions'
import { useI18n } from '@/i18n'
import { type Booking } from '@/types'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: Booking & { activity?: any }
  className?: string
}

const statusVariant = (status: Booking['status']): 'success' | 'warning' | 'danger' | 'neutral' => {
  switch (status) {
    case 'confirmed': return 'success'
    case 'pending': return 'warning'
    case 'cancelled': return 'danger'
    case 'completed': return 'neutral'
    default: return 'neutral'
  }
}

export function BookingCard({ booking, className }: BookingCardProps) {
  const { t } = useI18n()

  const handleCancel = async () => {
    if (!confirm(t('cancelThisBooking'))) return
    await cancelBooking(booking.id)
    window.location.reload()
  }

  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">{booking.activity?.name ?? t('activity')}</h3>
          <p className="text-sm text-slate-500">{booking.activity?.location}</p>
        </div>
        <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{booking.date}</span>
        <span>{t('groupLabel').replace('{size}', String(booking.group_size))}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-600">${booking.total_price}</span>
        {booking.status === 'pending' && (
          <Button variant="ghost" size="sm" onClick={handleCancel}>{t('cancel')}</Button>
        )}
      </div>
    </Card>
  )
}