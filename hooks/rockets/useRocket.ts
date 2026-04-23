import { useQuery } from "@tanstack/react-query";
import { fetchRocketById } from "@/lib/api/rockets";
import { QUERY_KEYS } from "@/lib/constants";

export function useRocket(id: string | null | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.rocket, id],
    queryFn: () => fetchRocketById(id!),
    enabled: Boolean(id),
  });
}