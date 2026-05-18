'use client'

import { useState } from 'react'
import { MapPin, Calendar, Users, DollarSign, Activity, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface PreChatData {
  destination: string
  duration: number
  travelers: number
  vibe: string
  budget: string
  services: string[]
}

interface PreChatPreferencesProps {
  onStart: (data: PreChatData) => void
  onSkip: () => void
}

const DESTINATIONS = ['Arenal', 'Manuel Antonio', 'Tamarindo', 'Monteverde', 'Puerto Viejo']
const VIBES = [
  { id: 'adventure', label: 'Aventura 🌋', desc: 'Canopy, rafting y caminatas activas' },
  { id: 'relaxation', label: 'Relax & Wellness 🧘', desc: 'Aguas termales, spa y playa' },
  { id: 'nature', label: 'Naturaleza y Flora 🦜', desc: 'Avistamiento de aves, parques nacionales' },
  { id: 'eco', label: 'Ecoturismo 🌿', desc: 'Sostenibilidad y reservas biológicas' },
  { id: 'luxury', label: 'Lujo Premium ✨', desc: 'Resorts de 5 estrellas, experiencias VIP' },
]

export function PreChatPreferences({ onStart, onSkip }: PreChatPreferencesProps) {
  const [destination, setDestination] = useState('Arenal')
  const [duration, setDuration] = useState(5)
  const [travelers, setTravelers] = useState(2)
  const [vibe, setVibe] = useState('nature')
  const [budget, setBudget] = useState('moderate')
  const [services, setServices] = useState<string[]>(['hotels', 'activities', 'restaurants'])

  const toggleService = (service: string) => {
    setServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart({
      destination,
      duration,
      travelers,
      vibe,
      budget,
      services,
    })
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Preferencias Rápidas</h3>
          <p className="text-sm text-slate-500">Configura tu viaje para acelerar al asistente IA</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <MapPin size={12} className="text-emerald-500" />
            ¿A dónde viajas?
          </label>
          <div className="flex flex-wrap gap-2">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => setDestination(dest)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
                  destination === dest
                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        {/* Duration & Travelers Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Calendar size={12} className="text-emerald-500" />
              Duración (Días)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Users size={12} className="text-emerald-500" />
              Viajeros
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* Experience Vibe */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Activity size={12} className="text-emerald-500" />
            Estilo / Vibe de la Experiencia
          </label>
          <div className="space-y-2">
            {VIBES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVibe(v.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center justify-between",
                  vibe === v.id
                    ? "bg-emerald-50/50 border-emerald-500/50 shadow-sm"
                    : "bg-slate-50/40 border-slate-100 hover:bg-slate-50"
                )}
              >
                <div>
                  <p className={cn("text-sm font-semibold", vibe === v.id ? "text-emerald-900" : "text-slate-700")}>
                    {v.label}
                  </p>
                  <p className="text-xs text-slate-400 font-normal mt-0.5">{v.desc}</p>
                </div>
                {vibe === v.id && (
                  <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <DollarSign size={12} className="text-emerald-500" />
            Presupuesto estimado
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'budget', label: 'Económico 🪙' },
              { id: 'moderate', label: 'Moderado 💵' },
              { id: 'luxury', label: 'Lujo ✨' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudget(b.id)}
                className={cn(
                  "py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all duration-200",
                  budget === b.id
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Sparkles size={12} className="text-emerald-500" />
            Servicios a incluir en el Itinerario
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hotels', label: 'Hoteles' },
              { id: 'activities', label: 'Actividades' },
              { id: 'restaurants', label: 'Restaurantes' },
            ].map((s) => {
              const active = services.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={cn(
                    "py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all duration-200",
                    active
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] transition-all"
          >
            Comenzar Planificación con IA
          </Button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-center py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Omitir y chatear directamente
          </button>
        </div>
      </form>
    </div>
  )
}
