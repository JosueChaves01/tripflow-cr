import { notFound } from 'next/navigation'
import { getRestaurantDetails } from '@/features/catalog/actions'
import { ImageGallery } from '@/features/catalog/components/ImageGallery'
import { ProviderCard } from '@/features/catalog/components/ProviderCard'
import { ReviewSection } from '@/features/catalog/components/ReviewSection'
import { FeatureList } from '@/features/catalog/components/FeatureList'
import { RestaurantBookingWidget } from './RestaurantBookingWidget'
import { Badge } from '@/components/ui/Badge'
import { MapPin, Star, Utensils, Clock, CheckCircle } from 'lucide-react'

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const restaurant = await getRestaurantDetails(resolvedParams.id)

  if (!restaurant) {
    notFound()
  }

  const reviews = restaurant.reviews || []
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length 
    : 0

  const specialties = restaurant.specialties && restaurant.specialties.length > 0 
    ? restaurant.specialties 
    : ['Plato del día', 'Bebidas artesanales', 'Postres de la casa']
  
  const schedule = restaurant.schedule && restaurant.schedule.length > 0 
    ? restaurant.schedule 
    : ['Lunes a Domingo: 12:00 PM - 10:00 PM']

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-slate-800 text-base">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              {averageRating > 0 ? averageRating.toFixed(1) : 'Nuevo'} 
              <span className="text-slate-500 font-normal">({reviews.length} reseñas)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-base">
              <MapPin size={18} />
              {restaurant.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-base font-medium">
              <Utensils size={18} />
              {restaurant.cuisine}
            </span>
            <span>•</span>
            <Badge variant="neutral" className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200">{restaurant.category}</Badge>
          </div>
        </div>

        <ImageGallery images={restaurant.images} title={restaurant.name} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">Acerca de este restaurante</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{restaurant.description}</p>
            </section>

            {restaurant.provider && <ProviderCard provider={restaurant.provider} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureList title="Especialidades" icon={CheckCircle} items={specialties} />
              <FeatureList title="Horario" icon={Clock} items={schedule} iconColor="text-slate-400" bulletColor="text-slate-400" />
            </div>
            
            <ReviewSection reviews={reviews} />
          </div>

          <div className="lg:col-span-1">
            <RestaurantBookingWidget restaurantId={restaurant.id} priceRange={restaurant.price_range} />
          </div>
        </div>
      </div>
    </div>
  )
}
