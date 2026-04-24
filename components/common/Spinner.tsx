export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = { sm: 18, md: 32, lg: 48 }[size];
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        width: dim,
        height: dim,
        borderRadius: "50%",
        border: "2px solid var(--border-mid)",
        borderTopColor: "var(--accent)",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}