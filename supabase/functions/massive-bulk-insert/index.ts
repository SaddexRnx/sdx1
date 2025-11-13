/**
 * MASSIVE BULK INSERT - 1684+ AI TOOLS
 * Consolidated from multiple premium sources
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Load tools data from request body
let CONSOLIDATED_TOOLS = [];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get tools data from request body or use default fallback
    let requestData;
    try {
      requestData = await req.json();
      CONSOLIDATED_TOOLS = requestData.tools || [];
    } catch {
      // Fallback: use some basic tools if no data provided
      CONSOLIDATED_TOOLS = [
        {
          name: "Test AI Tool",
          description: "A test AI tool for database testing",
          website_url: "https://example.com",
          category: "AI Tools",
          pricing: "Free"
        }
      ];
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Map to database schema
    const toolsWithLogos = CONSOLIDATED_TOOLS.map((tool: any) => {
      try {
        const domain = new URL(tool.website_url).hostname;
        const id = crypto.randomUUID();
        const hash = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + domain.replace(/\./g, '-');
        
        return {
          id,
          name: tool.name,
          description: tool.description,
          url: tool.website_url,
          official_website: tool.website_url,
          category: tool.category,
          pricing: tool.pricing,
          logo_url: `https://logo.clearbit.com/${domain}`,
          logo_quality_score: 50,
          logo_tier: 2,
          logo_source: 'clearbit',
          source: tool.source || 'bulk_consolidation',
          hash: hash,
          usage_count: 0,
          saves_count: 0,
          tool_type: tool.category === 'GPTs' ? 'gpt' : 'tool',
          featured: false,
        };
      } catch {
        const id = crypto.randomUUID();
        const hash = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        return {
          id,
          name: tool.name,
          description: tool.description,
          url: tool.website_url,
          official_website: tool.website_url,
          category: tool.category,
          pricing: tool.pricing,
          logo_url: null,
          logo_quality_score: 20,
          logo_tier: 1,
          logo_source: 'none',
          source: tool.source || 'bulk_consolidation',
          hash: hash,
          usage_count: 0,
          saves_count: 0,
          tool_type: 'tool',
          featured: false,
        };
      }
    });

    // Insert in batches of 100
    const batchSize = 100;
    let totalInserted = 0;
    const errors = [];

    for (let i = 0; i < toolsWithLogos.length; i += batchSize) {
      const batch = toolsWithLogos.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('ai_tools')
        .insert(batch)
        .select();

      if (error) {
        errors.push({ batch: Math.floor(i / batchSize) + 1, error: error.message });
      } else {
        totalInserted += data?.length || 0;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        inserted: totalInserted,
        total: CONSOLIDATED_TOOLS.length,
        errors: errors.length > 0 ? errors : null,
        batches: Math.ceil(CONSOLIDATED_TOOLS.length / batchSize),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
