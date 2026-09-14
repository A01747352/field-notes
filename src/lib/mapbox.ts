export type ReverseGeocodeResult = {
  placeName: string | null
}

/**
 * Reverse-geocodes coordinates to a city-level place name (e.g.
 * "Uppsala") for the "📍 Uppsala" auto-fill in docs/design.md 5.2.
 * Returns a null placeName (never throws for a missing/blank token)
 * so a note can still be created without location context.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult> {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) return { placeName: null }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&types=place`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Mapbox reverse geocoding failed with status ${response.status}`)
  }

  const data = await response.json()
  const placeName: string | undefined = data?.features?.[0]?.text
  return { placeName: placeName ?? null }
}
