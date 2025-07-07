
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserAnswers } from "@/context/QuestionnaireContext";

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

// Maps Q1 answers to corresponding tags
const getAgeTagFromAnswer = (ageAnswer: string): string | null => {
  console.log("Mapping age answer to tag:", ageAnswer);
  switch (ageAnswer) {
    case "unter 18":
      return "U18";
    case "18-24":
      return "18-24";
    case "25-64":
      return "25-64";
    case "über 65":
      return "65plus";
    default:
      console.log("No matching tag found for age answer:", ageAnswer);
      return null;
  }
};

export const useFundingResults = (answers?: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', answers ? 'filtered' : 'all', answers?.Q1],
    queryFn: async () => {
      console.log("=== FUNDING QUERY DEBUG ===");
      console.log("Full answers object:", answers);
      console.log("Q1 answer:", answers?.Q1);
      
      let query = supabase.from('funding').select('*');

      // If answers are provided and Q1 answer exists, filter by age tag
      if (answers && answers.Q1) {
        const ageTag = getAgeTagFromAnswer(answers.Q1);
        console.log("Mapped age tag:", ageTag);
        
        if (ageTag) {
          console.log("Applying filter for age tag:", ageTag);
          // Use the correct Supabase filter syntax
          query = query.contains('tags', [ageTag]);
        }
      } else {
        console.log("No Q1 answer found - showing all funding");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      console.log("Raw data from Supabase:", data);
      console.log("Number of entries returned:", data?.length || 0);
      
      // Additional filtering on the client side as backup
      let filteredData = data;
      if (answers && answers.Q1) {
        const ageTag = getAgeTagFromAnswer(answers.Q1);
        if (ageTag) {
          filteredData = data?.filter(funding => {
            const hasTag = funding.tags && funding.tags.includes(ageTag);
            console.log(`Funding "${funding.title}" has tag "${ageTag}":`, hasTag, "Tags:", funding.tags);
            return hasTag;
          }) || [];
          console.log("After client-side filtering:", filteredData.length, "entries remain");
        }
      }

      console.log("=== END FUNDING QUERY DEBUG ===");
      return filteredData as Funding[];
    },
  });
};
