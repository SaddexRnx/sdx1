import { useState } from 'react';
import { Plus, Upload, Link as LinkIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ToolSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ToolSubmissionForm({ onSuccess, onCancel }: ToolSubmissionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    pricing: '',
    url: '',
    official_website: '',
    tags: '',
    logo_url: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    'AI & Machine Learning',
    'Productivity',
    'Design',
    'Development',
    'Marketing',
    'Business',
    'Writing',
    'Content Creation',
    'Video',
    'Audio',
    'Image',
    'Education',
    'Communication',
    'Data Analytics',
    'Research',
    'Chatbots',
    'Other'
  ];

  const pricingOptions = ['Free', 'Freemium', 'Paid', 'Not Specified'];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Logo file must be less than 2MB');
        return;
      }
      setLogoFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      let finalLogoUrl = formData.logo_url;

      // Upload logo file if provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('tool-logos')
          .upload(fileName, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('tool-logos')
          .getPublicUrl(fileName);

        finalLogoUrl = publicUrl;
      }

      // Parse tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Insert tool
      const { error: insertError } = await supabase
        .from('ai_tools')
        .insert([{
          name: formData.name,
          description: formData.description,
          category: formData.category,
          pricing: formData.pricing || 'Not Specified',
          url: formData.url || formData.official_website,
          official_website: formData.official_website || formData.url,
          tags: tagsArray,
          logo_url: finalLogoUrl,
          featured: false,
          source: 'user_submission'
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to submit tool');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-primary border-pixel p-8 text-center">
        <div className="w-16 h-16 bg-pixel-green border-pixel mx-auto mb-4 flex items-center justify-center">
          <Plus className="w-8 h-8 text-black" strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-2">SUCCESS!</h3>
        <p className="text-secondary font-mono text-sm">
          Tool submitted successfully. It will be reviewed and added to the directory.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-primary border-pixel p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">SUBMIT NEW TOOL</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 bg-secondary border-pixel hover-pixel flex items-center justify-center"
          >
            <X className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border-pixel border-red-500 text-red-500 text-sm font-mono">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Tool Name */}
        <div>
          <label className="block text-sm font-bold text-primary mb-2">
            TOOL NAME *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-secondary border-pixel text-primary font-mono focus:outline-none focus:ring-2 focus:ring-pixel-green"
            placeholder="Enter tool name..."
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-primary mb-2">
            DESCRIPTION *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-secondary border-pixel text-primary font-mono focus:outline-none focus:ring-2 focus:ring-pixel-green h-24"
            placeholder="Describe what this tool does..."
            required
          />
        </div>

        {/* Category & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              CATEGORY *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-secondary border-pixel text-primary font-mono focus:outline-none focus:ring-2 focus:ring-pixel-green"
              required
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">
              PRICING
            </label>
            <select
              value={formData.pricing}
              onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
              className="w-full px-4 py-2 bg-secondary border-pixel text-primary font-mono focus:outline-none focus:ring-2 focus:ring-pixel-green"
            >
              <option value="">Select pricing...</option>
              {pricingOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-bold text-primary mb-2">
            WEBSITE URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" strokeWidth={2.5} />
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value, official_website: e.target.value })}
              className="w-full pl-12 pr-4 py-2 bg-secondary border-pixel text-primary font-mono focus:outline-none focus:ring-2 focus:ring-pixel-green"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-bold text-primary mb-2">
            LOGO
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2 bg-secondary border-pixel hover-pixel text-primary font-mono text-sm flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" strokeWidth={2.5} />
                  {logoFile ? logoFile.name : 'UPLOAD IMAGE (MAX 2MB)'}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-secondary font-mono">OR</p>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-4 py-2 bg-secondary border-pixel text-primary font-mono focus:outline-none focus:ring-2 focus:ring-pixel-green text-sm"
              placeholder="Logo URL..."
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-primary mb-2">
            TAGS (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 bg-secondary border-pixel text-primary font-mono focus:outline-none focus:ring-2 focus:ring-pixel-green"
            placeholder="ai, productivity, automation..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-pixel-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              SUBMITTING...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              SUBMIT TOOL
            </>
          )}
        </button>
      </div>
    </form>
  );
}
