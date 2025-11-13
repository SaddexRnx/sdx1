import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Tool } from '@/types/tool';
import { dbAPI } from '@/lib/supabase';

export function PopularToolsSection() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const result = await dbAPI.list({
          page: 1,
          limit: 4,
          sortBy: 'name'
        });
        setTools(result.tools);
      } catch (error) {
        console.error('Error loading featured tools:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  const trackClick = async (toolId: string) => {
    try {
      await fetch('https://yzoonszpdhbbjrggekma.supabase.co/functions/v1/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ toolId })
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (loading || tools.length === 0) return null;

  return (
    <section className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-pixel-green" />
            <h2 className="text-3xl font-bold text-primary uppercase">
              FEATURED TOOLS
            </h2>
            <TrendingUp className="w-6 h-6 text-pixel-green" />
          </div>
          <p className="text-secondary font-mono">
            Handpicked premium AI tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-primary border-pixel p-4 hover-pixel group cursor-pointer"
              onClick={() => {
                trackClick(tool.id);
                window.open(tool.url || tool.official_website, '_blank');
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={tool.logo_url || tool.logo || '/default-logo.png'}
                  alt={tool.name}
                  className="w-8 h-8 rounded border-pixel object-cover bg-white"
                  onError={(e) => {
                    e.currentTarget.src = '/default-logo.png';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-primary text-sm group-hover:text-pixel-green transition-colors">
                    {tool.name}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-secondary line-clamp-2">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
