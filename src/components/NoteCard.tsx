import { useNotePhotoUrls } from '../hooks/useNotePhotoUrls'
import type { Note } from '../types/note'

export function NoteCard({ note }: { note: Note }) {
  const { data: photoUrls } = useNotePhotoUrls(note.photo_paths)

  return (
    <article className="flex flex-col gap-2">
      {note.text && <p className="font-sans text-sm leading-relaxed text-ink">{note.text}</p>}

      {photoUrls && photoUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photoUrls.map((url) => (
            <img key={url} src={url} alt="" className="h-40 w-auto object-cover" />
          ))}
        </div>
      )}
    </article>
  )
}
