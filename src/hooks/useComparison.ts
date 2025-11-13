import { useState, useEffect } from 'react';
import { Tool } from '@/types/tool';

const COMPARISON_KEY = 'ai-tools-comparison';

export function useComparison() {
  const [compareList, setCompareList] = useState<Tool[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARISON_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (tool: Tool) => {
    setCompareList(prev => {
      if (prev.length >= 3) {
        return prev;  // Max 3 tools
      }
      if (prev.find(t => t.id === tool.id)) {
        return prev;  // Already added
      }
      return [...prev, tool];
    });
  };

  const removeFromCompare = (toolId: string) => {
    setCompareList(prev => prev.filter(t => t.id !== toolId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (toolId: string) => {
    return compareList.some(t => t.id === toolId);
  };

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
  };
}
