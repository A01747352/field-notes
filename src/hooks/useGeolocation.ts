import { useEffect, useState } from 'react'

type GeolocationState =
  | { status: 'loading' }
  | { status: 'success'; latitude: number; longitude: number }
  | { status: 'error'; message: string }

/**
 * One-shot read of the browser's geolocation, for the "📍" auto-fill
 * step in docs/design.md 5.2. Never blocks note creation — a denied
 * permission or unsupported browser just means no location context.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(() =>
    navigator.geolocation
      ? { status: 'loading' }
      : { status: 'error', message: 'Geolocation is not available in this browser.' },
  )

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'success',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        setState({ status: 'error', message: error.message })
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  return state
}
