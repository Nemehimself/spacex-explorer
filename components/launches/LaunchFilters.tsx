"use client";

import React from "react";
import {
  LaunchFilters as FiltersType,
  SortField,
  SortDirection,
} from "@/types/pagination";

interface LaunchFiltersProps {
  filters: FiltersType;
  onChange: (updated: Partial<FiltersType>) => void;
}

const DEFAULT_FILTERS: FiltersType = {
  sortField: "date_utc",
  sortDirection: "desc",
};

function isFiltersActive(filters: FiltersType): boolean {
  return Boolean(
    filters.search ||
    filters.upcoming !== undefined ||
    (filters.success !== undefined && filters.success !== null) ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.sortField !== "date_utc" ||
    filters.sortDirection !== "desc"
  );
}

export function LaunchFilters({ filters, onChange }: LaunchFiltersProps) {
  const hasActiveFilters = isFiltersActive(filters);

  function clearAll() {
    onChange({
      search: undefined,
      upcoming: undefined,
      success: null,
      dateFrom: undefined,
      dateTo: undefined,
      sortField: "date_utc",
      sortDirection: "desc",
    });
  }

  return (
    <div className="card-raised" style={{ padding: "1.25rem" }} role="search" aria-label="Filter and sort launches">

      {/* ── Header row: label + clear button ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}>
          Filter &amp; Sort
        </span>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="btn btn-ghost"
            style={{
              padding: "0.3rem 0.85rem",
              fontSize: "0.78rem",
              borderColor: "var(--danger)",
              color: "var(--danger)",
            }}
            aria-label="Clear all filters"
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* ── Active filter pills ── */}
      {hasActiveFilters && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
          {filters.search && (
            <FilterPill
              label={`Search: "${filters.search}"`}
              onRemove={() => onChange({ search: undefined })}
            />
          )}
          {filters.upcoming === true && (
            <FilterPill label="Upcoming" onRemove={() => onChange({ upcoming: undefined })} />
          )}
          {filters.upcoming === false && (
            <FilterPill label="Past" onRemove={() => onChange({ upcoming: undefined })} />
          )}
          {filters.success === true && (
            <FilterPill label="Success" onRemove={() => onChange({ success: null })} />
          )}
          {filters.success === false && (
            <FilterPill label="Failed" onRemove={() => onChange({ success: null })} />
          )}
          {filters.dateFrom && (
            <FilterPill label={`From: ${filters.dateFrom}`} onRemove={() => onChange({ dateFrom: undefined })} />
          )}
          {filters.dateTo && (
            <FilterPill label={`To: ${filters.dateTo}`} onRemove={() => onChange({ dateTo: undefined })} />
          )}
          {(filters.sortField !== "date_utc" || filters.sortDirection !== "desc") && (
            <FilterPill
              label={`Sort: ${filters.sortField === "date_utc" ? "Date" : filters.sortField === "name" ? "Name" : "Flight #"} ${filters.sortDirection === "asc" ? "↑" : "↓"}`}
              onRemove={() => onChange({ sortField: "date_utc", sortDirection: "desc" })}
            />
          )}
        </div>
      )}

      {/* ── Filter grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          alignItems: "end",
        }}
      >
        {/* Search */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="search" style={labelStyle}>Search missions</label>
          <div style={{ position: "relative" }}>
            <input
              id="search"
              type="search"
              className="input"
              placeholder="e.g. Starlink, CRS-24…"
              value={filters.search ?? ""}
              onChange={(e) => onChange({ search: e.target.value || undefined })}
              style={{ paddingRight: filters.search ? "2.5rem" : "1rem" }}
            />
            {filters.search && (
              <button
                onClick={() => onChange({ search: undefined })}
                aria-label="Clear search"
                style={{
                  position: "absolute",
                  right: "0.6rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  lineHeight: 1,
                  padding: "0.2rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Timing */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={labelStyle}>Timing</span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {(
              [
                { label: "All", value: undefined },
                { label: "Upcoming", value: true },
                { label: "Past", value: false },
              ] as { label: string; value: boolean | undefined }[]
            ).map(({ label, value }) => (
              <button
                key={label}
                onClick={() => onChange({ upcoming: value })}
                aria-pressed={filters.upcoming === value}
                className={`btn btn-ghost ${filters.upcoming === value ? "active" : ""}`}
                style={{ flex: 1, padding: "0.45rem 0.5rem", fontSize: "0.82rem" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={labelStyle}>Result</span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {(
              [
                // { label: "All", value: null },
                { label: "Success", value: true },
                { label: "Failed", value: false },
              ] as { label: string; value: boolean | null }[]
            ).map(({ label, value }) => (
              <button
                key={label}
                onClick={() => onChange({ success: value })}
                aria-pressed={filters.success === value}
                className={`btn btn-ghost ${filters.success === value ? "active" : ""}`}
                style={{ flex: 1, padding: "0.45rem 0.5rem", fontSize: "0.82rem" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="sort-field" style={labelStyle}>Sort by</label>
          <select
            id="sort-field"
            className="input"
            value={filters.sortField ?? "date_utc"}
            onChange={(e) => onChange({ sortField: e.target.value as SortField })}
          >
            <option value="date_utc">Date</option>
            <option value="name">Mission name</option>
            <option value="flight_number">Flight number</option>
          </select>
        </div>

        {/* Sort direction */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="sort-dir" style={labelStyle}>Order</label>
          <select
            id="sort-dir"
            className="input"
            value={filters.sortDirection ?? "desc"}
            onChange={(e) => onChange({ sortDirection: e.target.value as SortDirection })}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>

        {/* Date from */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="date-from" style={labelStyle}>From date</label>
          <input
            id="date-from"
            type="date"
            className="input"
            value={filters.dateFrom ?? ""}
            onChange={(e) => onChange({ dateFrom: e.target.value || undefined })}
          />
        </div>

        {/* Date to */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="date-to" style={labelStyle}>To date</label>
          <input
            id="date-to"
            type="date"
            className="input"
            value={filters.dateTo ?? ""}
            onChange={(e) => onChange({ dateTo: e.target.value || undefined })}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Shared label style ── */
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "0.72rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

/* ── Removable filter pill ── */
function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.2rem 0.5rem 0.2rem 0.75rem",
        background: "rgba(59,130,246,0.12)",
        border: "1px solid rgba(59,130,246,0.25)",
        borderRadius: 999,
        fontFamily: "var(--font-display)",
        fontSize: "0.75rem",
        color: "var(--accent-bright)",
        letterSpacing: "0.04em",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        style={{
          background: "none",
          border: "none",
          color: "var(--accent-bright)",
          cursor: "pointer",
          fontSize: "0.85rem",
          lineHeight: 1,
          padding: "0.1rem",
          opacity: 0.7,
          display: "flex",
          alignItems: "center",
        }}
      >
        ✕
      </button>
    </span>
  );
}