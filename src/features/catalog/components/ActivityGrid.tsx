import { ActivityCard } from './ActivityCard'
import { type Activity } from '@/types'
import { cn } from '@/lib/utils'

interface ActivityGridProps {
  activities: Activity[]
  className?: string
}

export function ActivityGrid({ activities, className }: ActivityGridProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <p>No activities found</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}