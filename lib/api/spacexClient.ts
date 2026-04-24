import axios, { AxiosError, AxiosInstance } from "axios";
import { SPACEX_API_BASE, MAX_RETRIES, RETRY_DELAY_MS } from "@/lib/constants";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a configured Axios instance for the SpaceX REST API v4.
 *
 * Features:
 * - Base URL set to https://api.spacexdata.com/v4
 * - 10 second request timeout
 * - Automatic retry with exponential backoff on:
 *   - 429 Too Many Requests
 *   - Any 5xx server error
 * - Max 3 retry attempts (delays: 1s → 2s → 4s)
 */

function createSpaceXClient(): AxiosInstance {
  const client = axios.create({
    baseURL: SPACEX_API_BASE,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Response interceptor: retry on 429 and 5xx
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as typeof error.config & {
        _retryCount?: number;
      };
      if (!config) return Promise.reject(error);

      config._retryCount = config._retryCount ?? 0;

      const status = error.response?.status;
      const shouldRetry =
        config._retryCount < MAX_RETRIES &&
        (status === 429 || (status !== undefined && status >= 500));

      if (shouldRetry) {
        config._retryCount += 1;
        // Exponential backoff: 1s, 2s, 4s
        const delay = RETRY_DELAY_MS * Math.pow(2, config._retryCount - 1);
        await sleep(delay);
        return client(config);
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export const spacexClient = createSpaceXClient();