import { useEffect, useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { dbAPI } from '@/lib/supabase';
import { Tool } from '@/types/tool';

export function ToolOfDaySection() {
  const [toolOfDay, setToolOfDay] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToolOfDay() {
      try {
        const result = await dbAPI.list({
          page: 1,
          limit: 4,
          sortBy: 'name'
        });
        
        // Filter for promoted tools
        const promotedTools = result.tools.filter(tool => tool.tool_of_day === true);
        setToolOfDay(promotedTools);
      } catch (error) {
        console.error('Error fetching Tool of the Day:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchToolOfDay();
  }, []);

  if (loading || toolOfDay.length === 0) {
    return null;
  }

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

  return (
    <section className="py-12 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <h2 className="text-3xl font-bold text-primary uppercase">
              TOOL OF THE DAY
            </h2>
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
          </div>
          <p className="text-secondary font-mono">
            Our featured AI tools for today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {toolOfDay.map((tool) => (
            <div
              key={tool.id}
              className="bg-tertiary border-pixel p-6 hover-pixel group cursor-pointer"
              onClick={() => {
                trackClick(tool.id);
                window.open(tool.url || tool.official_website, '_blank');
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-xs font-bold text-yellow-500 uppercase">FEATURED</span>
                </div>
                <ExternalLink className="w-4 h-4 text-secondary group-hover:text-primary" />
              </div>
              
              <div className="mb-4">
                <img
                  src={tool.logo_url || tool.logo || '/default-logo.png'}
                  alt={tool.name}
                  className="w-12 h-12 rounded border-pixel object-cover bg-white"
                  onError={(e) => {
                    e.currentTarget.src = '/default-logo.png';
                  }}
                />
              </div>
              
              <h3 className="font-bold text-primary mb-2 group-hover:text-pixel-green transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-sm text-secondary mb-3 line-clamp-2">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-secondary bg-primary px-2 py-1 border-pixel">
                  {tool.category || 'General'}
                </span>
                <span className="text-xs font-bold text-pixel-green bg-primary px-2 py-1 border-pixel">
                  {tool.pricing || 'Free'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}