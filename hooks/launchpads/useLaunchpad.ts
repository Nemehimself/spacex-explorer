import { useQuery } from "@tanstack/react-query";
import { fetchLaunchpadById } from "@/lib/api/launchpads";
import { QUERY_KEYS } from "@/lib/constants";

export function useLaunchpad(id: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.launchpad, id],
    queryFn: () => fetchLaunchpadById(id!),
    enabled: Boolean(id),
  });
}