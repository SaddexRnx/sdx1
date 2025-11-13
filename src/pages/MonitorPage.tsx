import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Database, Zap, Lock, Users, MousePointer, Globe, AlertCircle, Clock, Plus, Edit, Trash2, Star, Shield, Upload, Download, Filter, Search, Code2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase, dbAPI, toolsAPI } from '@/lib/supabase';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { APIManagementInterface } from '@/components/APIManagementInterface';

interface MonitorStats {
  total_tools: number;
  tools_added_today: number;
  progress_percentage: number;
  target: number;
  sources: Record<string, number>;
  logos: {
    total_with_logos: number;
    tier1: number;
    tier2: number;
    tier3: number;
    average_score: number;
  };
  tool_types: Record<string, number>;
  last_updated: string;
}

const PASSWORD = 'Saddex123@';

export function MonitorPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<MonitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  // Enhanced analytics state
  const [totalTools, setTotalTools] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [pricingBreakdown, setPricingBreakdown] = useState<Record<string, number>>({});

  // Tool management state
  const [activeTab, setActiveTab] = useState<'analytics' | 'management' | 'apis'>('analytics');
  const [showAddTool, setShowAddTool] = useState(false);
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingTool, setEditingTool] = useState<any>(null);
  const [moderationQueue, setModerationQueue] = useState<any[]>([]);
  
  // Pagination state for tool management
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20); // Show 20 tools per page
  
  // Search and filter state
  const [managementSearchQuery, setManagementSearchQuery] = useState('');
  const [managementCategoryFilter, setManagementCategoryFilter] = useState('all');
  
  // Add/Edit Tool Form State
  const [newTool, setNewTool] = useState({
    name: '',
    description: '',
    category: '',
    pricing: 'Free',
    url: '',
    logo_url: '',
    tags: '',
    featured: false
  });
  
  // Form loading states
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [isUpdatingTool, setIsUpdatingTool] = useState(false);
  const [isDeletingTool, setIsDeletingTool] = useState(false);

  // Check if already authenticated via session storage
  useEffect(() => {
    const auth = sessionStorage.getItem('monitor_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('monitor_authenticated', 'true');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchStats() {
      try {
        // Fetch from scraping monitor
        const { data, error } = await supabase.functions.invoke('scraping-monitor');
        
        if (error) throw error;
        setStats(data.data);
        
        // Fetch enhanced analytics from database
        const dbStats = await dbAPI.stats();
        setTotalTools(dbStats.totalTools);
        setCategories(dbStats.categories);
        
        // Calculate pricing breakdown - fetch with pagination to get all tools
        let allToolsFetched: any[] = [];
        let page = 1;
        const pageLimit = 1000;
        let hasMore = true;
        
        // Fetch all tools in batches
        while (hasMore && page <= 20) { // Limit to 20 pages (20,000 tools max) for safety
          const batch = await dbAPI.list({ page, limit: pageLimit });
          allToolsFetched = [...allToolsFetched, ...batch.tools];
          hasMore = batch.tools.length === pageLimit;
          page++;
        }
        
        const pricingCount: Record<string, number> = {};
        allToolsFetched.forEach(tool => {
          let pricing = 'Not Specified';
          
          // Handle JSON pricing objects
          if (tool.pricing) {
            if (typeof tool.pricing === 'string') {
              try {
                const parsed = JSON.parse(tool.pricing);
                pricing = parsed.model || parsed.type || 'Not Specified';
              } catch {
                pricing = tool.pricing;
              }
            } else if (typeof tool.pricing === 'object') {
              pricing = tool.pricing.model || tool.pricing.type || 'Not Specified';
            }
          }
          
          pricingCount[pricing] = (pricingCount[pricing] || 0) + 1;
        });
        setPricingBreakdown(pricingCount);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching monitor stats:', err);
        setError('Failed to load monitoring data');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Tool Management Functions
  const fetchAllTools = async () => {
    try {
      setLoading(true);
      const result = await dbAPI.list({
        page: currentPage,
        limit: pageSize,
        search: managementSearchQuery,
        category: managementCategoryFilter === 'all' ? undefined : managementCategoryFilter,
        sortBy: 'name'
      });
      setTools(result.tools);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setTools([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const addNewTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingTool(true);
    try {
      const toolData = {
        ...newTool,
        tags: newTool.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        tool_type: 'tool',
        logo_quality_score: 1,
        logo_tier: 1,
        logo_source: 'admin',
        usage_count: 0,
        saves_count: 0
      };
      
      await toolsAPI.create(toolData);
      setShowAddTool(false);
      setNewTool({
        name: '',
        description: '',
        category: '',
        pricing: 'Free',
        url: '',
        logo_url: '',
        tags: '',
        featured: false
      });
      
      // Refresh data
      await fetchAllTools();
      alert('Tool added successfully!');
    } catch (error) {
      console.error('Error adding tool:', error);
      alert('Failed to add tool');
    } finally {
      setIsAddingTool(false);
    }
  };

  const editTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingTool(true);
    try {
      await toolsAPI.update(editingTool.id, editingTool);
      setEditingTool(null);
      await fetchAllTools();
      alert('Tool updated successfully!');
    } catch (error) {
      console.error('Error updating tool:', error);
      alert('Failed to update tool');
    } finally {
      setIsUpdatingTool(false);
    }
  };

  const deleteTool = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    setIsDeletingTool(true);
    try {
      await toolsAPI.delete(toolId);
      await fetchAllTools();
      alert('Tool deleted successfully!');
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('Failed to delete tool');
    } finally {
      setIsDeletingTool(false);
    }
  };

  const promoteTool = async (toolId: string, promote: boolean) => {
    try {
      await toolsAPI.update(toolId, { featured: promote });
      await fetchAllTools();
      alert(`Tool ${promote ? 'promoted to featured' : 'demoted from featured'} successfully!`);
    } catch (error) {
      console.error('Error promoting tool:', error);
      alert('Failed to update tool status');
    }
  };

  const promoteToDay = async (toolId: string, promote: boolean) => {
    try {
      const response = await fetch('https://yzoonszpdhbbjrggekma.supabase.co/functions/v1/promote-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ toolId, promote })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        alert(result.error);
        return;
      }
      
      await fetchAllTools();
      alert(`Tool ${promote ? 'promoted to Tool of the Day' : 'removed from Tool of the Day'} successfully!`);
    } catch (error) {
      console.error('Error promoting tool:', error);
      alert('Failed to update tool status');
    }
  };

  const bulkDelete = async () => {
    if (selectedTools.length === 0) {
      alert('Please select tools to delete');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedTools.length} tools?`)) return;
    
    try {
      await Promise.all(selectedTools.map(toolId => toolsAPI.delete(toolId)));
      setSelectedTools([]);
      await fetchAllTools();
      alert(`${selectedTools.length} tools deleted successfully!`);
    } catch (error) {
      console.error('Error bulk deleting tools:', error);
      alert('Failed to delete tools');
    }
  };

  const bulkPromote = async (promote: boolean) => {
    if (selectedTools.length === 0) {
      alert('Please select tools to update');
      return;
    }
    
    try {
      await Promise.all(selectedTools.map(toolId => toolsAPI.update(toolId, { featured: promote })));
      setSelectedTools([]);
      await fetchAllTools();
      alert(`${selectedTools.length} tools ${promote ? 'promoted to featured' : 'demoted from featured'}!`);
    } catch (error) {
      console.error('Error bulk promoting tools:', error);
      alert('Failed to update tools');
    }
  };

  // Fetch tools when management tab is active
  useEffect(() => {
    if (activeTab === 'management') {
      fetchAllTools();
    }
  }, [currentPage, activeTab, managementSearchQuery, managementCategoryFilter]);
  
  // Reset pagination when search/filter changes
  useEffect(() => {
    if (activeTab === 'management') {
      setCurrentPage(1);
    }
  }, [managementSearchQuery, managementCategoryFilter]);
  useEffect(() => {
    if (activeTab === 'management' && isAuthenticated) {
      fetchAllTools();
    }
  }, [activeTab, isAuthenticated]);



  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="bg-secondary min-h-screen flex items-center justify-center">
        <div className="bg-primary border-pixel p-8 max-w-md w-full">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-primary" strokeWidth={2.5} />
            <h1 className="text-2xl font-bold text-primary uppercase">Protected Area</h1>
          </div>
          <p className="text-secondary font-mono text-sm mb-6 text-center">
            Enter password to access analytics dashboard
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password..."
              className={`w-full px-4 py-3 bg-secondary border-pixel text-primary font-mono mb-4 focus:outline-none focus:ring-2 ${
                passwordError ? 'ring-2 ring-red-500' : 'focus:ring-pixel-green'
              }`}
              autoFocus
            />
            {passwordError && (
              <div className="mb-4 p-3 bg-red-500/10 border-pixel border-red-500 text-red-500 text-sm font-mono">
                INCORRECT PASSWORD
              </div>
            )}
            <button
              type="submit"
              className="w-full btn-pixel-primary"
            >
              ACCESS DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-secondary min-h-screen flex items-center justify-center">
        <div className="bg-primary border-pixel p-8 text-center">
          <Activity className="w-12 h-12 text-primary mx-auto mb-4 animate-pixel-pulse" strokeWidth={2.5} />
          <p className="text-primary font-bold font-mono">{t('tools.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-secondary min-h-screen flex items-center justify-center">
        <div className="bg-primary border-pixel p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-primary font-bold mb-2 uppercase">Error</p>
          <p className="text-secondary font-mono text-sm">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const AnalyticsContent = () => (
    <>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tools with Live Counter */}
        <div className="bg-primary border-pixel p-6 hover-pixel">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              TOTAL TOOLS
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-primary">{totalTools.toLocaleString()}</p>
            <div className="w-2 h-2 bg-pixel-green rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-primary border-pixel p-6 hover-pixel">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              PROGRESS
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.progress_percentage.toFixed(1)}%</p>
          <p className="text-xs text-secondary font-mono mt-1">
            Target: {stats.target.toLocaleString()}
          </p>
        </div>

        {/* Added Today */}
        <div className="bg-pixel-green border-pixel p-6 hover-pixel">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-black" strokeWidth={2.5} />
            <p className="text-xs font-bold text-black uppercase tracking-wider">
              ADDED TODAY
            </p>
          </div>
          <p className="text-3xl font-bold text-black">{stats.tools_added_today}</p>
        </div>

        {/* High-Quality Logos */}
        <div className="bg-primary border-pixel p-6 hover-pixel">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-pixel-green border-pixel"></div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              HIGH-QUALITY LOGOS
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.logos.tier1}</p>
          <p className="text-xs text-secondary font-mono mt-1">
            Excellent visual assets
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-primary border-pixel p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-primary uppercase">Database Growth Progress</p>
          <p className="text-sm font-mono text-secondary">
            {totalTools.toLocaleString()} / {stats.target.toLocaleString()}
          </p>
        </div>
        <div className="w-full h-8 bg-secondary border-pixel relative">
          <div 
            className="h-full bg-pixel-green border-r-pixel transition-all duration-500"
            style={{ width: `${Math.min(stats.progress_percentage, 100)}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-black font-mono">
                {stats.progress_percentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Distribution */}
        <div className="bg-primary border-pixel p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-primary uppercase">Category Distribution</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {categories.filter(c => c !== 'All').map((category) => (
              <div key={category} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-2 h-2 bg-primary"></div>
                  <p className="text-sm font-mono text-primary truncate">{category}</p>
                </div>
              </div>
            ))}
            <div className="text-xs font-mono text-secondary mt-4 text-center">
              Total: {categories.filter(c => c !== 'All').length} categories
            </div>
          </div>
        </div>

        {/* Pricing Breakdown - SCROLLABLE */}
        <div className="bg-primary border-pixel p-6">
          <div className="flex items-center gap-3 mb-4">
            <MousePointer className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-primary uppercase">Pricing Breakdown</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {Object.entries(pricingBreakdown).map(([pricing, count]) => (
              <div key={pricing} className="flex items-center justify-between py-2 border-b border-tertiary">
                <p className="text-sm font-mono text-primary truncate flex-1">{pricing}</p>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-4 bg-secondary border-pixel">
                    <div 
                      className="h-full bg-pixel-green"
                      style={{ width: `${(count / totalTools) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-bold text-primary w-16 text-right">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sources Breakdown */}
        <div className="bg-primary border-pixel p-6">
          <h2 className="text-xl font-bold text-primary mb-4 uppercase">Data Sources</h2>
          <div className="space-y-3">
            {Object.entries(stats.sources).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-2 h-2 bg-primary"></div>
                  <p className="text-sm font-mono text-primary">{source}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-4 bg-secondary border-pixel">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${(count / totalTools) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-bold text-primary w-16 text-right">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo Statistics */}
        <div className="bg-primary border-pixel p-6">
          <h2 className="text-xl font-bold text-primary mb-4 uppercase">Logo Quality Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-tertiary">
              <p className="text-sm font-mono text-primary">Total with Logos</p>
              <p className="text-lg font-bold text-primary">{stats.logos.total_with_logos}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-tertiary">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pixel-green border-pixel"></div>
                <p className="text-sm font-mono text-primary">Tier 1 (Excellent)</p>
              </div>
              <p className="text-lg font-bold text-primary">{stats.logos.tier1}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-tertiary">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 border-pixel"></div>
                <p className="text-sm font-mono text-primary">Tier 2 (Good)</p>
              </div>
              <p className="text-lg font-bold text-primary">{stats.logos.tier2}</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-tertiary border-pixel"></div>
                <p className="text-sm font-mono text-primary">Tier 3 (Basic)</p>
              </div>
              <p className="text-lg font-bold text-primary">{stats.logos.tier3}</p>
            </div>
          </div>
        </div>

        {/* Tool Types */}
        <div className="bg-primary border-pixel p-6">
          <h2 className="text-xl font-bold text-primary mb-4 uppercase">Tool Types</h2>
          <div className="space-y-3">
            {Object.entries(stats.tool_types).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <p className="text-sm font-mono text-primary capitalize">{type}</p>
                <p className="text-lg font-bold text-primary">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="col-span-1 lg:col-span-2">
          <AnalyticsDashboard />
        </div>

        {/* System Info */}
        <div className="bg-primary border-pixel p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-primary" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-primary uppercase">System Info</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-secondary">Last Updated</p>
              <p className="text-sm font-bold text-primary">
                {new Date(stats.last_updated).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-secondary">Auto-Refresh</p>
              <p className="text-sm font-bold text-primary">Every 30s</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-secondary">Cron Schedule</p>
              <p className="text-sm font-bold text-primary">Every 6 hours</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-secondary">Database Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pixel-green rounded-full animate-pulse"></div>
                <p className="text-sm font-bold text-pixel-green">ONLINE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const ManagementContent = () => (
    <div className="space-y-6">
      {/* Management Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary uppercase">Tool Management</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddTool(true)}
            className="btn-pixel-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Tool
          </button>
          <button
            onClick={() => setShowBulkOperations(true)}
            className="btn-pixel-secondary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Bulk Operations
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-primary border-pixel p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-secondary" />
            <input
              type="text"
              placeholder="Search tools..."
              value={managementSearchQuery}
              onChange={(e) => setManagementSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
            />
          </div>
          <select
            value={managementCategoryFilter}
            onChange={(e) => setManagementCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'All').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTools([])}
              className="px-4 py-2 bg-tertiary border-pixel text-primary hover:bg-secondary transition-colors"
            >
              Clear Selection ({selectedTools.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tools Table */}
      <div className="bg-primary border-pixel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tertiary border-b-pixel">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTools.length === tools.length && tools.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTools(tools.map(tool => tool.id));
                      } else {
                        setSelectedTools([]);
                      }
                    }}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-secondary uppercase">Tool</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-secondary uppercase">Category</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-secondary uppercase">Pricing</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-secondary uppercase">Featured</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-secondary uppercase">Tool of Day</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id} className="border-b border-tertiary hover:bg-tertiary/20">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTools([...selectedTools, tool.id]);
                        } else {
                          setSelectedTools(selectedTools.filter(id => id !== tool.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-bold text-primary">{tool.name}</div>
                      <div className="text-sm text-secondary truncate max-w-xs">
                        {tool.description || 'No description'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary">{tool.category || 'Uncategorized'}</td>
                  <td className="px-4 py-3 text-sm text-secondary">{tool.pricing || 'Not specified'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => promoteTool(tool.id, !tool.featured)}
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        tool.featured
                          ? 'bg-pixel-green text-black'
                          : 'bg-tertiary text-secondary hover:bg-pixel-green hover:text-black'
                      }`}
                    >
                      {tool.featured ? 'FEATURED' : 'REGULAR'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => promoteToDay(tool.id, !tool.tool_of_day)}
                      disabled={!tool.tool_of_day && (tools.filter(t => t.tool_of_day).length >= 4)}
                      className={`px-2 py-1 rounded text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed ${
                        tool.tool_of_day
                          ? 'bg-yellow-500 text-black'
                          : 'bg-tertiary text-secondary hover:bg-yellow-500 hover:text-black'
                      }`}
                    >
                      {tool.tool_of_day ? 'DAY TOOL' : tool.tool_of_day ? '' : (tools.filter(t => t.tool_of_day).length >= 4 ? 'LIMIT REACHED' : 'PROMOTE')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTool(tool)}
                        className="p-1 bg-pixel-green text-black hover:bg-pixel-green/80"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTool(tool.id)}
                        className="p-1 bg-red-500 text-white hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center text-secondary">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-pixel-green border-t-transparent rounded-full animate-spin"></div>
              Loading tools...
            </div>
          </div>
        )}
        
        {/* No Tools Found */}
        {tools.length === 0 && !loading && (
          <div className="p-8 text-center text-secondary">
            No tools found matching your criteria
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-tertiary border-t-pixel p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-secondary">
                Showing {tools.length} of {total} tools (Page {currentPage} of {totalPages})
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-secondary border-pixel text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pixel-green hover:text-black transition-colors"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 border-pixel text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-pixel-green text-black'
                            : 'bg-secondary text-primary hover:bg-pixel-green hover:text-black'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-secondary border-pixel text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pixel-green hover:text-black transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-secondary min-h-screen">
      {/* Page Header */}
      <div className="bg-primary border-b-pixel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-8 h-8 text-primary" strokeWidth={2.5} />
                <h1 className="text-3xl font-bold text-primary">ADMIN DASHBOARD</h1>
              </div>
              <p className="text-secondary font-mono">Analytics, monitoring, and tool management</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pixel-green rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-secondary">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-secondary border-b-pixel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'text-primary border-pixel-green'
                  : 'text-tertiary border-transparent hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Analytics
              </div>
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`py-4 px-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'management'
                  ? 'text-primary border-pixel-green'
                  : 'text-tertiary border-transparent hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Tool Management
              </div>
            </button>
            <button
              onClick={() => setActiveTab('apis')}
              className={`py-4 px-2 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'apis'
                  ? 'text-primary border-pixel-green'
                  : 'text-tertiary border-transparent hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                API Management
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'analytics' ? <AnalyticsContent /> : activeTab === 'management' ? <ManagementContent /> : <APIManagementInterface />}
      </div>

      {/* Add Tool Modal */}
      {showAddTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary border-pixel max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary uppercase">Add New Tool</h3>
                <button
                  onClick={() => setShowAddTool(false)}
                  className="text-secondary hover:text-primary"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={addNewTool} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-secondary uppercase mb-2">Tool Name</label>
                  <input
                    type="text"
                    required
                    value={newTool.name}
                    onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary uppercase mb-2">Description</label>
                  <textarea
                    value={newTool.description}
                    onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green h-24 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-secondary uppercase mb-2">Category</label>
                    <input
                      type="text"
                      value={newTool.category}
                      onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                      className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary uppercase mb-2">Pricing</label>
                    <select
                      value={newTool.pricing}
                      onChange={(e) => setNewTool({...newTool, pricing: e.target.value})}
                      className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                    >
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                      <option value="Premium">Premium</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary uppercase mb-2">Website URL</label>
                  <input
                    type="url"
                    value={newTool.url}
                    onChange={(e) => setNewTool({...newTool, url: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary uppercase mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={newTool.logo_url}
                    onChange={(e) => setNewTool({...newTool, logo_url: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary uppercase mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTool.tags}
                    onChange={(e) => setNewTool({...newTool, tags: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newTool.featured}
                    onChange={(e) => setNewTool({...newTool, featured: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-secondary uppercase">Feature Tool</label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isAddingTool}
                    className="btn-pixel-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingTool && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isAddingTool ? 'Adding...' : 'Add Tool'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTool(false)}
                    disabled={isAddingTool}
                    className="btn-pixel-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tool Modal */}
      {editingTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary border-pixel max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary uppercase">Edit Tool</h3>
                <button
                  onClick={() => setEditingTool(null)}
                  className="text-secondary hover:text-primary"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={editTool} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-secondary uppercase mb-2">Tool Name</label>
                  <input
                    type="text"
                    required
                    value={editingTool.name}
                    onChange={(e) => setEditingTool({...editingTool, name: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary uppercase mb-2">Description</label>
                  <textarea
                    value={editingTool.description || ''}
                    onChange={(e) => setEditingTool({...editingTool, description: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green h-24 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-secondary uppercase mb-2">Category</label>
                    <input
                      type="text"
                      value={editingTool.category || ''}
                      onChange={(e) => setEditingTool({...editingTool, category: e.target.value})}
                      className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary uppercase mb-2">Pricing</label>
                    <select
                      value={editingTool.pricing || 'Free'}
                      onChange={(e) => setEditingTool({...editingTool, pricing: e.target.value})}
                      className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                    >
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                      <option value="Premium">Premium</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary uppercase mb-2">Website URL</label>
                  <input
                    type="url"
                    value={editingTool.url || ''}
                    onChange={(e) => setEditingTool({...editingTool, url: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border-pixel text-primary focus:outline-none focus:ring-2 focus:ring-pixel-green"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-featured"
                    checked={editingTool.featured || false}
                    onChange={(e) => setEditingTool({...editingTool, featured: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="edit-featured" className="text-sm font-bold text-secondary uppercase">Featured Tool</label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isUpdatingTool}
                    className="btn-pixel-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingTool && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isUpdatingTool ? 'Updating...' : 'Update Tool'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTool(null)}
                    disabled={isUpdatingTool}
                    className="btn-pixel-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Operations Modal */}
      {showBulkOperations && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary border-pixel max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary uppercase">Bulk Operations</h3>
                <button
                  onClick={() => setShowBulkOperations(false)}
                  className="text-secondary hover:text-primary"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="text-sm text-secondary mb-4">
                  {selectedTools.length} tools selected
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      bulkPromote(true);
                      setShowBulkOperations(false);
                    }}
                    className="btn-pixel-primary flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Promote to Featured
                  </button>
                  <button
                    onClick={() => {
                      bulkPromote(false);
                      setShowBulkOperations(false);
                    }}
                    className="btn-pixel-secondary flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Demote from Featured
                  </button>
                  <button
                    onClick={() => {
                      bulkDelete();
                      setShowBulkOperations(false);
                    }}
                    className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 border-pixel flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected Tools
                  </button>
                </div>
                <button
                  onClick={() => setShowBulkOperations(false)}
                  className="w-full btn-pixel-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
