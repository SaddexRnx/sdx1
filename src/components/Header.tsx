import { Moon, Sun, Grid3x3 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-primary border-b-pixel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3 hover-pixel group">
            <div className="w-12 h-12 border-pixel flex items-center justify-center" style={{ backgroundColor: 'var(--text-primary)' }}>
              <Grid3x3 className="w-6 h-6 text-pixel-green" strokeWidth={3} />
            </div>
            <div className="hidden sm:block">
              <div className="text-primary font-bold text-xl tracking-tight">{t('header.title')}</div>
              <div className="text-secondary font-bold text-xs tracking-wider">{t('header.subtitle')}</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="w-10 h-10 bg-secondary border-pixel hover-pixel flex items-center justify-center"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-primary" strokeWidth={2.5} />
              ) : (
                <Moon className="w-5 h-5 text-primary" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
