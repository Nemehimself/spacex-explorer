"use client";

import React from "react";
import { Launch } from "@/types/launch";
import { LaunchCard } from "./LaunchCard";
import { LaunchCardSkeleton } from "@/components/common/Skeleton";

interface LaunchListProps {
  launches: Launch[];
  isLoading: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function LaunchList({
  launches,
  isLoading,
  favorites,
  onToggleFavorite,
}: LaunchListProps) {
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <LaunchCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label="Launches"
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      {launches.map((launch) => (
        <div key={launch.id} role="listitem">
          <LaunchCard
            launch={launch}
            isFavorite={favorites.includes(launch.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
}