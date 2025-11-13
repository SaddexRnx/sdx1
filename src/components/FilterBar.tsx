import { Filter, Grid, List, X, Search } from 'lucide-react';
import { useFilters } from '@/contexts/FilterContext';
import { SortOption, Tool } from '@/types/tool';
import { useTranslation } from 'react-i18next';
import { ExportButton } from './ExportButton';
import { useState, useEffect } from 'react';
import { dbAPI } from '@/lib/supabase';

interface FilterBarProps {
  categories: string[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const { t } = useTranslation();
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const {
    selectedCategory,
    setSelectedCategory,
    selectedPricing,
    setSelectedPricing,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    clearFilters,
    searchQuery,
    setSearchQuery,
  } = useFilters();

  const pricingOptions = ['All', 'Free', 'Freemium', 'Premium'];
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'FEATURED' },
    { value: 'newest', label: 'NEWEST' },
    { value: 'name-asc', label: 'A TO Z' },
    { value: 'name-desc', label: 'Z TO A' },
  ];
  
  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedPricing !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Fetch all filtered tools for export
  useEffect(() => {
    async function fetchAllTools() {
      try {
        const result = await dbAPI.list({
          page: 1,
          limit: 1000, // Get a large number for export
          category: selectedCategory,
          pricing: selectedPricing,
          search: searchQuery,
          sortBy: sortBy || 'featured'
        });
        setAllTools(result.tools);
      } catch (error) {
        console.error('Error loading tools for export:', error);
      }
    }
    fetchAllTools();
  }, [selectedCategory, selectedPricing, searchQuery, sortBy]);

  return (
    <div className="bg-secondary border-b-pixel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" strokeWidth={2.5} />
            <input
              type="text"
              placeholder={t('filters.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-pixel w-full pl-12 pr-4 h-12 font-bold uppercase placeholder:text-tertiary"
            />
          </div>
        </div>

        {/* Category Selection - Clean Dropdown for All Screens */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={2.5} />
            <p className="text-sm font-bold text-primary uppercase">{t('categories.all')}</p>
          </div>
          
          {/* Clean Dropdown for All Screen Sizes */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-pixel w-full max-w-md px-4 py-3 font-bold uppercase text-sm cursor-pointer"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Pricing Filter */}
            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              className="input-pixel px-4 py-2 font-bold uppercase text-xs cursor-pointer"
            >
              {pricingOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? t('filters.allPricing') : option.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input-pixel px-4 py-2 font-bold uppercase text-xs cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="btn-pixel-secondary flex items-center gap-2 text-xs py-2 px-4"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
                {t('filters.clear')} ({activeFilterCount})
              </button>
            )}

            {/* Export Button */}
            <ExportButton tools={allTools} label="EXPORT" />
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-primary border-pixel">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-all ${
                viewMode === 'grid'
                  ? 'text-primary'
                  : 'text-secondary hover:bg-secondary'
              }`}
              style={viewMode === 'grid' ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' } : {}}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <div className="w-px h-6" style={{ backgroundColor: 'var(--border)' }}></div>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-all ${
                viewMode === 'list'
                  ? 'text-primary'
                  : 'text-secondary hover:bg-secondary'
              }`}
              style={viewMode === 'list' ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' } : {}}
              aria-label="List view"
            >
              <List className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
