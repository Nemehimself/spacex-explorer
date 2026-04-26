"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalDocs,
  pageSize,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  // Build the page number array with ellipsis
  function getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) pages.push("...");

    // Pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    // Always show last page
    pages.push(totalPages);

    return pages;
  }

  const pages = getPageNumbers();

  // Range shown on this page
  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalDocs);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "1.5rem 0",
      }}
    >
      {/* Showing X – Y of Z */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
        }}
      >
        Showing{" "}
        <span style={{ color: "var(--accent-bright)" }}>{rangeStart}–{rangeEnd}</span>
        {" "}of{" "}
        <span style={{ color: "var(--text-secondary)" }}>{totalDocs}</span>
        {" "}launches
      </p>

      {/* Page controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
        role="navigation"
        aria-label="Pagination"
      >
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          aria-label="Previous page"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-mid)",
            background: "transparent",
            color: currentPage === 1 ? "var(--text-muted)" : "var(--text-secondary)",
            fontFamily: "var(--font-display)",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.4 : 1,
            transition: "all 0.18s",
          }}
          onMouseOver={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent-bright)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "var(--border-mid)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          ← Prev
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              style={{
                padding: "0.45rem 0.5rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                userSelect: "none",
              }}
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "var(--radius-md)",
                border: currentPage === page
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border-mid)",
                background: currentPage === page
                  ? "var(--accent)"
                  : "transparent",
                color: currentPage === page
                  ? "white"
                  : "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                fontWeight: currentPage === page ? 600 : 400,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.18s",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseOver={(e) => {
                if (currentPage !== page) {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent-bright)";
                  e.currentTarget.style.background = "var(--accent-glow)";
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== page) {
                  e.currentTarget.style.borderColor = "var(--border-mid)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {page}
            </button>
          )
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          aria-label="Next page"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-mid)",
            background: "transparent",
            color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-secondary)",
            fontFamily: "var(--font-display)",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.4 : 1,
            transition: "all 0.18s",
          }}
          onMouseOver={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent-bright)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "var(--border-mid)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          Next →
        </button>
      </div>

      {/* Page X of Y */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
        }}
      >
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}