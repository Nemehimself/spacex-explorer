import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchLaunches } from "@/lib/api/launches";
import { LaunchFilters, PaginatedResponse } from "@/types/pagination";
import { Launch } from "@/types/launch";
import { QUERY_KEYS } from "@/lib/constants";

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