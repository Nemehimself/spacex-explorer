import { useQuery } from "@tanstack/react-query";
import { fetchLaunchById } from "@/lib/api/launches";
import { QUERY_KEYS } from "@/lib/constants";

export function useLaunch(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.launchDetail, id],
    queryFn: () => fetchLaunchById(id),
    enabled: Boolean(id),
  });
}