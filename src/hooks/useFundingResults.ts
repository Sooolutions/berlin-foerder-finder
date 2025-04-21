
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

export const useFundingResults = (answers: UserAnswers) => {
  return useQuery({
    queryKey: ['funding', answers],
    queryFn: async () => {
      let query = supabase
        .from('funding')
        .select('*');

      // Apply filters based on user answers
      if (answers.age !== null) {
        query = query
          .or(`min_age.is.null,min_age.lte.${answers.age}`)
          .or(`max_age.is.null,max_age.gte.${answers.age}`);
      }

      if (answers.income !== null) {
        query = query
          .or(`income_min.is.null,income_min.lte.${answers.income}`)
          .or(`income_max.is.null,income_max.gte.${answers.income}`);
      }

      if (answers.district) {
        query = query.contains('district', [answers.district]);
      }

      if (answers.hasChildren !== null) {
        query = query.or(
          `requires_children.is.null,requires_children.eq.${answers.hasChildren}`
        );
      }

      if (answers.maritalStatus === 'married') {
        query = query.or(
          'requires_marriage.is.null,requires_marriage.eq.true'
        );
      }

      if (answers.educationLevel) {
        query = query.contains('education_level', [answers.educationLevel]);
      }

      if (answers.employmentStatus) {
        query = query.contains('employment_status', [answers.employmentStatus]);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Funding[];
    },
  });
};
