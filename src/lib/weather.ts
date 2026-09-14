export type WeatherResult = {
  temp_c: number
  condition: string
}

/**
 * Current weather at a coordinate, for the "☁️ 12°C" auto-fill in
 * docs/design.md 5.2/5.3. Returns null rather than throwing when the
 * key is missing or the response is malformed — weather is a nice
 * extra, not a reason to block saving a note.
 */
export async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherResult | null> {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  if (!apiKey) return null

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Weather lookup failed with status ${response.status}`)
  }

  const data = await response.json()
  const temp = data?.main?.temp
  const condition = data?.weather?.[0]?.description

  if (typeof temp !== 'number' || typeof condition !== 'string') return null

  return { temp_c: Math.round(temp), condition }
}
