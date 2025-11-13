import { useState } from 'react';
import { X, GitCompare, ExternalLink } from 'lucide-react';
import { Tool } from '@/types/tool';

interface ToolComparisonModalProps {
  tools: Tool[];
  onClose: () => void;
  onRemove: (toolId: string) => void;
}

export function ToolComparisonModal({ tools, onClose, onRemove }: ToolComparisonModalProps) {
  if (tools.length === 0) return null;

  const comparisonFields = [
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'tags', label: 'Tags' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-primary border-pixel w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-pixel">
          <div className="flex items-center gap-3">
            <GitCompare className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <h2 className="text-2xl font-bold text-primary">COMPARE TOOLS</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-secondary border-pixel hover-pixel flex items-center justify-center"
          >
            <X className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${tools.length}, minmax(250px, 1fr))` }}>
            {tools.map((tool) => (
              <div key={tool.id} className="bg-secondary border-pixel p-4">
                {/* Tool Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-primary text-lg">{tool.name}</h3>
                    <button
                      onClick={() => onRemove(tool.id!)}
                      className="w-6 h-6 bg-primary border-pixel hover-pixel flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-primary" strokeWidth={2.5} />
                    </button>
                  </div>
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-pixel-green hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Website
                    </a>
                  )}
                </div>

                {/* Comparison Fields */}
                <div className="space-y-4">
                  {comparisonFields.map(field => (
                    <div key={field.key} className="border-t border-tertiary pt-3">
                      <p className="text-xs font-bold text-secondary uppercase mb-2">
                        {field.label}
                      </p>
                      {field.key === 'tags' ? (
                        <div className="flex flex-wrap gap-1">
                          {(tool.tags || []).slice(0, 5).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary text-primary text-xs font-mono border-pixel"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-primary font-mono">
                          {(tool as any)[field.key] || 'Not specified'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-pixel bg-secondary">
          <p className="text-sm text-secondary font-mono text-center">
            Comparing {tools.length} tool{tools.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
