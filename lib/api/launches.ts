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