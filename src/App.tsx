import { AuthScreen } from './components/AuthScreen'
import { useSession } from './hooks/useSession'
import { Timeline } from './pages/Timeline'

function App() {
  const { session, isLoading } = useSession()

  if (isLoading) return null
  if (!session) return <AuthScreen />

  return <Timeline />
}

export default App
