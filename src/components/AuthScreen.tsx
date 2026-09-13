import { useState, type FormEvent } from 'react'

import { useSignIn, useSignUp } from '../hooks/useAuthActions'

/**
 * Field Notes is single-user: there's no public sign-up flow to
 * design for, just a quiet door that only the one person who knows
 * the password gets through. Same form handles first-time account
 * creation, toggled by the link at the bottom.
 */
export function AuthScreen() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = useSignIn()
  const signUp = useSignUp()
  const active = mode === 'sign-in' ? signIn : signUp

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    active.mutate({ email, password })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-ink">
      <div className="text-center">
        <h1 className="font-display text-4xl">Field Notes</h1>
        <p className="mt-1 font-sans text-sm text-muted">
          {mode === 'sign-in' ? 'Sign in to keep going.' : 'Set up your archive.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <label className="flex flex-col gap-1 font-sans text-sm">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border border-line bg-paper px-3 py-2 font-sans text-ink outline-none focus:border-ink"
          />
        </label>

        <label className="flex flex-col gap-1 font-sans text-sm">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border border-line bg-paper px-3 py-2 font-sans text-ink outline-none focus:border-ink"
          />
        </label>

        {active.isError && (
          <p className="border border-line px-3 py-2 font-mono text-xs text-ink">
            {active.error instanceof Error ? active.error.message : 'Something went wrong.'}
          </p>
        )}

        {mode === 'sign-up' && signUp.isSuccess && (
          <p className="border border-line px-3 py-2 font-mono text-xs text-ink">
            Check your email to confirm the account, then sign in.
          </p>
        )}

        <button
          type="submit"
          disabled={active.isPending}
          className="mt-1 bg-ink px-3 py-2 font-sans text-sm text-paper disabled:opacity-50"
        >
          {active.isPending ? 'Working…' : 'Continue'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
        className="font-sans text-xs text-muted underline underline-offset-2"
      >
        {mode === 'sign-in' ? 'New here? Create an account.' : 'Already have an account? Sign in.'}
      </button>
    </main>
  )
}
