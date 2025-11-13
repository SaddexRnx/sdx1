import { useEffect, useState } from 'react';
import { FilterBar } from '@/components/FilterBar';
import { ToolCard } from '@/components/ToolCard';
import { Pagination } from '@/components/Pagination';
import { useFilters } from '@/contexts/FilterContext';
import { Tool } from '@/types/tool';
import { Loader2, TrendingUp } from 'lucide-react';
import { dbAPI } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

const TOOLS_PER_PAGE = 12;

export function MostUsedPage() {
  const { t } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const {
    searchQuery,
    selectedCategory,
    selectedPricing,
    viewMode,
  } = useFilters();

  // Fetch most used tools
  useEffect(() => {
    async function fetchMostUsedTools() {
      setLoading(true);
      try {
        const result = await dbAPI.list({
          page: currentPage,
          limit: TOOLS_PER_PAGE,
          category: selectedCategory,
          pricing: selectedPricing,
          search: searchQuery,
          sortBy: 'most-used'
        });
        
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
        console.error('Error loading most used tools:', error);
        setTools([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchMostUsedTools();
  }, [currentPage, searchQuery, selectedCategory, selectedPricing]);

  // Fetch categories
  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await dbAPI.stats();
        setCategories(stats.categories);
      } catch (error) {
        console.error('Error loading stats:', error);
        setCategories(['All']);
      }
    }

    fetchStats();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPricing]);

  return (
    <div className="bg-pixel-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b-pixel border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-black" strokeWidth={2.5} />
            <h1 className="text-3xl font-bold text-black">{t('pages.mostUsed.title')}</h1>
          </div>
          <p className="text-pixel-gray-500 font-mono">{t('pages.mostUsed.description')}</p>
        </div>
      </div>

      <FilterBar categories={categories} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <div className="bg-white border-pixel px-4 py-2 inline-block">
            <p className="text-black font-bold text-sm font-mono">
              {t('tools.showing')} {tools.length} {t('tools.of')} {total} {t('tools.tools')}
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
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white border-pixel">
              <Loader2 className="w-12 h-12 text-black animate-pixel-spin mb-4" strokeWidth={2.5} />
              <p className="text-black font-bold font-mono text-sm">{t('tools.loading')}</p>
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
      </div>
    </div>
  );
}
