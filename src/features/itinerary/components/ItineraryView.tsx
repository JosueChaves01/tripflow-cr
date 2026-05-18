'use client'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useTripFlowStore } from '@/store'
import { useI18n } from '@/i18n'
import { cn, robustParseJson } from '@/lib/utils'

interface RobustActivity {
  id?: string
  name?: string
  description?: string
  title?: string
  location?: string
  price?: number
  cost?: number
  duration_minutes?: number
  time?: string
}

interface RobustItineraryDay {
  day: number
  date?: string
  activities?: RobustActivity[]
}

export function ItineraryView({ className }: { className?: string }) {
  const { t } = useI18n()
  const currentItinerary = useTripFlowStore((s) => s.currentItinerary)

  if (!currentItinerary) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-slate-500', className)}>
        <p>{t('noItineraryYet')}</p>
      </div>
    )
  }

  const parsedDays = robustParseJson<RobustItineraryDay[]>(currentItinerary.days, [])

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">{t('yourItineraries')}</h2>
        {currentItinerary.total_cost > 0 && (
          <Badge variant="success">${currentItinerary.total_cost} {t('total').toLowerCase()}</Badge>
        )}
      </div>

      {parsedDays.map((day) => (
        <div key={day.day} className="relative border-l-2 border-emerald-200 pl-6">
          <div className="absolute -left-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
            {day.day}
          </div>
          <p className="mb-3 text-sm text-slate-500">{day.date || `Día ${day.day}`}</p>
          <div className="flex flex-col gap-3">
            {day.activities?.map((activity: RobustActivity, idx: number) => {
              const actId = activity.id || `act-${day.day}-${idx}`
              const actName = activity.name || activity.description || activity.title || 'Actividad'
              const actLoc = activity.location || 'Costa Rica'
              const actPrice = activity.price !== undefined ? activity.price : (activity.cost !== undefined ? activity.cost : 0)
              const actDuration = activity.duration_minutes 
                ? `${activity.duration_minutes} min` 
                : (activity.time ? activity.time : 'Flexible')

              return (
                <Card key={actId} className="border-l-4 border-l-emerald-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800">{actName}</h4>
                      <p className="text-sm text-slate-500">{actLoc}</p>
                    </div>
                    <span className="font-medium text-emerald-600">${actPrice}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{actDuration}</p>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      <Button
        onClick={() => {
          const activities = parsedDays.flatMap((d) => d.activities ?? [])
          const ids = activities.map((a: RobustActivity) => a?.id).filter(Boolean).join(',')
          window.location.href = `/booking?activities=${ids}`
        }}
      >
        {t('bookThisItinerary')}
      </Button>
    </div>
  )
}