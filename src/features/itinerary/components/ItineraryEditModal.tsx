'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  X, Trash2, ArrowUp, ArrowDown, Plus, Search, MapPin, 
  DollarSign, Activity as ActivityIcon, Hotel as HotelIcon, Utensils, Check, Compass
} from 'lucide-react'
import { useI18n } from '@/i18n'

interface RobustActivity {
  id?: string
  name?: string
  description?: string
  title?: string
  location?: string
  price?: number
  cost?: number
  duration_minutes?: number
  time?: string
  type?: 'activity' | 'hotel' | 'restaurant'
}

interface RobustItineraryDay {
  day: number
  date?: string
  activities?: RobustActivity[]
}

interface ItineraryEditModalProps {
  open: boolean
  onClose: () => void
  itineraryId: string
  initialDays: RobustItineraryDay[]
  onSave: (updatedDays: RobustItineraryDay[]) => Promise<void>
}

export function ItineraryEditModal({ open, onClose, itineraryId, initialDays, onSave }: ItineraryEditModalProps) {
  const { t } = useI18n()
  const [days, setDays] = useState<RobustItineraryDay[]>([])
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0)
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<RobustActivity[]>([])
  const [searching, setSearching] = useState(false)
  const [addingCustom, setAddingCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customCost, setCustomCost] = useState(0)

  const supabase = createClient()

  // Sync initial days when modal opens
  useEffect(() => {
    if (open) {
      // Deep clone to avoid mutating parent state
      setDays(JSON.parse(JSON.stringify(initialDays)))
      setActiveDayIdx(0)
      setSearchQuery('')
      setSearchResults([])
    }
  }, [open, initialDays])

  // Real-time Database Lookup (activities, hotels, restaurants)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true)
      try {
        const query = searchQuery.trim()
        const results: RobustActivity[] = []

        // 1. Search Activities
        const { data: acts } = await supabase
          .from('activities')
          .select('id, name, price, location, duration_minutes')
          .ilike('name', `%${query}%`)
          .eq('available', true)
          .limit(5)

        if (acts) {
          acts.forEach(a => results.push({
            id: a.id,
            name: a.name,
            price: Number(a.price),
            location: a.location || 'Costa Rica',
            duration_minutes: a.duration_minutes || 60,
            type: 'activity'
          }))
        }

        // 2. Search Hotels
        const { data: hotels } = await supabase
          .from('hotels')
          .select('id, name, price_per_night, location')
          .ilike('name', `%${query}%`)
          .eq('available', true)
          .limit(3)

        if (hotels) {
          hotels.forEach(h => results.push({
            id: h.id,
            name: h.name,
            price: Number(h.price_per_night),
            location: h.location || 'Costa Rica',
            type: 'hotel'
          }))
        }

        // 3. Search Restaurants
        const { data: rests } = await supabase
          .from('restaurants')
          .select('id, name, location')
          .ilike('name', `%${query}%`)
          .eq('available', true)
          .limit(3)

        if (rests) {
          rests.forEach(r => results.push({
            id: r.id,
            name: r.name,
            price: 0,
            location: r.location || 'Costa Rica',
            type: 'restaurant'
          }))
        }

        setSearchResults(results)
      } catch (err) {
        console.error('Error executing live search lookup:', err)
      } finally {
        setSearching(false)
      }
    }, 400) // Debounce search queries

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Move Activity Up in priority list
  const moveActivityUp = (dayIdx: number, actIdx: number) => {
    if (actIdx === 0) return
    const updated = [...days]
    const day = updated[dayIdx]
    if (!day.activities) return

    const temp = day.activities[actIdx]
    day.activities[actIdx] = day.activities[actIdx - 1]
    day.activities[actIdx - 1] = temp
    setDays(updated)
  }

  // Move Activity Down in priority list
  const moveActivityDown = (dayIdx: number, actIdx: number) => {
    const updated = [...days]
    const day = updated[dayIdx]
    if (!day.activities || actIdx === day.activities.length - 1) return

    const temp = day.activities[actIdx]
    day.activities[actIdx] = day.activities[actIdx + 1]
    day.activities[actIdx + 1] = temp
    setDays(updated)
  }

  // Remove Activity
  const removeActivity = (dayIdx: number, actIdx: number) => {
    const updated = [...days]
    const day = updated[dayIdx]
    if (!day.activities) return

    day.activities.splice(actIdx, 1)
    setDays(updated)
  }

  // Add Item to active Day
  const handleAddActivity = (item: RobustActivity) => {
    const updated = [...days]
    const day = updated[activeDayIdx]
    if (!day.activities) {
      day.activities = []
    }
    day.activities.push(item)
    setDays(updated)
    setSearchQuery('')
    setSearchResults([])
  }

  // Add Custom Activity (if not found in DB lookup)
  const handleAddCustomActivity = async () => {
    if (!customName.trim()) return

    // Resolve automatically using the trigger or fallback to first activity ID in system
    let defaultId = 'custom-' + Math.random().toString(36).substr(2, 9)
    try {
      const { data } = await supabase.from('activities').select('id').limit(1).single()
      if (data) defaultId = data.id
    } catch (_) {}

    handleAddActivity({
      id: defaultId,
      name: customName.trim(),
      price: customCost,
      location: 'Costa Rica',
      type: 'activity'
    })

    setCustomName('')
    setCustomCost(0)
    setAddingCustom(false)
  }

  const handleSave = async () => {
    await onSave(days)
    onClose()
  }

  if (!open) return null

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      className="max-w-2xl bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
            <ActivityIcon size={20} className="text-emerald-500" />
            Editar Itinerario de Viaje
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1">
            Modifica, añade y reordena actividades y hospedaje de forma manual.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-1.5 rounded-full transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Grid content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden">
        {/* Left Side: Day selector & active day schedule */}
        <div className="md:col-span-7 flex flex-col overflow-hidden">
          {/* Day Navigation Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {days.map((day, idx) => (
              <button
                key={day.day}
                onClick={() => setActiveDayIdx(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  activeDayIdx === idx
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-900/30'
                    : 'bg-slate-800/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'
                }`}
              >
                Día {day.day}
              </button>
            ))}
          </div>

          {/* Activity List for Active Day */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {days[activeDayIdx]?.activities && days[activeDayIdx].activities.length > 0 ? (
              days[activeDayIdx].activities.map((act, actIdx) => {
                const actName = act.name || act.description || act.title || 'Actividad'
                const actPrice = act.price !== undefined ? act.price : (act.cost !== undefined ? act.cost : 0)
                const actType = act.type || 'activity'

                return (
                  <div 
                    key={act.id || actIdx}
                    className="flex items-center justify-between bg-slate-800/40 border border-slate-800/80 p-3 rounded-2xl gap-3 group hover:border-slate-700/80 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Icon per type */}
                      <span className="p-2 rounded-xl bg-slate-800 text-slate-300">
                        {actType === 'hotel' ? <HotelIcon size={13} className="text-blue-400" /> : 
                         actType === 'restaurant' ? <Utensils size={13} className="text-amber-400" /> : 
                         <ActivityIcon size={13} className="text-emerald-400" />}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 truncate leading-tight">
                          {actName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin size={9} className="text-slate-500" />
                          {act.location || 'Costa Rica'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Price indicator */}
                      <span className="text-xs font-extrabold text-emerald-400 mr-2 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-lg">
                        ${actPrice}
                      </span>

                      {/* Reordering and Actions */}
                      <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => moveActivityUp(activeDayIdx, actIdx)}
                          disabled={actIdx === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-750 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveActivityDown(activeDayIdx, actIdx)}
                          disabled={!days[activeDayIdx].activities || actIdx === days[activeDayIdx].activities.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-750 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeActivity(activeDayIdx, actIdx)}
                          className="p-1 rounded-md text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors ml-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                <Compass size={32} className="mb-2 text-slate-650" />
                <p className="text-xs font-medium">No hay actividades programadas para este día.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Finder and Database Search */}
        <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-5 flex flex-col overflow-hidden">
          <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <Search size={13} className="text-emerald-500" />
            Añadir Actividades Reales del Sistema
          </h4>
          
          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Buscar canopy, termales, hoteles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-800 text-white rounded-xl text-xs placeholder:text-slate-500 focus-visible:ring-emerald-600 h-9"
            />
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {searching ? (
              <div className="text-center py-6 text-xs text-slate-400 flex items-center justify-center gap-2">
                <Spinner size="xs" />
                Buscando en base de datos...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddActivity(item)}
                  className="w-full flex items-start justify-between p-2.5 rounded-xl bg-slate-850 border border-slate-800/60 text-left hover:border-emerald-600 hover:bg-slate-800 transition-all text-xs gap-2 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {item.type === 'hotel' ? 'Hotel' : item.type === 'restaurant' ? 'Restaurante' : 'Actividad'}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-200 truncate mt-0.5 leading-tight group-hover:text-emerald-400">
                      {item.name}
                    </h5>
                    <p className="text-[9.5px] text-slate-500 font-semibold truncate flex items-center gap-0.5 mt-0.5">
                      <MapPin size={9} />
                      {item.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="font-bold text-emerald-400">
                      ${item.price}
                    </span>
                    <span className="p-1 rounded-full bg-slate-800 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Plus size={10} />
                    </span>
                  </div>
                </button>
              ))
            ) : searchQuery.trim() ? (
              <div className="text-center py-6 text-slate-500">
                <p className="text-xs font-semibold">No se encontraron resultados reales.</p>
                <button 
                  onClick={() => setAddingCustom(true)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 mt-2 flex items-center gap-1 mx-auto bg-emerald-950/20 px-3 py-1.5 rounded-xl border border-emerald-900/30"
                >
                  <Plus size={12} />
                  Crear Actividad Personalizada
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 border border-dashed border-slate-850 rounded-2xl p-4">
                <p className="text-[11px] font-medium leading-relaxed">
                  Digita palabras clave para consultar en tiempo real actividades ecoturísticas, resorts de aguas termales y restaurantes certificados disponibles en Costa Rica.
                </p>
              </div>
            )}

            {/* Custom Activity Creation Form */}
            {addingCustom && (
              <div className="bg-slate-850 border border-slate-800 p-3.5 rounded-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-150 mt-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-200">Crear Nueva Actividad</h5>
                  <button 
                    onClick={() => setAddingCustom(false)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <X size={12} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Nombre</label>
                  <Input 
                    type="text"
                    placeholder="Ej. Caminata al Mirador"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="bg-slate-800 border-slate-800 text-white rounded-xl text-xs placeholder:text-slate-600 focus-visible:ring-emerald-600 h-8.5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Costo ($ USD)</label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={customCost}
                    onChange={(e) => setCustomCost(Number(e.target.value))}
                    className="bg-slate-800 border-slate-800 text-white rounded-xl text-xs placeholder:text-slate-650 focus-visible:ring-emerald-600 h-8.5"
                  />
                </div>

                <Button 
                  onClick={handleAddCustomActivity}
                  disabled={!customName.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-xl active:scale-[0.98] transition-transform"
                >
                  Agregar al Día {days[activeDayIdx]?.day}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="border-t border-slate-800 pt-4 mt-4 flex items-center justify-between gap-3 shrink-0">
        {/* Total Cost live computation */}
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Costo Estimado</span>
          <span className="text-xl font-black text-emerald-400 flex items-center leading-none mt-1">
            ${days.reduce((sum, day) => {
              return sum + (day.activities?.reduce((daySum, act) => daySum + (act.price || act.cost || 0), 0) || 0)
            }, 0)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-750 border border-slate-800 hover:border-slate-700 text-slate-300 font-extrabold py-2 px-4 rounded-xl text-xs active:scale-[0.98] transition-transform"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-5 rounded-xl text-xs shadow-md shadow-emerald-950/20 active:scale-[0.98] transition-transform flex items-center gap-1"
          >
            <Check size={12} className="stroke-[3px]" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function Spinner({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' }) {
  const sizeClasses = {
    xs: 'h-3.5 w-3.5 stroke-[3px]',
    sm: 'h-4 w-4 stroke-[3px]',
    md: 'h-6 w-6 stroke-2'
  }
  return (
    <svg
      className={`animate-spin text-emerald-500 ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
