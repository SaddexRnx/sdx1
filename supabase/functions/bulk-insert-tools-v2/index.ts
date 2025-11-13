/**
 * BULK INSERT TOOLS EDGE FUNCTION
 * Accepts tools array via POST request and inserts into database
 * Handles batching and duplicate checking
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get tools from request body
    const body = await req.json();
    const tools = body.tools || [];

    if (tools.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No tools provided in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map tools to database schema
    const toolsToInsert = tools.map((tool: any) => {
      try {
        const domain = new URL(tool.website_url).hostname;
        const id = crypto.randomUUID();
        const hash = `${tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${domain.replace(/\./g, '-')}`;
        
        return {
          id,
          name: tool.name,
          description: tool.description || `${tool.name} - AI tool`,
          url: tool.website_url,
          official_website: tool.website_url,
          category: tool.category || 'AI Tools',
          pricing: tool.pricing || 'Unknown',
          logo_url: `https://logo.clearbit.com/${domain}`,
          logo_quality_score: 50,
          logo_tier: 2,
          logo_source: 'clearbit',
          source: tool.source || 'bulk_insert',
          hash: hash,
          usage_count: 0,
          saves_count: 0,
          tool_type: tool.category === 'GPTs' ? 'gpt' : 'tool',
          featured: false,
        };
      } catch {
        const id = crypto.randomUUID();
        const hash = `${tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
        
        return {
          id,
          name: tool.name,
          description: tool.description || `${tool.name} - AI tool`,
          url: tool.website_url || '',
          official_website: tool.website_url || '',
          category: tool.category || 'AI Tools',
          pricing: tool.pricing || 'Unknown',
          logo_url: null,
          logo_quality_score: 20,
          logo_tier: 1,
          logo_source: 'none',
          source: tool.source || 'bulk_insert',
          hash: hash,
          usage_count: 0,
          saves_count: 0,
          tool_type: 'tool',
          featured: false,
        };
      }
    });

    // Insert in batches of 50
    const batchSize = 50;
    let totalInserted = 0;
    const errors = [];

    for (let i = 0; i < toolsToInsert.length; i += batchSize) {
      const batch = toolsToInsert.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('ai_tools')
        .insert(batch)
        .select('id, name');

      if (error) {
        // Check if it's a duplicate error
        if (error.message.includes('duplicate key') || error.message.includes('constraint')) {
          console.log(`Batch ${Math.floor(i / batchSize) + 1}: Skipped duplicates`);
        } else {
          errors.push({ batch: Math.floor(i / batchSize) + 1, error: error.message });
        }
      } else {
        totalInserted += data?.length || 0;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        inserted: totalInserted,
        total: tools.length,
        skipped: tools.length - totalInserted,
        errors: errors.length > 0 ? errors : null,
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
