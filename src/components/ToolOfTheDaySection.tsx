import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Tool } from '@/types/tool';
import { ToolCard } from './ToolCard';
import { dbAPI } from '@/lib/supabase';

export function ToolOfTheDaySection() {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToolOfTheDay() {
      try {
        // Get a random featured tool or any random tool
        const result = await dbAPI.list({
          page: 1,
          limit: 50,
          sortBy: 'featured'
        });

        if (result.tools.length > 0) {
          // Pick random tool
          const randomIndex = Math.floor(Math.random() * Math.min(result.tools.length, 10));
          setTool(result.tools[randomIndex]);
        }
      } catch (error) {
        console.error('Error loading tool of the day:', error);
      } finally {
        setLoading(false);
      }
    }

    loadToolOfTheDay();
  }, []);

  if (loading || !tool) return null;

  return (
    <div className="bg-secondary border-t-pixel border-b-pixel py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Sparkles className="w-6 h-6 text-pixel-green animate-pulse" strokeWidth={2.5} />
          <h2 className="text-2xl font-bold text-primary">TOOL OF THE DAY</h2>
          <Sparkles className="w-6 h-6 text-pixel-green animate-pulse" strokeWidth={2.5} />
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-pixel-green border-pixel p-2">
            <ToolCard tool={tool} viewMode="grid" />
          </div>
          <p className="text-center mt-4 text-secondary font-mono text-sm">
            Check back tomorrow for a new featured tool!
          </p>
        </div>
      </div>
    </div>
  );
}
