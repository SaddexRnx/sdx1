// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yzoonszpdhbbjrggekma.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6b29uc3pwZGhiYmpyZ2dla21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTk2ODEsImV4cCI6MjA3NzQ3NTY4MX0.IqufI0w_-d5u7fDuFFlWvGkvp6NTqXc8lrQDMDHN13k'

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// MongoDB Tools API Service
export const toolsAPI = {
  // List tools with filters and pagination
  async list(params: {
    page?: number
    limit?: number
    filters?: {
      category?: string
      pricing?: string
      search?: string
      sortBy?: string
    }
  }) {
    const { data, error } = await supabase.functions.invoke('supabase-tools-api', {
      body: {
        action: 'list',
        page: params.page || 1,
        limit: params.limit || 12,
        filters: params.filters || {}
      }
    })

    if (error) throw error
    return data.data
  },

  // Get single tool by ID
  async get(toolId: string) {
    const { data, error } = await supabase.functions.invoke('supabase-tools-api', {
      body: {
        action: 'get',
        toolId
      }
    })

    if (error) throw error
    return data.data
  },

  // Get statistics (total count, categories, etc.)
  async stats() {
    const { data, error } = await supabase.functions.invoke('supabase-tools-api', {
      body: {
        action: 'stats'
      }
    })

    if (error) throw error
    return data.data
  },

  // Create new tool (admin only)
  async create(tool: any) {
    const { data, error } = await supabase.functions.invoke('supabase-tools-api', {
      body: {
        action: 'create',
        tool
      }
    })

    if (error) throw error
    return data.data
  },

  // Update tool (admin only)
  async update(toolId: string, tool: any) {
    const { data, error } = await supabase.functions.invoke('supabase-tools-api', {
      body: {
        action: 'update',
        toolId,
        tool
      }
    })

    if (error) throw error
    return data.data
  },

  // Delete tool (admin only)
  async delete(toolId: string) {
    const { data, error } = await supabase.functions.invoke('supabase-tools-api', {
      body: {
        action: 'delete',
        toolId
      }
    })

    if (error) throw error
    return data.data
  }
}

