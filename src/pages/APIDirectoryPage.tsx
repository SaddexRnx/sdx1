import { useState, useEffect } from 'react';
import { Search, Filter, Code2 } from 'lucide-react';
import { APICard } from '@/components/APICard';
import { Pagination } from '@/components/Pagination';
import { apisAPI } from '@/lib/supabase';

export function APIDirectoryPage() {
  const [apis, setApis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAPIs, setTotalAPIs] = useState(0);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [freeTierOnly, setFreeTierOnly] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const limit = 12;

  // Load categories on mount
  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await apisAPI.stats();
        setCategories(stats.categories);
        setTotalAPIs(stats.totalAPIs);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
    loadStats();
  }, []);

  // Load APIs whenever filters change
  useEffect(() => {
    async function loadAPIs() {
      setLoading(true);
      try {
        const result = await apisAPI.list({
          page,
          limit,
          category: selectedCategory,
          search: searchQuery,
          freeTierOnly,
          featured: showFeatured
        });
        setApis(result.apis);
        setTotalPages(result.totalPages);
        setTotalAPIs(result.total);
      } catch (error) {
        console.error('Error loading APIs:', error);
        setApis([]);
      } finally {
        setLoading(false);
      }
    }
    loadAPIs();
  }, [page, selectedCategory, searchQuery, freeTierOnly, showFeatured]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Code2 className="w-12 h-12" strokeWidth={2.5} />
          <h1 className="font-black text-4xl sm:text-5xl tracking-tight">
            API DIRECTORY
          </h1>
        </div>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          Discover {totalAPIs}+ free and public APIs for your next project
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search APIs..."
              className="w-full pl-12 pr-4 py-3 bg-secondary border-pixel font-mono text-primary focus:shadow-pixel outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-secondary font-bold border-pixel hover:shadow-pixel transition-all"
          >
            Search
          </button>
        </form>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-bold text-sm">Filters:</span>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={freeTierOnly}
              onChange={(e) => {
                setFreeTierOnly(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4"
            />
            <span className="text-sm font-mono">Free Tier Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFeatured}
              onChange={(e) => {
                setShowFeatured(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4"
            />
            <span className="text-sm font-mono">Featured Only</span>
          </label>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
              className={`px-4 py-2 font-mono text-sm border-pixel transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-secondary'
                  : 'bg-secondary text-primary hover:shadow-pixel'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm font-mono text-secondary">
          Found {totalAPIs} API{totalAPIs !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-4 font-mono">Loading APIs...</p>
        </div>
      )}

      {/* API Grid */}
      {!loading && apis.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {apis.map((api) => (
              <APICard key={api.id} api={api} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && apis.length === 0 && (
        <div className="text-center py-12">
          <Code2 className="w-16 h-16 mx-auto mb-4 text-secondary" />
          <h3 className="font-bold text-xl mb-2">No APIs Found</h3>
          <p className="text-secondary">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
