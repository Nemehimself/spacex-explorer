"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

interface YearStat {
  year: string;
  successRate: number;
  total: number;
}

interface Props {
  data: YearStat[];
}

function CustomTooltip({ active, payload }: TooltipProps<number, string> & { payload?: Array<{ payload: YearStat; value: number; color: string }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const label = d.payload.year;

  return (
    <div className="custom-tooltip">
      <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
      <p className="text-sm" style={{ color: d.color }}>
        Success rate:{" "}
        <span className="font-medium">{d.value}%</span>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {d.payload.total} launches
      </p>
    </div>
  );
}

export function SuccessRateChart({ data }: Props) {
  return (
    <section aria-labelledby="success-rate-heading">
      <h2
        id="success-rate-heading"
        className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
      >
        Mission success rate over time
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 24, left: 0, bottom: 8 }}
          role="img"
          aria-label="Line chart showing SpaceX mission success rate per year"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#4a5f80" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#4a5f80" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={100}
            stroke="#22c55e"
            strokeDasharray="4 4"
            label={{
              value: "100%",
              position: "insideTopRight",
              fontSize: 11,
              fill: "#22c55e",
            }}
          />
          <Line
            type="monotone"
            dataKey="successRate"
            name="Success rate"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}