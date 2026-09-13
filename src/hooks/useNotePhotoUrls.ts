import { useQuery } from '@tanstack/react-query'

import { supabase } from '../lib/supabase'

const SIGNED_URL_TTL_SECONDS = 60 * 60 // 1 hour, plenty for a single render pass

/**
 * note-photos is a private bucket (docs/design.md: personal archive,
 * not public), so every photo needs a freshly signed URL rather than
 * a plain public one.
 */
export function useNotePhotoUrls(photoPaths: string[]) {
  return useQuery({
    queryKey: ['note-photo-urls', photoPaths],
    queryFn: async (): Promise<string[]> => {
      if (photoPaths.length === 0) return []

      const { data, error } = await supabase.storage
        .from('note-photos')
        .createSignedUrls(photoPaths, SIGNED_URL_TTL_SECONDS)

      if (error) throw error
      return data.flatMap((entry) => (entry.signedUrl ? [entry.signedUrl] : []))
    },
    enabled: photoPaths.length > 0,
    staleTime: (SIGNED_URL_TTL_SECONDS / 2) * 1000,
  })
}
