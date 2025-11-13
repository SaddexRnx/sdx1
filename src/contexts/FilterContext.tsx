import React, { createContext, useContext, useState } from 'react';
import { ViewMode, SortOption } from '@/types/tool';

interface FilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPricing: string;
  setSelectedPricing: (pricing: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPricing('All');
    setSortBy('featured');
  };

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPricing,
        setSelectedPricing,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilters must be used within FilterProvider');
  return context;
}
