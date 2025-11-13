import { ArrowRight, Tag, ImageIcon, Bookmark, GitCompare, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tool } from '@/types/tool';
import { useState, useEffect } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useComparison } from '@/hooks/useComparison';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { ShareButton } from './ShareButton';

interface ToolCardProps {
  tool: Tool;
  viewMode: 'grid' | 'list';
}

const pricingColors: Record<string, string> = {
  Free: 'bg-pixel-green text-black border-pixel',
  Freemium: 'bg-tertiary text-primary border-pixel',
  Premium: 'border-pixel',
  'Not Specified': 'bg-tertiary text-primary border-pixel',
  'Open Source': 'bg-pixel-green text-black border-pixel',
  Paid: 'border-pixel',
};

// Multi-source logo extraction with quality assessment
function getLogoStrategies(url: string): Array<{ url: string; source: string; score: number }> {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return [
      { url: `https://logo.clearbit.com/${domain}`, source: 'Clearbit', score: 95 },
      { url: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`, source: 'Google-128', score: 75 },
      { url: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`, source: 'Google-64', score: 60 },
      { url: `https://${domain}/apple-touch-icon.png`, source: 'Apple-Touch', score: 85 },
      { url: `https://${domain}/logo.svg`, source: 'Direct-SVG', score: 90 },
      { url: `https://${domain}/logo.png`, source: 'Direct-PNG', score: 70 },
      { url: `https://${domain}/favicon.ico`, source: 'Favicon', score: 50 },
    ];
  } catch (e) {
    return [];
  }
}

