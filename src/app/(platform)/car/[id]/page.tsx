import { notFound } from 'next/navigation'
import { getCarDetails } from '@/features/catalog/cars'
import { ImageGallery } from '@/features/catalog/components/ImageGallery'
import { ProviderCard } from '@/features/catalog/components/ProviderCard'
import { FeatureList } from '@/features/catalog/components/FeatureList'
import { Badge } from '@/components/ui/Badge'
import { MapPin, Users, Settings, Calendar, ShieldCheck, CheckCircle2, CarFront } from 'lucide-react'

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const car = await getCarDetails(resolvedParams.id)

  if (!car) {
    notFound()
  }

  const standardPolicies = [
    'Licencia de conducir vigente y pasaporte al día',
    'Depósito de garantía reembolsable con tarjeta de crédito',
    'Seguro básico contra terceros incluido',
    'El conductor debe ser mayor de 21 años',
    'Se entrega con tanque lleno y se devuelve con tanque lleno'
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-none font-semibold px-3 py-1">Disponible</Badge>
                <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <MapPin size={16} className="text-emerald-500" />
                  {car.location}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">{car.make} {car.model}</h1>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
              <div className="flex flex-col items-center">
                <Users size={20} className="text-slate-400 mb-1" />
                <span className="text-sm font-bold text-slate-700">{car.seats} Pasajeros</span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex flex-col items-center">
                <Settings size={20} className="text-slate-400 mb-1" />
                <span className="text-sm font-bold text-slate-700">{car.transmission}</span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex flex-col items-center">
                <Calendar size={20} className="text-slate-400 mb-1" />
                <span className="text-sm font-bold text-slate-700">Año {car.year}</span>
              </div>
            </div>
          </div>
        </div>

        <ImageGallery images={car.images} title={`${car.make} ${car.model}`} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CarFront className="text-emerald-600" />
                Acerca de este vehículo
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{car.description ?? 'No hay descripción disponible para este vehículo.'}</p>
            </section>

            <FeatureList 
              title="Políticas de Renta" 
              icon={ShieldCheck} 
              items={standardPolicies}
              iconColor="text-blue-600"
              bulletColor="text-blue-500"
            />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-600" />
                  Proveedor del Vehículo
                </h2>
                {car.provider && <ProviderCard provider={car.provider} />}
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <section className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-4xl font-extrabold text-emerald-600">${car.price_per_day}</span>
                      <span className="text-slate-500 font-medium mb-1">/ día</span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-500" /> Seguro básico incluido
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Precio base (1 día)</span>
                      <span className="font-medium">${car.price_per_day}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Tarifa de servicio</span>
                      <span className="font-medium text-emerald-600">Gratis</span>
                    </div>
                  </div>

                  <button className="w-full relative group overflow-hidden rounded-xl bg-emerald-600 px-4 py-4 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-600/20 active:scale-[0.98]">
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                      <div className="relative h-full w-8 bg-white/20" />
                    </div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <CarFront size={18} />
                      Solicitar Reserva
                    </span>
                  </button>
                  
                  <p className="text-center text-xs text-slate-400 mt-4 font-medium">No se hará ningún cargo a tu tarjeta aún</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
