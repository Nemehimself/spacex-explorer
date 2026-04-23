import { spacexClient } from "./spacexClient";
import { Rocket } from "@/types/rocket";

export async function fetchRocketById(id: string): Promise<Rocket> {
  const { data } = await spacexClient.get<Rocket>(`/rockets/${id}`);
  return data;
}