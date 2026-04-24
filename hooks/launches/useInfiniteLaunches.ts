import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/api/launches";
import { LaunchFilters, PaginatedResponse } from "@/types/pagination";
import { Launch } from "@/types/launch";
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

export function useInfiniteLaunches(filters: LaunchFilters) {
  return useInfiniteQuery<PaginatedResponse<Launch>, Error>({
    queryKey: [QUERY_KEYS.launches, filters],
    queryFn: ({ pageParam }) => fetchLaunches(filters, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    staleTime: 1000 * 60 * 5,
  });
}