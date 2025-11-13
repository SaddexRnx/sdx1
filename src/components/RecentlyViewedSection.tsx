import { useState, useEffect } from 'react';
import { TrendingUp, Clock, X } from 'lucide-react';
import { Tool } from '@/types/tool';
import { ToolCard } from './ToolCard';
import { dbAPI } from '@/lib/supabase';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export function RecentlyViewedSection() {
  const { recentIds, clearRecent } = useRecentlyViewed();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRecentTools() {
      if (recentIds.length === 0) return;

      setLoading(true);
      try {
        // Load tools by IDs
        const promises = recentIds.slice(0, 8).map(id => 
          dbAPI.get(id).catch(() => null)
        );
        const results = await Promise.all(promises);
        const validTools = results.filter(t => t !== null) as Tool[];
        setTools(validTools);
      } catch (error) {
        console.error('Error loading recent tools:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentTools();
  }, [recentIds]);

  if (recentIds.length === 0) return null;

  return (
    <div className="bg-secondary border-t-pixel border-b-pixel py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-pixel-green" strokeWidth={2.5} />
            <h2 className="text-2xl font-bold text-primary">RECENTLY VIEWED</h2>
          </div>
          <button
            onClick={clearRecent}
            className="btn-pixel-secondary text-xs px-4 py-2 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            CLEAR
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
