import { format } from 'date-fns'
import { useState, type ChangeEvent } from 'react'

import { useCreateNote } from '../hooks/useCreateNote'
import { useNoteContext } from '../hooks/useNoteContext'
import { supabase } from '../lib/supabase'

/**
 * Crear nota (docs/design.md 5.2): photo optional, text is the first
 * thing you write, location/weather/time show up already filled in
 * (editable with a tap — here, the place name is a plain editable
 * input), and SAVE is the only action. No category picker and no
 * "+ Add music/people/place" here on purpose: the doc says category
 * can be assigned later or suggested non-intrusively, and Spotify
 * (V0.4) / People & Places (V0.3) don't exist yet.
 */
export function CreateNote({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState('')
  const [photoPaths, setPhotoPaths] = useState<string[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [placeNameOverride, setPlaceNameOverride] = useState<string | null>(null)

  const ctx = useNoteContext()
  const createNote = useCreateNote()

  const placeName = placeNameOverride ?? ctx.placeName ?? ''

  async function handlePhotoSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return

    setIsUploading(true)
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user.id

    if (userId) {
      const results = await Promise.all(
        files.map(async (file) => {
          const path = `${userId}/${Date.now()}-${file.name}`
          const { error } = await supabase.storage.from('note-photos').upload(path, file)
          return error ? null : path
        }),
      )
      const uploaded = results.filter((path): path is string => path !== null)
      setPhotoPaths((prev) => [...prev, ...uploaded])
      setPhotoPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))])
    }
    setIsUploading(false)
  }

  function handleSave() {
    createNote.mutate(
      {
        text: text.trim() || null,
        photo_paths: photoPaths,
        latitude: ctx.latitude,
        longitude: ctx.longitude,
        place_name: placeName || null,
        weather: ctx.weather,
      },
      { onSuccess: onDone },
    )
  }

  const canSave = (text.trim().length > 0 || photoPaths.length > 0) && !createNote.isPending

  return (
    <main className="flex min-h-screen flex-col gap-4 bg-paper px-4 py-6 text-ink">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onDone}
          className="font-mono text-xs text-muted"
          data-testid="cancel"
        >
          CANCEL
        </button>
        <h1 className="font-display text-xl">Field Note</h1>
        <span className="w-14" aria-hidden />
      </div>

      <p className="text-center font-sans text-sm text-muted">What&apos;s worth keeping?</p>

      <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-line font-sans text-sm text-muted">
        <span aria-hidden>📷</span>
        {isUploading ? 'Uploading…' : 'Photo'}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoSelect}
          disabled={isUploading}
          data-testid="photo-input"
        />
      </label>

      {photoPreviews.length > 0 && (
        <div className="flex gap-2 overflow-x-auto" data-testid="photo-previews">
          {photoPreviews.map((src) => (
            <img key={src} src={src} alt="" className="h-20 w-20 flex-none object-cover" />
          ))}
        </div>
      )}

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Write something..."
        rows={4}
        className="border-b border-line bg-paper font-sans text-base text-ink outline-none placeholder:text-muted"
        data-testid="text-input"
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3 font-mono text-xs text-muted">
        <span aria-hidden>📍</span>
        {ctx.isLoadingLocation || ctx.isLoadingContext ? (
          <span data-testid="place-loading">locating…</span>
        ) : (
          <input
            value={placeName}
            onChange={(event) => setPlaceNameOverride(event.target.value)}
            placeholder="place"
            className="w-28 bg-transparent p-0 font-mono text-xs text-muted outline-none"
            data-testid="place-input"
          />
        )}

        {ctx.weather && (
          <span data-testid="weather">
            ☁️ {ctx.weather.temp_c}°C {ctx.weather.condition}
          </span>
        )}

        <span data-testid="time">🕐 {format(new Date(), 'HH:mm')}</span>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        className="mt-auto bg-ink py-3 font-sans text-sm text-paper disabled:opacity-50"
        data-testid="save"
      >
        {createNote.isPending ? 'Saving…' : 'SAVE'}
      </button>

      {createNote.isError && (
        <p className="border border-line px-3 py-2 font-mono text-xs text-ink" role="alert">
          {createNote.error instanceof Error ? createNote.error.message : 'Could not save.'}
        </p>
      )}
    </main>
  )
}
