'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface HotelBookingWidgetProps {
  hotelId: string
  pricePerNight: number
}

export function HotelBookingWidget({ hotelId, pricePerNight }: HotelBookingWidgetProps) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [rooms, setRooms] = useState(1)

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const total = pricePerNight * nights * rooms

  const handleBook = () => {
    router.push(`/checkout?hotel=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}`)
  }

  const isValid = checkIn && checkOut && nights > 0

  return (
    <Card className="p-6 sticky top-24 shadow-xl border-slate-100 shadow-slate-200/50">
      <div className="mb-6">
        <span className="text-3xl font-bold text-slate-800">${pricePerNight}</span>
        <span className="text-slate-500 font-medium"> / noche</span>
      </div>
      
      <div className="space-y-5 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Check-in</label>
          <Input 
            type="date" 
            value={checkIn} 
            onChange={(e) => {
              setCheckIn(e.target.value)
              if (checkOut && e.target.value >= checkOut) setCheckOut('')
            }}
            min={today}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Check-out</label>
          <Input 
            type="date" 
            value={checkOut} 
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || today}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Habitaciones</label>
          <Input 
            type="number" 
            min="1" 
            value={rooms} 
            onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
            className="w-full"
          />
        </div>
      </div>

      {nights > 0 && (
        <div className="mb-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>${pricePerNight} × {nights} noches</span>
            <span>${pricePerNight * nights}</span>
          </div>
          {rooms > 1 && (
            <div className="flex justify-between">
              <span>× {rooms} habitaciones</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mb-6 py-4 border-t border-b border-slate-100">
        <span className="font-semibold text-slate-700">Total</span>
        <span className="text-2xl font-bold text-emerald-600">${total}</span>
      </div>

      <button
        onClick={handleBook}
        disabled={!isValid}
        className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
      >
        Reservar Ahora
      </button>
      
      <p className="text-center text-sm text-slate-500 mt-4">
        No se te cobrará aún
      </p>
    </Card>
  )
}
