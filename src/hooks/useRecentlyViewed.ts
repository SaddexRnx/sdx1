import { useState, useEffect } from 'react';

const RECENTLY_VIEWED_KEY = 'sdxrnx_recently_viewed';
const MAX_RECENT = 20;

interface RecentTool {
  id: string;
  timestamp: number;
}

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) {
        const recent: RecentTool[] = JSON.parse(stored);
        // Sort by timestamp and extract IDs
        const ids = recent
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(item => item.id);
        setRecentIds(ids);
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    }
  }, []);

  const addToRecent = (toolId: string) => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let recent: RecentTool[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists
      recent = recent.filter(item => item.id !== toolId);

      // Add to front
      recent.unshift({
        id: toolId,
        timestamp: Date.now()
      });

      // Keep only MAX_RECENT items
      recent = recent.slice(0, MAX_RECENT);

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recent));
      setRecentIds(recent.map(item => item.id));
    } catch (error) {
      console.error('Error saving recently viewed:', error);
    }
  };

  const clearRecent = () => {
    try {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
      setRecentIds([]);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  return {
    recentIds,
    addToRecent,
    clearRecent,
    count: recentIds.length
  };
}
