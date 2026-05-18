'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useI18n } from '@/i18n'

interface BookingWidgetProps {
  activityId: string
  price: number
}

export function BookingWidget({ activityId, price }: BookingWidgetProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(1)

  const total = price * guests

  const handleBook = () => {
    router.push(`/checkout?activity=${activityId}&date=${date}&guests=${guests}`)
  }

  return (
    <Card className="p-6 sticky top-24 shadow-xl border-slate-100 shadow-slate-200/50">
      <div className="mb-6">
        <span className="text-3xl font-bold text-slate-800">${price}</span>
        <span className="text-slate-500 font-medium"> {t('perPerson')}</span>
      </div>

      <div className="space-y-5 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">{t('selectDate')}</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">{t('guests')}</label>
          <Input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 py-4 border-t border-b border-slate-100">
        <span className="font-semibold text-slate-700">{t('calculatedTotal')}</span>
        <span className="text-2xl font-bold text-emerald-600">${total}</span>
      </div>

      <button
        onClick={handleBook}
        disabled={!date}
        className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
      >
        {t('bookNow')}
      </button>

      <p className="text-center text-sm text-slate-500 mt-4">
        {t('noChargeYet')}
      </p>
    </Card>
  )
}
