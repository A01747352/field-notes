import type { Tables, TablesInsert, TablesUpdate } from './database'

/**
 * Category keys, paired with their emoji + label in the UI
 * (docs/design.md, section 9). Kept as a plain text CHECK constraint
 * in Postgres rather than an enum, so adding a category later is a
 * one-line migration instead of an ALTER TYPE.
 */
export const NOTE_CATEGORIES = [
  'place',
  'cafe',
  'hike',
  'food',
  'culture',
  'people',
  'thought',
  'sound',
] as const

export type NoteCategory = (typeof NOTE_CATEGORIES)[number]

export type Weather = {
  temp_c: number
  condition: string
}

export type Music = {
  track: string
  artist: string
  album_art_url?: string
  spotify_url?: string
}

type Jsonb = 'category' | 'weather' | 'music'

/** A note as read from the database. */
export type Note = Omit<Tables<'notes'>, Jsonb> & {
  category: NoteCategory | null
  weather: Weather | null
  music: Music | null
}

/** Fields needed to insert a new note. */
export type NewNote = Omit<TablesInsert<'notes'>, Jsonb> & {
  category?: NoteCategory | null
  weather?: Weather | null
  music?: Music | null
}

/** Fields that can be patched onto an existing note. */
export type NoteUpdate = Omit<TablesUpdate<'notes'>, Jsonb> & {
  category?: NoteCategory | null
  weather?: Weather | null
  music?: Music | null
}
