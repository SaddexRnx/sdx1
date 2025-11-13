import { X, ArrowRight } from 'lucide-react';
import { Tool } from '@/types/tool';
import { Link } from 'react-router-dom';

interface ComparisonModalProps {
  tools: Tool[];
  onClose: () => void;
  onRemove: (toolId: string) => void;
}

export function ComparisonModal({ tools, onClose, onRemove }: ComparisonModalProps) {
  if (tools.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="bg-primary border-pixel w-full max-w-6xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary border-b-pixel p-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-primary">TOOL COMPARISON</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 border-pixel hover-pixel flex items-center justify-center bg-secondary"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-pixel p-3 bg-secondary text-left text-primary font-bold uppercase text-sm">
                    Feature
                  </th>
                  {tools.map((tool) => (
                    <th key={tool.id} className="border-pixel p-3 bg-secondary text-center min-w-[250px]">
                      <div className="flex flex-col items-center gap-2">
                        {tool.logo_url ? (
                          <img src={tool.logo_url} alt={tool.name} className="w-12 h-12 object-contain" />
                        ) : (
                          <div className="w-12 h-12 bg-tertiary border-pixel flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {tool.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="font-bold text-primary">{tool.name}</div>
                        <button
                          onClick={() => onRemove(tool.id)}
                          className="text-xs text-secondary hover:text-primary underline"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-pixel p-3 font-bold text-primary">Description</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="border-pixel p-3 text-sm text-secondary">
                      {tool.description}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-pixel p-3 font-bold text-primary">Category</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="border-pixel p-3 text-center">
                      <span className="badge-pixel text-xs" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                        {tool.category}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-pixel p-3 font-bold text-primary">Pricing</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="border-pixel p-3 text-center">
                      <span className={`badge-pixel text-xs ${
                        tool.pricing === 'Free' || tool.pricing === 'Open Source'
                          ? 'bg-pixel-green text-black'
                          : 'bg-tertiary text-primary'
                      }`}>
                        {tool.pricing}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-pixel p-3 font-bold text-primary">Tags</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="border-pixel p-3">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {tool.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-tertiary text-[10px] text-primary font-mono"
                            style={{ borderWidth: '1px', borderColor: 'var(--border-light)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-pixel p-3 font-bold text-primary">Website</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="border-pixel p-3 text-center">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pixel-secondary text-xs px-3 py-2 inline-flex items-center gap-1"
                      >
                        VISIT <ArrowRight className="w-3 h-3" />
                      </a>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-pixel p-3 font-bold text-primary">View Details</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="border-pixel p-3 text-center">
                      <Link
                        to={`/tool/${tool.id}`}
                        className="btn-pixel-primary text-xs px-3 py-2 inline-block"
                      >
                        MORE INFO
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
