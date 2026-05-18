'use client'

import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  Activity, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  AlertCircle,
  Search,
  User,
  Heart,
  Compass,
  Coffee,
  Trees,
  Sprout,
  Crown,
  Coins,
  Banknote,
  X,
  Map,
  Trash2
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface GoogleMapsWindow extends Window {
  google: typeof google
  initGoogleMaps: () => void
}

declare let window: GoogleMapsWindow

export interface TravelerDetail {
  age: number
  gender: 'male' | 'female' | 'other'
  relationship: 'Yo' | 'Pareja' | 'Hijo/a' | 'Padre/Madre' | 'Amigo/a' | 'Otro'
}

export interface PreChatData {
  destination: string
  lat?: number
  lng?: number
  duration: number
  travelers: number
  travelersDetails?: TravelerDetail[]
  vibe: string
  budget: string // 'budget' | 'moderate' | 'luxury'
  budgetAmount?: number | null
  services: string[]
  startDate?: string | null
  endDate?: string | null
}

interface PreChatPreferencesProps {
  preferences: PreChatData
  onChange: (data: PreChatData) => void
  isExpanded?: boolean
  preferencesApplied: boolean
  onApply: (applied: boolean) => void
  onToggleExpand?: (expanded: boolean) => void
  onTriggerGeneratePlan?: () => void
}

const COSTA_RICA_PLACES = [
  { name: 'La Fortuna, Alajuela (Arenal)', shortName: 'Arenal', lat: 10.4678, lng: -84.6427, zone: 'Alajuela', x: 175, y: 100 },
  { name: 'Manuel Antonio, Puntarenas', shortName: 'Manuel Antonio', lat: 9.3874, lng: -84.1373, zone: 'Puntarenas', x: 220, y: 245 },
  { name: 'Tamarindo, Guanacaste', shortName: 'Tamarindo', lat: 10.2993, lng: -85.8400, zone: 'Guanacaste', x: 65, y: 110 },
  { name: 'Monteverde, Puntarenas', shortName: 'Monteverde', lat: 10.2750, lng: -84.8255, zone: 'Puntarenas', x: 145, y: 130 },
  { name: 'Puerto Viejo de Talamanca, Limón', shortName: 'Puerto Viejo', lat: 9.6553, lng: -82.7540, zone: 'Limón', x: 380, y: 210 },
  { name: 'Jacó, Puntarenas', shortName: 'Jacó', lat: 9.6149, lng: -84.6288, zone: 'Puntarenas', x: 185, y: 210 },
  { name: 'Santa Teresa, Puntarenas', shortName: 'Santa Teresa', lat: 9.6433, lng: -85.1691, zone: 'Puntarenas', x: 105, y: 200 },
  { name: 'Tortuguero, Limón', shortName: 'Tortuguero', lat: 10.5417, lng: -83.5042, zone: 'Limón', x: 310, y: 90 },
  { name: 'Nosara, Guanacaste', shortName: 'Nosara', lat: 9.9792, lng: -85.6692, zone: 'Guanacaste', x: 75, y: 155 },
  { name: 'Uvita, Puntarenas (Bahía Ballena)', shortName: 'Uvita', lat: 9.1729, lng: -83.7380, zone: 'Puntarenas', x: 255, y: 285 }
]

const PRESET_CHIPS = ['Arenal', 'Manuel Antonio', 'Tamarindo', 'Monteverde', 'Puerto Viejo']

const VIBES = [
  { id: 'adventure', label: 'Aventura', icon: Compass },
  { id: 'relaxation', label: 'Relax', icon: Coffee },
  { id: 'nature', label: 'Naturaleza', icon: Trees },
  { id: 'eco', label: 'Ecoturismo', icon: Sprout },
  { id: 'luxury', label: 'Lujo', icon: Crown },
]

const BUDGET_TIERS = [
  { id: 'budget', label: 'Económico', icon: Coins, desc: 'Presupuesto medido', amount: 1000 },
  { id: 'moderate', label: 'Moderado', icon: Banknote, desc: 'Buen balance precio/calidad', amount: 2500 },
  { id: 'luxury', label: 'Lujo', icon: Crown, desc: 'Experiencias exclusivas', amount: 7500 },
]

const SERVICES = [
  { id: 'hotels', label: 'Hoteles', icon: Sparkles },
  { id: 'activities', label: 'Tours', icon: Activity },
  { id: 'restaurants', label: 'Comida', icon: Check },
]

