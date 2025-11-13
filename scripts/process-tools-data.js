// Script to process tools data: mark featured tools and fix pricing
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Famous AI tools to mark as featured
const FAMOUS_TOOLS = [
  'ChatGPT', 'Claude', 'Google Gemini', 'Gemini', 'Midjourney', 
  'DALL-E 3', 'Jasper', 'Copy.ai', 'Notion', 'Notion AI', 
  'Canva', 'Grammarly', 'Microsoft Copilot', 'Adobe Firefly',
  'Stable Diffusion', 'RunwayML', 'Perplexity', 'Anthropic Claude',
  'GPT-4', 'Bard', 'Bing AI', 'GitHub Copilot', 'Hugging Face',
  'Replicate', 'Synthesia', 'Descript', 'Loom', 'Pictory',
  'Writesonic', 'QuillBot', 'Otter.ai', 'Fireflies.ai',
  'Beautiful.ai', 'Tome', 'Gamma', 'Miro', 'FigJam',
  'Framer AI', 'Webflow AI', 'Zapier', 'Make', 'n8n'
];

// Gradient presets for logos
const GRADIENTS = [
  'gradient-purple', 'gradient-blue', 'gradient-green', 
  'gradient-orange', 'gradient-red', 'gradient-indigo',
  'gradient-pink', 'gradient-gray', 'gradient-teal', 
  'gradient-cyan', 'gradient-yellow'
];

function processTools() {
  const dataPath = path.join(__dirname, '../public/data/ai-tools.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  let featuredCount = 0;
  let fixedPricingCount = 0;
  let addedLogoCount = 0;

  data.tools = data.tools.map((tool, index) => {
    // Mark famous tools as featured
    if (FAMOUS_TOOLS.some(famous => 
      tool.name.toLowerCase().includes(famous.toLowerCase()) ||
      famous.toLowerCase().includes(tool.name.toLowerCase())
    )) {
      tool.featured = true;
      featuredCount++;
    }

    // Fix empty pricing
    if (!tool.pricing || tool.pricing.trim() === '') {
      tool.pricing = 'Not Specified';
      fixedPricingCount++;
    }

    // Add gradient logo if missing
    if (!tool.logo) {
      tool.logo = GRADIENTS[index % GRADIENTS.length];
      addedLogoCount++;
    }

    return tool;
  });

  // Write back to file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  
  console.log(`✅ Processing complete!`);
  console.log(`   - Featured tools marked: ${featuredCount}`);
  console.log(`   - Fixed empty pricing: ${fixedPricingCount}`);
  console.log(`   - Added gradient logos: ${addedLogoCount}`);
  console.log(`   - Total tools: ${data.tools.length}`);
}

processTools();
