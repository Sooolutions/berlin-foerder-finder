
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
      return null;
  }
};

export const useFundingResults = (answers?: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', answers ? 'filtered' : 'all', answers?.Q1],
    queryFn: async () => {
      let query = supabase.from('funding').select('*');

      // If answers are provided and Q1 answer exists, filter by age tag
      if (answers && answers.Q1) {
        const ageTag = getAgeTagFromAnswer(answers.Q1);
        if (ageTag) {
          // Filter for funding entries that contain the age tag in their tags array
          query = query.contains('tags', [ageTag]);
        }
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Funding[];
    },
  });
};
