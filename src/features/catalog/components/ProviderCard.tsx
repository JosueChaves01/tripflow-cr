import { CheckCircle } from 'lucide-react'

interface ProviderCardProps {
  provider: {
    business_name: string
    description?: string | null
    verified?: boolean
  }
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <section className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl">
          {provider.business_name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-xl">Ofrecido por {provider.business_name}</h3>
          {provider.verified && (
            <span className="text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle size={16} /> Proveedor Verificado
            </span>
          )}
        </div>
      </div>
      {provider.description && (
        <p className="text-slate-600 text-base mt-4">{provider.description}</p>
      )}
    </section>
  )
}
