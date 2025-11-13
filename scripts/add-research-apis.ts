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

// Existing APIs to avoid duplicates (based on database query)
const existingAPIs = new Set([
  'JSONPlaceholder', 'REST Countries', 'HTTP Status Codes', 'IP Geolocation',
  'Public APIs', 'UUID Generator', 'Random Data', 'OpenWeatherMap', 'WeatherAPI',
  'MetaWeather', '7Timer!', 'Twitter API v2', 'Reddit API', 'Instagram Basic Display',
  'Discord API', 'CoinGecko', 'Alpha Vantage', 'Fixer.io', 'IEX Cloud', 'CoinAPI',
  'TMDB (The Movie Database)', 'OMDb API', 'TV Maze', 'JokeAPI', 'Chuck Norris Facts',
  'Unsplash', 'Pixabay', 'Pexels', 'Giphy', 'Google Maps', 'OpenStreetMap Nominatim',
  'MapBox', 'GeoNames', 'OpenAI API', 'Hugging Face', 'Google Vision AI', 'IBM Watson',
  'OpenFDA', 'Disease.sh', 'Nutritionix', 'USDA Food Data Central', 'NewsAPI',
  'Guardian API', 'New York Times', 'Hacker News', 'GitHub API', 'Stack Overflow',
  'GitLab API', 'npm Registry', 'Shopify API', 'WooCommerce', 'Amazon Product Advertising',
  'Cat Facts', 'Dog API', 'Bored API', 'Advice Slip', 'Numbers API', 'Wolfram Alpha',
  'Open Library', 'NASA API', 'Quotable', 'QR Server', 'TinyURL', 'Have I Been Pwned',
  'Lorem Picsum', 'JSON Storage'
]);

