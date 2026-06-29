import { QueryClient } from '@tanstack/react-query'

// Shared QueryClient instance (also used in main.jsx)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
})
