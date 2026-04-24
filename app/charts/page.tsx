"use client";

import React from "react";
import { useChartData } from "@/hooks/launches/useChartData";
import { LaunchesPerYearChart } from "./LaunchesPerYearChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { Skeleton } from "@/components/common/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { TbDeviceAnalytics } from "react-icons/tb";

export default function ChartsPage() {
  const { data, isLoading, isError, refetch } = useChartData();

  if (isError) {
    return <ErrorState message="Failed to load analytics." onRetry={() => refetch()} />;
  }

  const totalLaunches = data?.yearStats.reduce((s, y) => s + y.total, 0) ?? 0;
  const totalSuccess = data?.yearStats.reduce((s, y) => s + y.success, 0) ?? 0;
  const totalFailed = data?.yearStats.reduce((s, y) => s + y.failed, 0) ?? 0;
  const overallRate = totalLaunches > 0 ? Math.round((totalSuccess / totalLaunches) * 100) : 0;

  const statCards = [
    { label: "Total launches", value: totalLaunches, color: "var(--accent-bright)" },
    { label: "Successful", value: totalSuccess, color: "var(--success)" },
    { label: "Failed", value: totalFailed, color: "var(--danger)" },
    { label: "Overall success rate", value: `${overallRate}%`, color: "var(--warning)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ marginBottom: "0.35rem" }} className="flex items-center gap-2">
          <TbDeviceAnalytics />
          Launch Analytics
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Historical SpaceX launch performance at a glance.
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {[1,2,3,4].map((i) => <Skeleton key={i} style={{ height: 100, borderRadius: 16 }} />)}
          </div>
          <Skeleton style={{ height: 360, borderRadius: 16 }} />
          <Skeleton style={{ height: 360, borderRadius: 16 }} />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {statCards.map(({ label, value, color }) => (
              <div key={label} className="card-raised" style={{ padding: "1.25rem" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  {label}
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 700, color, lineHeight: 1 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="card-raised" style={{ padding: "1.75rem" }}>
            <LaunchesPerYearChart data={data?.yearStats ?? []} />
          </div>

          <div className="card-raised" style={{ padding: "1.75rem" }}>
            <SuccessRateChart data={data?.yearStats ?? []} />
          </div>
        </div>
      )}
    </div>
  );
}