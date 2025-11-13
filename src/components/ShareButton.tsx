import { Share2, Copy, Twitter, Linkedin, MessageCircle, Check } from 'lucide-react';
import { Tool } from '@/types/tool';
import { shareOnTwitter, shareOnLinkedIn, shareOnWhatsApp, copyToClipboard } from '@/lib/exportUtils';
import { useState } from 'react';

interface ShareButtonProps {
  tool: Tool;
}

export function ShareButton({ tool }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    copyToClipboard(tool.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowMenu(false);
    }, 2000);
  };

  const handleShare = (shareFn: () => void) => {
    shareFn();
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-8 h-8 border-pixel hover-pixel flex items-center justify-center bg-secondary"
        aria-label="Share tool"
      >
        <Share2 className="w-4 h-4 text-primary" strokeWidth={2.5} />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 bg-primary border-pixel z-20 min-w-[200px] animate-pixel-slide">
          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-3 text-left font-bold text-sm text-primary hover:bg-secondary flex items-center gap-2 border-b-pixel"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-pixel-green" strokeWidth={2.5} />
                COPIED!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" strokeWidth={2.5} />
                COPY LINK
              </>
            )}
          </button>
          <button
            onClick={() => handleShare(() => shareOnTwitter(tool))}
            className="w-full px-4 py-3 text-left font-bold text-sm text-primary hover:bg-secondary flex items-center gap-2 border-b-pixel"
          >
            <Twitter className="w-4 h-4" strokeWidth={2.5} />
            TWITTER
          </button>
          <button
            onClick={() => handleShare(() => shareOnLinkedIn(tool))}
            className="w-full px-4 py-3 text-left font-bold text-sm text-primary hover:bg-secondary flex items-center gap-2 border-b-pixel"
          >
            <Linkedin className="w-4 h-4" strokeWidth={2.5} />
            LINKEDIN
          </button>
          <button
            onClick={() => handleShare(() => shareOnWhatsApp(tool))}
            className="w-full px-4 py-3 text-left font-bold text-sm text-primary hover:bg-secondary flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
            WHATSAPP
          </button>
        </div>
      )}
    </div>
  );
}
