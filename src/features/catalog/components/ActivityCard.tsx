'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { type Activity } from '@/types'

interface ActivityCardProps {
  activity: Activity
  className?: string
}

export function ActivityCard({ activity, className }: ActivityCardProps) {
  const router = useRouter()

  const categoryVariant = (cat: string): 'success' | 'warning' | 'neutral' => {
    const map: Record<string, 'success' | 'warning' | 'neutral'> = {
      adventure: 'warning',
      tours: 'success',
      culture: 'neutral',
      food: 'warning',
      nature: 'success',
    }
    return map[cat.toLowerCase()] ?? 'neutral'
  }

  return (
    <Card
      className={cn('cursor-pointer transition-shadow hover:shadow-lg overflow-hidden', className)}
      onClick={() => router.push(`/activity/${activity.id}`)}
    >
      {activity.images?.[0] && (
        <div className="mb-3 h-40 w-full relative bg-slate-200 rounded-t-lg overflow-hidden">
          <Image
            src={activity.images[0]}
            alt={activity.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-800">{activity.name}</h3>
        <Badge variant={categoryVariant(activity.category)}>{activity.category}</Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500">{activity.location}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-600">${activity.price}</span>
        <span className="text-sm text-slate-500">{activity.duration_minutes} min</span>
      </div>
    </Card>
  )
}