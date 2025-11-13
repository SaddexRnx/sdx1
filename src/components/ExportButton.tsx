import { Download, FileJson, FileText } from 'lucide-react';
import { Tool } from '@/types/tool';
import { exportToCSV, exportToJSON } from '@/lib/exportUtils';
import { useState } from 'react';

interface ExportButtonProps {
  tools: Tool[];
  label?: string;
}

export function ExportButton({ tools, label = 'EXPORT' }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(tools, `ai-tools-${new Date().toISOString().split('T')[0]}`);
    setShowMenu(false);
  };

  const handleExportJSON = () => {
    exportToJSON(tools, `ai-tools-${new Date().toISOString().split('T')[0]}`);
    setShowMenu(false);
  };

  if (tools.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="btn-pixel-secondary flex items-center gap-2 text-xs px-3 py-2"
      >
        <Download className="w-4 h-4" strokeWidth={2.5} />
        {label}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 bg-primary border-pixel z-20 min-w-[180px] animate-pixel-slide">
          <button
            onClick={handleExportCSV}
            className="w-full px-4 py-3 text-left font-bold text-sm text-primary hover:bg-secondary flex items-center gap-2 border-b-pixel"
          >
            <FileText className="w-4 h-4" strokeWidth={2.5} />
            EXPORT CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="w-full px-4 py-3 text-left font-bold text-sm text-primary hover:bg-secondary flex items-center gap-2"
          >
            <FileJson className="w-4 h-4" strokeWidth={2.5} />
            EXPORT JSON
          </button>
        </div>
      )}
    </div>
  );
}
