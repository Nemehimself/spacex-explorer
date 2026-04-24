"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface YearStat {
  year: string;
  total: number;
  success: number;
  failed: number;
  successRate: number;
}

interface Props {
  data: YearStat[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="text-sm">
          {entry.name}: <span className="font-medium">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export function LaunchesPerYearChart({ data }: Props) {
  return (
    <section aria-labelledby="launches-year-heading">
      <h2
        id="launches-year-heading"
        className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
      >
        Launches per year
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 24, left: 0, bottom: 8 }}
          role="img"
          aria-label="Bar chart showing number of SpaceX launches per year"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#4a5f80" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#4a5f80" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
          />
          <Bar
            dataKey="success"
            name="Success"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="failed"
            name="Failed"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}