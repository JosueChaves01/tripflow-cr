import { notFound } from 'next/navigation'
import { getHotelDetails } from '@/features/catalog/actions'
import { ImageGallery } from '@/features/catalog/components/ImageGallery'
import { ProviderCard } from '@/features/catalog/components/ProviderCard'
import { ReviewSection } from '@/features/catalog/components/ReviewSection'
import { FeatureList } from '@/features/catalog/components/FeatureList'
import { HotelBookingWidget } from './HotelBookingWidget'
import { Badge } from '@/components/ui/Badge'
import { MapPin, Star, Wifi, ShieldCheck } from 'lucide-react'

export default async function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const hotel = await getHotelDetails(resolvedParams.id)

  if (!hotel) {
    notFound()
  }

  const reviews = hotel.reviews || []
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length 
    : 0

  const amenities = hotel.amenities && hotel.amenities.length > 0 
    ? hotel.amenities 
    : ['Wi-Fi Gratuito', 'Estacionamiento', 'Recepción 24h']
  
  const policies = hotel.policies && hotel.policies.length > 0 
    ? hotel.policies 
    : ['Check-in: 3:00 PM', 'Check-out: 12:00 PM']

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{hotel.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className={i < hotel.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'} />
              ))}
            </div>
            <span className="flex items-center gap-1 font-semibold text-slate-800 text-base">
              {averageRating > 0 ? averageRating.toFixed(1) : 'Nuevo'} 
              <span className="text-slate-500 font-normal">({reviews.length} reseñas)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-base">
              <MapPin size={18} />
              {hotel.location}
            </span>
            <span>•</span>
            <Badge variant="neutral" className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200">{hotel.category}</Badge>
          </div>
        </div>

        <ImageGallery images={hotel.images} title={hotel.name} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">Acerca de este hotel</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{hotel.description}</p>
            </section>

            {hotel.provider && <ProviderCard provider={hotel.provider} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureList title="Amenidades" icon={Wifi} items={amenities} />
              <FeatureList title="Políticas" icon={ShieldCheck} items={policies} iconColor="text-slate-400" bulletColor="text-slate-400" />
            </div>
            
            <ReviewSection reviews={reviews} />
          </div>

          <div className="lg:col-span-1">
            <HotelBookingWidget hotelId={hotel.id} pricePerNight={hotel.price_per_night} />
          </div>
        </div>
      </div>
    </div>
  )
}