// Direct database queries (faster, uses logo quality fields)
export const dbAPI = {
  // List tools with logo-first sorting
  async list(params: {
    page?: number
    limit?: number
    category?: string
    pricing?: string
    search?: string
    sortBy?: string
    toolType?: string
    createdAfter?: string
  }) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('ai_tools')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (params.category && params.category !== 'All') {
      query = query.eq('category', params.category);
    }
    
    if (params.pricing && params.pricing !== 'All') {
      query = query.eq('pricing', params.pricing);
    }
    
    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    if (params.toolType) {
      query = query.eq('tool_type', params.toolType);
    }

    if (params.createdAfter) {
      query = query.gte('created_at', params.createdAfter);
    }
    
    // Apply sorting - LOGO-FIRST by default
    const sortBy = params.sortBy || 'featured';
    if (sortBy === 'featured' || !sortBy) {
      // Logo-first: Best logos first (tier 1), then by quality score
      query = query
        .order('logo_tier', { ascending: true, nullsFirst: false })
        .order('logo_quality_score', { ascending: false, nullsFirst: false })
        .order('name', { ascending: true });
    } else if (sortBy === 'name-asc') {
      query = query.order('name', { ascending: true });
    } else if (sortBy === 'name-desc') {
      query = query.order('name', { ascending: false });
    } else if (sortBy === 'most-used') {
      query = query.order('usage_count', { ascending: false, nullsFirst: false })
                   .order('logo_tier', { ascending: true, nullsFirst: false });
    } else if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false, nullsFirst: false });
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.warn('Database query error:', error);
      // Return empty result with fallback data if database fails
      return {
        tools: [], // Empty tools array
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
    
    return {
      tools: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  },
  
  // Get single tool by ID
  async get(toolId: string) {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('id', toolId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Get statistics and categories with fallback
  async stats() {
    try {
      // Get actual count without fetching all records
      const { count: totalCount, error: countError } = await supabase
        .from('ai_tools')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.warn('Count error, using fallback:', countError);
        // Fallback to default stats if database connection fails
        return {
          totalTools: 5000, // Fallback count
          categories: ['All', 'AI Tools', 'Productivity', 'Development', 'Marketing'],
          pricingOptions: ['All', 'Free', 'Freemium', 'Premium']
        };
      }
      
      // Get distinct categories and pricing (limited fetch for metadata only)
      const { data, error } = await supabase
        .from('ai_tools')
        .select('category, pricing')
        .limit(1000); // Reduce limit to avoid timeouts
      
      if (error) {
        console.warn('Categories fetch error:', error);
        // Return with fallback categories
        return {
          totalTools: totalCount || 0,
          categories: ['All', 'AI Tools', 'Productivity', 'Development', 'Marketing'],
          pricingOptions: ['All', 'Free', 'Freemium', 'Premium']
        };
      }
      
      const categories = ['All', ...Array.from(new Set(data?.map(t => t.category).filter(Boolean))).sort()];
      const pricingOptions = ['All', ...Array.from(new Set(data?.map(t => t.pricing).filter(Boolean))).sort()];
      
      return {
        totalTools: totalCount || 0,
        categories,
        pricingOptions
      };
    } catch (error) {
      console.error('Stats error, using fallback:', error);
      // Complete fallback
      return {
        totalTools: 5000,
        categories: ['All', 'AI Tools', 'Productivity', 'Development', 'Marketing'],
        pricingOptions: ['All', 'Free', 'Freemium', 'Premium']
      };
    }
  }
};

// APIs Directory Management
export const apisAPI = {
  // List APIs with filters and pagination
  async list(params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    freeTierOnly?: boolean
    featured?: boolean
  }) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('apis')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (params.category && params.category !== 'All') {
      query = query.eq('category', params.category);
    }
    
    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    if (params.freeTierOnly) {
      query = query.eq('free_tier', true);
    }

    if (params.featured) {
      query = query.eq('featured', true);
    }
    
    // Sort by featured first, then by name
    query = query
      .order('featured', { ascending: false })
      .order('name', { ascending: true });
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.warn('Database query error:', error);
      return {
        apis: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
    
    return {
      apis: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  },
  
  // Get single API by ID
  async get(apiId: string) {
    const { data, error } = await supabase
      .from('apis')
      .select('*')
      .eq('id', apiId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Get statistics
  async stats() {
    try {
      const { count: totalCount, error: countError } = await supabase
        .from('apis')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        return {
          totalAPIs: 0,
          categories: ['All']
        };
      }
      
      const { data, error } = await supabase
        .from('apis')
        .select('category')
        .limit(1000);
      
      if (error) {
        return {
          totalAPIs: totalCount || 0,
          categories: ['All']
        };
      }
      
      const categories = ['All', ...Array.from(new Set(data?.map(a => a.category).filter(Boolean))).sort()];
      
      return {
        totalAPIs: totalCount || 0,
        categories
      };
    } catch (error) {
      return {
        totalAPIs: 0,
        categories: ['All']
      };
    }
  },

  // Create new API (admin only)
  async create(api: any) {
    const { data, error } = await supabase
      .from('apis')
      .insert([api])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update API (admin only)
  async update(apiId: string, api: any) {
    const { data, error } = await supabase
      .from('apis')
      .update({ ...api, updated_at: new Date().toISOString() })
      .eq('id', apiId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete API (admin only)
  async delete(apiId: string) {
    const { error } = await supabase
      .from('apis')
      .delete()
      .eq('id', apiId);
    
    if (error) throw error;
    return { success: true };
  }
};

// Admin API for management tasks
export const adminAPI = {
  // Migrate data from JSON to Supabase PostgreSQL
  async migrateData(jsonUrl: string, dryRun: boolean = false) {
    const { data, error } = await supabase.functions.invoke('supabase-migrate-data', {
      body: {
        jsonUrl,
        dryRun
      }
    })

    if (error) throw error
    return data.data
  },

  // Scrape tools from theresanaiforthat.com
  async scrapeTools(params: {
    startPage?: number
    maxPages?: number
    category?: string
    dryRun?: boolean
  }) {
    const { data, error } = await supabase.functions.invoke('supabase-scrape-tools', {
      body: {
        startPage: params.startPage || 1,
        maxPages: params.maxPages || 10,
        category: params.category || '',
        dryRun: params.dryRun || false
      }
    })

    if (error) throw error
    return data.data
  },

  // Fix missing logos for existing tools
  async fixLogos(limit: number = 100, dryRun: boolean = false) {
    const { data, error } = await supabase.functions.invoke('fix-missing-logos', {
      body: {
        limit,
        dryRun
      }
    })

    if (error) throw error
    return data.data
  },

  // Extract logo for a specific tool
  async extractLogo(domain: string, toolName: string) {
    const { data, error } = await supabase.functions.invoke('extract-logo', {
      body: {
        domain,
        toolName
      }
    })

    if (error) throw error
    return data.data
  }
}
