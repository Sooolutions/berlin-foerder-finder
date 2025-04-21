
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import FirecrawlApp from '@mendable/firecrawl-js';

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

    // Process and store the results in Supabase
    const { data: { supabaseClient } } = await req.json();
    const processedData = processFundingData(crawlResponse.data);
    
    // Insert the processed data into the funding table
    const { error: insertError } = await supabaseClient
      .from('funding')
      .insert(processedData);

    if (insertError) {
      throw insertError;
    }

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
  // Add more category inference logic as needed
  
  return Array.from(categories);
}

function generateTags(item: any): string[] {
  // Generate relevant tags based on content
  const tags = new Set<string>();
  const content = (item.content || '').toLowerCase();
  
  // Add tags based on content analysis
  // This should be enhanced based on actual data patterns
  if (content.includes('förderung')) tags.add('Förderung');
  if (content.includes('zuschuss')) tags.add('Zuschuss');
  
  return Array.from(tags);
}
