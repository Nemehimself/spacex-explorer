import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";
import { TbDeviceAnalytics } from "react-icons/tb";
import { IoRocketSharp } from "react-icons/io5";

export const metadata: Metadata = {
  title: "SpaceX Explorer",
  description: "Explore every SpaceX launch, rocket, and launchpad",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* ── Top navigation ── */}
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 50,
              background: "rgba(8,12,20,0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div className="page-container">
              <nav
                aria-label="Main navigation"
                style={{
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {/* Logo */}
                <Link
                  href="/"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginRight: "1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}><IoRocketSharp /></span>
                  <span>SpaceX Explorer</span>
                </Link>

                {/* Nav links */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
                  <Link href="/" className="nav-link">Launches</Link>
                  <Link href="/favorites" className="nav-link">★ Favorites</Link>
                  <Link href="/charts" className="nav-link flex items-center gap-2"><TbDeviceAnalytics />Analytics</Link>
                </div>
              </nav>
            </div>
          </header>

          {/* ── Page content ── */}
          <main id="main-content" style={{ position: "relative", zIndex: 1 }}>
            <div className="page-container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
              {children}
            </div>
          </main>

          {/* ── Footer ── */}
          <footer
            style={{
              borderTop: "1px solid var(--border-subtle)",
              padding: "1.5rem 0",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              className="page-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: "0.06em", color: "var(--text-muted)", textTransform: "uppercase" }}>
                SpaceX Explorer
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Data via{" "}
                <a
                  href="https://github.com/r-spacex/SpaceX-API"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-bright)", textDecoration: "none" }}
                >
                  SpaceX API v4
                </a>
              </span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}