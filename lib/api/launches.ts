import { spacexClient } from "./spacexClient";
import { Launch } from "@/types/launch";
import {
  SpaceXQuery,
  PaginatedResponse,
  LaunchFilters,
  SortDirection,
  SortField,
} from "@/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

/**
 * Builds the POST body for /launches/query based on active filters.
 *
 * Uses MongoDB-style query operators supported by the SpaceX API:
 * - $regex / $options for case-insensitive name search
 * - $gte / $lte for date range filtering
 *
 * @param filters - Active filter state from LaunchFilters component
 * @param page    - 1-based page number for pagination cursor
 * @returns       - SpaceX query body ready to POST
 */

function buildLaunchQuery(
  filters: LaunchFilters,
  page: number
): SpaceXQuery {
  const query: Record<string, unknown> = {};

  // upcoming / past filter
  if (filters.upcoming !== undefined) {
    query.upcoming = filters.upcoming;
  }

  // success filter (null means "all")
  if (filters.success !== null && filters.success !== undefined) {
    query.success = filters.success;
  }

  // date range
  if (filters.dateFrom || filters.dateTo) {
    query.date_utc = {};
    if (filters.dateFrom) {
      (query.date_utc as Record<string, string>)["$gte"] = filters.dateFrom;
    }
    if (filters.dateTo) {
      (query.date_utc as Record<string, string>)["$lte"] = filters.dateTo;
    }
  }

  // search by mission name (regex, case-insensitive)
  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" };
  }

  // sort
  const sortField: SortField = filters.sortField ?? "date_utc";
  const sortDirection: SortDirection = filters.sortDirection ?? "desc";

  return {
    query,
    options: {
      sort: { [sortField]: sortDirection === "asc" ? 1 : -1 },
      limit: DEFAULT_PAGE_SIZE,
      page,
    },
  };
}

/**
 * Fetches a paginated, filtered, sorted page of launches.
 * Called by useInfiniteQuery — do not call directly in components.
 *
 * @param filters - Active user-selected filters
 * @param page    - Page number (1-indexed)
 * @returns       - Paginated response including hasNextPage cursor
 */

export async function fetchLaunches(
  filters: LaunchFilters,
  page: number
): Promise<PaginatedResponse<Launch>> {
  const body = buildLaunchQuery(filters, page);
  const { data } = await spacexClient.post<PaginatedResponse<Launch>>(
    "/launches/query",
    body
  );
  return data;
}

export async function fetchLaunchById(id: string): Promise<Launch> {
  const { data } = await spacexClient.get<Launch>(`/launches/${id}`);
  return data;
}

/**
 * Fetches ALL launches in a single request for chart aggregation.
 *
 * Uses a select projection to return only the 5 fields needed for charts,
 * keeping the payload small (~40KB vs ~500KB for full objects).
 * Cached for 1 hour — historical launch data is immutable.
 *
 * Do NOT use this for the launch list — use fetchLaunches() instead.
 */

// Fetch ALL launches for charting (no pagination — one POST, limit 9999)
export async function fetchAllLaunchesForCharts(): Promise<Launch[]> {
  const { data } = await spacexClient.post<PaginatedResponse<Launch>>(
    "/launches/query",
    {
      query: {},
      options: {
        select: {
          name: 1,
          date_utc: 1,
          success: 1,
          upcoming: 1,
          flight_number: 1,
        },
        limit: 9999,
        sort: { date_utc: 1 },
      },
    }
  );
  return data.docs;
}