const DURATION_PRESETS = [
  { label: '3d', days: 3 },
  { label: '5d', days: 5 },
  { label: '7d', days: 7 },
  { label: '10d', days: 10 },
  { label: '2sem', days: 14 }
]

function formatDateString(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function PreChatPreferences({ 
  preferences, 
  onChange, 
  isExpanded = false,
  preferencesApplied,
  onApply,
  onToggleExpand,
  onTriggerGeneratePlan
}: PreChatPreferencesProps) {
  const [expanded, setExpanded] = useState(isExpanded)
  
  // Local draft preferences to prevent chat spam until "Aplicar" is clicked
  const [draft, setDraft] = useState<PreChatData>({ ...preferences })

  // Sync draft state with incoming preferences props if they change externally
  useEffect(() => {
    setDraft({ ...preferences })
  }, [preferences])

  // Destination autocomplete search states
  const [searchText, setSearchText] = useState('')
  const [predictions, setPredictions] = useState<typeof COSTA_RICA_PLACES>([])
  const [showPredictions, setShowPredictions] = useState(false)
  
  // Custom points added by clicking on either map
  interface CustomMapPoint {
    name: string
    x: number
    y: number
    lat?: number
    lng?: number
  }
  const [customPoints, setCustomPoints] = useState<CustomMapPoint[]>([])
  const [customPointModal, setCustomPointModal] = useState<{ x: number; y: number; lat?: number; lng?: number } | null>(null)
  const [customPointName, setCustomPointName] = useState('')

  const [googleMapsApiKey] = useState(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyABpF5b5lniSxWkxikr44Jm_WHw7Qxaq0Y')
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false)

  // Refs for Google Map instances
  const googleMapRef = useRef<HTMLDivElement>(null)
  const googleMapInstanceRef = useRef<google.maps.Map | null>(null)
  const googleMarkersRef = useRef<globalThis.Map<string, google.maps.Marker>>(new globalThis.Map())

  // Bounding box mapping formula to bridge real GPS coordinates and stylized SVG coordinates
  const latLngToSvgCoords = (lat: number, lng: number) => {
    const minLat = 8.0
    const maxLat = 11.2
    const minLng = -86.0
    const maxLng = -82.4
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 500
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 400
    
    return {
      x: Math.round(Math.max(10, Math.min(490, x))),
      y: Math.round(Math.max(10, Math.min(390, y)))
    }
  }

  // Utility to parse destination comma separated string
  const getSelectedPlaces = (destinationStr: string): string[] => {
    if (!destinationStr) return []
    return destinationStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }

  const isPlaceSelected = (shortName: string) => {
    const current = getSelectedPlaces(draft.destination)
    return current.some(p => 
      p.toLowerCase().includes(shortName.toLowerCase()) ||
      shortName.toLowerCase().includes(p.toLowerCase())
    )
  }

  const togglePlace = (shortName: string) => {
    const current = getSelectedPlaces(draft.destination)
    const isSel = current.some(p => 
      p.toLowerCase().includes(shortName.toLowerCase()) ||
      shortName.toLowerCase().includes(p.toLowerCase())
    )
    
    let next: string[]
    if (isSel) {
      next = current.filter(p => 
        !p.toLowerCase().includes(shortName.toLowerCase()) &&
        !shortName.toLowerCase().includes(p.toLowerCase())
      )
    } else {
      next = [...current, shortName]
    }
    
    const newDest = next.join(', ')
    setDraft(prev => ({ ...prev, destination: newDest }))
  }

  // Dynamic Google Maps SDK loader hook with extremely robust polling and fallback listener
  useEffect(() => {
    if (googleMapsLoaded || !googleMapsApiKey) return

    const checkGoogleMaps = () => {
      if (window.google?.maps) {
        setGoogleMapsLoaded(true)
        return true
      }
      return false
    }

    if (checkGoogleMaps()) return

    const interval = setInterval(() => {
      if (checkGoogleMaps()) {
        clearInterval(interval)
      }
    }, 300)

    const existingScript = document.getElementById('google-maps-script')
    if (existingScript) {
      existingScript.addEventListener('load', () => setGoogleMapsLoaded(true))
      return () => {
        clearInterval(interval)
      }
    }

    window.initGoogleMaps = () => setGoogleMapsLoaded(true)

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      clearInterval(interval)
    }
  }, [googleMapsApiKey, googleMapsLoaded])

  // Synchronize custom points when draft.destination changes (from user or AI)
  useEffect(() => {
    const places = getSelectedPlaces(draft.destination)
    // Filter out items that match COSTA_RICA_PLACES by shortName or name
    const rawCustomNames = places.filter(pName => {
      const isPreset = COSTA_RICA_PLACES.some(preset => 
        preset.name.toLowerCase().includes(pName.toLowerCase()) ||
        pName.toLowerCase().includes(preset.shortName.toLowerCase())
      )
      return !isPreset
    })

    // Update customPoints state: keep coordinates if they exist, or assign random coordinates geolocated in Costa Rica
    setCustomPoints(prev => {
      return rawCustomNames.map(name => {
        const existing = prev.find(p => p.name === name)
        if (existing) return existing
        
        // Random offset generators for coordinates
        const geoOffset = () => (Math.random() - 0.5) * 0.45
        const lat = 9.9281 + geoOffset()
        const lng = -84.0907 + geoOffset()
        const svgCoords = latLngToSvgCoords(lat, lng)

        return {
          name,
          x: svgCoords.x,
          y: svgCoords.y,
          lat,
          lng
        }
      })
    })
  }, [draft.destination])

  // Initialize and synchronize Live Google Map markers
  useEffect(() => {
    if (!googleMapsLoaded || !googleMapRef.current) return

    let map = googleMapInstanceRef.current
    if (!map) {
      map = new window.google.maps.Map(googleMapRef.current, {
        center: { lat: 9.7489, lng: -83.7534 },
        zoom: 7.8,
        styles: [
          {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c0e2f8' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f8fafc' }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true
      })
      googleMapInstanceRef.current = map

      // Click listener to drop new custom waypoint
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        const latLng = e.latLng
        if (latLng) {
          const lat = latLng.lat()
          const lng = latLng.lng()
          const svgCoords = latLngToSvgCoords(lat, lng)
          setCustomPointModal({
            x: svgCoords.x,
            y: svgCoords.y,
            lat,
            lng
          })
        }
      })
    }

    const activePlaces = getSelectedPlaces(draft.destination)

    // Clear obsolete markers that are NOT presets and NOT active custom points
    googleMarkersRef.current.forEach((marker, name) => {
      const isPreset = COSTA_RICA_PLACES.some(p => p.shortName.toLowerCase() === name.toLowerCase())
      const isCustomActive = customPoints.some(p => p.name.toLowerCase() === name.toLowerCase() && isPlaceSelected(p.name))
      
      if (!isPreset && !isCustomActive) {
        marker.setMap(null)
        googleMarkersRef.current.delete(name)
      }
    })

    // Preset location markers (Suggestions)
    COSTA_RICA_PLACES.forEach(place => {
      const active = isPlaceSelected(place.shortName)
      let marker = googleMarkersRef.current.get(place.shortName)

      if (!marker) {
        marker = new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: map!,
          title: place.shortName,
        })

        // Clicking the preset marker toggles the place selection reactively!
        marker.addListener('click', () => {
          togglePlace(place.shortName)
        })

        googleMarkersRef.current.set(place.shortName, marker)
      }

      // Update appearance based on active state: Green pulsing/glowing if selected, slate/gray suggestion if unselected
      marker.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: active ? '#10b981' : '#94a3b8',
        fillOpacity: active ? 0.95 : 0.5,
        strokeColor: '#ffffff',
        strokeWeight: active ? 2.5 : 1.5,
        scale: active ? 9 : 6
      })
    })

    // Custom location markers
    customPoints.forEach(point => {
      const active = isPlaceSelected(point.name)
      let marker = googleMarkersRef.current.get(point.name)

      if (active) {
        if (!marker) {
          const lat = point.lat ?? 9.7489
          const lng = point.lng ?? -83.7534

          marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map!,
            title: point.name,
          })

          marker.addListener('click', () => {
            togglePlace(point.name)
          })

          googleMarkersRef.current.set(point.name, marker)
        }

        // Custom points are amber
        marker.setIcon({
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#f59e0b',
          fillOpacity: 0.95,
          strokeColor: '#ffffff',
          strokeWeight: 2.5,
          scale: 9
        })
      } else {
        if (marker) {
          marker.setMap(null)
          googleMarkersRef.current.delete(point.name)
        }
      }
    })

  }, [googleMapsLoaded, draft.destination, customPoints, expanded])

  // Clean up dirty Google Maps instance reference when preferences panel is collapsed
  useEffect(() => {
    if (!expanded) {
      googleMapInstanceRef.current = null
      googleMarkersRef.current.clear()
    }
  }, [expanded])

  const handleSearchChange = (val: string) => {
    setSearchText(val)
    if (!val.trim()) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    const query = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const matches = COSTA_RICA_PLACES.filter(place => {
      const normalizedName = place.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const normalizedShort = place.shortName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return normalizedName.includes(query) || normalizedShort.includes(query)
    })

    setPredictions(matches)
    setShowPredictions(matches.length > 0)
  }

  const handleSelectPrediction = (place: typeof COSTA_RICA_PLACES[0]) => {
    togglePlace(place.shortName)
    setSearchText('')
    setPredictions([])
    setShowPredictions(false)
  }

  const handleAddCustomPoint = () => {
    if (!customPointName.trim() || !customPointModal) return
    const name = customPointName.trim()
    const { x, y } = customPointModal
    
    // Add to customPoints
    setCustomPoints(prev => [...prev, { name, x, y }])
    
    // Add to draft.destination
    const current = getSelectedPlaces(draft.destination)
    if (!current.some(p => p.toLowerCase() === name.toLowerCase())) {
      const next = [...current, name]
      setDraft(prev => ({ ...prev, destination: next.join(', ') }))
    }
    setCustomPointModal(null)
    setCustomPointName('')
  }

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 500
    const y = ((e.clientY - rect.top) / rect.height) * 400
    setCustomPointModal({ x: Math.round(x), y: Math.round(y) })
  }

  // Handle Quick duration presets calculation
  const applyDurationPreset = (days: number) => {
    const start = draft.startDate ? new Date(draft.startDate + 'T00:00:00') : new Date()
    const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000)

    setDraft(prev => ({
      ...prev,
      startDate: formatDateString(start),
      endDate: formatDateString(end),
      duration: days
    }))
  }

  // Travelers detail synchronization
  useEffect(() => {
    const currentDetails = draft.travelersDetails || []
    if (currentDetails.length === draft.travelers) return

    let newDetails = [...currentDetails]
    if (draft.travelers > currentDetails.length) {
      for (let i = currentDetails.length; i < draft.travelers; i++) {
        newDetails.push({
          age: i === 0 ? 30 : 28,
          gender: 'female',
          relationship: i === 0 ? 'Yo' : 'Pareja'
        })
      }
    } else {
      newDetails = newDetails.slice(0, draft.travelers)
    }

    setDraft(prev => ({
      ...prev,
      travelersDetails: newDetails
    }))
  }, [draft.travelers])

  const toggleService = (serviceId: string) => {
    const currentServices = draft.services || []
    const updated = currentServices.includes(serviceId)
      ? currentServices.filter(s => s !== serviceId)
      : [...currentServices, serviceId]
    setDraft(prev => ({ ...prev, services: updated }))
  }

  // Check if draft has unapplied changes
  const isDraftDifferent = JSON.stringify(draft) !== JSON.stringify(preferences)
  const showDraftBanner = isDraftDifferent || !preferencesApplied

  const handleApply = () => {
    onChange(draft)
    onApply(true)
    setExpanded(false)
    if (onToggleExpand) onToggleExpand(false)
  }

  const handleToggle = () => {
    const nextVal = !expanded
    setExpanded(nextVal)
    if (onToggleExpand) onToggleExpand(nextVal)
  }

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200/80 transition-all duration-300">
      
      {/* Collapsed Header / Summary Bar */}
      <div 
        onClick={handleToggle}
        className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-slate-100/50 transition-colors select-none"
      >
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tus Preferencias
          </span>
          
          {preferences.destination ? (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                <MapPin size={11} className="text-emerald-500 shrink-0" />
                {preferences.destination}
              </span>
              {preferences.startDate && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  <CalendarIcon size={11} className="text-emerald-500 shrink-0" />
                  {preferences.startDate} {preferences.endDate ? `al ${preferences.endDate}` : ''}
                </span>
              )}
              {preferences.budgetAmount && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  <DollarSign size={11} className="text-emerald-500 shrink-0" />
                  ${preferences.budgetAmount.toLocaleString()} USD
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                <Users size={11} className="text-emerald-500 shrink-0" />
                {preferences.travelers} {preferences.travelers === 1 ? 'persona' : 'personas'}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                {(() => {
                  const activeVibe = VIBES.find(v => v.id === preferences.vibe)
                  const IconComp = activeVibe?.icon || Sparkles
                  return <IconComp size={11} className="text-emerald-500 shrink-0" />
                })()}
                {VIBES.find(v => v.id === preferences.vibe)?.label || preferences.vibe}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-medium">
              Configura tus preferencias para generar un itinerario personalizado →
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {preferences.destination && onTriggerGeneratePlan && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation() // Prevent toggling the panel
                onTriggerGeneratePlan()
              }}
              className="text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98] select-none hover:shadow-emerald-500/10 shrink-0"
            >
              <Sparkles size={13} className="text-white animate-pulse" />
              Generar Plan IA
            </button>
          )}

          <button 
            type="button"
            className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/50 px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs shrink-0"
          >
            {expanded ? 'Ocultar' : 'Editar'}
            {expanded ? <ChevronUp size={13} strokeWidth={2.5} /> : <ChevronDown size={13} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
      {/* Expanded panel container */}
      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50 flex flex-col max-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-top-4 duration-200 relative overflow-hidden">
          
          {/* Main scrollable body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            
            {/* Unapplied Changes Alert banner */}
            {showDraftBanner && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800 shadow-sm">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <span>Cambios en borrador. Haz clic en <strong>"Aplicar Preferencias al Asistente"</strong> abajo para cargarlos en el chat.</span>
              </div>
            )}
            
            {/* Form grid hierarchy - Gorgeous 3 columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              
              {/* COLUMN 1: DESTINATION MULTI-SELECT & GOOGLE MAP */}
              <div className="space-y-4 text-left bg-white p-4.5 rounded-xl border border-slate-200/60 shadow-xs relative">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={11} className="text-emerald-500" />
                    Destinos a Incluir ({getSelectedPlaces(draft.destination).length})
                  </label>
                  <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    Google Maps
                  </span>
                </div>

                {/* Autocomplete Input Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search size={13} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      setPredictions(COSTA_RICA_PLACES)
                      setShowPredictions(true)
                    }}
                    onBlur={() => setTimeout(() => setShowPredictions(false), 200)}
                    placeholder="Busca y agrega destinos..."
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-semibold text-slate-700 bg-white placeholder-slate-400 shadow-xs"
                  />

                  {/* Autocomplete Dropdown */}
                  {showPredictions && predictions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                      {predictions.map((p) => {
                        const selected = isPlaceSelected(p.shortName)
                        return (
                          <div
                            key={p.name}
                            onMouseDown={() => handleSelectPrediction(p)}
                            className={cn(
                              "px-3.5 py-2.5 hover:bg-emerald-50/50 cursor-pointer flex items-center justify-between gap-2 transition-colors",
                              selected && "bg-emerald-50/30"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <MapPin size={11} className={cn("mt-0.5 shrink-0", selected ? "text-emerald-600" : "text-slate-400")} />
                              <div className="text-[10.5px] text-left">
                                <p className="font-bold text-slate-700 leading-none">{p.name}</p>
                                <p className="text-slate-400 text-[8.5px] mt-0.5">Región: {p.zone}</p>
                              </div>
                            </div>
                            {selected && <Check size={12} className="text-emerald-600 shrink-0" />}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Places Tags */}
                {getSelectedPlaces(draft.destination).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50/50 border border-slate-100 rounded-lg max-h-20 overflow-y-auto">
                    {getSelectedPlaces(draft.destination).map((place) => {
                      const preset = COSTA_RICA_PLACES.find(p => p.shortName.toLowerCase() === place.toLowerCase())
                      const isCustom = !preset
                      return (
                        <span
                          key={place}
                          className={cn(
                            "inline-flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs transition-all",
                            isCustom 
                              ? "bg-amber-50 border border-amber-200 text-amber-800" 
                              : "bg-emerald-50 border border-emerald-200 text-emerald-800"
                          )}
                        >
                          <MapPin size={9} className={isCustom ? "text-amber-500" : "text-emerald-500"} />
                          {place}
                          <button
                            type="button"
                            onClick={() => togglePlace(place)}
                            className="hover:bg-slate-200/60 p-0.5 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* REAL GOOGLE MAP CONTAINER */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200/80 shadow-inner bg-slate-50 p-1 group/map h-[190px]">
                  <div className="w-full h-full relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <div ref={googleMapRef} className="w-full h-full min-h-[180px]" />
                    {!googleMapsLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-20 backdrop-blur-xs flex-col gap-2">
                        <span className="text-[10px] font-bold text-slate-500 animate-pulse">Cargando Google Maps...</span>
                      </div>
                    )}
                  </div>

                  {/* Map Click Help Banner */}
                  <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-xs text-[7.5px] font-bold text-white px-2 py-1 rounded-md pointer-events-none select-none opacity-0 group-hover/map:opacity-100 transition-opacity z-10">
                    📍 Haz clic en el mapa para añadir un waypoint personalizado
                  </div>

                  {/* Custom Point Modal dialog */}
                  {customPointModal && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-2 z-50 rounded-lg">
                      <div className="bg-white p-3 rounded-xl shadow-2xl border border-slate-200 w-full max-w-[210px] space-y-2.5 animate-in zoom-in-95 duration-150">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-center">Nuevo Punto</span>
                        <input
                          type="text"
                          placeholder="Nombre (ej. Playa Hermosa)"
                          value={customPointName}
                          onChange={(e) => setCustomPointName(e.target.value)}
                          className="w-full text-xs font-semibold px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 bg-white"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (customPointName.trim()) {
                                const name = customPointName.trim()
                                const { x, y, lat, lng } = customPointModal
                                setCustomPoints(prev => [...prev, { name, x, y, lat, lng }])
                                
                                const current = getSelectedPlaces(draft.destination)
                                if (!current.some(p => p.toLowerCase() === name.toLowerCase())) {
                                  const next = [...current, name]
                                  setDraft(prev => ({ ...prev, destination: next.join(', ') }))
                                }
                                
                                setCustomPointModal(null)
                                setCustomPointName('')
                              }
                            }
                          }}
                        />
                        <div className="flex gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (customPointName.trim() && customPointModal) {
                                const name = customPointName.trim()
                                const { x, y, lat, lng } = customPointModal
                                setCustomPoints(prev => [...prev, { name, x, y, lat, lng }])
                                
                                const current = getSelectedPlaces(draft.destination)
                                if (!current.some(p => p.toLowerCase() === name.toLowerCase())) {
                                  const next = [...current, name]
                                  setDraft(prev => ({ ...prev, destination: next.join(', ') }))
                                }
                              }
                              setCustomPointModal(null)
                              setCustomPointName('')
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Añadir
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomPointModal(null)
                              setCustomPointName('')
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9.5px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scrollable list selector */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lista de Lugares</span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[85px] overflow-y-auto p-1 bg-slate-50/50 border border-slate-100 rounded-lg">
                    {COSTA_RICA_PLACES.map((p) => {
                      const selected = isPlaceSelected(p.shortName)
                      return (
                        <button
                          type="button"
                          key={p.shortName}
                          onClick={() => togglePlace(p.shortName)}
                          className={cn(
                            "px-2.5 py-1.5 rounded-lg text-[9.5px] font-bold border transition-all flex items-center justify-between shadow-3xs text-left",
                            selected 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-extrabold" 
                              : "bg-white border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                          )}
                        >
                          <span className="truncate">{p.shortName}</span>
                          {selected && <Check size={10} className="text-emerald-600 shrink-0 ml-1" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* COLUMN 2: DATES & TRAVELERS */}
              <div className="space-y-4">
                
                {/* FECHAS DE VIAJE */}
                <div className="space-y-3.5 text-left bg-white p-4.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon size={11} className="text-emerald-500" />
                    Fechas de Viaje
                  </label>

                  {/* Two Date Pickers Side-by-Side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Llegada</span>
                      <input
                        type="date"
                        value={draft.startDate || ''}
                        min={formatDateString(new Date())}
                        onChange={(e) => {
                          const arrival = e.target.value
                          setDraft(prev => {
                            const next = { ...prev, startDate: arrival }
                            if (arrival && next.endDate) {
                              const a = new Date(arrival + 'T00:00:00')
                              const b = new Date(next.endDate + 'T00:00:00')
                              if (b >= a) {
                                next.duration = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1
                              }
                            }
                            return next
                          })
                        }}
                        className="w-full text-xs font-bold text-slate-600 border border-slate-200 rounded-lg p-2 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Salida</span>
                      <input
                        type="date"
                        value={draft.endDate || ''}
                        min={draft.startDate || formatDateString(new Date())}
                        onChange={(e) => {
                          const departure = e.target.value
                          setDraft(prev => {
                            const next = { ...prev, endDate: departure }
                            if (next.startDate && departure) {
                              const a = new Date(next.startDate + 'T00:00:00')
                              const b = new Date(departure + 'T00:00:00')
                              if (b >= a) {
                                next.duration = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1
                              }
                            }
                            return next
                          })
                        }}
                        className="w-full text-xs font-bold text-slate-600 border border-slate-200 rounded-lg p-2 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  {/* Quick duration presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                    <span className="text-[9px] font-extrabold text-slate-400 mr-1 uppercase">Días:</span>
                    {DURATION_PRESETS.map((p) => {
                      const active = draft.duration === p.days
                      return (
                        <button
                          type="button"
                          key={p.label}
                          onClick={() => applyDurationPreset(p.days)}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border shadow-2xs select-none",
                            active 
                              ? "bg-emerald-600 border-emerald-600 text-white" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* VIAJEROS & DETAILS */}
                <div className="space-y-3.5 text-left bg-white p-4.5 rounded-xl border border-slate-200/60 shadow-xs relative">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users size={11} className="text-emerald-500" />
                      Viajeros ({draft.travelers})
                    </label>

                    {/* Counter buttons */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() => {
                          if (draft.travelers > 1) {
                            setDraft(prev => ({ ...prev, travelers: prev.travelers - 1 }))
                          }
                        }}
                        className="p-1 px-2.5 text-slate-500 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-30"
                        disabled={draft.travelers <= 1}
                      >
                        <Minus size={10} strokeWidth={3} />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-700 select-none">
                        {draft.travelers}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (draft.travelers < 12) {
                            setDraft(prev => ({ ...prev, travelers: prev.travelers + 1 }))
                          }
                        }}
                        className="p-1 px-2.5 text-slate-500 hover:bg-slate-100 active:bg-slate-200"
                      >
                        <Plus size={10} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* Inline Traveler detail table */}
                  <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
                    {(draft.travelersDetails || []).map((traveler, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-slate-50/70 border border-slate-150 p-1.5 rounded-lg text-[10px] justify-between">
                        <span className="font-extrabold text-slate-500 shrink-0">
                          #{idx + 1} {idx === 0 ? 'Yo' : traveler.relationship}
                        </span>
                        
                        {/* Age Input */}
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 font-bold">Edad:</span>
                          <input
                            type="number"
                            value={traveler.age}
                            min={0}
                            max={120}
                            onChange={(e) => {
                              const val = Number(e.target.value)
                              setDraft(prev => {
                                const details = [...(prev.travelersDetails || [])]
                                details[idx] = { ...details[idx], age: val }
                                return { ...prev, travelersDetails: details }
                              })
                            }}
                            className="w-10 text-center font-bold text-slate-700 bg-white border border-slate-200 rounded p-0.5 focus:outline-none"
                          />
                        </div>

                        {/* Gender select */}
                        <div className="flex gap-0.5 shrink-0 bg-white border border-slate-200 rounded p-0.5">
                          {(['male', 'female'] as const).map(g => (
                            <button
                              type="button"
                              key={g}
                              onClick={() => {
                                setDraft(prev => {
                                  const details = [...(prev.travelersDetails || [])]
                                  details[idx] = { ...details[idx], gender: g }
                                  return { ...prev, travelersDetails: details }
                                })
                              }}
                              className={cn(
                                "px-1.5 py-0.2 rounded font-bold text-[8px]",
                                traveler.gender === g ? "bg-slate-900 text-white" : "text-slate-500"
                              )}
                            >
                              {g === 'male' ? 'H' : 'M'}
                            </button>
                          ))}
                        </div>

                        {/* Vínculo Select */}
                        {idx > 0 && (
                          <select
                            value={traveler.relationship}
                            onChange={(e) => {
                              const val = e.target.value as any
                              setDraft(prev => {
                                const details = [...(prev.travelersDetails || [])]
                                details[idx] = { ...details[idx], relationship: val }
                                return { ...prev, travelersDetails: details }
                              })
                            }}
                            className="bg-white border border-slate-250 text-slate-800 text-[9px] font-bold rounded p-0.5 focus:outline-none max-w-[62px] text-right cursor-pointer"
                          >
                            <option value="Pareja" className="text-slate-800 bg-white font-semibold">Pareja</option>
                            <option value="Hijo/a" className="text-slate-800 bg-white font-semibold">Hijo/a</option>
                            <option value="Padre/Madre" className="text-slate-800 bg-white font-semibold">Padre/Madre</option>
                            <option value="Amigo/a" className="text-slate-800 bg-white font-semibold">Amigos</option>
                            <option value="Otro" className="text-slate-800 bg-white font-semibold">Otro</option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMN 3: BUDGET, STYLE & SERVICES */}
              <div className="space-y-4 md:col-span-2 lg:col-span-1">
                
                {/* PRESUPUESTO */}
                <div className="space-y-3 text-left bg-white p-4.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign size={11} className="text-emerald-500" />
                    Presupuesto
                  </label>

                  {/* Three Tier Cards */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {BUDGET_TIERS.map((tier) => {
                      const active = draft.budget === tier.id
                      const IconComp = tier.icon
                      return (
                        <button
                          type="button"
                          key={tier.id}
                          onClick={() => {
                            setDraft(prev => ({
                              ...prev,
                              budget: tier.id,
                              budgetAmount: tier.amount
                            }))
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all text-center gap-1 select-none",
                            active 
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/10 shadow-sm" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          <IconComp size={14} className={active ? 'text-emerald-600' : 'text-slate-455'} />
                          <span className="text-[9px] font-extrabold">{tier.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Dollar input */}
                  <div className="relative rounded-lg shadow-sm border border-slate-200 bg-slate-50/50 overflow-hidden flex items-center h-8.5">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-xs font-extrabold">$</span>
                    </div>
                    <input
                      type="number"
                      value={draft.budgetAmount || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : Number(e.target.value)
                        let cat = 'moderate'
                        if (val !== null) {
                          if (val < 1500) cat = 'budget'
                          else if (val > 5000) cat = 'luxury'
                        }
                        setDraft(prev => ({ ...prev, budgetAmount: val, budget: cat }))
                      }}
                      placeholder="Monto máximo en dólares"
                      className="block w-full pl-5 pr-9 py-1 text-xs font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-transparent border-0 h-full"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-[8.5px] font-bold">USD</span>
                    </div>
                  </div>

                  {/* Quick Add Helper buttons */}
                  <div className="flex gap-1.5 justify-end">
                    {[500, 1000, 2500].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => {
                          const current = draft.budgetAmount || 0
                          const nextVal = current + val
                          let cat = 'moderate'
                          if (nextVal < 1500) cat = 'budget'
                          else if (nextVal > 5000) cat = 'luxury'
                          setDraft(prev => ({ ...prev, budgetAmount: nextVal, budget: cat }))
                        }}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md border border-slate-200 text-[8.5px] font-extrabold shadow-2xs transition-all active:scale-95"
                      >
                        +{val}$
                      </button>
                    ))}
                  </div>
                </div>

                {/* ESTILO / VIBE */}
                <div className="space-y-3 text-left bg-white p-4.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={11} className="text-emerald-500" />
                    Estilo / Vibe
                  </label>

                  {/* Vibe cards */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {VIBES.map((v) => {
                      const active = draft.vibe === v.id
                      const IconComp = v.icon
                      return (
                        <button
                          type="button"
                          key={v.id}
                          onClick={() => setDraft(prev => ({ ...prev, vibe: v.id }))}
                          className={cn(
                            "flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all text-center gap-1 shadow-2xs select-none",
                            active 
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/10 scale-[1.02] shadow-sm font-bold" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          <IconComp size={14} className={active ? 'text-emerald-600' : 'text-slate-455'} />
                          <span className="text-[8.5px] font-bold tracking-tight truncate w-full">{v.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* SERVICIOS A INCLUIR */}
                <div className="space-y-3 text-left bg-white p-4.5 rounded-xl border border-slate-200/60 shadow-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={11} className="text-emerald-500" />
                    Servicios a Incluir
                  </label>

                  {/* Pills Multi-selection */}
                  <div className="flex flex-wrap gap-1.5">
                    {SERVICES.map((s) => {
                      const active = (draft.services || []).includes(s.id)
                      const IconComp = s.icon
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => toggleService(s.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold border shadow-2xs transition-all select-none",
                            active 
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/10 font-bold" 
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          <IconComp size={10} className={active ? 'text-white' : 'text-slate-455'} />
                          <span>{s.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-100/95 backdrop-blur-xs flex items-center justify-end gap-3 shrink-0">
            {preferences.destination && onTriggerGeneratePlan && (
              <button
                type="button"
                onClick={onTriggerGeneratePlan}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-700 text-xs font-extrabold py-2 px-4 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={13} className="text-emerald-600 animate-pulse" />
                Generar Plan IA
              </button>
            )}
            <button
              type="button"
              onClick={handleApply}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} className="text-white" />
              Aplicar Preferencias al Asistente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

