import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'ai-tools-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (toolId: string) => {
    setBookmarks(prev => {
      if (prev.includes(toolId)) return prev;
      return [...prev, toolId];
    });
  };

  const removeBookmark = (toolId: string) => {
    setBookmarks(prev => prev.filter(id => id !== toolId));
  };

  const toggleBookmark = (toolId: string) => {
    if (bookmarks.includes(toolId)) {
      removeBookmark(toolId);
    } else {
      addBookmark(toolId);
    }
  };

  const isBookmarked = (toolId: string) => bookmarks.includes(toolId);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
  };
}
