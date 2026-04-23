export const SPACEX_API_BASE = "https://api.spacexdata.com/v4";
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;

export const QUERY_KEYS = {
  launches: "launches",
  launchDetail: "launch-detail",
  rocket: "rocket",
  launchpad: "launchpad",
} as const;