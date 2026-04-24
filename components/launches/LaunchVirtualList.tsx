"use client";
"use no memo";

import React, { useCallback, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Launch } from "@/types/launch";
import { LaunchCard } from "./LaunchCard";
import { Spinner } from "@/components/common/Spinner";

interface LaunchVirtualListProps {
  launches: Launch[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

/**
 * Virtualised infinite-scroll list of launch cards.
 *
 * Uses @tanstack/react-virtual to render only the DOM nodes currently
 * visible in the viewport (~10 nodes vs 200+ without virtualisation).
 *
 * The "load more" trigger uses IntersectionObserver on a sentinel div
 * at the bottom of the list. When the sentinel enters the viewport
 * (with a 300px root margin), fetchNextPage() is called automatically.
 *
 * NOTE: This component is opted out of the React Compiler's auto-memoisation
 * via "use no memo" because useVirtualizer returns functions that cannot
 * be safely memoised (TanStack Virtual recommendation).
 */

export function LaunchVirtualList({
  launches,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  favorites,
  onToggleFavorite,
}: LaunchVirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: launches.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  });

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !hasNextPage || isFetchingNextPage) return;
      const observer = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) onLoadMore(); },
        { rootMargin: "300px" }
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [hasNextPage, isFetchingNextPage, onLoadMore]
  );

  return (
    <div>
      <div
        ref={parentRef}
        role="feed"
        aria-label="Launches list"
        style={{ height: "calc(100vh - 320px)", overflowY: "auto", minHeight: 400 }}
      >
        <div style={{ height: rowVirtualizer.getTotalSize(), width: "100%", position: "relative" }}>
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const launch = launches[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                  paddingBottom: "0.75rem",
                }}
              >
                <LaunchCard
                  launch={launch}
                  isFavorite={favorites.includes(launch.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Infinite scroll sentinel */}
      <div
        ref={loadMoreRef}
        style={{ display: "flex", justifyContent: "center", padding: "2rem 0", minHeight: 60 }}
      >
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && launches.length > 0 && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            — {launches.length} launches loaded —
          </p>
        )}
      </div>
    </div>
  );
}