interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>⚠️</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
        Houston, we have a problem
      </h2>
      <p style={{ color: "var(--text-secondary)", maxWidth: 380, marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}