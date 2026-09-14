/**
 * The 3-item bottom nav from docs/design.md section 4. Map is V0.2
 * scope (design.md section 10) — shown so the bar matches the design,
 * but disabled rather than wired to anything yet.
 */
export function BottomNav({ onCreate }: { onCreate: () => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex items-center justify-around border-t border-line bg-paper py-3 font-mono text-[11px] text-ink">
      <span className="flex flex-col items-center gap-1">
        <span aria-hidden className="text-lg">
          ◉
        </span>
        Notes
      </span>

      <button
        type="button"
        onClick={onCreate}
        aria-label="New note"
        className="flex flex-col items-center gap-1 text-ink"
      >
        <span aria-hidden className="text-lg">
          ⊕
        </span>
        New
      </button>

      <button
        type="button"
        disabled
        aria-label="Map (coming soon)"
        className="flex flex-col items-center gap-1 text-muted opacity-50"
      >
        <span aria-hidden className="text-lg">
          ◇
        </span>
        Map
      </button>
    </nav>
  )
}
