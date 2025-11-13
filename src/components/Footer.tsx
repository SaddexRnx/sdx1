import { Send, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dbAPI } from '@/lib/supabase';

export function Footer() {
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
    <footer className="border-t-pixel" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {/* Title */}
          <div className="font-bold text-xl tracking-tight text-primary">SDXRNX DIRECTORY</div>
          
          {/* Tool Count */}
          <div className="text-secondary text-sm font-mono">
            {totalTools > 0 ? `${totalTools.toLocaleString()}+ TOOLS` : 'LOADING...'}
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono text-secondary">BY</span>
            <a
              href="https://t.me/Saddex_x"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:text-pixel-green transition-colors flex items-center gap-1"
            >
              <Send className="w-4 h-4" strokeWidth={2.5} />
              @SADDEX_X
            </a>
          </div>

          {/* Copyright */}
          <div className="text-secondary text-xs font-bold">
            2025 © ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}
