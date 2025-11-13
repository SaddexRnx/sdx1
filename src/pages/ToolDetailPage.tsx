import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Tag, Share2, ImageIcon } from 'lucide-react';
import { Tool } from '@/types/tool';
import { ToolCard } from '@/components/ToolCard';
import { dbAPI } from '@/lib/supabase';

const pricingColors: Record<string, string> = {
  Free: 'bg-pixel-green text-black border-pixel',
  Freemium: 'bg-tertiary text-primary border-pixel',
  Premium: 'border-pixel',
  'Not Specified': 'bg-tertiary text-primary border-pixel',
  'Open Source': 'bg-pixel-green text-black border-pixel',
  Paid: 'border-pixel',
};

// Multi-source logo extraction
function getLogoStrategies(url: string): Array<{ url: string; source: string }> {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return [
      { url: `https://logo.clearbit.com/${domain}`, source: 'Clearbit' },
      { url: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`, source: 'Google-128' },
      { url: `https://${domain}/apple-touch-icon.png`, source: 'Apple-Touch' },
      { url: `https://${domain}/logo.svg`, source: 'Direct-SVG' },
      { url: `https://${domain}/logo.png`, source: 'Direct-PNG' },
      { url: `https://${domain}/favicon.ico`, source: 'Favicon' },
    ];
  } catch (e) {
    return [];
  }
}

export function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoAttempt, setLogoAttempt] = useState(0);
  const logoStrategies = tool ? getLogoStrategies(tool.url) : [];

  useEffect(() => {
    async function fetchTool() {
      try {
        // Fetch from database
        const data = await dbAPI.get(id || '');
        setTool(data);
        setLogoUrl(data.logo_url || null);
        
        // Fetch related tools
        const relatedResult = await dbAPI.list({
          page: 1,
          limit: 6,
          category: data.category
        });
        
        const related = relatedResult.tools.filter(t => t.id !== id);
        setRelatedTools(related.slice(0, 6));
      } catch (err) {
        console.error('Error loading tool:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTool();
    }
  }, [id, navigate]);

  // Intensive logo extraction
  useEffect(() => {
    if (tool && !logoUrl && logoStrategies.length > 0 && logoAttempt < logoStrategies.length) {
      const currentStrategy = logoStrategies[logoAttempt];
      const testLogo = new Image();
      
      testLogo.onload = () => {
        setLogoUrl(currentStrategy.url);
      };
      
      testLogo.onerror = () => {
        setLogoAttempt(prev => prev + 1);
      };
      
      testLogo.src = currentStrategy.url;
    }
  }, [logoAttempt, logoStrategies, logoUrl, tool]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tool?.name,
          text: tool?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Render logo
  const renderLogo = () => {
    if (logoUrl) {
      return (
        <div className="w-24 h-24 flex items-center justify-center overflow-hidden bg-primary border-pixel">
          <img
            src={logoUrl}
            alt={`${tool?.name} logo`}
            className="w-full h-full object-contain p-2"
            style={{ imageRendering: 'pixelated' }}
            onError={() => {
              setLogoUrl(null);
              if (logoAttempt < logoStrategies.length - 1) {
                setLogoAttempt(prev => prev + 1);
              }
            }}
          />
        </div>
      );
    }
    
    // Fallback: Pixel-style initials
    const initials = tool?.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AI';
    
    return (
      <div className="w-24 h-24 flex items-center justify-center bg-tertiary border-pixel">
        <div className="flex flex-col items-center justify-center gap-2">
          <ImageIcon className="w-8 h-8 text-secondary" />
          <span className="text-sm font-bold text-primary">{initials}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="bg-secondary border-pixel p-8 text-center">
          <div className="w-12 h-12 border-4 border-pixel-green border-t-transparent mx-auto mb-4 animate-pixel-spin"></div>
          <p className="text-primary font-bold font-mono">LOADING TOOL...</p>
        </div>
      </div>
    );
  }

  if (!tool) return null;

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover-pixel mb-8 font-mono font-bold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          BACK TO ALL TOOLS
        </Link>

        {/* Tool Header */}
        <div className="bg-primary border-pixel p-8 mb-6 animate-pixel-slide">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {renderLogo()}

            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{tool.name}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge-pixel ${pricingColors[tool.pricing] || 'bg-tertiary text-primary border-pixel'}`} style={tool.pricing === 'Premium' || tool.pricing === 'Paid' ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' } : {}}>
                  {tool.pricing}
                </span>
                <span className="badge-pixel border-pixel" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                  {tool.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pixel-primary flex items-center gap-2"
                >
                  VISIT WEBSITE
                  <ExternalLink className="w-4 h-4" />
                </a>
                
                <button
                  onClick={handleShare}
                  className="btn-pixel-secondary flex items-center gap-2"
                >
                  SHARE
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Description */}
        <div className="bg-primary border-pixel p-8 mb-6">
          <h2 className="text-2xl font-bold text-primary mb-4 uppercase">About {tool.name}</h2>
          <p className="text-secondary leading-relaxed text-base font-mono">{tool.description}</p>
        </div>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="bg-primary border-pixel p-8 mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4 uppercase">Tags</h2>
            <div className="flex flex-wrap gap-3">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary border-pixel text-primary font-mono"
                >
                  <Tag className="w-4 h-4" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6 uppercase">Related Tools in {tool.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((relatedTool) => (
                <ToolCard key={relatedTool.id} tool={relatedTool} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
