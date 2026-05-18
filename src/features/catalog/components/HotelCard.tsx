'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { type Hotel } from '@/types'
import { Star, MapPin } from 'lucide-react'

interface HotelCardProps {
  hotel: Hotel
  className?: string
}

export function HotelCard({ hotel, className }: HotelCardProps) {
  const router = useRouter()

  const categoryVariant = (cat: string): 'success' | 'warning' | 'neutral' => {
    const map: Record<string, 'success' | 'warning' | 'neutral'> = {
      'Resort': 'success',
      'Boutique': 'warning',
      'Eco-Lodge': 'success',
      'All-Inclusive': 'warning',
      'Hostel': 'neutral',
    }
    return map[cat] ?? 'neutral'
  }

  return (
    <Card
      className={cn('cursor-pointer transition-shadow hover:shadow-lg overflow-hidden', className)}
      onClick={() => router.push(`/hotel/${hotel.id}`)}
    >
      {hotel.images?.[0] && (
        <div className="mb-3 h-40 w-full relative bg-slate-200 rounded-t-lg overflow-hidden">
          <Image
            src={hotel.images[0]}
            alt={hotel.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{hotel.name}</h3>
        <Badge variant={categoryVariant(hotel.category)}>{hotel.category}</Badge>
      </div>
      <div className="mt-1 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className={i < hotel.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'} />
        ))}
      </div>
      <p className="mt-1 text-sm text-slate-500 flex items-center gap-1">
        <MapPin size={14} />
        {hotel.location}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-600">${hotel.price_per_night}</span>
        <span className="text-sm text-slate-500">/ noche</span>
      </div>
    </Card>
  )
}
