"use client";

import React, { useState, useCallback, useEffect } from "react";
import { LaunchFilters } from "@/components/launches/LaunchFilters";
import { LaunchList } from "@/components/launches/LaunchList";
import { Pagination } from "@/components/launches/Pagination";
import { ErrorState } from "@/components/common/ErrorState";
import { useLaunches } from "@/hooks/launches/useLaunches";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { LaunchFilters as FiltersType } from "@/types/pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export default function LaunchesPage() {
  const [filters, setFilters] = useState<FiltersType>({
    sortField: "date_utc",
    sortDirection: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { favorites, toggleFavorite } = useFavorites();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useLaunches(filters, currentPage);

  // Reset to page 1 whenever filters change
  const handleFilterChange = useCallback((updated: Partial<FiltersType>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1);
  }, []);

  // Scroll to top of list when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const launches = data?.docs ?? [];
  const totalDocs = data?.totalDocs ?? 0;
  const totalPages = data?.totalPages ?? 1;

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

      {/* Error state */}
      {isError && (
        <ErrorState
          message={error?.message ?? "Failed to load launches."}
          onRetry={() => refetch()}
        />
      )}

      {/* Empty state */}
      {!isLoading && !isError && launches.length === 0 && (
        <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔭</div>
          <h2 style={{ marginBottom: "0.5rem" }}>No launches found</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Try adjusting your filters or clearing the search.
          </p>
        </div>
      )}

      {/* Launch list */}
      {!isError && (
        <>
          <LaunchList
            launches={launches}
            isLoading={isLoading}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />

          {/* Pagination — only show when we have data */}
          {!isLoading && totalDocs > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalDocs={totalDocs}
              pageSize={DEFAULT_PAGE_SIZE}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
}