import { useQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/api/launches";
import { LaunchFilters } from "@/types/pagination";
import { QUERY_KEYS } from "@/lib/constants";

/**
 * Provides an infinite-scroll paginated list of SpaceX launches.
 *
 * Uses React Query's useInfiniteQuery with the SpaceX /launches/query endpoint.
 * Each page is fetched server-side — no client-side filtering of a full dataset.
 *
 * The queryKey includes the full filters object so any filter change
 * automatically refetches from page 1 with a fresh cache entry.
 *
 * @param filters - Filter/sort/search state from LaunchFilters component
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useInfiniteLaunches(filters);
 * const allLaunches = data?.pages.flatMap(page => page.docs) ?? [];
 */

export function useLaunches(filters: LaunchFilters, page: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.launches, filters, page],
    queryFn: () => fetchLaunches(filters, page),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev, // keeps previous page visible while next loads
  });
}