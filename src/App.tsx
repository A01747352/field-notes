import { useState } from 'react'

import { AuthScreen } from './components/AuthScreen'
import { BottomNav } from './components/BottomNav'
import { useSession } from './hooks/useSession'
import { CreateNote } from './pages/CreateNote'
import { Timeline } from './pages/Timeline'

function App() {
  const { session, isLoading } = useSession()
  const [isCreating, setIsCreating] = useState(false)

  if (isLoading) return null
  if (!session) return <AuthScreen />

  // "+ " opens create-note as a full-screen modal, not a route
  // (docs/design.md section 4) — plain state, no router involved.
  if (isCreating) {
    return <CreateNote onDone={() => setIsCreating(false)} />
  }

  return (
    <>
      <Timeline />
      <BottomNav onCreate={() => setIsCreating(true)} />
    </>
  )
}

export default App
