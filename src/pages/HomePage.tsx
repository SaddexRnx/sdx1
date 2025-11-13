import { useEffect, useState } from 'react';
import { Hero } from '@/components/Hero';
import { FilterBar } from '@/components/FilterBar';
import { ToolCard } from '@/components/ToolCard';
import { Pagination } from '@/components/Pagination';
import { RecentlyAddedSection } from '@/components/RecentlyAddedSection';
import { PopularToolsSection } from '@/components/PopularToolsSection';
import { TrendingSection } from '@/components/TrendingSection';
import { ToolOfDaySection } from '@/components/ToolOfDaySection';
import { TrendingCarousel } from '@/components/TrendingCarousel';
import { RecentlyViewedSection } from '@/components/RecentlyViewedSection';
import { ToolComparisonModal } from '@/components/ToolComparisonModal';
import { useFilters } from '@/contexts/FilterContext';
import { useComparison } from '@/hooks/useComparison';
import { Tool } from '@/types/tool';
import { Loader2, GitCompare } from 'lucide-react';
import { dbAPI } from '@/lib/supabase';

const TOOLS_PER_PAGE = 12;

export function HomePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { compareList, removeFromCompare, clearCompare } = useComparison();

  const {
    searchQuery,
    selectedCategory,
    selectedPricing,
    sortBy,
    viewMode,
  } = useFilters();

  // Fetch tools from Supabase database with logo-first sorting
  useEffect(() => {
    async function fetchTools() {
      setLoading(true);
      try {
        const result = await dbAPI.list({
          page: currentPage,
          limit: TOOLS_PER_PAGE,
          category: selectedCategory,
          pricing: selectedPricing,
          search: searchQuery,
          sortBy: sortBy || 'featured'
        });
        
        // Map database fields to Tool interface
        const mappedTools = result.tools.map((t: any) => ({
          ...t,
          id: t.id || t._id,
          _id: t._id || t.id,
          logo: t.logo_url || t.logo || '',
          tags: t.tags || []
        }));

        setTools(mappedTools);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error loading tools from database:', error);
        setTools([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, [currentPage, searchQuery, selectedCategory, selectedPricing, sortBy, retryCount]);

  // Fetch categories from database
  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await dbAPI.stats();
        setCategories(stats.categories);
      } catch (error) {
        console.error('Error loading stats:', error);
        setCategories(['All', 'Productivity', 'Design', 'Development', 'Marketing', 'Business']);
      }
    }

    fetchStats();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPricing, sortBy]);

  // Manual retry function
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setCurrentPage(1);
  };

  return (
    <div className="bg-secondary min-h-screen">
      <Hero />
      <ToolOfDaySection />
      <TrendingCarousel />
      <TrendingSection />
      <RecentlyAddedSection />
      <PopularToolsSection />
      <RecentlyViewedSection />
      <FilterBar categories={categories} />

      {/* Comparison Floating Button */}
      {compareList.length > 0 && (
        <button
          onClick={() => setShowComparison(true)}
          className="fixed bottom-8 right-8 z-40 btn-pixel-primary px-6 py-4 flex items-center gap-3 shadow-pixel-lg animate-pixel-pulse"
        >
          <GitCompare className="w-5 h-5" strokeWidth={2.5} />
          COMPARE ({compareList.length})
        </button>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <ToolComparisonModal
          tools={compareList}
          onClose={() => setShowComparison(false)}
          onRemove={removeFromCompare}
        />
      )}

      <div id="tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tools.length === 0 && !loading ? (
          <div className="text-center py-16 bg-primary border-pixel p-12">
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <p className="text-xl font-bold text-primary mb-2 uppercase">No Tools Found</p>
            <p className="text-secondary font-mono text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-primary border-pixel px-4 py-2 inline-block">
                <p className="text-primary font-bold text-sm font-mono">
                  SHOWING {tools.length} OF {total} TOOLS
                </p>
              </div>
            </div>

            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 bg-primary border-pixel">
                  <Loader2 className="w-12 h-12 text-primary animate-pixel-spin mb-4" strokeWidth={2.5} />
                  <p className="text-primary font-bold font-mono text-sm">LOADING AI TOOLS...</p>
                </div>
              ) : tools.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 bg-primary border-pixel">
                  <div className="text-center">
                    <p className="text-primary font-bold font-mono text-lg mb-4">NO AI TOOLS FOUND</p>
                    <p className="text-gray-400 font-mono text-sm mb-6">
                      {total > 0 ? 'No tools match your current filters' : 'Database may be updating...'}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="bg-secondary hover:bg-secondary/80 text-primary px-6 py-3 font-bold font-mono text-sm border-pixel transition-colors"
                    >
                      🔄 RETRY LOADING
                    </button>
                  </div>
                </div>
              ) : (
                tools.map((tool) => (
                  <ToolCard 
                    key={tool._id || tool.id} 
                    tool={{ ...tool, id: tool._id || tool.id }} 
                    viewMode={viewMode} 
                  />
                ))
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
