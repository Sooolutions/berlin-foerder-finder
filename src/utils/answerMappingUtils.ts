
import { UserAnswers } from "@/context/QuestionnaireContext";
import { getQuestionData } from "@/data/questionnaireData";

/**
 * Extracts all relevant tags from user answers based on questionnaire data.
 * @param answers User's answers from the questionnaire
 * @returns Array of tags that match the user's answers
 */
export const extractTagsFromAnswers = (answers: UserAnswers): string[] => {
  const collectedTags: string[] = [];
  
  console.log("=== EXTRACTING TAGS FROM ANSWERS ===");
  console.log("User answers:", answers);
  
  // Iterate through all answers
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    console.log(`Processing question ${questionId} with answer: ${selectedAnswer}`);
    
    // Get question data
    const questionData = getQuestionData(questionId);
    
    if (!questionData) {
      console.log(`No question data found for ${questionId}`);
      return;
    }
    
    if (!questionData.tags || !questionData.options) {
      console.log(`Question ${questionId} has no tags or options`);
      return;
    }
    
    // Find the index of the selected answer in the options array
    const answerIndex = questionData.options.indexOf(selectedAnswer);
    
    if (answerIndex === -1) {
      console.log(`Answer "${selectedAnswer}" not found in options for ${questionId}`);
      return;
    }
    
    // Get the corresponding tag
    const correspondingTag = questionData.tags[answerIndex];
    
    if (correspondingTag) {
      console.log(`Found tag "${correspondingTag}" for answer "${selectedAnswer}" in ${questionId}`);
      collectedTags.push(correspondingTag);
    } else {
      console.log(`No tag found for answer index ${answerIndex} in ${questionId}`);
    }
  });
  
  // Remove duplicates
  const uniqueTags = Array.from(new Set(collectedTags));
  
  console.log("Collected tags:", uniqueTags);
  console.log("=== END TAG EXTRACTION ===");
  
  return uniqueTags;
};

/**
 * Groups tags by category for better organization
 * @param tags Array of tags
 * @returns Object with tags grouped by category
 */
export const groupTagsByCategory = (tags: string[]): { [category: string]: string[] } => {
  const grouped: { [category: string]: string[] } = {};
  
  tags.forEach(tag => {
    const parts = tag.split('_');
    const category = parts[0] || 'general';
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    grouped[category].push(tag);
  });
  
  return grouped;
};

interface DatabaseFilters {
  minAge?: number;
  maxAge?: number;
  incomeMin?: number;
  incomeMax?: number;
  district?: string[];
  requiresChildren?: boolean;
  requiresMarriage?: boolean;
  educationLevel?: string[];
  employmentStatus?: string[];
  categories?: string[];
  tags?: string[];
}

/**
 * Maps user questionnaire answers to database filter parameters.
 * @param answers User's answers from the questionnaire
 * @returns Filter parameters that can be used with the Supabase query
 */
export const mapAnswersToFilters = (answers: UserAnswers): DatabaseFilters => {
  const extractedTags = extractTagsFromAnswers(answers);
  
  const filters: DatabaseFilters = {
    tags: extractedTags
  };
  
  console.log("Mapped filters:", filters);
  
  return filters;
};

/**
 * Applies the database filters to a Supabase query builder.
 * @param query The Supabase query builder
 * @param filters The database filters
 * @returns The updated query with filters applied
 */
export const applyFiltersToQuery = (query: any, filters: DatabaseFilters): any => {
  if (filters.tags && filters.tags.length > 0) {
    console.log("Applying tag filters to query:", filters.tags);
    // Apply tag filters - we'll use client-side filtering for multiple tags
    // as Supabase has limitations with complex array filtering
  }
  
  return query;
};
