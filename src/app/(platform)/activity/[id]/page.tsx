import { notFound } from 'next/navigation'
import { getActivityDetails } from '@/features/catalog/actions'
import { ImageGallery } from '@/features/catalog/components/ImageGallery'
import { ProviderCard } from '@/features/catalog/components/ProviderCard'
import { ReviewSection } from '@/features/catalog/components/ReviewSection'
import { FeatureList } from '@/features/catalog/components/FeatureList'
import { BookingWidget } from './BookingWidget'
import { Badge } from '@/components/ui/Badge'
import { MapPin, Star, CheckCircle, Info } from 'lucide-react'

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const activity = await getActivityDetails(resolvedParams.id)

  if (!activity) {
    notFound()
  }

  const reviews = activity.reviews || []
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length 
    : 0

  const included = activity.included && activity.included.length > 0 
    ? activity.included 
    : ['Transporte', 'Guía bilingüe', 'Entradas', 'Seguro']
  
  const requirements = activity.requirements && activity.requirements.length > 0 
    ? activity.requirements 
    : ['Ropa cómoda', 'Protector solar', 'Repelente', 'Pasaporte']

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{activity.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-slate-800 text-base">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              {averageRating > 0 ? averageRating.toFixed(1) : 'Nuevo'} 
              <span className="text-slate-500 font-normal">({reviews.length} reseñas)</span>
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

        <ImageGallery images={activity.images} title={activity.name} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">Acerca de esta actividad</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{activity.description}</p>
            </section>

            {activity.provider && <ProviderCard provider={activity.provider} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureList title="Qué incluye" icon={CheckCircle} items={included} />
              <FeatureList title="Requisitos" icon={Info} items={requirements} iconColor="text-slate-400" bulletColor="text-slate-400" />
            </div>
            
            <ReviewSection reviews={reviews} />
          </div>

          <div className="lg:col-span-1">
            <BookingWidget activityId={activity.id} price={activity.price} />
          </div>
        </div>
      </div>
    </div>
  )
}
