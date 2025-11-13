import { Languages, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'ENG' },
  { code: 'zh', name: 'CHINESE' },
  { code: 'ar', name: 'ARABIC' },
  { code: 'fr', name: 'FRENCH' },
  { code: 'es', name: 'SPANISH' },
  { code: 'de', name: 'GERMAN' },
  { code: 'ja', name: 'JAPANESE' },
  { code: 'pt', name: 'PORTUGUESE' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative group">
      <button
        className="w-10 h-10 bg-white dark:bg-gray-800 border-pixel hover-pixel flex items-center justify-center"
        aria-label="Switch language"
      >
        <span className="text-sm font-bold text-black dark:text-white">{currentLang.name}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border-pixel opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-lg">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`w-full px-4 py-3 text-left font-bold text-sm hover:bg-pixel-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
              i18n.language === lang.code ? 'bg-black text-white dark:bg-gray-700' : 'text-black dark:text-white'
            }`}
          >
            <span className="flex-1 font-bold">{lang.name}</span>
            {i18n.language === lang.code && (
              <div className="w-2 h-2 bg-pixel-green rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
