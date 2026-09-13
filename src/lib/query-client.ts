import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Field notes don't change from outside the app, so there's no
      // need to refetch just because the window regained focus.
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
})
