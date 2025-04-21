
import { supabase } from "@/integrations/supabase/client";

export async function scrapeFundingSource(url: string) {
  try {
    const { data, error } = await supabase.functions.invoke('scrape-funding', {
      body: { url }
    });

    if (error) {
      console.error('Error scraping funding source:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in scrapeFundingSource:', error);
    throw error;
  }
}
