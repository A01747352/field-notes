import { useMutation, useQueryClient } from '@tanstack/react-query'

import { supabase } from '../lib/supabase'
import type { NewNote, Note } from '../types/note'
import { notesKeys } from './useNotes'

/**
 * Saves a new note. Per docs/design.md 5.2, this is the one action
 * behind "SAVE" — no intermediate confirmation screens.
 */
export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (note: NewNote): Promise<Note> => {
      const { data, error } = await supabase.from('notes').insert(note).select().single()

      if (error) throw error
      return data as Note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all })
    },
  })
}
