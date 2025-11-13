import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { dbAPI } from '@/lib/supabase';
import { Tool } from '@/types/tool';

export function TrendingCarousel() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingTools() {
      try {
        const result = await dbAPI.list({
          page: 1,
          limit: 20,
          sortBy: 'name'
        });
        setTools(result.tools);
      } catch (error) {
        console.error('Error fetching trending tools:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingTools();
  }, []);

  useEffect(() => {
    if (tools.length <= 4) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 1 >= Math.ceil(tools.length / 4) ? 0 : prevIndex + 1
      );
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [tools.length]);

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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= Math.ceil(tools.length / 4) ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.ceil(tools.length / 4) - 1 : prevIndex - 1
    );
  };

  if (loading || tools.length === 0) {
    return null;
  }

  const getVisibleTools = () => {
    const startIndex = currentIndex * 4;
    return tools.slice(startIndex, startIndex + 4);
  };

  return (
    <section className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-pixel-green" />
            <h2 className="text-3xl font-bold text-primary uppercase">
              TRENDING TOOLS
            </h2>
            <TrendingUp className="w-6 h-6 text-pixel-green" />
          </div>
          <p className="text-secondary font-mono">
            Most popular AI tools right now
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(tools.length / 4) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.slice(slideIndex * 4, slideIndex * 4 + 4).map((tool) => (
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
              ))}
            </div>
          </div>

          {tools.length > 4 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary border-pixel p-2 hover-pixel z-10"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary border-pixel p-2 hover-pixel z-10"
              >
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(tools.length / 4) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 border-pixel ${
                      index === currentIndex ? 'bg-pixel-green' : 'bg-tertiary hover:bg-pixel-green/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}