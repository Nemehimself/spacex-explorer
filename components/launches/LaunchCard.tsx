"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Launch } from "@/types/launch";
import { formatLaunchDate } from "@/utils/date";

interface LaunchCardProps {
  launch: Launch;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function StatusBadge({
  success,
  upcoming,
}: {
  success: boolean | null;
  upcoming: boolean;
}) {
  if (upcoming) return <span className="badge badge-info">Upcoming</span>;
  if (success === true) return <span className="badge badge-success">✓ Success</span>;
  if (success === false) return <span className="badge badge-danger">✗ Failed</span>;
  return <span className="badge badge-neutral">Unknown</span>;
}

export const LaunchCard = memo(function LaunchCard({
  launch,
  isFavorite,
  onToggleFavorite,
}: LaunchCardProps) {
  return (
    <article className="card" style={{ overflow: "hidden" }}>
      <Link
        href={`/launches/${launch.id}`}
        style={{ display: "block", padding: "1.25rem", textDecoration: "none" }}
        aria-label={`View details for ${launch.name}`}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          {/* Mission patch */}
          <div style={{ flexShrink: 0 }}>
            {launch.links.patch.small ? (
              <Image
                src={launch.links.patch.small}
                alt={`${launch.name} mission patch`}
                width={56}
                height={56}
                style={{ borderRadius: "50%", background: "var(--bg-overlay)" }}
              />
            ) : (
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--bg-overlay)",
                  border: "1px solid var(--border-mid)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                🚀
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.35rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "0.02em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {launch.name}
              </h2>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(launch.id);
                }}
                className={`btn-icon ${isFavorite ? "favorited" : ""}`}
                aria-label={isFavorite ? `Remove ${launch.name} from favorites` : `Add ${launch.name} to favorites`}
                aria-pressed={isFavorite}
                style={{ flexShrink: 0 }}
              >
                {isFavorite ? "★" : "☆"}
              </button>
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {formatLaunchDate(launch.date_utc)}
              </span>
              <span style={{ color: "var(--border-mid)" }}>·</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Flight #{launch.flight_number}
              </span>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
              <StatusBadge success={launch.success} upcoming={launch.upcoming} />
            </div>

            {/* Details */}
            {launch.details && (
              <p
                className="line-clamp-2"
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.55 }}
              >
                {launch.details}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
});