'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { type Car } from '@/types'
import { MapPin } from 'lucide-react'

interface CarCardProps {
  car: Car
  className?: string
}

export function CarCard({ car, className }: CarCardProps) {
  const router = useRouter()

  return (
    <Card
      className={cn('cursor-pointer transition-shadow hover:shadow-lg overflow-hidden', className)}
      onClick={() => router.push(`/car/${car.id}`)}
    >
      {car.images?.[0] && (
        <div className="mb-3 h-40 w-full relative bg-slate-200 rounded-t-lg overflow-hidden">
          <Image
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-800 line-clamp-1">{car.make} {car.model}</h3>
      </div>

      <p className="mt-1 text-sm text-slate-500 flex items-center gap-1">
        <MapPin size={14} />
        {car.location}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-emerald-600">${car.price_per_day}</span>
        <span className="text-sm text-slate-500">{car.seats ?? '-'} seats • {car.transmission ?? '-'}</span>
      </div>
    </Card>
  )
}
