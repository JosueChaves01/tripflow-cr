import { notFound } from 'next/navigation'
import { getCarDetails } from '@/features/catalog/cars'
import { ImageGallery } from '@/features/catalog/components/ImageGallery'
import { ProviderCard } from '@/features/catalog/components/ProviderCard'
import { Badge } from '@/components/ui/Badge'
import { MapPin } from 'lucide-react'

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const car = await getCarDetails(resolvedParams.id)

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{car.make} {car.model}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1 text-base">
              <MapPin size={18} />
              {car.location}
            </span>
            <span>•</span>
            <Badge variant="neutral" className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200">{car.seats} seats • {car.transmission}</Badge>
          </div>
        </div>

        <ImageGallery images={car.images} title={`${car.make} ${car.model}`} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">About this car</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{car.description ?? 'No description available.'}</p>
            </section>

            {car.provider && <ProviderCard provider={car.provider} />}

          </div>

          <div className="lg:col-span-1">
            <section className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="mb-4">
                <span className="text-3xl font-bold text-emerald-600">${car.price_per_day}</span>
                <span className="text-sm text-slate-500"> / día</span>
              </div>
              <button className="w-full rounded-md px-4 py-3 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">Rent this car</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
