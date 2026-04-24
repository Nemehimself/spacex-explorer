interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`skeleton ${className}`}
      style={style}
    />
  );
}

export function LaunchCardSkeleton() {
  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div
          className="skeleton"
          style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0 }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          <div className="skeleton" style={{ height: 20, width: "65%" }} />
          <div className="skeleton" style={{ height: 14, width: "40%" }} />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div
              className="skeleton"
              style={{ height: 22, width: 70, borderRadius: 999 }}
            />
            <div
              className="skeleton"
              style={{ height: 22, width: 80, borderRadius: 999 }}
            />
          </div>
          <div className="skeleton" style={{ height: 14, width: "90%" }} />
          <div className="skeleton" style={{ height: 14, width: "75%" }} />
        </div>
      </div>
    </div>
  );
}