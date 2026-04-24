import React from "react";
import { Rocket } from "@/types/rocket";

export function RocketCard({ rocket }: { rocket: Rocket }) {
  return (
    <section aria-labelledby="rocket-heading" className="card-raised" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h2 id="rocket-heading" style={{ fontSize: "1rem" }}>🚀 {rocket.name}</h2>
        <span className={`badge ${rocket.active ? "badge-success" : "badge-neutral"}`}>
          {rocket.active ? "Active" : "Retired"}
        </span>
      </div>

      <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {[
          { label: "Type", value: rocket.type },
          { label: "Success rate", value: `${rocket.success_rate_pct}%` },
          { label: "First flight", value: rocket.first_flight },
          { label: "Cost per launch", value: `$${rocket.cost_per_launch.toLocaleString()}` },
          { label: "Stages", value: rocket.stages },
          { label: "Country", value: rocket.country },
        ].map(({ label, value }) => (
          <div key={label}>
            <dt style={{ fontFamily: "var(--font-display)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
              {label}
            </dt>
            <dd style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--text-primary)" }}>
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {rocket.description && (
        <>
          <div className="divider" />
          <p className="line-clamp-3" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {rocket.description}
          </p>
        </>
      )}
    </section>
  );
}