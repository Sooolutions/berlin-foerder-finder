
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
      return "65+";
    default:
      console.log("No matching tag found for age answer:", ageAnswer);
      return null;
  }
};

export const useFundingResults = (answers?: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', answers ? 'filtered' : 'all', answers?.Q1],
    queryFn: async () => {
      console.log("Fetching funding with answers:", answers);
      
      let query = supabase.from('funding').select('*');

      // If answers are provided and Q1 answer exists, filter by age tag
      if (answers && answers.Q1) {
        const ageTag = getAgeTagFromAnswer(answers.Q1);
        console.log("Age tag for filtering:", ageTag);
        
        if (ageTag) {
          // Filter for funding entries that contain the age tag in their tags array
          console.log("Applying filter for age tag:", ageTag);
          query = query.contains('tags', [ageTag]);
        }
      } else {
        console.log("No Q1 answer found, fetching all funding");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching funding:", error);
        throw error;
      }

      console.log("Fetched funding data:", data);
      console.log("Number of funding entries:", data?.length || 0);

      return data as Funding[];
    },
  });
};
