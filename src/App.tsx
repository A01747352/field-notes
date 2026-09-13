import { AuthScreen } from './components/AuthScreen'
import { useSession } from './hooks/useSession'

function App() {
  const { session, isLoading } = useSession()

  if (isLoading) return null
  if (!session) return <AuthScreen />

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink">
      <h1 className="font-display text-5xl">Field Notes</h1>
      <p className="max-w-xs font-sans text-base text-ink">
        A quiet record of the places you go, the things you notice, and the days you want to
        remember.
      </p>
      <p className="font-mono text-xs text-muted">FN—000 · SETUP</p>
    </main>
  )
}

export default App
