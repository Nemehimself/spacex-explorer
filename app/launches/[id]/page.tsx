"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLaunch } from "@/hooks/launches/useLaunch";
import { useRocket } from "@/hooks/rockets/useRocket";
import { useLaunchpad } from "@/hooks/launchpads/useLaunchpad";
import { useFavorites } from "@/hooks/favorites/useFavorites";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";
import { RocketCard } from "@/components/detail/RocketCard";
import { LaunchpadCard } from "@/components/detail/LaunchpadCard";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { formatLaunchDate } from "@/utils/date";

export default function LaunchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data: launch, isLoading, isError, refetch } = useLaunch(id);
  const { data: rocket, isLoading: rocketLoading } = useRocket(launch?.rocket ?? null);
  const { data: launchpad, isLoading: launchpadLoading } = useLaunchpad(launch?.launchpad ?? null);

  if (isError) {
    return <ErrorState message="Launch not found." onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} aria-busy="true">
        <Skeleton style={{ height: 48, width: "55%" }} />
        <Skeleton style={{ height: 20, width: "35%" }} />
        <Skeleton style={{ height: 120, borderRadius: 16 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Skeleton style={{ height: 200, borderRadius: 16 }} />
          <Skeleton style={{ height: 200, borderRadius: 16 }} />
        </div>
      </div>
    );
  }

  if (!launch) return null;

  const flickrImages = launch.links.flickr.original;
  const isLaunchFavorite = isFavorite(launch.id);

  return (
    <article>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.82rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "color 0.18s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--accent-bright)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          ← Mission Archive
        </Link>
      </nav>

      {/* Hero header */}
      <header
        className="card-raised"
        style={{ padding: "2rem", marginBottom: "1.5rem" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ marginBottom: "0.5rem" }}>{launch.name}</h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              {formatLaunchDate(launch.date_utc)} · Flight #{launch.flight_number}
            </p>

            {/* Status badges */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {launch.upcoming ? (
                <span className="badge badge-info">Upcoming</span>
              ) : launch.success ? (
                <span className="badge badge-success">✓ Mission Success</span>
              ) : (
                <span className="badge badge-danger">✗ Mission Failed</span>
              )}
              {launch.links.webcast && (
                <a
                  href={launch.links.webcast}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge badge-neutral"
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  ▶ Webcast
                </a>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(launch.id)}
            className={`btn-icon ${isLaunchFavorite ? "favorited" : ""}`}
            style={{ fontSize: "1.4rem", width: "3rem", height: "3rem", flexShrink: 0 }}
            aria-label={isLaunchFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isLaunchFavorite}
          >
            {isLaunchFavorite ? "★" : "☆"}
          </button>
        </div>

        {launch.details && (
          <>
            <div className="divider" />
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
              {launch.details}
            </p>
          </>
        )}
      </header>

      {/* External links */}
      {(launch.links.article || launch.links.wikipedia || launch.links.reddit.launch) && (
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {launch.links.article && (
            <a href={launch.links.article} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              📰 Article
            </a>
          )}
          {launch.links.wikipedia && (
            <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              📖 Wikipedia
            </a>
          )}
          {launch.links.reddit.launch && (
            <a href={launch.links.reddit.launch} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              💬 Reddit thread
            </a>
          )}
        </div>
      )}

      {/* Image gallery */}
      {flickrImages.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <ImageGallery images={flickrImages} missionName={launch.name} />
        </div>
      )}

      {/* Rocket + launchpad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: "1rem",
        }}
      >
        {rocketLoading ? (
          <Skeleton style={{ height: 220, borderRadius: 16 }} />
        ) : rocket ? (
          <RocketCard rocket={rocket} />
        ) : null}

        {launchpadLoading ? (
          <Skeleton style={{ height: 220, borderRadius: 16 }} />
        ) : launchpad ? (
          <LaunchpadCard launchpad={launchpad} />
        ) : null}
      </div>
    </article>
  );
}