export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  rockets: string[];
  launches: string[];
  status: "active" | "inactive" | "unknown" | "retired" | "lost" | "under construction";
  details: string;
  images: {
    large: string[];
  };
}