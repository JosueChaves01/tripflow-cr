'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface RestaurantBookingWidgetProps {
  restaurantId: string
  priceRange: string
}

export function RestaurantBookingWidget({ restaurantId, priceRange }: RestaurantBookingWidgetProps) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)

  const handleBook = () => {
    router.push(`/checkout?restaurant=${restaurantId}&date=${date}&time=${time}&guests=${guests}`)
  }

  const isValid = date && time && guests > 0

  return (
    <Card className="p-6 sticky top-24 shadow-xl border-slate-100 shadow-slate-200/50">
      <div className="mb-6">
        <span className="text-2xl font-bold text-slate-800">Reservar Mesa</span>
        <div className="text-slate-500 font-medium mt-1">Precio promedio: {priceRange}</div>
      </div>
      
      <div className="space-y-5 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha</label>
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Hora</label>
          <Input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Personas</label>
          <Input 
            type="number" 
            min="1" 
            max="20"
            value={guests} 
            onChange={(e) => setGuests(parseInt(e.target.value) || 2)}
            className="w-full"
          />
        </div>
      </div>

      <button
        onClick={handleBook}
        disabled={!isValid}
        className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
      >
        Confirmar Reserva
      </button>
      
      <p className="text-center text-sm text-slate-500 mt-4">
        Reserva gratuita, pagas en el restaurante
      </p>
    </Card>
  )
}
