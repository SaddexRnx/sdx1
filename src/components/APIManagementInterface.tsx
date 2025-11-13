import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Code2, Star, Lock, Unlock } from 'lucide-react';
import { apisAPI } from '@/lib/supabase';

export function APIManagementInterface() {
  const [apis, setApis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAPI, setEditingAPI] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General APIs',
    url: '',
    documentation_url: '',
    authentication_required: false,
    auth_type: 'None',
    rate_limit: '',
    free_tier: true,
    tags: '',
    featured: false
  });

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const stats = await apisAPI.stats();
        setCategories(stats.categories.filter(c => c !== 'All'));
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    loadCategories();
  }, []);

  // Load APIs
  useEffect(() => {
    loadAPIs();
  }, [currentPage, searchQuery, selectedCategory]);

  async function loadAPIs() {
    setLoading(true);
    try {
      const result = await apisAPI.list({
        page: currentPage,
        limit: pageSize,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined
      });
      setApis(result.apis);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading APIs:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingAPI) {
        await apisAPI.update(editingAPI.id, apiData);
      } else {
        await apisAPI.create(apiData);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'General APIs',
        url: '',
        documentation_url: '',
        authentication_required: false,
        auth_type: 'None',
        rate_limit: '',
        free_tier: true,
        tags: '',
        featured: false
      });
      setShowAddForm(false);
      setEditingAPI(null);
      loadAPIs();
    } catch (error) {
      console.error('Error saving API:', error);
      alert('Failed to save API. Please try again.');
    }
  };

  const handleEdit = (api: any) => {
    setEditingAPI(api);
    setFormData({
      name: api.name,
      description: api.description || '',
      category: api.category,
      url: api.url,
      documentation_url: api.documentation_url || '',
      authentication_required: api.authentication_required,
      auth_type: api.auth_type,
      rate_limit: api.rate_limit || '',
      free_tier: api.free_tier,
      tags: api.tags?.join(', ') || '',
      featured: api.featured
    });
    setShowAddForm(true);
  };

  const handleDelete = async (apiId: string) => {
    if (!confirm('Are you sure you want to delete this API?')) return;
    
    try {
      await apisAPI.delete(apiId);
      loadAPIs();
    } catch (error) {
      console.error('Error deleting API:', error);
      alert('Failed to delete API. Please try again.');
    }
  };

  const apiCategories = [
    'General APIs',
    'Weather APIs',
    'Social Media APIs',
    'Finance/Crypto APIs',
    'Entertainment APIs',
    'Media APIs',
    'Maps/Geography APIs',
    'AI/ML APIs',
    'Health APIs',
    'News APIs',
    'Development Tools APIs',
    'E-commerce APIs',
    'Fun APIs',
    'Education APIs',
    'Utilities APIs'
  ];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-2">API Management</h2>
          <p className="text-secondary">Manage your API directory entries</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingAPI(null);
            setFormData({
              name: '',
              description: '',
              category: 'General APIs',
              url: '',
              documentation_url: '',
              authentication_required: false,
              auth_type: 'None',
              rate_limit: '',
              free_tier: true,
              tags: '',
              featured: false
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary font-bold border-pixel hover:shadow-pixel transition-all"
        >
          <Plus className="w-4 h-4" />
          Add API
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-secondary border-pixel p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingAPI ? 'Edit API' : 'Add New API'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-primary border-pixel font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-primary border-pixel font-mono"
                >
                  {apiCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 bg-primary border-pixel font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">API URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-primary border-pixel font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Documentation URL</label>
                <input
                  type="url"
                  value={formData.documentation_url}
                  onChange={(e) => setFormData({ ...formData, documentation_url: e.target.value })}
                  className="w-full px-3 py-2 bg-primary border-pixel font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Authentication Type</label>
                <select
                  value={formData.auth_type}
                  onChange={(e) => {
                    const authRequired = e.target.value !== 'None';
                    setFormData({ 
                      ...formData, 
                      auth_type: e.target.value,
                      authentication_required: authRequired
                    });
                  }}
                  className="w-full px-3 py-2 bg-primary border-pixel font-mono"
                >
                  <option value="None">None</option>
                  <option value="API Key">API Key</option>
                  <option value="OAuth">OAuth</option>
                  <option value="Bearer Token">Bearer Token</option>
                  <option value="Basic Auth">Basic Auth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Rate Limit</label>
                <input
                  type="text"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({ ...formData, rate_limit: e.target.value })}
                  placeholder="e.g., 1000 requests/day"
                  className="w-full px-3 py-2 bg-primary border-pixel font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="rest, json, free"
                className="w-full px-3 py-2 bg-primary border-pixel font-mono"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.free_tier}
                  onChange={(e) => setFormData({ ...formData, free_tier: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold">Has Free Tier</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-bold">Featured</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-secondary font-bold border-pixel hover:shadow-pixel"
              >
                {editingAPI ? 'Update' : 'Add'} API
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAPI(null);
                }}
                className="px-6 py-2 bg-secondary text-primary font-bold border-pixel hover:shadow-pixel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search APIs..."
            className="w-full pl-10 pr-4 py-2 bg-secondary border-pixel font-mono"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-secondary border-pixel font-mono"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* API List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {apis.map((api) => (
              <div key={api.id} className="bg-secondary border-pixel p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-4 h-4" />
                    <h3 className="font-bold">{api.name}</h3>
                    {api.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    {api.free_tier && (
                      <span className="text-xs px-2 py-0.5 bg-green-500 text-white border-pixel">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-secondary mb-2">{api.description}</p>
                  <div className="flex items-center gap-4 text-xs font-mono text-secondary">
                    <span>{api.category}</span>
                    <span className="flex items-center gap-1">
                      {api.authentication_required ? (
                        <><Lock className="w-3 h-3" /> {api.auth_type}</>
                      ) : (
                        <><Unlock className="w-3 h-3" /> No Auth</>
                      )}
                    </span>
                    {api.rate_limit && <span>Rate: {api.rate_limit}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(api)}
                    className="p-2 bg-primary text-secondary border-pixel hover:shadow-pixel"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(api.id)}
                    className="p-2 bg-red-500 text-white border-pixel hover:shadow-pixel"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-secondary border-pixel font-bold disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-primary text-secondary border-pixel font-bold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-secondary border-pixel font-bold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
