import { useEffect, useState } from 'react';
import { Home, Calendar, TrendingUp, Bookmark, Sparkles, Code2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dbAPI } from '@/lib/supabase';

export function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const [showGPTs, setShowGPTs] = useState(true);

  // Check if there are any GPT tools
  useEffect(() => {
    async function checkGPTs() {
      try {
        const result = await dbAPI.list({
          page: 1,
          limit: 1,
          toolType: 'gpt'
        });
        setShowGPTs(result.total > 0);
      } catch (error) {
        console.error('Error checking GPTs:', error);
        setShowGPTs(false);
      }
    }
    checkGPTs();
  }, []);

  const allNavItems = [
    { path: '/', label: t('nav.home'), icon: Home, show: true },
    { path: '/apis', label: 'APIs', icon: Code2, show: true },
    { path: '/today', label: t('nav.today'), icon: Calendar, show: true },
    { path: '/most-used', label: t('nav.mostUsed'), icon: TrendingUp, show: true },
    { path: '/saved', label: t('nav.saved'), icon: Bookmark, show: true },
    { path: '/gpts', label: t('nav.gpts'), icon: Sparkles, show: showGPTs },
  ];

  const navItems = allNavItems.filter(item => item.show);

  return (
    <nav className="bg-primary border-b-pixel sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm whitespace-nowrap transition-all border-pixel ${
                  isActive
                    ? ''
                    : 'bg-secondary hover:shadow-pixel-sm'
                }`}
                style={isActive ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' } : { color: 'var(--text-primary)' }}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