export function ToolCard({ tool, viewMode }: ToolCardProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(tool.logo_url || null);
  const [logoAttempt, setLogoAttempt] = useState(0);
  const [logoTier, setLogoTier] = useState<number>(tool.logo_tier || 4);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useComparison();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToRecent } = useRecentlyViewed();
  const logoStrategies = getLogoStrategies(tool.url);

  const handleCardClick = () => {
    // Track as recently viewed
    addToRecent(tool.id);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(tool.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(tool.id)) {
      removeFromCompare(tool.id);
    } else {
      if (compareList.length >= 3) {
        alert('Maximum 3 tools can be compared at once');
        return;
      }
      addToCompare(tool);
    }
  };

  // Intensive logo extraction with quality assessment
  useEffect(() => {
    if (!tool.logo_url && logoStrategies.length > 0 && logoAttempt < logoStrategies.length) {
      const currentStrategy = logoStrategies[logoAttempt];
      const testLogo = new Image();
      
      testLogo.onload = () => {
        // Assess logo quality based on strategy score and image dimensions
        const quality = currentStrategy.score;
        let tier = 4;
        if (quality >= 90) tier = 1;
        else if (quality >= 70) tier = 2;
        else if (quality >= 50) tier = 3;
        
        setLogoUrl(currentStrategy.url);
        setLogoTier(tier);
        console.log(`Logo loaded: ${tool.name} - ${currentStrategy.source} (Tier ${tier})`);
      };
      
      testLogo.onerror = () => {
        setLogoAttempt(prev => prev + 1);
      };
      
      testLogo.src = currentStrategy.url;
    }
  }, [logoAttempt, logoStrategies, tool.logo_url, tool.name]);

  // Get tier class for styling
  const getTierClass = () => {
    return `logo-tier-${logoTier}`;
  };

  // Render logo with pixel aesthetic
  const renderLogo = (size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-20 h-20'
    };
    
    if (logoUrl) {
      return (
        <div className={`${sizeClasses[size]} flex items-center justify-center overflow-hidden bg-primary border-pixel relative group`}>
          <img
            src={logoUrl}
            alt={`${tool.name} logo`}
            className="w-full h-full object-contain p-1"
            style={{ imageRendering: 'pixelated' }}
            onError={() => {
              setLogoUrl(null);
              if (logoAttempt < logoStrategies.length - 1) {
                setLogoAttempt(prev => prev + 1);
              }
            }}
          />
          {/* Tier indicator for high-quality logos */}
          {logoTier === 1 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pixel-green" style={{ borderWidth: '1px', borderColor: 'var(--border)' }}></div>
          )}
        </div>
      );
    }
    
    // Fallback: Pixel-style initials
    const initials = tool.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-tertiary border-pixel`}>
        <div className="flex flex-col items-center justify-center gap-1">
          <ImageIcon className="w-4 h-4 text-secondary" />
          <span className="text-xs font-bold text-primary">{initials}</span>
        </div>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/tool/${tool.id}`}>
        <div 
          className={`bg-primary border-pixel p-6 hover-pixel animate-pixel-slide flex flex-col sm:flex-row gap-4 ${getTierClass()}`}
        >
          {renderLogo('md')}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-xl font-bold text-primary">{tool.name}</h3>
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                <span className={`badge-pixel ${pricingColors[tool.pricing] || 'bg-tertiary text-primary border-pixel'}`} style={tool.pricing === 'Premium' || tool.pricing === 'Paid' ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' } : {}}>
                  {tool.pricing}
                </span>
                <span className="badge-pixel border-pixel" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                  {tool.category}
                </span>
              </div>
            </div>
            
            <p className="text-secondary text-sm mb-3 line-clamp-2 font-mono">{tool.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2 overflow-x-auto">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-tertiary text-xs text-primary whitespace-nowrap font-mono"
                    style={{ borderWidth: '1px', borderColor: 'var(--border-light)' }}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCompareClick}
                  className="w-8 h-8 border-pixel flex items-center justify-center hover-pixel bg-secondary flex-shrink-0"
                  aria-label={isInCompare(tool.id) ? 'Remove from comparison' : 'Add to comparison'}
                >
                  <GitCompare 
                    className={`w-4 h-4 ${isInCompare(tool.id) ? 'text-pixel-green' : 'text-primary'}`}
                    strokeWidth={2.5}
                  />
                </button>
                <div onClick={(e) => e.preventDefault()}>
                  <ShareButton tool={tool} />
                </div>
                <button
                  onClick={handleBookmarkClick}
                  className="w-8 h-8 border-pixel flex items-center justify-center hover-pixel bg-secondary flex-shrink-0"
                  aria-label={isBookmarked(tool.id) ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Bookmark 
                    className={`w-4 h-4 ${isBookmarked(tool.id) ? 'fill-pixel-green text-pixel-green' : 'text-primary'}`}
                    strokeWidth={2.5}
                  />
                </button>
                <div className="flex items-center gap-2 font-bold text-sm flex-shrink-0 text-primary">
                  VIEW
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/tool/${tool.id}`}>
      <div 
        className={`bg-primary border-pixel p-6 hover-pixel animate-pixel-slide flex flex-col h-full ${getTierClass()}`}
      >
        <div className="flex items-start justify-between mb-4">
          {renderLogo('md')}
          <div className="flex items-center gap-2">
            {logoTier === 1 && (
              <div className="badge-pixel bg-pixel-green text-black text-[10px] px-2 py-1">
                BEST
              </div>
            )}
            <button
              onClick={handleBookmarkClick}
              className="w-8 h-8 border-pixel flex items-center justify-center hover-pixel bg-secondary"
              aria-label={isBookmarked(tool.id) ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark 
                className={`w-4 h-4 ${isBookmarked(tool.id) ? 'fill-pixel-green text-pixel-green' : 'text-primary'}`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-primary mb-2">{tool.name}</h3>
        
        <p className="text-secondary text-xs mb-4 line-clamp-3 flex-1 font-mono leading-relaxed">{tool.description}</p>
        
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`badge-pixel text-[10px] ${pricingColors[tool.pricing] || 'bg-tertiary text-primary border-pixel'}`} style={tool.pricing === 'Premium' || tool.pricing === 'Paid' ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' } : {}}>
            {tool.pricing}
          </span>
          <span className="badge-pixel text-[10px] border-pixel" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
            {tool.category}
          </span>
        </div>
        
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {tool.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-tertiary text-[10px] text-primary whitespace-nowrap font-mono"
              style={{ borderWidth: '1px', borderColor: 'var(--border-light)' }}
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2 font-bold text-xs mt-auto text-primary">
          VIEW
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
