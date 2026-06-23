import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "3d-house-viewer:favorites";

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(readFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const value = useMemo(() => {
    const favoriteSet = new Set(favoriteIds);

    return {
      favoriteIds,
      isFavorite: (houseId: string) => favoriteSet.has(houseId),
      toggleFavorite: (houseId: string) => {
        setFavoriteIds((current) =>
          current.includes(houseId)
            ? current.filter((id) => id !== houseId)
            : [houseId, ...current],
        );
      },
    };
  }, [favoriteIds]);

  return value;
}