const researchAPIs: APIData[] = [
  // From Reddit Research - Popular Community Recommendations
  {
    name: "RandomUser",
    description: "Generate random realistic user data for testing and prototyping",
    category: "General",
    url: "https://randomuser.me",
    documentation_url: "https://randomuser.me/documentation",
    authentication_required: false,
    free_tier: true,
    tags: ["testing", "fake-data", "users"],
    featured: true
  },
  {
    name: "ZenQuotes",
    description: "Inspirational quotes API with categories and daily quotes",
    category: "General",
    url: "https://zenquotes.io",
    documentation_url: "https://zenquotes.io/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5 requests per 30 seconds",
    tags: ["quotes", "inspiration", "daily"]
  },
  {
    name: "IPify",
    description: "Simple IP address geolocation API",
    category: "Utilities",
    url: "https://www.ipify.org",
    documentation_url: "https://www.ipify.org/",
    authentication_required: false,
    free_tier: true,
    tags: ["ip", "geolocation", "network"]
  },
  {
    name: "Random Quotes",
    description: "Famous quotes API with author information",
    category: "General",
    url: "https://api.quotegarden.com",
    documentation_url: "https://quotegarden.com/api/v3/",
    authentication_required: false,
    free_tier: true,
    tags: ["quotes", "authors", "wisdom"]
  },
  {
    name: "JSONBin",
    description: "Simple JSON storage and hosting service",
    category: "Utilities",
    url: "https://jsonbin.io",
    documentation_url: "https://jsonbin.io/api-reference",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "10,000 requests per month",
    tags: ["storage", "json", "database"]
  },
  {
    name: "Faker API",
    description: "Generate fake data for testing purposes",
    category: "General",
    url: "https://fakerapi.it",
    documentation_url: "https://fakerapi.it/api",
    authentication_required: false,
    free_tier: true,
    tags: ["fake-data", "testing", "development"]
  },

  // From GitHub Research - APIs.guru and Public APIs
  {
    name: "PokeAPI",
    description: "RESTful API for Pokemon data - species, moves, abilities, and more",
    category: "Entertainment",
    url: "https://pokeapi.co",
    documentation_url: "https://pokeapi.co/docs/v2",
    authentication_required: false,
    free_tier: true,
    tags: ["pokemon", "games", "anime"],
    featured: true
  },
  {
    name: "SWAPI",
    description: "The Star Wars API - comprehensive Star Wars data",
    category: "Entertainment",
    url: "https://swapi.dev",
    documentation_url: "https://swapi.dev/documentation",
    authentication_required: false,
    free_tier: true,
    tags: ["star-wars", "movies", "characters"]
  },
  {
    name: "Fun Translations",
    description: "Translate text into various fun languages like Yoda, Klingon, Pig Latin",
    category: "Entertainment",
    url: "https://funtranslations.com/api",
    documentation_url: "https://funtranslations.com/api/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "60 requests per hour",
    tags: ["translation", "fun", "languages"]
  },
  {
    name: "Evil Insult Generator",
    description: "Generate creative insults and comebacks",
    category: "Fun",
    url: "https://evilinsult.com/api",
    documentation_url: "https://evilinsult.com/api/",
    authentication_required: false,
    free_tier: true,
    tags: ["humor", "insults", "comedy"]
  },
  {
    name: "Kanye Rest",
    description: "Random Kanye West quotes API",
    category: "Fun",
    url: "https://api.kanye.rest",
    documentation_url: "https://github.com/ajzbc/kanye.rest",
    authentication_required: false,
    free_tier: true,
    tags: ["quotes", "kanye-west", "humor"]
  },
  {
    name: "Dad Jokes",
    description: "Random dad jokes API with various response formats",
    category: "Fun",
    url: "https://icanhazdadjoke.com",
    documentation_url: "https://icanhazdadjoke.com/api",
    authentication_required: false,
    free_tier: true,
    tags: ["jokes", "humor", "dad-jokes"]
  },

  // From Technical Directories Research - Mock and Testing APIs
  {
    name: "Mockoon",
    description: "Mock API server for rapid prototyping and testing",
    category: "Development Tools",
    url: "https://mockoon.com",
    documentation_url: "https://mockoon.com/docs/latest/",
    authentication_required: false,
    free_tier: true,
    tags: ["mocking", "testing", "prototyping"]
  },
  {
    name: "Mocky",
    description: "Generate custom HTTP responses for testing",
    category: "Development Tools",
    url: "https://mocky.io",
    documentation_url: "https://mocky.io/",
    authentication_required: false,
    free_tier: true,
    tags: ["mocking", "http", "testing"]
  },
  {
    name: "Beeceptor",
    description: "REST and SOAP API mock server with real-time debugging",
    category: "Development Tools",
    url: "https://beeceptor.com",
    documentation_url: "https://beeceptor.com/docs/",
    authentication_required: false,
    free_tier: true,
    tags: ["mocking", "debugging", "api-testing"]
  },
  {
    name: "FakeStoreAPI",
    description: "Fake e-commerce API for testing and prototyping",
    category: "E-commerce",
    url: "https://fakestoreapi.com",
    documentation_url: "https://fakestoreapi.com/docs",
    authentication_required: false,
    free_tier: true,
    tags: ["e-commerce", "fake-data", "testing"]
  },
  {
    name: "DummyJSON",
    description: "Fake REST API with realistic data for development",
    category: "General",
    url: "https://dummyjson.com",
    documentation_url: "https://dummyjson.com/docs",
    authentication_required: false,
    free_tier: true,
    tags: ["fake-data", "json", "testing"]
  },

  // From Specialized Sources Research - Government and Academic APIs
  {
    name: "US Census Bureau",
    description: "Access to US demographic, economic, and geographic data",
    category: "General",
    url: "https://www.census.gov/data/developers/data-sets.html",
    documentation_url: "https://www.census.gov/data/developers.html",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["census", "demographics", "government"],
    featured: true
  },
  {
    name: "OECD API",
    description: "International economic and social statistics via SDMX standard",
    category: "General",
    url: "https://data.oecd.org",
    documentation_url: "https://www.oecd.org/en/data/insights/data-explainers/2024/09/api.html",
    authentication_required: false,
    free_tier: true,
    tags: ["oecd", "statistics", "economics"]
  },
  {
    name: "Data.gov",
    description: "US government open data catalog and APIs",
    category: "General",
    url: "https://api.data.gov",
    documentation_url: "https://api.data.gov/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["government", "open-data", "catalog"]
  },

  // Mapping and Geographic APIs (Alternatives to Google Maps)
  {
    name: "HERE Maps",
    description: "Comprehensive mapping, geocoding, and routing services",
    category: "Maps/Geography",
    url: "https://developer.here.com",
    documentation_url: "https://www.here.com/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "250,000 transactions per month",
    tags: ["maps", "geocoding", "routing"],
    featured: true
  },
  {
    name: "TomTom Maps",
    description: "Maps, places, routing, and traffic APIs",
    category: "Maps/Geography",
    url: "https://developer.tomtom.com",
    documentation_url: "https://developer.tomtom.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "2,500 requests per day",
    tags: ["maps", "traffic", "places"]
  },
  {
    name: "OpenCage Geocoding",
    description: "Worldwide geocoding API with 40+ data sources",
    category: "Maps/Geography",
    url: "https://opencagedata.com",
    documentation_url: "https://opencagedata.com/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "2,500 requests per day",
    tags: ["geocoding", "addresses", "coordinates"]
  },
  {
    name: "LocationIQ",
    description: "Geocoding, maps, and routing API",
    category: "Maps/Geography",
    url: "https://locationiq.com",
    documentation_url: "https://locationiq.com/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5,000 requests per day",
    tags: ["geocoding", "maps", "routing"]
  },
  {
    name: "MapTiler",
    description: "Global maps, geocoding, and geolocation services",
    category: "Maps/Geography",
    url: "https://www.maptiler.com",
    documentation_url: "https://docs.maptiler.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100,000 requests per month",
    tags: ["maps", "tiles", "geocoding"]
  },
  {
    name: "Open-Meteo",
    description: "Open-source weather API with historical data and forecasts",
    category: "Weather",
    url: "https://open-meteo.com",
    documentation_url: "https://open-meteo.com/en/docs",
    authentication_required: false,
    free_tier: true,
    tags: ["weather", "forecast", "climate"]
  },

  // Health and Medical APIs
  {
    name: "FHIR Test Server",
    description: "Free FHIR server for healthcare interoperability testing",
    category: "Health",
    url: "https://hapi.fhir.org",
    documentation_url: "https://hapifhir.io/hapi-fhir/docs/",
    authentication_required: false,
    free_tier: true,
    tags: ["fhir", "healthcare", "medical"]
  },
  {
    name: "RxNorm",
    description: "Normalized names for clinical drugs from the US National Library of Medicine",
    category: "Health",
    url: "https://rxnav.nlm.nih.gov",
    documentation_url: "https://rxnav.nlm.nih.gov/RxNormAPIs.html",
    authentication_required: false,
    free_tier: true,
    tags: ["drugs", "medication", "medical"]
  },

  // Financial APIs
  {
    name: "Finnhub",
    description: "Real-time stock market, forex and crypto API",
    category: "Finance/Crypto",
    url: "https://finnhub.io",
    documentation_url: "https://finnhub.io/docs/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "60 calls per minute",
    tags: ["stocks", "forex", "financial-data"],
    featured: true
  },
  {
    name: "ExchangeRate-API",
    description: "Free currency exchange rates and conversion",
    category: "Finance/Crypto",
    url: "https://www.exchangerate-api.com",
    documentation_url: "https://www.exchangerate-api.com/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1,500 requests per month",
    tags: ["currency", "exchange-rates", "forex"]
  },
  {
    name: "CurrencyAPI",
    description: "Foreign exchange rates and currency conversion",
    category: "Finance/Crypto",
    url: "https://currencyapi.com",
    documentation_url: "https://currencyapi.com/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "300 requests per month",
    tags: ["currency", "rates", "conversion"]
  },

  // Developer and Programming APIs
  {
    name: "Programming Quotes",
    description: "Inspirational and funny programming quotes",
    category: "Development Tools",
    url: "https://programming-quotes-api.herokuapp.com",
    documentation_url: "https://github.com/skolakoda/programming-quotes-api",
    authentication_required: false,
    free_tier: true,
    tags: ["quotes", "programming", "inspiration"]
  },
  {
    name: "HTTPie API",
    description: "Test HTTP requests and responses",
    category: "Development Tools",
    url: "https://httpie.io/api",
    documentation_url: "https://httpie.io/docs/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["http", "testing", "debugging"]
  },
  {
    name: "ReqRes",
    description: "Hosted REST API for testing and prototyping",
    category: "Development Tools",
    url: "https://reqres.in",
    documentation_url: "https://reqres.in/",
    authentication_required: false,
    free_tier: true,
    tags: ["testing", "rest", "prototyping"]
  },

  // Educational APIs
  {
    name: "Universities API",
    description: "Search for universities by name and country",
    category: "Education",
    url: "http://universities.hipolabs.com",
    documentation_url: "https://github.com/hipo/university-domains-list",
    authentication_required: false,
    free_tier: true,
    tags: ["universities", "education", "search"]
  },
  {
    name: "World University Rankings",
    description: "University rankings and information API",
    category: "Education",
    url: "https://rapidapi.com/adnan-umer7/api/world-university-rankings",
    documentation_url: "https://rapidapi.com/adnan-umer7/api/world-university-rankings",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["universities", "rankings", "education"]
  },

  // Art and Culture APIs
  {
    name: "Metropolitan Museum API",
    description: "Access to The Met's collection of artworks",
    category: "Art & Design",
    url: "https://metmuseum.github.io",
    documentation_url: "https://metmuseum.github.io/",
    authentication_required: false,
    free_tier: true,
    tags: ["art", "museum", "culture"],
    featured: true
  },
  {
    name: "Rijksmuseum API",
    description: "Dutch art and history collection from the Rijksmuseum",
    category: "Art & Design",
    url: "https://www.rijksmuseum.nl/en/api",
    documentation_url: "https://data.rijksmuseum.nl/object-metadata/api/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["art", "dutch", "history"]
  },
  {
    name: "Art Institute of Chicago",
    description: "Access to the Art Institute of Chicago's collection",
    category: "Art & Design",
    url: "https://api.artic.edu",
    documentation_url: "https://api.artic.edu/docs/",
    authentication_required: false,
    free_tier: true,
    tags: ["art", "museum", "chicago"]
  },

  // Sports APIs
  {
    name: "Football-Data.org",
    description: "Football (soccer) data including leagues, teams, and matches",
    category: "Sports",
    url: "https://www.football-data.org",
    documentation_url: "https://www.football-data.org/documentation/quickstart",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "10 requests per minute",
    tags: ["football", "soccer", "sports"]
  },
  {
    name: "TheSportsDB",
    description: "Sports data including teams, players, and leagues",
    category: "Sports",
    url: "https://www.thesportsdb.com",
    documentation_url: "https://www.thesportsdb.com/api.php",
    authentication_required: false,
    free_tier: true,
    tags: ["sports", "teams", "leagues"]
  },

  // Food and Recipe APIs
  {
    name: "Spoonacular",
    description: "Recipe and food API with nutrition information",
    category: "Food",
    url: "https://spoonacular.com/food-api",
    documentation_url: "https://spoonacular.com/food-api/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "150 requests per day",
    tags: ["recipes", "food", "nutrition"]
  },
  {
    name: "TheMealDB",
    description: "Free meal and recipe database",
    category: "Food",
    url: "https://www.themealdb.com",
    documentation_url: "https://www.themealdb.com/api.php",
    authentication_required: false,
    free_tier: true,
    tags: ["meals", "recipes", "cooking"]
  },

  // Music APIs
  {
    name: "Lyrics.ovh",
    description: "Get song lyrics by artist and song title",
    category: "Music",
    url: "https://lyrics.ovh",
    documentation_url: "https://lyricsovh.docs.apiary.io/",
    authentication_required: false,
    free_tier: true,
    tags: ["lyrics", "music", "songs"]
  },
  {
    name: "MusicBrainz",
    description: "Open music encyclopedia with artist, album, and track information",
    category: "Music",
    url: "https://musicbrainz.org",
    documentation_url: "https://musicbrainz.org/doc/MusicBrainz_API",
    authentication_required: false,
    free_tier: true,
    tags: ["music", "database", "metadata"]
  },

  // Color and Design APIs
  {
    name: "Colormind",
    description: "AI-powered color palette generator",
    category: "Art & Design",
    url: "http://colormind.io",
    documentation_url: "http://colormind.io/api-access/",
    authentication_required: false,
    free_tier: true,
    tags: ["colors", "palette", "design"]
  },
  {
    name: "ColorAPI",
    description: "Color information and palette generation",
    category: "Art & Design",
    url: "https://www.thecolorapi.com",
    documentation_url: "https://www.thecolorapi.com/docs",
    authentication_required: false,
    free_tier: true,
    tags: ["colors", "design", "palette"]
  },

  // Language and Translation APIs
  {
    name: "MyMemory Translation",
    description: "Free translation API supporting 100+ languages",
    category: "Language",
    url: "https://mymemory.translated.net",
    documentation_url: "https://mymemory.translated.net/doc/spec.php",
    authentication_required: false,
    free_tier: true,
    rate_limit: "100 requests per day",
    tags: ["translation", "languages", "text"]
  },
  {
    name: "Yandex.Translate",
    description: "Text translation API supporting 90+ languages",
    category: "Language",
    url: "https://translate.yandex.com/developers",
    documentation_url: "https://yandex.com/dev/translate/doc/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1 million characters per month",
    tags: ["translation", "yandex", "multilingual"]
  },

  // QR Code and Utilities
  {
    name: "QR Code Generator",
    description: "Generate QR codes with customization options",
    category: "Utilities",
    url: "https://goqr.me/api",
    documentation_url: "https://goqr.me/api/doc/create-qr-code/",
    authentication_required: false,
    free_tier: true,
    tags: ["qr-code", "generator", "barcode"]
  },
  {
    name: "PDF24 Tools",
    description: "PDF manipulation and conversion API",
    category: "Utilities",
    url: "https://developer.pdf24.org",
    documentation_url: "https://developer.pdf24.org/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["pdf", "conversion", "documents"]
  },

  // Blockchain and Crypto (additional)
  {
    name: "CoinCap",
    description: "Real-time cryptocurrency market data",
    category: "Finance/Crypto",
    url: "https://coincap.io",
    documentation_url: "https://docs.coincap.io/",
    authentication_required: false,
    free_tier: true,
    tags: ["cryptocurrency", "market-data", "prices"]
  },
  {
    name: "Messari",
    description: "Crypto market intelligence and research data",
    category: "Finance/Crypto",
    url: "https://messari.io",
    documentation_url: "https://messari.io/api/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "20 requests per minute",
    tags: ["crypto", "research", "analytics"]
  },

  // Time and Date APIs
  {
    name: "WorldTimeAPI",
    description: "Simple timezone and time API",
    category: "Utilities",
    url: "https://worldtimeapi.org",
    documentation_url: "https://worldtimeapi.org/pages/examples",
    authentication_required: false,
    free_tier: true,
    tags: ["time", "timezone", "datetime"]
  },
  {
    name: "TimeZoneDB",
    description: "Time zone information and conversion API",
    category: "Utilities",
    url: "https://timezonedb.com",
    documentation_url: "https://timezonedb.com/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1 request per second",
    tags: ["timezone", "time", "conversion"]
  },

  // Additional categories
  {
    name: "Random Data API",
    description: "Generate random data for various use cases",
    category: "General",
    url: "https://random-data-api.com",
    documentation_url: "https://random-data-api.com/documentation",
    authentication_required: false,
    free_tier: true,
    tags: ["random", "data", "generator"]
  },
  {
    name: "This Person Does Not Exist",
    description: "AI-generated human faces",
    category: "Media",
    url: "https://thispersondoesnotexist.com",
    documentation_url: "https://github.com/NVlabs/stylegan",
    authentication_required: false,
    free_tier: true,
    tags: ["ai", "faces", "images"]
  }
];

async function addResearchAPIs() {
  console.log('Starting to add research-discovered APIs...');
  console.log(`Total APIs to add: ${researchAPIs.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < researchAPIs.length; i++) {
    const api = researchAPIs[i];
    
    // Skip if already exists
    if (existingAPIs.has(api.name)) {
      console.log(`⚠️  Skipping ${api.name} - already exists`);
      continue;
    }
    
    console.log(`Adding API ${i + 1}/${researchAPIs.length}: ${api.name}`);
    
    try {
      const { data, error } = await supabase
        .from('apis')
        .insert([{
          ...api,
          added_by: 'research-expansion'
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
  
  console.log('\n🎉 Research API addition completed!');
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
addResearchAPIs();