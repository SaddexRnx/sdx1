import { useEffect, useState } from 'react';
import { ToolCard } from '@/components/ToolCard';
import { useFilters } from '@/contexts/FilterContext';
import { Tool } from '@/types/tool';
import { Bookmark, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBookmarks } from '@/hooks/useBookmarks';
import { dbAPI } from '@/lib/supabase';

export function SavedToolsPage() {
  const { t } = useTranslation();
  const [savedTools, setSavedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const { viewMode } = useFilters();
  const { bookmarks } = useBookmarks();

  useEffect(() => {
    async function fetchSavedTools() {
      if (bookmarks.length === 0) {
        setSavedTools([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all bookmarked tools
        const toolPromises = bookmarks.map(id => 
          dbAPI.get(id).catch(() => null)
        );
        const tools = await Promise.all(toolPromises);
        setSavedTools(tools.filter((t): t is Tool => t !== null));
      } catch (error) {
        console.error('Error loading saved tools:', error);
        setSavedTools([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedTools();
  }, [bookmarks]);

  return (
    <div className="bg-secondary min-h-screen">
      {/* Page Header */}
      <div className="bg-primary border-b-pixel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-primary" strokeWidth={2.5} />
            <h1 className="text-3xl font-bold text-primary">{t('pages.saved.title')}</h1>
          </div>
          <p className="text-secondary font-mono">{t('pages.saved.description')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-primary border-pixel">
            <Loader2 className="w-12 h-12 text-primary animate-pixel-spin mb-4" strokeWidth={2.5} />
            <p className="text-primary font-bold font-mono text-sm">LOADING BOOKMARKS...</p>
          </div>
        ) : savedTools.length === 0 ? (
          <div className="text-center py-16 bg-primary border-pixel p-12">
            <Bookmark className="w-16 h-16 text-tertiary mx-auto mb-4" strokeWidth={2} />
            <p className="text-xl font-bold text-primary mb-2 uppercase">{t('pages.saved.empty')}</p>
            <p className="text-secondary font-mono text-sm">Bookmark tools to see them here</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-primary border-pixel px-4 py-2 inline-block">
                <p className="text-primary font-bold text-sm font-mono">
                  {savedTools.length} BOOKMARKED {savedTools.length === 1 ? 'TOOL' : 'TOOLS'}
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
              {savedTools.map((tool) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  viewMode={viewMode} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
