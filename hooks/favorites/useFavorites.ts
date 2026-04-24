import { useState, useCallback } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/utils/storage";

/**
 * Manages the user's favorited launch IDs.
 *
 * Persists to localStorage so favorites survive page refreshes.
 * Initialises from localStorage on mount (inside useEffect) to avoid
 * SSR hydration mismatches — the server has no access to localStorage.
 *
 * @returns favorites      - Array of favorited launch IDs
 * @returns toggleFavorite - Add or remove a launch ID from favorites
 * @returns isFavorite     - Check if a specific launch ID is favorited
 */

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return getFavorites();
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return removeFavorite(id);
      } else {
        return addFavorite(id);
      }
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}