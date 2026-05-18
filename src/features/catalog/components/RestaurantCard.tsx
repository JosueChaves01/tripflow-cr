'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { type Restaurant } from '@/types'
import { MapPin, Utensils } from 'lucide-react'

interface RestaurantCardProps {
  restaurant: Restaurant
  className?: string
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  const router = useRouter()

  const categoryVariant = (cat: string): 'success' | 'warning' | 'neutral' => {
    const map: Record<string, 'success' | 'warning' | 'neutral'> = {
      'Fine Dining': 'success',
      'Casual': 'neutral',
      'Seafood': 'warning',
      'Café': 'warning',
      'Fusion': 'success',
      'Vegetarian': 'success'
    }
    return map[cat] ?? 'neutral'
  }

  return (
    <Card
      className={cn('cursor-pointer transition-shadow hover:shadow-lg overflow-hidden', className)}
      onClick={() => router.push(`/restaurant/${restaurant.id}`)}
    >
      {restaurant.images?.[0] && (
        <div className="mb-3 h-40 w-full relative bg-slate-200 rounded-t-lg overflow-hidden">
          <Image
            src={restaurant.images[0]}
            alt={restaurant.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{restaurant.name}</h3>
        <Badge variant={categoryVariant(restaurant.category)}>{restaurant.category}</Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500 flex items-center gap-1">
        <Utensils size={14} />
        {restaurant.cuisine}
      </p>
      <p className="mt-1 text-sm text-slate-500 flex items-center gap-1">
        <MapPin size={14} />
        {restaurant.location}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-700">{restaurant.price_range}</span>
      </div>
    </Card>
  )
}
