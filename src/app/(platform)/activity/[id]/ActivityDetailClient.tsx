'use client'

import { Star, MapPin, CheckCircle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { BookingWidget } from './BookingWidget'
import { useI18n } from '@/i18n'

interface ActivityDetailClientProps {
  activity: any
  averageRating: number
  reviews: any[]
}

export function ActivityDetailClient({ activity, averageRating, reviews }: ActivityDetailClientProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{activity.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-slate-800 text-base">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              {averageRating > 0 ? averageRating.toFixed(1) : t('newLabel')}
              <span className="text-slate-500 font-normal">({reviews.length} {t('reviews')})</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-base">
              <MapPin size={18} />
              {activity.location}
            </span>
            <span>•</span>
            <Badge variant="neutral" className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200">{activity.category}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">{t('aboutThisActivity')}</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{activity.description}</p>
            </section>

            {activity.provider && (
              <section className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl">
                    {activity.provider.business_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-xl">{t('offeredBy')} {activity.provider.business_name}</h3>
                    {activity.provider.verified && (
                      <span className="text-emerald-600 font-medium flex items-center gap-1 mt-1">
                        <CheckCircle size={16} /> {t('verifiedProvider')}
                      </span>
                    )}
                  </div>
                </div>
                {activity.provider.description && (
                  <p className="text-slate-600 text-base mt-4">{activity.provider.description}</p>
                )}
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <CheckCircle size={24} className="text-emerald-600" />
                  {t('whatsIncluded')}
                </h3>
                <ul className="space-y-4">
                  {(activity.included && activity.included.length > 0 ? activity.included : ['Transporte', 'Guía bilingüe', 'Entradas', 'Seguro']).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-lg">
                      <span className="text-emerald-500 mt-1 font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Info size={24} className="text-slate-400" />
                  {t('requirements')}
                </h3>
                <ul className="space-y-4">
                  {(activity.requirements && activity.requirements.length > 0 ? activity.requirements : ['Ropa cómoda', 'Protector solar', 'Repelente', 'Pasaporte']).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-lg">
                      <span className="text-slate-400 mt-1 font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {reviews.length > 0 && (
              <section className="pt-10 border-t border-slate-100">
                <h3 className="text-3xl font-semibold text-slate-900 mb-8">{t('reviews')} ({reviews.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                          {review.user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{review.user?.full_name || 'Usuario Anónimo'}</p>
                          <div className="flex items-center gap-1 text-yellow-400 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400' : 'text-slate-300'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <BookingWidget activityId={activity.id} price={activity.price} />
          </div>
        </div>
      </div>
    </div>
  )
}