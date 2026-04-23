export interface QueryOptions {
  populate?: string[];
  select?: Record<string, number>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  page?: number;
  offset?: number;
}

export interface SpaceXQuery<T = Record<string, unknown>> {
  query: T;
  options: QueryOptions;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export type SortDirection = "asc" | "desc";
export type SortField = "date_utc" | "name" | "flight_number";

export interface LaunchFilters {
  upcoming?: boolean;
  success?: boolean | null;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
}