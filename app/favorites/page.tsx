"use client";

import React from "react";
import { useQueries } from "@tanstack/react-query";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { fetchLaunchById } from "@/lib/api/launches";
import { LaunchCard } from "@/components/launches/LaunchCard";
import { LaunchCardSkeleton } from "@/components/common/Skeleton";
import { Launch } from "@/types/launch";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const results = useQueries({
    queries: favorites.map((id) => ({
      queryKey: ["launch-detail", id],
      queryFn: (): Promise<Launch> => fetchLaunchById(id),
      enabled: favorites.length > 0,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ marginBottom: "0.35rem" }}>★ Favorites</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {favorites.length > 0
            ? `${favorites.length} saved mission${favorites.length !== 1 ? "s" : ""}`
            : "No missions saved yet."}
        </p>
      </div>

      {favorites.length === 0 && (
        <div
          className="card"
          style={{ padding: "4rem 2rem", textAlign: "center" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>☆</div>
          <h2 style={{ marginBottom: "0.5rem", fontSize: "1.2rem" }}>Nothing saved yet</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            Tap the star on any launch card to bookmark it here.
          </p>
          <Link href="/" className="btn btn-primary" style={{ display: "inline-flex" }}>
            Browse launches
          </Link>
        </div>
      )}

      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {favorites.map((id) => <LaunchCardSkeleton key={id} />)}
        </div>
      )}

      {!isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {results.map((result) =>
            result.data ? (
              <LaunchCard
                key={result.data.id}
                launch={result.data}
                isFavorite={isFavorite(result.data.id)}
                onToggleFavorite={toggleFavorite}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}