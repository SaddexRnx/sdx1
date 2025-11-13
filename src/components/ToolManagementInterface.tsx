import { useState } from 'react';
import { Search, Trash2, Star, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tool } from '@/types/tool';

interface ToolManagementInterfaceProps {
  onClose?: () => void;
}

export function ToolManagementInterface({ onClose }: ToolManagementInterfaceProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  const loadTools = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ai_tools')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('ai_tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;
      
      setTools(tools.filter(t => t.id !== toolId));
      alert('Tool deleted successfully');
    } catch (error: any) {
      alert('Failed to delete tool: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeatureToggle = async (toolId: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('ai_tools')
        .update({ featured: !currentStatus })
        .eq('id', toolId);

      if (error) throw error;

      setTools(tools.map(t => 
        t.id === toolId ? { ...t, featured: !currentStatus } : t
      ));
    } catch (error: any) {
      alert('Failed to update tool: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTools.size === 0) return;
    if (!confirm(`Delete ${selectedTools.size} selected tools?`)) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('ai_tools')
        .delete()
        .in('id', Array.from(selectedTools));

      if (error) throw error;

      setTools(tools.filter(t => !selectedTools.has(t.id!)));
      setSelectedTools(new Set());
      alert(`Deleted ${selectedTools.size} tools`);
    } catch (error: any) {
      alert('Failed to delete tools: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelection = (toolId: string) => {
    const newSelection = new Set(selectedTools);
    if (newSelection.has(toolId)) {
      newSelection.delete(toolId);
    } else {
      newSelection.add(toolId);
    }
    setSelectedTools(newSelection);
  };

  return (
    <div className="bg-primary border-pixel p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">TOOL MANAGEMENT</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 bg-secondary border-pixel hover-pixel flex items-center justify-center"
          >
            <X className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" strokeWidth={2.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadTools()}
            className="w-full pl-12 pr-4 py-2 bg-secondary border-pixel text-primary font-mono focus:outline-none focus:ring-2 focus:ring-pixel-green"
            placeholder="Search tools by name or description..."
          />
        </div>
        <button
          onClick={loadTools}
          disabled={loading}
          className="btn-pixel-primary px-6"
        >
          {loading ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedTools.size > 0 && (
        <div className="mb-4 p-4 bg-secondary border-pixel flex items-center justify-between">
          <p className="text-primary font-bold">
            {selectedTools.size} tool(s) selected
          </p>
          <button
            onClick={handleBulkDelete}
            disabled={actionLoading}
            className="btn-pixel-secondary flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            DELETE SELECTED
          </button>
        </div>
      )}

      {/* Tools List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tools.length === 0 && !loading && (
          <div className="text-center py-12 bg-secondary border-pixel">
            <p className="text-secondary font-mono">
              No tools found. Search to load tools.
            </p>
          </div>
        )}

        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-secondary border-pixel p-4 flex items-start gap-4"
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleSelection(tool.id!)}
              className="w-6 h-6 border-pixel bg-primary flex items-center justify-center flex-shrink-0 mt-1"
            >
              {selectedTools.has(tool.id!) && (
                <Check className="w-4 h-4 text-pixel-green" strokeWidth={3} />
              )}
            </button>

            {/* Tool Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <h3 className="font-bold text-primary truncate flex-1">
                  {tool.name}
                </h3>
                {tool.featured && (
                  <span className="px-2 py-1 bg-pixel-green text-black text-xs font-bold border-pixel">
                    FEATURED
                  </span>
                )}
              </div>
              <p className="text-sm text-secondary font-mono line-clamp-2 mb-2">
                {tool.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-secondary">
                <span>{tool.category}</span>
                <span>{tool.pricing}</span>
                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pixel-green hover:underline"
                  >
                    VIEW SITE
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleFeatureToggle(tool.id!, tool.featured || false)}
                disabled={actionLoading}
                className="w-8 h-8 bg-primary border-pixel hover-pixel flex items-center justify-center"
                title={tool.featured ? 'Unfeature' : 'Feature'}
              >
                <Star
                  className="w-4 h-4"
                  strokeWidth={2.5}
                  fill={tool.featured ? 'currentColor' : 'none'}
                />
              </button>
              <button
                onClick={() => handleDelete(tool.id!)}
                disabled={actionLoading}
                className="w-8 h-8 bg-primary border-pixel hover-pixel flex items-center justify-center"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-primary font-mono text-sm">Loading tools...</p>
        </div>
      )}
    </div>
  );
}
