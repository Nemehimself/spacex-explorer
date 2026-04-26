import { useQuery } from "@tanstack/react-query";
import { fetchAllLaunchesForCharts } from "@/lib/api/launches";
import { Launch } from "@/types/launch";

interface YearStat {
  year: string;
  total: number;
  success: number;
  failed: number;
  successRate: number;
}

// interface RocketStat {
//   name: string;       // flight number bucket label
//   launches: number;
// }

function buildYearStats(launches: Launch[]): YearStat[] {
  const map = new Map<string, { total: number; success: number; failed: number }>();

  for (const launch of launches) {
    if (launch.upcoming) continue;
    const year = new Date(launch.date_utc).getFullYear().toString();
    const existing = map.get(year) ?? { total: 0, success: 0, failed: 0 };
    existing.total += 1;
    if (launch.success === true) existing.success += 1;
    if (launch.success === false) existing.failed += 1;
    map.set(year, existing);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, stat]) => ({
      year,
      ...stat,
      successRate:
        stat.total > 0 ? Math.round((stat.success / stat.total) * 100) : 0,
    }));
}

export function useChartData() {
  return useQuery({
    queryKey: ["chart-data"],
    queryFn: fetchAllLaunchesForCharts,
    staleTime: 1000 * 60 * 60, // 1 hour — historical data rarely changes
    select: (launches): { yearStats: YearStat[] } => ({
      yearStats: buildYearStats(launches),
    }),
  });
}