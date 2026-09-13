import { format } from 'date-fns'
import { useEffect, useMemo, useRef, useState } from 'react'

import { NoteCard } from '../components/NoteCard'
import { useNotes } from '../hooks/useNotes'
import type { Note } from '../types/note'

type DayGroup = {
  key: string
  day: Date
  placeName: string | null
  notes: Note[]
}

/**
 * Notes are already ordered newest-first by useNotes(), so grouping
 * by calendar day (in the viewer's local time) and taking insertion
 * order gives day groups newest-first for free.
 */
function groupByDay(notes: Note[]): DayGroup[] {
  const groups = new Map<string, DayGroup>()

  for (const note of notes) {
    const day = new Date(note.occurred_at)
    const key = format(day, 'yyyy-MM-dd')
    const existing = groups.get(key)
    if (existing) {
      existing.notes.push(note)
    } else {
      groups.set(key, { key, day, placeName: note.place_name, notes: [note] })
    }
  }

  return Array.from(groups.values())
}

/**
 * Home/Timeline (docs/design.md, 5.1): notes grouped by day, with a
 * sticky header that tracks the month/city of whatever day group is
 * currently in view, like a diary flipping chapters.
 */
export function Timeline() {
  const { data: notes, isLoading } = useNotes()
  const groups = useMemo(() => groupByDay(notes ?? []), [notes])

  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null)
  const headerRefs = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    if (groups.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const topKey = visible[0]?.target.getAttribute('data-day-key')
        if (topKey) setActiveGroupKey(topKey)
      },
      // Treat a day header as "current" once it's within the top 20%
      // of the viewport, not only once it's fully in view.
      { rootMargin: '0px 0px -80% 0px' },
    )

    headerRefs.current.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [groups])

  if (isLoading) return null

  const activeGroup = groups.find((group) => group.key === activeGroupKey) ?? groups[0]

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-10 flex items-baseline justify-between border-b border-line bg-paper px-4 py-3">
        <span className="font-mono text-xs">FIELD NOTES</span>
        {activeGroup && (
          <span className="text-right font-mono text-xs">
            <span className="block">{format(activeGroup.day, 'MM / yyyy')}</span>
            {activeGroup.placeName && (
              <span className="block text-muted">{activeGroup.placeName.toUpperCase()}</span>
            )}
          </span>
        )}
      </header>

      {groups.length === 0 ? (
        <p className="px-4 py-24 text-center font-sans text-sm text-muted">
          Nothing here yet. Go outside.
        </p>
      ) : (
        <div className="divide-y divide-line">
          {groups.map((group) => (
            <section key={group.key} className="px-4 py-6">
              <div
                data-day-key={group.key}
                ref={(element) => {
                  if (element) headerRefs.current.set(group.key, element)
                  else headerRefs.current.delete(group.key)
                }}
                className="mb-4"
              >
                <p className="font-display text-3xl leading-none">{format(group.day, 'dd')}</p>
                {group.placeName && (
                  <p className="mt-1 font-sans text-xs tracking-wide text-muted">
                    {group.placeName.toUpperCase()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-6">
                {group.notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
