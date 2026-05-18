'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ItineraryChat } from '@/features/itinerary/components/ItineraryChat'
import { PreChatPreferences, PreChatData } from '@/features/itinerary/components/PreChatPreferences'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapPin, Calendar, Sparkles, ChevronDown, ChevronRight, Compass, ArrowRight, Loader2, Clock, Trash2, Pencil } from 'lucide-react'
import { cn, robustParseJson } from '@/lib/utils'
import type { Itinerary } from '@/types'
import { useNotification } from '@/components/ui/NotificationProvider'
import { ItineraryEditModal } from '@/features/itinerary/components/ItineraryEditModal'

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
}

interface RobustItineraryDay {
  day: number
  date?: string
  activities?: RobustActivity[]
}

interface RobustPreferences {
  location?: string
  destination?: string
  start_date?: string
  startDate?: string
  end_date?: string
  endDate?: string
}

export default function ItineraryPage() {
  const { showAlert, showConfirm } = useNotification()
  
  // 1. Unified State Orchestration
  const [preferences, setPreferences] = useState<PreChatData>({
    destination: 'Arenal',
    duration: 5,
    travelers: 2,
    vibe: 'nature',
    budget: 'moderate',
    budgetAmount: 2500,
    services: ['hotels', 'activities', 'restaurants'],
    startDate: null,
    endDate: null,
    travelersDetails: [
      { age: 30, gender: 'male', relationship: 'Yo' },
      { age: 28, gender: 'female', relationship: 'Pareja' }
    ]
  })
  
  const [preferencesApplied, setPreferencesApplied] = useState(false)
  const [showPreferencesPanel, setShowPreferencesPanel] = useState(false)
  const [generatePlanTrigger, setGeneratePlanTrigger] = useState<number | null>(null)

  // 2. Saved Itineraries Database Query states
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loadingItineraries, setLoadingItineraries] = useState(true)
  const [expandedItineraryId, setExpandedItineraryId] = useState<string | null>(null)
  
  // Interactive Editing States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItinerary, setEditingItinerary] = useState<{ id: string; days: RobustItineraryDay[] } | null>(null)

  const fetchItineraries = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        setItineraries(data as Itinerary[])
        // Auto-expand the first one if we have it
        if (data.length > 0 && !expandedItineraryId) {
          setExpandedItineraryId(data[0].id)
        }
      }
    } catch (err) {
      console.error('Error fetching itineraries:', err)
    } finally {
      setLoadingItineraries(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    fetchItineraries()
  }, [])

  const handleItinerarySaved = () => {
    // Re-query database to display newly saved n8n itineraries in real-time
    fetchItineraries()
  }

  const handleDeleteItinerary = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!(await showConfirm('¿Estás seguro de que deseas eliminar este itinerario?', 'Confirmar eliminación'))) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItineraries((prev) => prev.filter((it) => it.id !== id))
      if (expandedItineraryId === id) {
        setExpandedItineraryId(null)
      }
    } catch (err) {
      console.error('Error deleting itinerary:', err)
      await showAlert('No se pudo eliminar el itinerario. Inténtalo de nuevo.', 'Error')
    }
  }

  const handleUpdateItinerary = async (updatedDays: RobustItineraryDay[]) => {
    if (!editingItinerary) return

    // Calculate new total cost by summing activities
    const totalCost = updatedDays.reduce((sum, day) => {
      return sum + (day.activities?.reduce((daySum, act) => daySum + (act.price || act.cost || 0), 0) || 0)
    }, 0)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('itineraries')
        .update({
          days: updatedDays,
          total_cost: totalCost
        })
        .eq('id', editingItinerary.id)

      if (error) throw error

      setItineraries((prev) => 
        prev.map((it) => 
          it.id === editingItinerary.id 
            ? { ...it, days: updatedDays as any, total_cost: totalCost } 
            : it
        )
      )
      
      await showAlert('Itinerario actualizado con éxito.', 'Éxito')
    } catch (err) {
      console.error('Error updating itinerary:', err)
      await showAlert('No se pudo guardar la edición del itinerario.', 'Error')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-slate-50 overflow-hidden">
      
      {/* 1. Collapsible Panel top zone */}
      <PreChatPreferences 
        preferences={preferences}
        onChange={setPreferences}
        isExpanded={showPreferencesPanel}
        preferencesApplied={preferencesApplied}
        onApply={setPreferencesApplied}
        onToggleExpand={setShowPreferencesPanel}
        onTriggerGeneratePlan={() => {
          setPreferencesApplied(true)
          setShowPreferencesPanel(false)
          setGeneratePlanTrigger(Date.now())
        }}
      />

      {/* 2. Lower double-column workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
        
        {/* Left Column: Tus Itinerarios (ancho ~40%) */}
        <div className="w-full md:w-[40%] flex flex-col h-1/2 md:h-full bg-white overflow-hidden p-5 shrink-0">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={14} className="text-emerald-500" />
              Tus Itinerarios
            </h2>
            {itineraries.length > 0 && (
              <Badge variant="success" className="text-[10px] font-bold py-0.5 px-2">
                {itineraries.length} {itineraries.length === 1 ? 'Generado' : 'Generados'}
              </Badge>
            )}
          </div>

          {/* List area with custom scrollable area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1 min-h-0">
            {loadingItineraries ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                <Loader2 size={24} className="animate-spin text-emerald-500" />
                <span className="text-xs font-semibold">Cargando tus itinerarios...</span>
              </div>
            ) : itineraries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30 text-center h-56">
                <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-3 shadow-2xs">
                  <Sparkles size={18} />
                </div>
                <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">Aún no hay itinerario</p>
                <p className="text-[10.5px] text-slate-400 font-medium max-w-[240px] leading-relaxed">
                  Completa tus preferencias arriba y pídele a tu Asistente IA en el chat que elabore tu viaje.
                </p>
              </div>
            ) : (
              itineraries.map((itinerary) => {
                const isExpanded = expandedItineraryId === itinerary.id
                
                // Graceful fallback for preferences formats with robust JSON parsing
                const parsedPreferences = robustParseJson<RobustPreferences>(itinerary.preferences, {})
                const parsedDays = robustParseJson<RobustItineraryDay[]>(itinerary.days, [])

                const loc = parsedPreferences?.location || parsedPreferences?.destination || 'Costa Rica'
                const start = parsedPreferences?.start_date || parsedPreferences?.startDate || 'Pronto'
                const end = parsedPreferences?.end_date || parsedPreferences?.endDate || ''
                const daysCount = parsedDays.length || 1

                return (
                  <Card 
                    key={itinerary.id} 
                    className={cn(
                      "border transition-all duration-200 overflow-hidden shadow-2xs",
                      isExpanded 
                        ? "border-emerald-500/80 bg-emerald-50/10 shadow-sm" 
                        : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    )}
                  >
                    {/* Header Summary click selector */}
                    <div 
                      onClick={() => setExpandedItineraryId(isExpanded ? null : itinerary.id)}
                      className="p-4 cursor-pointer flex items-start justify-between gap-3 text-left select-none"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate flex items-center gap-1.5">
                          <MapPin size={13} className="text-emerald-500 shrink-0" />
                          {loc}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                          <span className="inline-flex items-center gap-0.5">
                            <Calendar size={11} className="text-slate-400" />
                            {start} {end ? `al ${end}` : `(${daysCount} días)`}
                          </span>
                          {itinerary.total_cost > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-100/50 rounded px-1">
                              ${itinerary.total_cost.toLocaleString()} USD
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingItinerary({ id: itinerary.id, days: parsedDays })
                            setIsEditModalOpen(true)
                          }}
                          className="text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all p-1.5 rounded-lg active:scale-95"
                          title="Editar itinerario"
                        >
                          <Pencil size={13} />
                        </button>
                        <button 
                          type="button" 
                          onClick={(e) => handleDeleteItinerary(itinerary.id, e)}
                          className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all p-1.5 rounded-lg active:scale-95"
                          title="Eliminar itinerario"
                        >
                          <Trash2 size={13} />
                        </button>
                        <button 
                          type="button" 
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable detailed activities and checkout action */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-slate-100 bg-white/70 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="space-y-3.5 mt-3.5">
                          {parsedDays.map((day) => (
                            <div key={day.day} className="relative border-l border-emerald-250 pl-4.5 pb-4 last:pb-1">
                              <div className="absolute -left-1 top-0 flex h-2 w-2 rounded-full bg-emerald-600" />
                              
                              <p className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 leading-none">
                                Día {day.day} • {day.date || `Paso #${day.day}`}
                              </p>
                              
                              <div className="flex flex-col gap-2">
                                {day.activities?.map((activity: RobustActivity, idx: number) => {
                                  const actId = activity.id || `act-${day.day}-${idx}`
                                  const actName = activity.name || activity.description || activity.title || 'Actividad'
                                  const actLoc = activity.location || 'Costa Rica'
                                  const actPrice = activity.price !== undefined ? activity.price : (activity.cost !== undefined ? activity.cost : 0)
                                  const actDuration = activity.duration_minutes 
                                    ? `${activity.duration_minutes} min` 
                                    : (activity.time ? activity.time : 'Flexible')

                                  return (
                                    <div 
                                      key={actId} 
                                      className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl shadow-3xs text-left"
                                    >
                                      <div className="flex items-start justify-between gap-1.5">
                                        <div>
                                          <h4 className="font-bold text-slate-800 text-[10.5px] leading-tight">
                                            {actName}
                                          </h4>
                                          <p className="text-[9px] font-semibold text-slate-400 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <span className="flex items-center gap-0.5">
                                              <MapPin size={10} className="text-slate-400 shrink-0" />
                                              {actLoc}
                                            </span>
                                            <span className="text-slate-250 font-normal select-none">•</span>
                                            <span className="flex items-center gap-0.5">
                                              <Clock size={10} className="text-slate-400 shrink-0" />
                                              {actDuration}
                                            </span>
                                          </p>
                                        </div>
                                        <span className="font-extrabold text-emerald-600 text-[10.5px] shrink-0">
                                          ${actPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Booking Checkout Trigger button */}
                        <Button
                          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-sm hover:shadow-md transition-all active:scale-[0.99] shrink-0"
                          onClick={() => {
                            const activities = parsedDays.flatMap((d) => d.activities ?? [])
                            const ids = activities.map((a: RobustActivity) => a?.id).filter(Boolean).join(',')
                            window.location.href = `/booking?activities=${ids}`
                          }}
                        >
                          Reservar este Itinerario
                          <ArrowRight size={13} className="ml-1" />
                        </Button>
                      </div>
                    )}
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat with the AI assistant (flex: 1) */}
        <div className="flex-1 flex flex-col h-1/2 md:h-full bg-slate-50/20 overflow-hidden">
          <ItineraryChat 
            preferences={preferences}
            setPreferences={setPreferences}
            preferencesApplied={preferencesApplied}
            setPreferencesApplied={setPreferencesApplied}
            onItinerarySaved={handleItinerarySaved}
            generatePlanTrigger={generatePlanTrigger}
          />
        </div>
      </div>

      {editingItinerary && (
        <ItineraryEditModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingItinerary(null)
          }}
          itineraryId={editingItinerary.id}
          initialDays={editingItinerary.days}
          onSave={handleUpdateItinerary}
        />
      )}
    </div>
  )
}