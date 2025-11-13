import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { type } = await req.json(); // 'daily', 'weekly', 'monthly', 'all-time', 'top-tools'
    
    // Get Supabase URL and key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    let query = '';
    let dateFilter = '';

    const now = new Date();
    switch (type) {
      case 'daily':
        const today = now.toISOString().split('T')[0];
        dateFilter = `click_date=eq.${today}`;
        break;
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        dateFilter = `click_date=gte.${weekAgo}`;
        break;
      case 'monthly':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        dateFilter = `click_date=gte.${monthAgo}`;
        break;
      case 'all-time':
        dateFilter = '';
        break;
      case 'top-tools':
        query = `${supabaseUrl}/rest/v1/tool_analytics?select=*,ai_tools(name,logo_url)&order=click_count.desc&limit=10`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid analytics type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (type !== 'top-tools') {
      query = `${supabaseUrl}/rest/v1/tool_analytics?select=*,ai_tools(name,logo_url)&order=click_count.desc&limit=100${dateFilter ? '&' + dateFilter : ''}`;
    }

    const response = await fetch(query, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Calculate totals
    const totalClicks = data.reduce((sum: number, item: any) => sum + (item.click_count || 0), 0);

    return new Response(
      JSON.stringify({ 
        data, 
        totalClicks,
        type
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});