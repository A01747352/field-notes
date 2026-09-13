import { useQuery } from '@tanstack/react-query'

import { supabase } from '../lib/supabase'
import type { Note } from '../types/note'

export const notesKeys = {
  all: ['notes'] as const,
}

/**
 * All of the current user's notes, newest moment first — the shape
 * the Home/Timeline screen groups by day (docs/design.md, 5.1).
 * RLS means this naturally returns only rows owned by whoever is
 * signed in, and an empty list (not an error) when no one is.
 */
export function useNotes() {
  return useQuery({
    queryKey: notesKeys.all,
    queryFn: async (): Promise<Note[]> => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('occurred_at', { ascending: false })

      if (error) throw error
      return data as Note[]
    },
  })
}
