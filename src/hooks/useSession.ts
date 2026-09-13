import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

/**
 * The current Supabase auth session, kept in sync with sign-in/out
 * events. Field Notes is a single-user app, so this is really just
 * "are we allowed through the door yet" — everything past it (notes,
 * places, people) is scoped by RLS to whoever this session belongs to.
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, isLoading }
}
