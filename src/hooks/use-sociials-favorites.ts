"use client";

import { useEffect, useState } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('toolioz_tool_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        setFavorites([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (slug: string) => {
    setFavorites((previous) => {
      const next = previous.includes(slug)
        ? previous.filter((item) => item !== slug)
        : [...previous, slug];
      localStorage.setItem('toolioz_tool_favorites', JSON.stringify(next));
      return next;
    });
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite: (slug: string) => favorites.includes(slug),
    isLoaded,
  };
}
