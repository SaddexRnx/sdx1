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

const apis: APIData[] = [
  // General APIs
  {
    name: "JSONPlaceholder",
    description: "Free fake REST API for testing and prototyping",
    category: "General",
    url: "https://jsonplaceholder.typicode.com",
    documentation_url: "https://jsonplaceholder.typicode.com/guide/",
    authentication_required: false,
    free_tier: true,
    tags: ["testing", "fake-data", "rest"]
  },
  {
    name: "REST Countries",
    description: "Get information about countries via a RESTful API",
    category: "General",
    url: "https://restcountries.com",
    documentation_url: "https://restcountries.com/",
    authentication_required: false,
    free_tier: true,
    tags: ["countries", "geography", "data"]
  },
  {
    name: "HTTP Status Codes",
    description: "Simple API to generate different HTTP status codes",
    category: "General",
    url: "https://httpstat.us",
    documentation_url: "https://httpstat.us/",
    authentication_required: false,
    free_tier: true,
    tags: ["http", "status-codes", "testing"]
  },
  {
    name: "IP Geolocation",
    description: "Get geographical information about an IP address",
    category: "General",
    url: "http://ip-api.com",
    documentation_url: "http://ip-api.com/docs",
    authentication_required: false,
    free_tier: true,
    rate_limit: "1000 requests per month",
    tags: ["ip", "geolocation", "location"]
  },
  {
    name: "Public APIs",
    description: "A collective list of free APIs for use in software and web development",
    category: "General",
    url: "https://api.publicapis.org",
    documentation_url: "https://github.com/public-apis/public-apis",
    authentication_required: false,
    free_tier: true,
    tags: ["apis", "directory", "collection"]
  },
  {
    name: "UUID Generator",
    description: "Generate version 4 UUIDs",
    category: "General",
    url: "https://www.uuidgenerator.net/api",
    documentation_url: "https://www.uuidgenerator.net/dev-corner",
    authentication_required: false,
    free_tier: true,
    tags: ["uuid", "generator", "unique-id"]
  },
  {
    name: "Random Data",
    description: "Generate random user data for testing",
    category: "General",
    url: "https://randomapi.com",
    documentation_url: "https://randomapi.com/documentation",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100 requests per day",
    tags: ["random", "fake-data", "testing"]
  },

  // Weather APIs
  {
    name: "OpenWeatherMap",
    description: "Weather data including current, forecast, and historical weather",
    category: "Weather",
    url: "https://openweathermap.org/api",
    documentation_url: "https://openweathermap.org/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1000 calls per day",
    tags: ["weather", "forecast", "climate"],
    featured: true
  },
  {
    name: "WeatherAPI",
    description: "Real-time weather information and forecasts",
    category: "Weather",
    url: "https://www.weatherapi.com",
    documentation_url: "https://www.weatherapi.com/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1 million calls per month",
    tags: ["weather", "real-time", "forecast"]
  },
  {
    name: "MetaWeather",
    description: "Weather information for cities worldwide",
    category: "Weather",
    url: "https://www.metaweather.com/api",
    documentation_url: "https://www.metaweather.com/api/",
    authentication_required: false,
    free_tier: true,
    tags: ["weather", "cities", "worldwide"]
  },
  {
    name: "7Timer!",
    description: "Weather forecast APIs with multiple forecast models",
    category: "Weather",
    url: "http://www.7timer.info",
    documentation_url: "http://www.7timer.info/doc.php",
    authentication_required: false,
    free_tier: true,
    tags: ["weather", "forecast", "models"]
  },

  // Social Media APIs
  {
    name: "Twitter API v2",
    description: "Access Twitter data and functionality",
    category: "Social Media",
    url: "https://developer.twitter.com/en/docs/twitter-api",
    documentation_url: "https://developer.twitter.com/en/docs",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    rate_limit: "300 requests per 15 minutes",
    tags: ["twitter", "social", "posts"],
    featured: true
  },
  {
    name: "Reddit API",
    description: "Access Reddit's vast collection of content",
    category: "Social Media",
    url: "https://www.reddit.com/dev/api",
    documentation_url: "https://www.reddit.com/dev/api/",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    rate_limit: "60 requests per minute",
    tags: ["reddit", "social", "content"]
  },
  {
    name: "Instagram Basic Display",
    description: "Access Instagram user profile and media",
    category: "Social Media",
    url: "https://developers.facebook.com/docs/instagram-basic-display-api",
    documentation_url: "https://developers.facebook.com/docs/instagram-basic-display-api",
    authentication_required: true,
    auth_type: "OAuth 2.0",
    free_tier: true,
    tags: ["instagram", "photos", "social"]
  },
  {
    name: "Discord API",
    description: "Build applications and bots for Discord",
    category: "Social Media",
    url: "https://discord.com/developers/docs/intro",
    documentation_url: "https://discord.com/developers/docs",
    authentication_required: true,
    auth_type: "Bot Token",
    free_tier: true,
    tags: ["discord", "chat", "bots"]
  },

  // Finance/Crypto APIs
  {
    name: "CoinGecko",
    description: "Cryptocurrency data including prices, market cap, and trading volume",
    category: "Finance/Crypto",
    url: "https://www.coingecko.com/en/api",
    documentation_url: "https://www.coingecko.com/en/api/documentation",
    authentication_required: false,
    free_tier: true,
    rate_limit: "100 requests per minute",
    tags: ["cryptocurrency", "prices", "market"],
    featured: true
  },
  {
    name: "Alpha Vantage",
    description: "Real-time and historical stock market data",
    category: "Finance/Crypto",
    url: "https://www.alphavantage.co",
    documentation_url: "https://www.alphavantage.co/documentation/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5 API requests per minute",
    tags: ["stocks", "financial", "market-data"]
  },
  {
    name: "Fixer.io",
    description: "Foreign exchange rates and currency conversion",
    category: "Finance/Crypto",
    url: "https://fixer.io",
    documentation_url: "https://fixer.io/documentation",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1000 requests per month",
    tags: ["currency", "exchange-rates", "conversion"]
  },
  {
    name: "IEX Cloud",
    description: "Financial data including stocks, forex, and cryptocurrency",
    category: "Finance/Crypto",
    url: "https://iexcloud.io",
    documentation_url: "https://iexcloud.io/docs/api/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100 requests per second",
    tags: ["stocks", "financial", "real-time"]
  },
  {
    name: "CoinAPI",
    description: "Cryptocurrency market data and exchange rates",
    category: "Finance/Crypto",
    url: "https://www.coinapi.io",
    documentation_url: "https://docs.coinapi.io/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100 requests per day",
    tags: ["cryptocurrency", "exchange", "trading"]
  },

  // Entertainment APIs
  {
    name: "TMDB (The Movie Database)",
    description: "Movie and TV show information database",
    category: "Entertainment",
    url: "https://www.themoviedb.org/documentation/api",
    documentation_url: "https://developers.themoviedb.org/3",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "40 requests per 10 seconds",
    tags: ["movies", "tv-shows", "entertainment"],
    featured: true
  },
  {
    name: "OMDb API",
    description: "Open Movie Database with movie and series information",
    category: "Entertainment",
    url: "http://www.omdbapi.com",
    documentation_url: "http://www.omdbapi.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1000 requests per day",
    tags: ["movies", "database", "search"]
  },
  {
    name: "TV Maze",
    description: "TV show data including episodes, cast, and crew information",
    category: "Entertainment",
    url: "https://www.tvmaze.com/api",
    documentation_url: "https://www.tvmaze.com/api",
    authentication_required: false,
    free_tier: true,
    tags: ["tv-shows", "episodes", "cast"]
  },
  {
    name: "JokeAPI",
    description: "Programming, miscellaneous, and dark jokes",
    category: "Entertainment",
    url: "https://jokeapi.dev",
    documentation_url: "https://jokeapi.dev/",
    authentication_required: false,
    free_tier: true,
    tags: ["jokes", "humor", "programming"]
  },
  {
    name: "Chuck Norris Facts",
    description: "Hand curated Chuck Norris facts",
    category: "Entertainment",
    url: "https://api.chucknorris.io",
    documentation_url: "https://api.chucknorris.io/",
    authentication_required: false,
    free_tier: true,
    tags: ["jokes", "chuck-norris", "facts"]
  },

  // Media APIs
  {
    name: "Unsplash",
    description: "High-quality photos from professional photographers",
    category: "Media",
    url: "https://unsplash.com/developers",
    documentation_url: "https://unsplash.com/documentation",
    authentication_required: true,
    auth_type: "Access Key",
    free_tier: true,
    rate_limit: "50 requests per hour",
    tags: ["photos", "images", "stock"],
    featured: true
  },
  {
    name: "Pixabay",
    description: "Free images, videos, and music",
    category: "Media",
    url: "https://pixabay.com/api/docs/",
    documentation_url: "https://pixabay.com/api/docs/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5000 requests per hour",
    tags: ["images", "videos", "free"]
  },
  {
    name: "Pexels",
    description: "Free stock photos and videos",
    category: "Media",
    url: "https://www.pexels.com/api/",
    documentation_url: "https://www.pexels.com/api/documentation/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "200 requests per hour",
    tags: ["photos", "videos", "stock"]
  },
  {
    name: "Giphy",
    description: "GIFs, stickers, and animated content",
    category: "Media",
    url: "https://developers.giphy.com",
    documentation_url: "https://developers.giphy.com/docs/api/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "100 requests per hour",
    tags: ["gifs", "animations", "stickers"]
  },

  // Maps/Geography APIs
  {
    name: "Google Maps",
    description: "Comprehensive mapping, geocoding, and place information",
    category: "Maps/Geography",
    url: "https://developers.google.com/maps",
    documentation_url: "https://developers.google.com/maps/documentation",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "$200 free credits monthly",
    tags: ["maps", "geocoding", "places"],
    featured: true
  },
  {
    name: "OpenStreetMap Nominatim",
    description: "Free geocoding service using OpenStreetMap data",
    category: "Maps/Geography",
    url: "https://nominatim.openstreetmap.org",
    documentation_url: "https://nominatim.org/release-docs/develop/api/",
    authentication_required: false,
    free_tier: true,
    rate_limit: "1 request per second",
    tags: ["geocoding", "openstreetmap", "free"]
  },
  {
    name: "MapBox",
    description: "Maps, geocoding, and navigation APIs",
    category: "Maps/Geography",
    url: "https://www.mapbox.com",
    documentation_url: "https://docs.mapbox.com/api/",
    authentication_required: true,
    auth_type: "Access Token",
    free_tier: true,
    rate_limit: "50,000 requests per month",
    tags: ["maps", "navigation", "geocoding"]
  },
  {
    name: "GeoNames",
    description: "Geographical database and web services",
    category: "Maps/Geography",
    url: "http://www.geonames.org",
    documentation_url: "http://www.geonames.org/export/web-services.html",
    authentication_required: true,
    auth_type: "Username",
    free_tier: true,
    rate_limit: "2000 credits per hour",
    tags: ["geography", "places", "database"]
  },

  // AI/ML APIs
  {
    name: "OpenAI API",
    description: "Access to GPT models and AI capabilities",
    category: "AI/ML",
    url: "https://platform.openai.com",
    documentation_url: "https://platform.openai.com/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "$5 free credits",
    tags: ["ai", "gpt", "language-model"],
    featured: true
  },
  {
    name: "Hugging Face",
    description: "Machine learning models and transformers",
    category: "AI/ML",
    url: "https://huggingface.co/docs/api-inference/",
    documentation_url: "https://huggingface.co/docs",
    authentication_required: true,
    auth_type: "API Token",
    free_tier: true,
    rate_limit: "1000 requests per hour",
    tags: ["ml", "transformers", "models"]
  },
  {
    name: "Google Vision AI",
    description: "Image analysis and computer vision",
    category: "AI/ML",
    url: "https://cloud.google.com/vision",
    documentation_url: "https://cloud.google.com/vision/docs",
    authentication_required: true,
    auth_type: "Service Account",
    free_tier: true,
    rate_limit: "1000 requests per month",
    tags: ["computer-vision", "image-analysis", "ocr"]
  },
  {
    name: "IBM Watson",
    description: "AI services including language and visual recognition",
    category: "AI/ML",
    url: "https://www.ibm.com/watson/developer/",
    documentation_url: "https://cloud.ibm.com/docs/watson",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "Limited free tier",
    tags: ["ai", "watson", "nlp"]
  },

  // Health APIs
  {
    name: "OpenFDA",
    description: "FDA data including drug, device, and food information",
    category: "Health",
    url: "https://open.fda.gov",
    documentation_url: "https://open.fda.gov/apis/",
    authentication_required: false,
    free_tier: true,
    rate_limit: "120 requests per minute",
    tags: ["fda", "drugs", "medical"]
  },
  {
    name: "Disease.sh",
    description: "COVID-19 and disease statistics",
    category: "Health",
    url: "https://disease.sh",
    documentation_url: "https://disease.sh/docs/",
    authentication_required: false,
    free_tier: true,
    tags: ["covid-19", "disease", "statistics"]
  },
  {
    name: "Nutritionix",
    description: "Nutrition data for foods and recipes",
    category: "Health",
    url: "https://www.nutritionix.com/business/api",
    documentation_url: "https://docs.nutritionix.com/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "500 requests per day",
    tags: ["nutrition", "food", "calories"]
  },
  {
    name: "USDA Food Data Central",
    description: "Comprehensive food and nutrition database",
    category: "Health",
    url: "https://fdc.nal.usda.gov",
    documentation_url: "https://fdc.nal.usda.gov/api-guide.html",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["nutrition", "usda", "food-data"]
  },

  // News APIs
  {
    name: "NewsAPI",
    description: "News articles from thousands of sources",
    category: "News",
    url: "https://newsapi.org",
    documentation_url: "https://newsapi.org/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "500 requests per day",
    tags: ["news", "articles", "sources"],
    featured: true
  },
  {
    name: "Guardian API",
    description: "The Guardian newspaper's content API",
    category: "News",
    url: "https://open-platform.theguardian.com",
    documentation_url: "https://open-platform.theguardian.com/documentation/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "5000 requests per day",
    tags: ["guardian", "news", "articles"]
  },
  {
    name: "New York Times",
    description: "Access to NYT articles, bestsellers, and archives",
    category: "News",
    url: "https://developer.nytimes.com",
    documentation_url: "https://developer.nytimes.com/docs",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "4000 requests per day",
    tags: ["nytimes", "news", "archives"]
  },
  {
    name: "Hacker News",
    description: "Hacker News stories, comments, and user data",
    category: "News",
    url: "https://github.com/HackerNews/API",
    documentation_url: "https://github.com/HackerNews/API",
    authentication_required: false,
    free_tier: true,
    tags: ["hackernews", "tech-news", "programming"]
  },

  // Development Tools APIs
  {
    name: "GitHub API",
    description: "Access GitHub repositories, users, and organization data",
    category: "Development Tools",
    url: "https://docs.github.com/en/rest",
    documentation_url: "https://docs.github.com/en/rest",
    authentication_required: true,
    auth_type: "Personal Access Token",
    free_tier: true,
    rate_limit: "5000 requests per hour",
    tags: ["github", "repositories", "version-control"],
    featured: true
  },
  {
    name: "Stack Overflow",
    description: "Stack Overflow questions, answers, and user data",
    category: "Development Tools",
    url: "https://api.stackexchange.com",
    documentation_url: "https://api.stackexchange.com/docs",
    authentication_required: false,
    free_tier: true,
    rate_limit: "300 requests per day",
    tags: ["stackoverflow", "programming", "q-and-a"]
  },
  {
    name: "GitLab API",
    description: "GitLab project, user, and pipeline data",
    category: "Development Tools",
    url: "https://docs.gitlab.com/ee/api/",
    documentation_url: "https://docs.gitlab.com/ee/api/",
    authentication_required: true,
    auth_type: "Personal Access Token",
    free_tier: true,
    rate_limit: "2000 requests per minute",
    tags: ["gitlab", "ci-cd", "repositories"]
  },
  {
    name: "npm Registry",
    description: "npm package information and statistics",
    category: "Development Tools",
    url: "https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md",
    documentation_url: "https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md",
    authentication_required: false,
    free_tier: true,
    tags: ["npm", "packages", "javascript"]
  },

  // E-commerce APIs
  {
    name: "Shopify API",
    description: "E-commerce platform API for stores and products",
    category: "E-commerce",
    url: "https://shopify.dev/api",
    documentation_url: "https://shopify.dev/api",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    tags: ["shopify", "e-commerce", "products"]
  },
  {
    name: "WooCommerce",
    description: "WordPress e-commerce plugin API",
    category: "E-commerce",
    url: "https://woocommerce.github.io/woocommerce-rest-api-docs/",
    documentation_url: "https://woocommerce.github.io/woocommerce-rest-api-docs/",
    authentication_required: true,
    auth_type: "Consumer Key/Secret",
    free_tier: true,
    tags: ["woocommerce", "wordpress", "e-commerce"]
  },
  {
    name: "Amazon Product Advertising",
    description: "Amazon product information and affiliate links",
    category: "E-commerce",
    url: "https://webservices.amazon.com/paapi5/documentation/",
    documentation_url: "https://webservices.amazon.com/paapi5/documentation/",
    authentication_required: true,
    auth_type: "Access Key",
    free_tier: true,
    rate_limit: "8640 requests per day",
    tags: ["amazon", "products", "affiliate"]
  },

  // Fun APIs
  {
    name: "Cat Facts",
    description: "Random cat facts",
    category: "Fun",
    url: "https://catfact.ninja",
    documentation_url: "https://catfact.ninja/",
    authentication_required: false,
    free_tier: true,
    tags: ["cats", "facts", "random"]
  },
  {
    name: "Dog API",
    description: "Random dog images by breed",
    category: "Fun",
    url: "https://dog.ceo/dog-api/",
    documentation_url: "https://dog.ceo/dog-api/documentation",
    authentication_required: false,
    free_tier: true,
    tags: ["dogs", "images", "random"]
  },
  {
    name: "Bored API",
    description: "Random activity suggestions when you're bored",
    category: "Fun",
    url: "https://www.boredapi.com",
    documentation_url: "https://www.boredapi.com/documentation",
    authentication_required: false,
    free_tier: true,
    tags: ["activities", "random", "suggestions"]
  },
  {
    name: "Advice Slip",
    description: "Random pieces of advice",
    category: "Fun",
    url: "https://api.adviceslip.com",
    documentation_url: "https://api.adviceslip.com/",
    authentication_required: false,
    free_tier: true,
    tags: ["advice", "random", "wisdom"]
  },
  {
    name: "Numbers API",
    description: "Interesting facts about numbers",
    category: "Fun",
    url: "http://numbersapi.com",
    documentation_url: "http://numbersapi.com/",
    authentication_required: false,
    free_tier: true,
    tags: ["numbers", "facts", "trivia"]
  },

  // Education APIs
  {
    name: "Wolfram Alpha",
    description: "Computational knowledge engine",
    category: "Education",
    url: "http://products.wolframalpha.com/api/",
    documentation_url: "http://products.wolframalpha.com/api/documentation/",
    authentication_required: true,
    auth_type: "AppID",
    free_tier: true,
    rate_limit: "2000 queries per month",
    tags: ["math", "computation", "knowledge"]
  },
  {
    name: "Open Library",
    description: "Book data and search from Internet Archive",
    category: "Education",
    url: "https://openlibrary.org/developers/api",
    documentation_url: "https://openlibrary.org/developers/api",
    authentication_required: false,
    free_tier: true,
    tags: ["books", "library", "education"]
  },
  {
    name: "NASA API",
    description: "NASA data including astronomy picture of the day",
    category: "Education",
    url: "https://api.nasa.gov",
    documentation_url: "https://api.nasa.gov/",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1000 requests per hour",
    tags: ["nasa", "space", "astronomy"],
    featured: true
  },
  {
    name: "Quotable",
    description: "Famous quotes and authors database",
    category: "Education",
    url: "https://quotable.io",
    documentation_url: "https://github.com/lukePeavey/quotable",
    authentication_required: false,
    free_tier: true,
    tags: ["quotes", "authors", "inspiration"]
  },

  // Utilities APIs
  {
    name: "QR Server",
    description: "Generate QR codes",
    category: "Utilities",
    url: "https://goqr.me/api/",
    documentation_url: "https://goqr.me/api/doc/create-qr-code/",
    authentication_required: false,
    free_tier: true,
    tags: ["qr-code", "generator", "utility"]
  },
  {
    name: "TinyURL",
    description: "URL shortening service",
    category: "Utilities",
    url: "https://tinyurl.com/app/dev",
    documentation_url: "https://tinyurl.com/app/dev",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "600 requests per month",
    tags: ["url-shortener", "links", "utility"]
  },
  {
    name: "Have I Been Pwned",
    description: "Check if email addresses have been compromised in data breaches",
    category: "Utilities",
    url: "https://haveibeenpwned.com/API/v3",
    documentation_url: "https://haveibeenpwned.com/API/v3",
    authentication_required: true,
    auth_type: "API Key",
    free_tier: true,
    rate_limit: "1 request per 1.5 seconds",
    tags: ["security", "data-breaches", "email"]
  },
  {
    name: "Lorem Picsum",
    description: "Lorem Ipsum for photos - placeholder images",
    category: "Utilities",
    url: "https://picsum.photos",
    documentation_url: "https://picsum.photos/",
    authentication_required: false,
    free_tier: true,
    tags: ["placeholder", "images", "lorem-ipsum"]
  },
  {
    name: "JSON Storage",
    description: "Simple JSON storage service",
    category: "Utilities",
    url: "https://jsonstorage.net",
    documentation_url: "https://jsonstorage.net/",
    authentication_required: false,
    free_tier: true,
    rate_limit: "Limited requests",
    tags: ["json", "storage", "database"]
  }
];

async function populateAPIs() {
  console.log('Starting API population...');
  
  try {
    for (let i = 0; i < apis.length; i++) {
      const api = apis[i];
      console.log(`Inserting API ${i + 1}/${apis.length}: ${api.name}`);
      
      const { data, error } = await supabase
        .from('apis')
        .insert([api]);
      
      if (error) {
        console.error(`Error inserting ${api.name}:`, error);
      } else {
        console.log(`✓ Successfully inserted ${api.name}`);
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎉 API population completed!');
    
    // Get count of inserted APIs
    const { count } = await supabase
      .from('apis')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Total APIs in database: ${count}`);
    
    // Get count by category
    const { data: categories } = await supabase
      .from('apis')
      .select('category')
      .then(result => {
        const categoryCounts: Record<string, number> = {};
        result.data?.forEach(item => {
          categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        });
        return { data: categoryCounts };
      });
    
    console.log('\nAPIs by category:');
    Object.entries(categories || {}).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error during API population:', error);
  }
}

// Run the population script
populateAPIs();