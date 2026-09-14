import { useQuery } from '@tanstack/react-query'

import { reverseGeocode } from '../lib/mapbox'
import { fetchWeather, type WeatherResult } from '../lib/weather'
import { useGeolocation } from './useGeolocation'

type NoteContextData = {
  placeName: string | null
  weather: WeatherResult | null
}

/**
 * Everything docs/design.md 5.2 auto-fills for a new note: where you
 * are, what it's called, and what the weather's doing — each piece
 * degrading to null on its own rather than failing the whole thing,
 * since none of this should ever block writing and saving a note.
 */
export function useNoteContext() {
  const geo = useGeolocation()
  const hasCoords = geo.status === 'success'
  const latitude = hasCoords ? geo.latitude : null
  const longitude = hasCoords ? geo.longitude : null

  const context = useQuery({
    queryKey: ['note-context', latitude, longitude],
    queryFn: async (): Promise<NoteContextData> => {
      const [place, weather] = await Promise.all([
        reverseGeocode(latitude!, longitude!).catch(() => ({ placeName: null })),
        fetchWeather(latitude!, longitude!).catch(() => null),
      ])
      return { placeName: place.placeName, weather }
    },
    enabled: latitude !== null && longitude !== null,
  })

  return {
    isLoadingLocation: geo.status === 'loading',
    locationError: geo.status === 'error' ? geo.message : null,
    latitude,
    longitude,
    isLoadingContext: context.isLoading,
    placeName: context.data?.placeName ?? null,
    weather: context.data?.weather ?? null,
  }
}
