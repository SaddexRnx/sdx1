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

const additionalAPIs: APIData[] = [
  // Science and Reference APIs
  {
    name: "arXiv API",
    description: "Search and access research papers from arXiv.org",
    category: "Education",
    url: "https://arxiv.org",
    documentation_url: "https://arxiv.org/help/api/",
    authentication_required: false,
    free_tier: true,
    tags: ["research", "papers", "science"],
    featured: true
  },
  {
    name: "PubMed API",
    description: "Search biomedical literature from PubMed database",
    category: "Health",
    url: "https://www.ncbi.nlm.nih.gov/home/develop/api/",
    documentation_url: "https://www.ncbi.nlm.nih.gov/books/NBK25501/",
    authentication_required: false,
    free_tier: true,
    tags: ["pubmed", "medical", "research"]
  },
  {
    name: "Crossref API",
    description: "Scholarly metadata for publications and citations",
    category: "Education",
    url: "https://www.crossref.org",
    documentation_url: "https://github.com/CrossRef/rest-api-doc",
    authentication_required: false,
    free_tier: true,
    tags: ["citations", "publications", "doi"]
  },

  // Social and Communication APIs
  {
    name: "Telegram Bot API",
    description: "Create bots for Telegram messaging platform",
    category: "Social Media",
    url: "https://core.telegram.org/bots/api",
    documentation_url: "https://core.telegram.org/bots/api",
    authentication_required: true,
    auth_type: "Bot Token",
    free_tier: true,
    tags: ["telegram", "bots", "messaging"]
  },
  {
    name: "WhatsApp Business API",
    description: "Send and receive WhatsApp messages for business",
    category: "Social Media",
    url: "https://developers.facebook.com/docs/whatsapp",
    documentation_url: "https://developers.facebook.com/docs/whatsapp",
    authentication_required: true,
    auth_type: "Access Token",
    free_tier: true,
    tags: ["whatsapp", "messaging", "business"]
  },
  {
    name: "Mastodon API",
    description: "Interact with Mastodon decentralized social network",
    category: "Social Media",
    url: "https://docs.joinmastodon.org/api/",
    documentation_url: "https://docs.joinmastodon.org/api/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["mastodon", "social", "decentralized"]
  },

  // Gaming and Entertainment APIs
  {
    name: "Steam Web API",
    description: "Access Steam gaming platform data",
    category: "Entertainment",
    url: "https://steamcommunity.com/dev",
    documentation_url: "https://steamcommunity.com/dev",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["steam", "gaming", "games"]
  },
  {
    name: "BoardGameGeek API",
    description: "Board game information and statistics",
    category: "Entertainment",
    url: "https://boardgamegeek.com/wiki/page/BGG_XML_API2",
    documentation_url: "https://boardgamegeek.com/wiki/page/BGG_XML_API2",
    authentication_required: false,
    free_tier: true,
    tags: ["board-games", "games", "statistics"]
  },
  {
    name: "Twitch API",
    description: "Access Twitch streaming platform data",
    category: "Entertainment",
    url: "https://dev.twitch.tv/docs/api/",
    documentation_url: "https://dev.twitch.tv/docs/api/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["twitch", "streaming", "gaming"]
  },

  // Transportation APIs
  {
    name: "OpenSky Network",
    description: "Real-time air traffic data and flight tracking",
    category: "Transportation",
    url: "https://opensky-network.org",
    documentation_url: "https://opensky-network.org/apidoc/",
    authentication_required: false,
    free_tier: true,
    tags: ["flights", "aviation", "tracking"]
  },
  {
    name: "AviationStack",
    description: "Real-time flight status and aviation data",
    category: "Transportation",
    url: "https://aviationstack.com",
    documentation_url: "https://aviationstack.com/documentation",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1,000 requests per month",
    tags: ["aviation", "flights", "airports"]
  },
  {
    name: "Public Transport API",
    description: "European public transport information",
    category: "Transportation",
    url: "https://transport.rest",
    documentation_url: "https://transport.rest/",
    authentication_required: false,
    free_tier: true,
    tags: ["public-transport", "europe", "transit"]
  },

  // Environmental and Nature APIs
  {
    name: "AirVisual API",
    description: "Air quality data worldwide",
    category: "Environment",
    url: "https://www.iqair.com/air-pollution-data-api",
    documentation_url: "https://www.iqair.com/air-pollution-data-api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "10,000 calls per month",
    tags: ["air-quality", "pollution", "environment"]
  },
  {
    name: "World Air Quality Index",
    description: "Real-time air pollution data",
    category: "Environment",
    url: "https://aqicn.org/api/",
    documentation_url: "https://aqicn.org/api/",
    authentication_required: true,
    auth_type: "Token",
    free_tier: true,
    tags: ["air-quality", "pollution", "aqi"]
  },
  {
    name: "Carbon Interface",
    description: "Calculate carbon emissions for various activities",
    category: "Environment",
    url: "https://www.carboninterface.com",
    documentation_url: "https://docs.carboninterface.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "200 requests per month",
    tags: ["carbon", "emissions", "sustainability"]
  },

  // Government and Open Data APIs
  {
    name: "FBI Crime Data",
    description: "US crime statistics and data",
    category: "Government",
    url: "https://cde.ucr.cjis.gov",
    documentation_url: "https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/docApi",
    authentication_required: false,
    free_tier: true,
    tags: ["crime", "fbi", "statistics"]
  },
  {
    name: "FEC API",
    description: "Federal Election Commission data",
    category: "Government",
    url: "https://api.open.fec.gov",
    documentation_url: "https://api.open.fec.gov/developers/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["elections", "campaign-finance", "politics"]
  },
  {
    name: "USASpending API",
    description: "Federal spending data",
    category: "Government",
    url: "https://api.usaspending.gov",
    documentation_url: "https://api.usaspending.gov/",
    authentication_required: false,
    free_tier: true,
    tags: ["spending", "government", "transparency"]
  },

  // E-commerce and Business APIs
  {
    name: "Etsy API",
    description: "Access Etsy marketplace data",
    category: "E-commerce",
    url: "https://developers.etsy.com",
    documentation_url: "https://developers.etsy.com/documentation/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["etsy", "marketplace", "handmade"]
  },
  {
    name: "eBay API",
    description: "eBay marketplace integration",
    category: "E-commerce",
    url: "https://developer.ebay.com",
    documentation_url: "https://developer.ebay.com/api-docs/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["ebay", "marketplace", "auctions"]
  },
  {
    name: "Stripe API",
    description: "Online payment processing",
    category: "Finance/Crypto",
    url: "https://stripe.com/docs/api",
    documentation_url: "https://stripe.com/docs/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["payments", "stripe", "fintech"],
    featured: true
  },

  // Productivity and Communication APIs
  {
    name: "Trello API",
    description: "Project management and organization boards",
    category: "Productivity",
    url: "https://developer.atlassian.com/cloud/trello/",
    documentation_url: "https://developer.atlassian.com/cloud/trello/rest/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["trello", "project-management", "productivity"]
  },
  {
    name: "Notion API",
    description: "Access and modify Notion workspace content",
    category: "Productivity",
    url: "https://developers.notion.com",
    documentation_url: "https://developers.notion.com/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["notion", "notes", "productivity"]
  },
  {
    name: "Todoist API",
    description: "Task management and productivity",
    category: "Productivity",
    url: "https://developer.todoist.com",
    documentation_url: "https://developer.todoist.com/",
    authentication_required: true,
    auth_type: "Bearer Token",
    free_tier: true,
    tags: ["tasks", "productivity", "todo"]
  },

  // Image and Media Processing APIs
  {
    name: "Remove.bg",
    description: "AI-powered background removal from images",
    category: "Media",
    url: "https://www.remove.bg/api",
    documentation_url: "https://www.remove.bg/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "50 images per month",
    tags: ["image-processing", "background-removal", "ai"]
  },
  {
    name: "TinyPNG API",
    description: "Image compression and optimization",
    category: "Media",
    url: "https://tinypng.com/developers",
    documentation_url: "https://tinypng.com/developers",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "500 compressions per month",
    tags: ["image-compression", "optimization", "png"]
  },
  {
    name: "Cloudinary API",
    description: "Image and video management in the cloud",
    category: "Media",
    url: "https://cloudinary.com",
    documentation_url: "https://cloudinary.com/documentation",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["images", "videos", "cloud-storage"]
  },

  // Analytics and Monitoring APIs
  {
    name: "Google Analytics API",
    description: "Access Google Analytics data programmatically",
    category: "Analytics",
    url: "https://developers.google.com/analytics",
    documentation_url: "https://developers.google.com/analytics/devguides/reporting",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["analytics", "google", "metrics"]
  },
  {
    name: "Mixpanel API",
    description: "Product analytics and user behavior tracking",
    category: "Analytics",
    url: "https://developer.mixpanel.com",
    documentation_url: "https://developer.mixpanel.com/reference/",
    authentication_required: true,
    auth_type: "API Secret",
    free_tier: true,
    tags: ["analytics", "events", "tracking"]
  },

  // Email and Marketing APIs
  {
    name: "SendGrid API",
    description: "Email delivery and marketing platform",
    category: "Communication",
    url: "https://sendgrid.com/docs/api-reference/",
    documentation_url: "https://sendgrid.com/docs/api-reference/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100 emails per day",
    tags: ["email", "sendgrid", "marketing"]
  },
  {
    name: "Mailchimp API",
    description: "Email marketing and automation",
    category: "Communication",
    url: "https://mailchimp.com/developer/",
    documentation_url: "https://mailchimp.com/developer/marketing/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["email", "marketing", "automation"]
  },

  // More Fun and Random APIs
  {
    name: "Corporate Bullshit Generator",
    description: "Generate corporate buzzword phrases",
    category: "Fun",
    url: "https://corporatebs-generator.sameerkumar.website",
    documentation_url: "https://github.com/sameerkumar18/corporate-bs-generator-api",
    authentication_required: false,
    free_tier: true,
    tags: ["humor", "corporate", "buzzwords"]
  },
  {
    name: "Yes No Maybe",
    description: "Get yes, no, or maybe answers with GIFs",
    category: "Fun",
    url: "https://yesno.wtf/api",
    documentation_url: "https://yesno.wtf/api",
    authentication_required: false,
    free_tier: true,
    tags: ["decisions", "yes-no", "gifs"]
  },
  {
    name: "Bored API Alternative",
    description: "Activity suggestions to cure boredom",
    category: "Fun",
    url: "https://www.boredapi.com/api/activity",
    documentation_url: "https://www.boredapi.com/documentation",
    authentication_required: false,
    free_tier: true,
    tags: ["activities", "boredom", "suggestions"]
  },

  // Technology and Geek APIs
  {
    name: "Is It Up?",
    description: "Check if a website is online or down",
    category: "Utilities",
    url: "https://isitup.org",
    documentation_url: "https://isitup.org/api/api.html",
    authentication_required: false,
    free_tier: true,
    tags: ["uptime", "monitoring", "status"]
  },
  {
    name: "IP Geolocation API",
    description: "Detailed IP address information and geolocation",
    category: "Utilities",
    url: "https://ipgeolocation.io",
    documentation_url: "https://ipgeolocation.io/documentation/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1,000 requests per month",
    tags: ["ip", "geolocation", "location"]
  },
  {
    name: "LinkPreview API",
    description: "Generate link previews with metadata",
    category: "Utilities",
    url: "https://www.linkpreview.net",
    documentation_url: "https://www.linkpreview.net/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1,000 requests per month",
    tags: ["links", "previews", "metadata"]
  },

  // More Educational APIs
  {
    name: "Khan Academy API",
    description: "Educational content and learning data",
    category: "Education",
    url: "https://github.com/Khan/khan-api",
    documentation_url: "https://github.com/Khan/khan-api/wiki",
    authentication_required: true,
    auth_type: "OAuth 1.0",
    free_tier: true,
    tags: ["education", "learning", "khan-academy"]
  },
  {
    name: "Coursera API",
    description: "Access course information and learning data",
    category: "Education",
    url: "https://tech.coursera.org/app-platform/catalog/",
    documentation_url: "https://tech.coursera.org/app-platform/catalog/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["courses", "education", "learning"]
  },

  // Additional Weather APIs
  {
    name: "Visual Crossing Weather",
    description: "Historical and forecast weather data",
    category: "Weather",
    url: "https://www.visualcrossing.com",
    documentation_url: "https://www.visualcrossing.com/resources/documentation/weather-api/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1,000 requests per day",
    tags: ["weather", "forecast", "historical"]
  },
  {
    name: "Tomorrow.io Weather",
    description: "Hyperlocal weather forecasting API",
    category: "Weather",
    url: "https://www.tomorrow.io",
    documentation_url: "https://docs.tomorrow.io/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "500 requests per day",
    tags: ["weather", "hyperlocal", "forecast"]
  },

  // More Health and Medical APIs
  {
    name: "MedlinePlus API",
    description: "Health information from the National Library of Medicine",
    category: "Health",
    url: "https://medlineplus.gov",
    documentation_url: "https://medlineplus.gov/xml.html",
    authentication_required: false,
    free_tier: true,
    tags: ["health", "medical", "information"]
  },
  {
    name: "Drug Bank API",
    description: "Comprehensive drug and drug target database",
    category: "Health",
    url: "https://go.drugbank.com",
    documentation_url: "https://docs.drugbank.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["drugs", "pharmaceuticals", "medical"]
  },

  // Sports APIs
  {
    name: "ESPN API",
    description: "Sports scores, news, and statistics",
    category: "Sports",
    url: "http://www.espn.com/apis/devcenter",
    documentation_url: "http://www.espn.com/static/apis/devcenter/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["sports", "espn", "scores"]
  },
  {
    name: "NHL API",
    description: "Official NHL hockey data",
    category: "Sports",
    url: "https://github.com/erunion/sport-api-specifications/tree/master/nhl",
    documentation_url: "https://github.com/erunion/sport-api-specifications/tree/master/nhl",
    authentication_required: false,
    free_tier: true,
    tags: ["hockey", "nhl", "sports"]
  },

  // More AI/ML APIs
  {
    name: "Clarifai API",
    description: "Computer vision and machine learning",
    category: "AI/ML",
    url: "https://www.clarifai.com",
    documentation_url: "https://docs.clarifai.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5,000 operations per month",
    tags: ["computer-vision", "ai", "machine-learning"]
  },
  {
    name: "AssemblyAI",
    description: "Speech-to-text and audio intelligence API",
    category: "AI/ML",
    url: "https://www.assemblyai.com",
    documentation_url: "https://www.assemblyai.com/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5 hours per month",
    tags: ["speech-to-text", "audio", "ai"]
  },

  // More Development Tools
  {
    name: "Postman API",
    description: "API development and testing platform",
    category: "Development Tools",
    url: "https://www.postman.com",
    documentation_url: "https://docs.api.getpostman.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["api-testing", "development", "postman"]
  },
  {
    name: "Insomnia API",
    description: "API design and testing tool",
    category: "Development Tools",
    url: "https://insomnia.rest",
    documentation_url: "https://docs.insomnia.rest/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["api-testing", "design", "development"]
  }
];

async function addAdditionalAPIs() {
  console.log('Starting to add additional research APIs...');
  console.log(`Total APIs to add: ${additionalAPIs.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < additionalAPIs.length; i++) {
    const api = additionalAPIs[i];
    
    console.log(`Adding API ${i + 1}/${additionalAPIs.length}: ${api.name}`);
    
    try {
      const { data, error } = await supabase
        .from('apis')
        .insert([{
          ...api,
          added_by: 'research-expansion-batch2'
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
  
  console.log('\n🎉 Additional API addition completed!');
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
    
    console.log('\n📈 APIs by category:');
    Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
      });
  }
}

// Run the addition script
addAdditionalAPIs();