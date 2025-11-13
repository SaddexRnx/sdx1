import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { dbAPI } from '@/lib/supabase';

export function Hero() {
  const { t } = useTranslation();
  const [totalTools, setTotalTools] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const stats = await dbAPI.stats();
        setTotalTools(stats.totalTools || 0);
      } catch (error) {
        console.error('Error fetching tool count:', error);
      }
    }
    fetchCount();
  }, []);

  return (
    <div className="relative bg-primary border-b-pixel overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(to right, #000 1px, transparent 1px),
          linear-gradient(to bottom, #000 1px, transparent 1px)
        `,
        backgroundSize: '16px 16px'
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          {/* Main Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 bg-pixel-green rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
              DISCOVER {totalTools > 0 ? `${totalTools.toLocaleString()}+` : 'LOADING...'} AI TOOLS
            </h1>
            <div className="w-3 h-3 bg-pixel-green rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          </div>
          
          {/* Subtitle */}
          <div className="mb-8 space-y-2">
            <p className="text-lg sm:text-xl text-secondary font-mono max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10">
            <div className="bg-secondary border-pixel px-6 py-3 hover-pixel">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-pixel-green rounded-full animate-pulse"></div>
                <div className="text-2xl font-bold text-primary">{totalTools > 0 ? `${totalTools.toLocaleString()}+` : 'LOADING...'}</div>
                <div className="w-2 h-2 bg-pixel-green rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs font-bold text-secondary uppercase tracking-wider">{t('hero.stats.tools')}</div>
            </div>
            <div className="bg-secondary border-pixel px-6 py-3 hover-pixel">
              <div className="text-2xl font-bold text-primary">100+</div>
              <div className="text-xs font-bold text-secondary uppercase tracking-wider">{t('hero.stats.categories')}</div>
            </div>
            <div className="bg-pixel-green border-pixel px-6 py-3 hover-pixel">
              <div className="text-2xl font-bold text-black">100%</div>
              <div className="text-xs font-bold text-black uppercase tracking-wider">{t('hero.stats.freeAccess')}</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://t.me/Saddex_x" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-pixel-secondary flex items-center gap-2"
            >
              {t('hero.cta.submit')}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Pixel Border Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--border)' }}></div>
    </div>
  );
}
