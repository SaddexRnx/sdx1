import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yzoonszpdhbbjrggekma.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6b29uc3pwZGhiYmpyZ2dla21hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg5OTY4MSwiZXhwIjoyMDc3NDc1NjgxfQ.3IIZqBPruAPbpPK0eCow2oUj9kygJObleao7Yhn6Y-Q';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface APIData {
  name: string;
  description: string;
  category: string;
  url: string;
  documentation_url?: string;
  authentication_required: boolean;
  auth_type?: string;
  rate_limit?: string;
  free_tier: boolean;
  tags: string[];
  featured?: boolean;
  added_by?: string;
}

const finalBatchAPIs: APIData[] = [
  // More Social Media and Communication APIs
  {
    name: "LinkedIn API",
    description: "Professional networking platform integration",
    category: "Social Media",
    url: "https://docs.microsoft.com/en-us/linkedin/",
    documentation_url: "https://docs.microsoft.com/en-us/linkedin/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["linkedin", "professional", "networking"]
  },
  {
    name: "YouTube Data API",
    description: "Access YouTube videos, channels, and playlists data",
    category: "Social Media",
    url: "https://developers.google.com/youtube/v3",
    documentation_url: "https://developers.google.com/youtube/v3/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "10,000 units per day",
    tags: ["youtube", "videos", "google"],
    featured: true
  },
  {
    name: "Vimeo API",
    description: "Video hosting and streaming platform API",
    category: "Social Media",
    url: "https://developer.vimeo.com",
    documentation_url: "https://developer.vimeo.com/api",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["vimeo", "videos", "streaming"]
  },

  // More Government and Open Data APIs
  {
    name: "World Bank API",
    description: "Global development data and statistics",
    category: "Government",
    url: "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392",
    documentation_url: "https://datahelpdesk.worldbank.org/knowledgebase/topics/125589",
    authentication_required: false,
    free_tier: true,
    tags: ["world-bank", "development", "economics"],
    featured: true
  },
  {
    name: "UN Data API",
    description: "United Nations statistical data",
    category: "Government",
    url: "http://data.un.org",
    documentation_url: "http://data.un.org/Host.aspx?Content=API",
    authentication_required: false,
    free_tier: true,
    tags: ["united-nations", "statistics", "global"]
  },
  {
    name: "Open Corporates API",
    description: "Global company and corporate data",
    category: "Business",
    url: "https://api.opencorporates.com",
    documentation_url: "https://api.opencorporates.com/documentation/API-Reference",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "500 requests per month",
    tags: ["companies", "corporate", "business"]
  },

  // More Educational and Academic APIs
  {
    name: "Internet Archive API",
    description: "Access to digital library and archived content",
    category: "Education",
    url: "https://archive.org/services/docs/api/",
    documentation_url: "https://archive.org/services/docs/api/",
    authentication_required: false,
    free_tier: true,
    tags: ["archive", "books", "history"]
  },
  {
    name: "Google Books API",
    description: "Search and access book information",
    category: "Education",
    url: "https://developers.google.com/books",
    documentation_url: "https://developers.google.com/books/docs/v1/using",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["books", "google", "literature"]
  },
  {
    name: "Goodreads API",
    description: "Book reviews and reading recommendations",
    category: "Education",
    url: "https://www.goodreads.com/api",
    documentation_url: "https://www.goodreads.com/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["books", "reviews", "reading"]
  },

  // More Entertainment and Gaming APIs
  {
    name: "Spotify API",
    description: "Music streaming platform data and controls",
    category: "Music",
    url: "https://developer.spotify.com/documentation/web-api/",
    documentation_url: "https://developer.spotify.com/documentation/web-api/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["spotify", "music", "streaming"],
    featured: true
  },
  {
    name: "Last.fm API",
    description: "Music discovery and listening statistics",
    category: "Music",
    url: "https://www.last.fm/api",
    documentation_url: "https://www.last.fm/api/intro",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["lastfm", "music", "scrobbling"]
  },
  {
    name: "RAWG Video Games API",
    description: "Video game database with 500,000+ games",
    category: "Entertainment",
    url: "https://rawg.io/apidocs",
    documentation_url: "https://api.rawg.io/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "20,000 requests per month",
    tags: ["games", "video-games", "database"]
  },

  // More Financial and Business APIs
  {
    name: "Yahoo Finance API",
    description: "Stock market data and financial information",
    category: "Finance/Crypto",
    url: "https://finance.yahoo.com",
    documentation_url: "https://rapidapi.com/apidojo/api/yahoo-finance1/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["yahoo", "finance", "stocks"]
  },
  {
    name: "Polygon.io",
    description: "Real-time and historical market data",
    category: "Finance/Crypto",
    url: "https://polygon.io",
    documentation_url: "https://polygon.io/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5 calls per minute",
    tags: ["stocks", "market-data", "real-time"]
  },
  {
    name: "Quandl API",
    description: "Financial, economic, and alternative datasets",
    category: "Finance/Crypto",
    url: "https://www.quandl.com",
    documentation_url: "https://docs.quandl.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "50 calls per day",
    tags: ["financial-data", "economics", "datasets"]
  },

  // More Health and Medical APIs
  {
    name: "ClinicalTrials.gov API",
    description: "Information about clinical research studies",
    category: "Health",
    url: "https://clinicaltrials.gov/api/",
    documentation_url: "https://clinicaltrials.gov/api/gui",
    authentication_required: false,
    free_tier: true,
    tags: ["clinical-trials", "research", "medical"]
  },
  {
    name: "WHO Global Health Observatory",
    description: "World Health Organization health statistics",
    category: "Health",
    url: "https://www.who.int/data/gho",
    documentation_url: "https://www.who.int/data/gho/info/gho-odata-api",
    authentication_required: false,
    free_tier: true,
    tags: ["who", "health", "global-statistics"]
  },

  // More Weather and Environment APIs
  {
    name: "AccuWeather API",
    description: "Weather forecasts and severe weather alerts",
    category: "Weather",
    url: "https://developer.accuweather.com",
    documentation_url: "https://developer.accuweather.com/apis",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "50 calls per day",
    tags: ["weather", "forecast", "alerts"]
  },
  {
    name: "Sunrise Sunset API",
    description: "Sunrise and sunset times for any location",
    category: "Weather",
    url: "https://sunrise-sunset.org/api",
    documentation_url: "https://sunrise-sunset.org/api",
    authentication_required: false,
    free_tier: true,
    tags: ["sunrise", "sunset", "solar"]
  },
  {
    name: "Earthquake API",
    description: "Real-time earthquake data from USGS",
    category: "Environment",
    url: "https://earthquake.usgs.gov/fdsnws/event/1/",
    documentation_url: "https://earthquake.usgs.gov/fdsnws/event/1/",
    authentication_required: false,
    free_tier: true,
    tags: ["earthquakes", "usgs", "seismic"]
  },

  // More Technology and Developer APIs
  {
    name: "Firebase API",
    description: "Google's mobile and web development platform",
    category: "Development Tools",
    url: "https://firebase.google.com",
    documentation_url: "https://firebase.google.com/docs/reference/rest",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["firebase", "backend", "google"]
  },
  {
    name: "Heroku API",
    description: "Cloud platform for app deployment and management",
    category: "Development Tools",
    url: "https://devcenter.heroku.com/articles/platform-api-reference",
    documentation_url: "https://devcenter.heroku.com/articles/platform-api-reference",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["heroku", "deployment", "cloud"]
  },
  {
    name: "DigitalOcean API",
    description: "Cloud infrastructure management API",
    category: "Development Tools",
    url: "https://docs.digitalocean.com/reference/api/",
    documentation_url: "https://docs.digitalocean.com/reference/api/",
    authentication_required: true,
    auth_type: "Bearer Token",
    free_tier: true,
    tags: ["digitalocean", "cloud", "infrastructure"]
  },

  // More Utility APIs
  {
    name: "Abstract APIs",
    description: "Collection of utility APIs (email validation, IP geolocation, etc.)",
    category: "Utilities",
    url: "https://www.abstractapi.com",
    documentation_url: "https://docs.abstractapi.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100-1000 requests per month per API",
    tags: ["utilities", "validation", "collection"]
  },
  {
    name: "Hunter.io",
    description: "Email finder and verification API",
    category: "Utilities",
    url: "https://hunter.io",
    documentation_url: "https://hunter.io/api-documentation",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "25 requests per month",
    tags: ["email", "verification", "finder"]
  },
  {
    name: "ZeroBounce API",
    description: "Email validation and deliverability service",
    category: "Utilities",
    url: "https://www.zerobounce.net",
    documentation_url: "https://www.zerobounce.net/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100 validations per month",
    tags: ["email", "validation", "deliverability"]
  },

  // More Food and Recipe APIs
  {
    name: "Edamam Recipe API",
    description: "Recipe search with nutrition analysis",
    category: "Food",
    url: "https://developer.edamam.com",
    documentation_url: "https://developer.edamam.com/edamam-docs-recipe-api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5 calls per minute",
    tags: ["recipes", "nutrition", "food"]
  },
  {
    name: "Recipe Puppy API",
    description: "Recipe search by ingredients",
    category: "Food",
    url: "http://www.recipepuppy.com/about/api/",
    documentation_url: "http://www.recipepuppy.com/about/api/",
    authentication_required: false,
    free_tier: true,
    tags: ["recipes", "ingredients", "cooking"]
  },
  {
    name: "FoodData Central",
    description: "USDA food composition database",
    category: "Food",
    url: "https://fdc.nal.usda.gov",
    documentation_url: "https://fdc.nal.usda.gov/api-guide.html",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["nutrition", "usda", "food-composition"]
  },

  // More Art and Design APIs
  {
    name: "Cooper Hewitt API",
    description: "Smithsonian Design Museum collection",
    category: "Art & Design",
    url: "https://collection.cooperhewitt.org/api/",
    documentation_url: "https://collection.cooperhewitt.org/api/",
    authentication_required: true,
    auth_type: "Access Token",
    free_tier: true,
    tags: ["design", "museum", "smithsonian"]
  },
  {
    name: "Victoria and Albert Museum",
    description: "V&A Museum collection API",
    category: "Art & Design",
    url: "https://www.vam.ac.uk/api",
    documentation_url: "https://www.vam.ac.uk/api",
    authentication_required: false,
    free_tier: true,
    tags: ["art", "museum", "collection"]
  },
  {
    name: "Harvard Art Museums",
    description: "Harvard Art Museums collection data",
    category: "Art & Design",
    url: "https://www.harvardartmuseums.org/collections/api",
    documentation_url: "https://github.com/harvardartmuseums/api-docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["art", "harvard", "museums"]
  },

  // More News and Media APIs
  {
    name: "Associated Press API",
    description: "Global news content from AP",
    category: "News",
    url: "https://developer.ap.org",
    documentation_url: "https://developer.ap.org/ap-content-api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["news", "associated-press", "journalism"]
  },
  {
    name: "BBC News API",
    description: "BBC news articles and content",
    category: "News",
    url: "https://www.bbc.co.uk/developer",
    documentation_url: "https://www.bbc.co.uk/developer",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["bbc", "news", "uk"]
  },
  {
    name: "Reuters API",
    description: "Reuters news and financial content",
    category: "News",
    url: "https://www.reuters.com/tools/api",
    documentation_url: "https://www.reuters.com/tools/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["reuters", "news", "financial"]
  },

  // More Transportation APIs
  {
    name: "Uber API",
    description: "Ride-sharing and delivery platform integration",
    category: "Transportation",
    url: "https://developer.uber.com",
    documentation_url: "https://developer.uber.com/docs/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["uber", "ride-sharing", "transport"]
  },
  {
    name: "Lyft API",
    description: "Ride-sharing platform integration",
    category: "Transportation",
    url: "https://developer.lyft.com",
    documentation_url: "https://developer.lyft.com/docs/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["lyft", "ride-sharing", "transport"]
  },
  {
    name: "Transit API",
    description: "Public transit information worldwide",
    category: "Transportation",
    url: "https://transitland.org",
    documentation_url: "https://www.transit.land/documentation/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["transit", "public-transport", "global"]
  },

  // More AI/ML APIs
  {
    name: "DeepL API",
    description: "Neural machine translation service",
    category: "AI/ML",
    url: "https://www.deepl.com/docs-api",
    documentation_url: "https://www.deepl.com/docs-api/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "500,000 characters per month",
    tags: ["translation", "ai", "neural-networks"]
  },
  {
    name: "Azure Cognitive Services",
    description: "Microsoft's AI and machine learning APIs",
    category: "AI/ML",
    url: "https://azure.microsoft.com/en-us/services/cognitive-services/",
    documentation_url: "https://docs.microsoft.com/en-us/azure/cognitive-services/",
    authentication_required: true,
    auth_type: "Subscription Key",
    free_tier: true,
    tags: ["azure", "cognitive", "microsoft"]
  },
  {
    name: "AWS AI Services",
    description: "Amazon's artificial intelligence APIs",
    category: "AI/ML",
    url: "https://aws.amazon.com/machine-learning/ai-services/",
    documentation_url: "https://docs.aws.amazon.com/ai-services/",
    authentication_required: true,
    auth_type: "AWS Credentials",
    free_tier: true,
    tags: ["aws", "ai", "amazon"]
  },

  // More Productivity APIs
  {
    name: "Slack API",
    description: "Team communication and collaboration platform",
    category: "Productivity",
    url: "https://api.slack.com",
    documentation_url: "https://api.slack.com/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["slack", "communication", "teams"],
    featured: true
  },
  {
    name: "Microsoft Graph API",
    description: "Access Microsoft 365 data and services",
    category: "Productivity",
    url: "https://docs.microsoft.com/en-us/graph/",
    documentation_url: "https://docs.microsoft.com/en-us/graph/api/overview",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["microsoft", "office365", "graph"]
  },
  {
    name: "Google Workspace API",
    description: "Integrate with Google Workspace applications",
    category: "Productivity",
    url: "https://developers.google.com/workspace",
    documentation_url: "https://developers.google.com/workspace/guides",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["google", "workspace", "productivity"]
  },

  // More Language and Translation APIs
  {
    name: "Google Translate API",
    description: "Neural machine translation by Google",
    category: "Language",
    url: "https://cloud.google.com/translate",
    documentation_url: "https://cloud.google.com/translate/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "500,000 characters per month",
    tags: ["google", "translation", "language"]
  },
  {
    name: "Microsoft Translator",
    description: "Real-time text and speech translation",
    category: "Language",
    url: "https://www.microsoft.com/en-us/translator/translatorapi/",
    documentation_url: "https://docs.microsoft.com/en-us/azure/cognitive-services/translator/",
    authentication_required: true,
    auth_type: "Subscription Key",
    free_tier: true,
    rate_limit: "2 million characters per month",
    tags: ["microsoft", "translation", "speech"]
  },
  {
    name: "Language Detection API",
    description: "Detect language of text automatically",
    category: "Language",
    url: "https://ws.detectlanguage.com",
    documentation_url: "https://detectlanguage.com/documentation",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1,000 requests per day",
    tags: ["language-detection", "nlp", "text-analysis"]
  },

  // More Business and E-commerce APIs
  {
    name: "PayPal API",
    description: "Online payment processing and financial services",
    category: "Finance/Crypto",
    url: "https://developer.paypal.com",
    documentation_url: "https://developer.paypal.com/docs/api/overview/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["paypal", "payments", "fintech"]
  },
  {
    name: "Square API",
    description: "Payment processing and point-of-sale solutions",
    category: "Finance/Crypto",
    url: "https://developer.squareup.com",
    documentation_url: "https://developer.squareup.com/docs",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["square", "payments", "pos"]
  },
  {
    name: "Twilio API",
    description: "Communications platform for SMS, voice, and video",
    category: "Communication",
    url: "https://www.twilio.com/docs/api",
    documentation_url: "https://www.twilio.com/docs",
    authentication_required: true,
    auth_type: "Account SID",
    free_tier: true,
    tags: ["twilio", "sms", "communications"]
  },

  // Additional Specialized APIs
  {
    name: "Clearbit API",
    description: "Business intelligence and lead enrichment",
    category: "Business",
    url: "https://clearbit.com/docs",
    documentation_url: "https://dashboard.clearbit.com/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100 requests per month",
    tags: ["enrichment", "business-intelligence", "leads"]
  },
  {
    name: "FullContact API",
    description: "Contact management and identity resolution",
    category: "Business",
    url: "https://www.fullcontact.com/developer/",
    documentation_url: "https://docs.fullcontact.com/",
    authentication_required: true,
    auth_type: "Bearer Token",
    free_tier: true,
    rate_limit: "100 requests per month",
    tags: ["contacts", "identity", "person-api"]
  }
];

