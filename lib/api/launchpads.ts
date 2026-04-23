import { spacexClient } from "./spacexClient";
import { Launchpad } from "@/types/launchpad";

export async function fetchLaunchpadById(id: string): Promise<Launchpad> {
  const { data } = await spacexClient.get<Launchpad>(`/launchpads/${id}`);
  return data;
}