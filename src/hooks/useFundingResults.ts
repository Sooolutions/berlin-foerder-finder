
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserAnswers } from "@/context/QuestionnaireContext";
import { extractTagsFromAnswers, groupTagsByCategory } from "@/utils/answerMappingUtils";

export interface Funding {
  id: string;
  title: string;
  description: string;
  organization: string;
  amount: string | null;
  application_deadline: string | null;
  application_process: string | null;
  url: string;
  contact_email: string | null;
  contact_phone: string | null;
  categories: string[];
  tags: string[];
}

export const useFundingResults = (answers?: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', 'filtered', JSON.stringify(answers)],
    queryFn: async () => {
      console.log("=== NEW FUNDING QUERY DEBUG ===");
      console.log("Full answers object:", answers);
      
      // Extract tags from answers using the new system
      const userTags = answers ? extractTagsFromAnswers(answers) : [];
      const groupedTags = groupTagsByCategory(userTags);
      
      console.log("User tags:", userTags);
      console.log("Grouped tags:", groupedTags);

      // Start with all funding data
      let query = supabase.from('funding').select('*');
      
      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      console.log("Raw data from Supabase:", data?.length, "entries");
      
      // Client-side filtering based on extracted tags
      let filteredData = data;
      
      if (userTags.length > 0) {
        console.log("Filtering by tags:", userTags);
        
        filteredData = data?.filter(funding => {
          if (!funding.tags || !Array.isArray(funding.tags)) {
            console.log(`Funding "${funding.title}" has no tags array`);
            return false;
          }
          
          // Check if funding has any of the user's tags
          const hasMatchingTag = userTags.some(userTag => 
            funding.tags.includes(userTag)
          );
          
          console.log(`Funding "${funding.title}":`, {
            fundingTags: funding.tags,
            hasMatch: hasMatchingTag
          });
          
          return hasMatchingTag;
        }) || [];
        
        console.log("After tag filtering:", filteredData.length, "entries remain");
        
        // Sort by relevance - funding with more matching tags comes first
        filteredData.sort((a, b) => {
          const aMatches = userTags.filter(tag => a.tags?.includes(tag)).length;
          const bMatches = userTags.filter(tag => b.tags?.includes(tag)).length;
          return bMatches - aMatches; // Descending order
        });
        
        console.log("Results sorted by relevance");
      } else {
        console.log("No user tags - showing all funding");
      }

      console.log("=== END NEW FUNDING QUERY DEBUG ===");
      return filteredData as Funding[];
    },
  });
};
