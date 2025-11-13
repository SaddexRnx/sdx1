export interface Tool {
  _id?: string;
  id: string;
  name: string;
  description: string;
  url: string;
  official_website?: string;
  category: string;
  pricing: string;
  tags: string[];
  logo: string;
  logo_url?: string | null;
  logo_quality_score?: number;
  logo_source?: string;
  logo_tier?: number; // 1=best (crystal clear), 2=good, 3=basic, 4=no logo
  featured?: boolean;
  tool_of_day?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ToolsData {
  tools: Tool[];
  categories: string[];
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'featured' | 'name-asc' | 'name-desc' | 'newest' | 'most-used';
