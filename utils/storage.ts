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