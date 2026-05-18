'use client'
import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

interface GoogleMapsWindow extends Window {
  google: typeof google
  initGoogleMaps: () => void
}

declare let window: GoogleMapsWindow

interface LocationPickerProps {
  value?: { lat: number; lng: number; address: string }
  onChange: (location: { lat: number; lng: number; address: string }) => void
  className?: string
  apiKey: string
}

export function LocationPicker({ value, onChange, className, apiKey }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [searchValue, setSearchValue] = useState(value?.address ?? '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (!apiKey || showMap) return

    const existingScript = document.getElementById('google-maps-script')
    if (existingScript) {
      if (window.google?.maps) {
        setIsLoaded(true)
        return
      }
      existingScript.addEventListener('load', () => setIsLoaded(true))
      return
    }

    window.initGoogleMaps = () => setIsLoaded(true)

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // cleanup not needed for singleton script load
    }
  }, [apiKey, showMap])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !showMap) return

    const defaultCenter = value
      ? { lat: value.lat, lng: value.lng }
      : { lat: 10.4805, lng: -84.6423 } // Costa Rica center

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: value ? 14 : 8,
      disableDefaultUI: true,
      zoomControl: true,
    })

    mapInstanceRef.current = map

    if (value) {
      markerRef.current = new window.google.maps.Marker({
        position: defaultCenter,
        map,
        draggable: true,
      })

      markerRef.current.addListener('dragend', () => {
        const pos = markerRef.current?.getPosition()
        if (pos) {
          reverseGeocode(pos.lat(), pos.lng())
        }
      })
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current!, {
      componentRestrictions: { country: 'cr' },
    })

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        onChange({ lat, lng, address: place.formatted_address ?? searchValue })
        map.setCenter(place.geometry.location)
        map.setZoom(14)

        if (markerRef.current) {
          markerRef.current.setPosition(place.geometry.location)
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: place.geometry.location,
            map,
            draggable: true,
          })
          markerRef.current.addListener('dragend', () => {
            const pos = markerRef.current?.getPosition()
            if (pos) reverseGeocode(pos.lat(), pos.lng())
          })
        }
      }
    })

    return () => {
      // cleanup map instance if needed
    }
  }, [isLoaded, showMap, value])

  function reverseGeocode(lat: number, lng: number) {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const address = results[0].formatted_address
        setSearchValue(address)
        onChange({ lat, lng, address })
      }
    })
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex gap-2">
        <Input
          ref={searchInputRef}
          placeholder="Buscar ubicación en Costa Rica..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant={showMap ? 'secondary' : 'ghost'}
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? 'Ocultar mapa' : 'Ver en mapa'}
        </Button>
      </div>

      {showMap && (
        <div className="relative rounded-lg overflow-hidden border border-slate-300">
          <div ref={mapRef} className="h-64 w-full" />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <span className="text-slate-500">Cargando mapa...</span>
            </div>
          )}
        </div>
      )}

      {value?.address && (
        <p className="text-sm text-slate-500 flex items-center gap-1.5">
          <MapPin size={14} className="text-slate-400 shrink-0" />
          {value.address}
        </p>
      )}
    </div>
  )
}