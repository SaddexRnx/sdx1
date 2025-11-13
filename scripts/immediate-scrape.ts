/**
 * IMMEDIATE TOOL SCRAPING SCRIPT
 * Scrapes major AI tool directories and adds tools directly to database
 * Target: 2000+ new tools
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yzoonszpdhbbjrggekma.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface ScrapedTool {
  name: string;
  description: string;
  website_url: string;
  category: string;
  pricing: string;
  logo_url?: string;
  logo_quality?: number;
  source: string;
}

// Category mapping to match our existing categories
const CATEGORY_MAP: Record<string, string> = {
  'chatbot': 'AI Chatbots',
  'chat': 'AI Chatbots',
  'writing': 'AI Writing Tools',
  'content': 'AI Content Creation',
  'image': 'AI Image Generation',
  'video': 'AI Video Creation',
  'audio': 'AI Audio',
  'voice': 'AI Voice',
  'music': 'AI Music',
  'code': 'AI Code Assistant',
  'developer': 'AI Developer Tools',
  'productivity': 'AI Productivity',
  'automation': 'AI Automation',
  'marketing': 'AI Marketing',
  'seo': 'AI SEO',
  'sales': 'AI Sales',
  'design': 'AI Design',
  'research': 'AI Research',
  'data': 'AI Data Analysis',
  'analytics': 'AI Analytics',
  'education': 'AI Education',
  'healthcare': 'AI Healthcare',
  'finance': 'AI Finance',
  'ecommerce': 'AI E-commerce',
  'customer': 'AI Customer Service',
  'support': 'AI Customer Service',
  'hr': 'AI HR',
  'recruitment': 'AI HR',
  'legal': 'AI Legal',
  'real estate': 'AI Real Estate',
  'gaming': 'AI Gaming',
  'travel': 'AI Travel',
  'food': 'AI Food & Nutrition',
  'fitness': 'AI Fitness',
  'fashion': 'AI Fashion',
  'social': 'AI Social Media',
  'translation': 'AI Translation',
  'transcription': 'AI Transcription',
  'summarization': 'AI Summarization',
  'paraphrasing': 'AI Paraphrasing',
  'prompt': 'AI Prompt Engineering',
  'gpt': 'GPTs',
  'assistant': 'AI Assistants',
  'agent': 'AI Agents',
};

function mapCategory(rawCategory: string): string {
  const normalized = rawCategory.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  return 'AI Tools'; // Default category
}

function generateLogoUrl(websiteUrl: string): string {
  try {
    const domain = new URL(websiteUrl).hostname;
    // Try multiple logo sources
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    return '';
  }
}

async function insertTools(tools: ScrapedTool[]) {
  console.log(`Attempting to insert ${tools.length} tools...`);
  
  const toolsToInsert = tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    website_url: tool.website_url,
    category: tool.category,
    pricing: tool.pricing,
    logo_url: tool.logo_url || generateLogoUrl(tool.website_url),
    logo_quality: tool.logo_quality || 2,
    source: tool.source,
    usage_count: 0,
    saves_count: 0,
    tool_type: tool.category === 'GPTs' ? 'gpt' : 'regular',
  }));

  const { data, error } = await supabase
    .from('ai_tools')
    .insert(toolsToInsert)
    .select();

  if (error) {
    console.error('Error inserting tools:', error.message);
    return 0;
  }

  console.log(`Successfully inserted ${data?.length || 0} tools`);
  return data?.length || 0;
}

// Sample tools from major categories (This would normally scrape from real sources)
const SAMPLE_TOOLS: ScrapedTool[] = [
  // AI Chatbots
  {
    name: 'ChatGPT',
    description: 'Advanced conversational AI by OpenAI for natural language understanding and generation',
    website_url: 'https://chat.openai.com',
    category: 'AI Chatbots',
    pricing: 'Freemium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Claude',
    description: 'Anthropic\'s AI assistant for safe, helpful conversations and complex tasks',
    website_url: 'https://claude.ai',
    category: 'AI Chatbots',
    pricing: 'Freemium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Gemini',
    description: 'Google\'s most capable AI model for text, code, images, and more',
    website_url: 'https://gemini.google.com',
    category: 'AI Chatbots',
    pricing: 'Freemium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Perplexity AI',
    description: 'AI-powered search engine that provides accurate answers with citations',
    website_url: 'https://perplexity.ai',
    category: 'AI Search',
    pricing: 'Freemium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Jasper AI',
    description: 'AI content platform for marketing teams to create on-brand content',
    website_url: 'https://jasper.ai',
    category: 'AI Writing Tools',
    pricing: 'Premium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Copy.ai',
    description: 'AI-powered copywriter for marketing content, emails, and social posts',
    website_url: 'https://copy.ai',
    category: 'AI Writing Tools',
    pricing: 'Freemium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Writesonic',
    description: 'AI writer for creating SEO-optimized content for blogs, ads, and more',
    website_url: 'https://writesonic.com',
    category: 'AI Writing Tools',
    pricing: 'Freemium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Grammarly',
    description: 'AI writing assistant for grammar checking, style suggestions, and clarity',
    website_url: 'https://grammarly.com',
    category: 'AI Writing Tools',
    pricing: 'Freemium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Midjourney',
    description: 'AI art generator creating stunning images from text descriptions',
    website_url: 'https://midjourney.com',
    category: 'AI Image Generation',
    pricing: 'Premium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'DALL-E 3',
    description: 'OpenAI\'s image generation model for creating detailed images from text',
    website_url: 'https://openai.com/dall-e-3',
    category: 'AI Image Generation',
    pricing: 'Premium',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Stable Diffusion',
    description: 'Open-source AI model for generating high-quality images from text',
    website_url: 'https://stability.ai',
    category: 'AI Image Generation',
    pricing: 'Free',
    source: 'manual',
    logo_quality: 3,
  },
  {
    name: 'Leonardo AI',
    description: 'AI-powered creative platform for generating production-quality visual assets',
    website_url: 'https://leonardo.ai',
    category: 'AI Image Generation',
    pricing: 'Freemium',
    source: 'manual',
    logo_quality: 3,
  },
  // Continue with more tools...
];

async function main() {
  console.log('Starting immediate tool scraping...');
  console.log('Target: Add 2000+ tools to database');
  
  // For now, insert sample tools (in production, this would scrape from real sources)
  const inserted = await insertTools(SAMPLE_TOOLS);
  
  console.log(`\nSummary:`);
  console.log(`- Tools processed: ${SAMPLE_TOOLS.length}`);
  console.log(`- Tools inserted: ${inserted}`);
  console.log(`\nNote: This is a sample script. For full 2000+ tools, integrate with:`);
  console.log(`  - Futurepedia API`);
  console.log(`  - Toolify.ai scraping`);
  console.log(`  - FutureTools.io scraping`);
  console.log(`  - OpenAI GPTs directory`);
  console.log(`  - There's An AI For That`);
}

main().catch(console.error);
