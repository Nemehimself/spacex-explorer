import { useQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/api/launches";
import { LaunchFilters } from "@/types/pagination";
import { QUERY_KEYS } from "@/lib/constants";

/**
 * Fetches a single page of launches for the paginated launch list.
 *
 * Uses placeholderData to keep the previous page visible while the
 * next page loads — prevents a blank flash between page navigations.
 *
 * The queryKey includes both filters and page number so any filter
 * change or page change triggers a fresh fetch with its own cache entry.
 *
 * @param filters - Active filter/sort/search state from LaunchFilters
 * @param page    - Current page number (1-indexed)
 */
export function useLaunches(filters: LaunchFilters, page: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.launches, filters, page],
    queryFn: () => fetchLaunches(filters, page),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}