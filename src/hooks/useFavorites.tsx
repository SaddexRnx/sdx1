import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Tool } from '@/types/tool';

const FAVORITES_KEY = 'sdxrnx_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (toolId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(toolId)) {
      newFavorites.delete(toolId);
    } else {
      newFavorites.add(toolId);
    }
    saveFavorites(newFavorites);
  };

  const isFavorite = (toolId: string) => favorites.has(toolId);

  const clearFavorites = () => {
    saveFavorites(new Set());
  };

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.size
  };
}

interface FavoriteButtonProps {
  toolId: string;
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ toolId, isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className="w-8 h-8 bg-primary border-pixel hover-pixel flex items-center justify-center transition-colors"
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`w-4 h-4 ${isFavorite ? 'text-red-500' : 'text-primary'}`}
        strokeWidth={2.5}
        fill={isFavorite ? 'currentColor' : 'none'}
      />
    </button>
  );
}