async function addFinalBatchAPIs() {
  console.log('Starting to add final batch of research APIs...');
  console.log(`Total APIs to add: ${finalBatchAPIs.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < finalBatchAPIs.length; i++) {
    const api = finalBatchAPIs[i];
    
    console.log(`Adding API ${i + 1}/${finalBatchAPIs.length}: ${api.name}`);
    
    try {
      const { data, error } = await supabase
        .from('apis')
        .insert([{
          ...api,
          added_by: 'research-expansion-final'
        }]);
      
      if (error) {
        console.error(`❌ Error adding ${api.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Successfully added ${api.name} (${api.category})`);
        successCount++;
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error(`❌ Exception adding ${api.name}:`, error);
      errorCount++;
    }
  }
  
  console.log('\n🎉 Final batch API addition completed!');
  console.log(`✅ Successfully added: ${successCount} APIs`);
  console.log(`❌ Errors: ${errorCount} APIs`);
  
  // Get updated count
  const { count } = await supabase
    .from('apis')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📊 Total APIs in database: ${count}`);
  
  // Get count by category
  const { data: categoryData } = await supabase
    .from('apis')
    .select('category');
  
  if (categoryData) {
    const categoryCounts: Record<string, number> = {};
    categoryData.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    
    console.log('\n📈 Final APIs by category:');
    Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
      });
  }
  
  console.log('\n🎊 API DATABASE EXPANSION COMPLETED! 🎊');
  console.log('The API directory has been successfully expanded with research-discovered APIs.');
}

// Run the final addition script
addFinalBatchAPIs();