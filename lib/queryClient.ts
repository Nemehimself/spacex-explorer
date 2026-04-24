import { QueryClient } from "@tanstack/react-query";

/**
 * Global React Query client configuration.
 *
 * staleTime: 5 minutes
 *   Data is considered fresh for 5 minutes. No background refetch
 *   will occur during this window even if the window is refocused.
 *   SpaceX launch data changes infrequently so this is appropriate.
 *
 * gcTime: 30 minutes
 *   Unused cache entries are garbage collected after 30 minutes.
 *   This keeps memory usage bounded while still allowing fast
 *   back-navigation without a network request.
 *
 * retry: 2
 *   Failed queries retry twice before showing an error state.
 *   The Axios interceptor handles 429/5xx separately with backoff.
 *
 * refetchOnWindowFocus: false
 *   Disabled to avoid surprising refetches when the user alt-tabs
 *   back to the app. Re-enable if real-time data freshness matters.
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 minutes — SpaceX data doesn't change often
      gcTime: 1000 * 60 * 30,          // 30 minutes in garbage collection
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});