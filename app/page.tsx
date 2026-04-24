"use client";

import React, { useState, useCallback } from "react";
import { LaunchFilters } from "@/components/launches/LaunchFilters";
import { LaunchVirtualList } from "@/components/launches/LaunchVirtualList";
import { ErrorState } from "@/components/common/ErrorState";
import { LaunchCardSkeleton } from "@/components/common/Skeleton";
import { useInfiniteLaunches } from "@/hooks/launches/useInfiniteLaunches";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { LaunchFilters as FiltersType } from "@/types/pagination";

export default function LaunchesPage() {
  const [filters, setFilters] = useState<FiltersType>({
    sortField: "date_utc",
    sortDirection: "desc",
  });

  const { favorites, toggleFavorite } = useFavorites();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLaunches(filters);

  const handleFilterChange = useCallback(
    (updated: Partial<FiltersType>) =>
      setFilters((prev) => ({ ...prev, ...updated })),
    []
  );

  const allLaunches = data?.pages.flatMap((p) => p.docs) ?? [];
  const totalDocs = data?.pages[0]?.totalDocs ?? 0;

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ marginBottom: "0.35rem" }}>Mission Archive</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Every SpaceX launch — filterable, searchable, bookmarkable.
        </p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "1.5rem" }}>
        <LaunchFilters filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Result count */}
      {!isLoading && !isError && (
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {allLaunches.length} of {totalDocs} launches
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <ErrorState
          message={error?.message ?? "Failed to load launches."}
          onRetry={() => refetch()}
        />
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <LaunchCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && allLaunches.length === 0 && (
        <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔭</div>
          <h2 style={{ marginBottom: "0.5rem" }}>No launches found</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Try adjusting your filters or clearing the search.
          </p>
        </div>
      )}

      {/* List */}
      {!isLoading && allLaunches.length > 0 && (
        <LaunchVirtualList
          launches={allLaunches}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={Boolean(hasNextPage)}
          onLoadMore={fetchNextPage}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}