/**
 * SSR-safe localStorage helpers for persisting favorite launch IDs.
 *
 * All functions guard against:
 * - Server-side rendering (window is undefined on the server)
 * - localStorage quota errors (silent fail with console.warn)
 * - JSON parse errors from corrupted storage (returns empty array)
 *
 * Storage key: "spacex_favorites"
 * Storage format: JSON array of launch ID strings, e.g. ["abc123", "def456"]
 */

const FAVORITES_KEY = "spacex_favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    console.warn("Failed to save favorites to localStorage");
  }
}

export function addFavorite(id: string): string[] {
  const current = getFavorites();
  if (current.includes(id)) return current;
  const updated = [...current, id];
  saveFavorites(updated);
  return updated;
}

export function removeFavorite(id: string): string[] {
  const current = getFavorites();
  const updated = current.filter((fid) => fid !== id);
  saveFavorites(updated);
  return updated;
}