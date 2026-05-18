'use client'

import { ItineraryChat } from '@/features/itinerary/components/ItineraryChat'
import { ItineraryView } from '@/features/itinerary/components/ItineraryView'
import { useI18n } from '@/i18n'

export default function ItineraryPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">{t('planYourTrip')}</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">Planificador con IA</h2>
            <ItineraryChat />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">{t('yourItineraries')}</h2>
            <ItineraryView />
          </div>
        </div>
      </div>
    </div>
  )
}