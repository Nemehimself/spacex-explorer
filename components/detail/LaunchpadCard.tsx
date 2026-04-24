import React from "react";
import { Launchpad } from "@/types/launchpad";

export function LaunchpadCard({ launchpad }: { launchpad: Launchpad }) {
  const successRate =
    launchpad.launch_attempts > 0
      ? Math.round((launchpad.launch_successes / launchpad.launch_attempts) * 100)
      : 0;

  return (
    <section aria-labelledby="launchpad-heading" className="card-raised" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
        <h2 id="launchpad-heading" style={{ fontSize: "1rem" }}>📍 {launchpad.name}</h2>
        <span className={`badge ${launchpad.status === "active" ? "badge-success" : "badge-neutral"}`}>
          {launchpad.status}
        </span>
      </div>

      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
        {launchpad.locality}, {launchpad.region}
      </p>

      <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {[
          { label: "Total launches", value: launchpad.launch_attempts },
          { label: "Successes", value: launchpad.launch_successes },
          { label: "Success rate", value: `${successRate}%` },
          { label: "Timezone", value: launchpad.timezone },
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

      {launchpad.details && (
        <>
          <div className="divider" />
          <p className="line-clamp-3" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {launchpad.details}
          </p>
        </>
      )}
    </section>
  );
}