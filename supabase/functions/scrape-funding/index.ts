
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Import Firecrawl from a URL instead of a package name
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js@latest';

const ALLOWED_URLS = [
  'https://daten.berlin.de',
  'https://www.foerderdatenbank.de',
  'https://www.govdata.de',
  'https://www.ibb.de',
  'https://www.vbb.de'
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      throw new Error('Firecrawl API key not configured');
    }

    const firecrawl = new FirecrawlApp({ apiKey: firecrawlKey });
    const { url } = await req.json();

    // Validate URL is in allowed list
    if (!ALLOWED_URLS.some(allowedUrl => url.startsWith(allowedUrl))) {
      throw new Error('URL not in allowed list');
    }

    console.log('Starting crawl for URL:', url);
    const crawlResponse = await firecrawl.crawlUrl(url, {
      limit: 100,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      }
    });

    if (!crawlResponse.success) {
      throw new Error(crawlResponse.error || 'Crawl failed');
    }

    // Process the raw data into our funding format
    const processedData = processFundingData(crawlResponse.data || []);
    
    return new Response(JSON.stringify({ success: true, data: processedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scrape-funding function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function processFundingData(rawData: any[]): any[] {
  // Process the raw scraped data into the format expected by our funding table
  return rawData.map(item => ({
    title: item.title || 'Untitled',
    description: item.description || item.content || '',
    organization: extractOrganization(item),
    url: item.url || '',
    categories: inferCategories(item),
    tags: generateTags(item),
    // Add other fields as needed
  }));
}

function extractOrganization(item: any): string {
  // Extract organization name from the data
  // This is a simple implementation that should be enhanced based on actual data structure
  return item.organization || item.source || 'Unknown';
}

function inferCategories(item: any): string[] {
  // Infer categories based on content and keywords
  const categories = new Set<string>();
  const content = (item.content || '').toLowerCase();
  
  if (content.includes('bildung') || content.includes('schule')) {
    categories.add('Bildung');
  }
  if (content.includes('arbeit') || content.includes('beruf')) {
    categories.add('Arbeit');
  }
  if (content.includes('wohnen') || content.includes('miet')) {
    categories.add('Wohnen');
  }
  if (content.includes('familie') || content.includes('kind')) {
    categories.add('Familie');
  }
  if (content.includes('gesundheit') || content.includes('krankheit')) {
    categories.add('Gesundheit');
  }
  if (content.includes('integration') || content.includes('migration')) {
    categories.add('Integration');
  }
  if (content.includes('kultur') || content.includes('kunst')) {
    categories.add('Kultur');
  }
  if (content.includes('sozial')) {
    categories.add('Soziales');
  }
  
  // Ensure we return at least one category
  if (categories.size === 0) {
    categories.add('Soziales');
  }
  
  return Array.from(categories);
}

function generateTags(item: any): string[] {
  // Generate relevant tags based on content
  const tags = new Set<string>();
  const content = (item.content || '').toLowerCase();
  
  // Add tags based on content analysis
  if (content.includes('förderung')) tags.add('Förderung');
  if (content.includes('zuschuss')) tags.add('Zuschuss');
  if (content.includes('darlehen')) tags.add('Darlehen');
  if (content.includes('antrag')) tags.add('Antragspflichtig');
  if (content.includes('beratung')) tags.add('Beratung');
  if (content.includes('beihilfe')) tags.add('Beihilfe');
  
  return Array.from(tags);
}
