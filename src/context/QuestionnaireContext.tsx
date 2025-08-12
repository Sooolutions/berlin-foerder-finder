
import React, { createContext, useState, useContext, ReactNode } from "react";
import { getQuestionData } from "@/data/questionnaireData";

interface QuestionnaireContextType {
  currentQuestionId: string;
  answers: UserAnswers;
  updateAnswer: (questionId: string, answer: any) => void;
  goToNextQuestion: (currentQuestionId: string, answer: any) => string;
  goToPreviousQuestion: () => void;
  resetQuestionnaire: () => void;
  questionHistory: string[];
  isLastQuestion: boolean;
}

export interface UserAnswers {
  [questionId: string]: any;
}

// Initial empty answers object
const initialAnswers: UserAnswers = {};

// Define question branching logic based on the provided structure
const getNextQuestionId = (currentQuestionId: string, answer: any): string => {
  console.log("getNextQuestionId called with:", currentQuestionId, answer);
  
  // Define the branching logic based on the provided question flow
  switch (currentQuestionId) {
    // Initial age question
    case "Q1":
      if (answer === "unter 18") return "Q2_U18";
      if (answer === "18-24") return "Q2_18_24";
      if (answer === "25-64") return "Q2_25_64";
      if (answer === "über 65") return "Q2_Ü65";
      return "Q2_18_24"; // Default path
      
    // Under 18 nationality question (NEW FLOW)
    case "Q2_U18":
      return "Q3_U18"; // All nationality answers lead to Q3_U18
      
    // Under 18 activity question (NEW FLOW)
    case "Q3_U18":
      if (answer === "Schule") return "Q4_U18_Schule";
      if (answer === "Ausbildung") return "Q4_U18_Ausbildung";
      if (answer === "FSJ oder FÖJ") return "Q4_U18_FSJ";
      return "Q4_U18_Sonstiges";
      
    // Under 18 Q4 paths (NEW FLOW)
    case "Q4_U18_Schule":
    case "Q4_U18_Ausbildung":
    case "Q4_U18_FSJ":
    case "Q4_U18_Sonstiges":
      return "Q5_U18";
      
    // Under 18 Q5 living situation (NEW FLOW)
    case "Q5_U18":
      if (answer === "Ja") return "Q6_U18_Eltern";
      if (answer === "Nein, ich wohne in einer Betreuungseinrichtung (Wohngruppe, Internat, Heim, etc.)") return "Q6_U18_Betreuung";
      return "Q6_U18_Verwandte";
      
    // Under 18 Q6 financial questions (NEW FLOW)
    case "Q6_U18_Eltern":
    case "Q6_U18_Betreuung":
    case "Q6_U18_Verwandte":
      return "Q7_U18";
      
    // Under 18 Q7 health question (NEW FLOW)
    case "Q7_U18":
      if (answer === "Ja") return "Q8_U18_Ja";
      // Check if user is from abroad (non-German nationality)
      const previousAnswers = JSON.parse(localStorage.getItem('questionnaireAnswers') || '{}');
      const nationality = previousAnswers.Q2_U18;
      if (nationality && nationality !== "Deutsch") {
        return "Q8_U18_Ausland_Nein";
      }
      return "Q8_U18_Nein";
      
    // Under 18 Q8 support questions (NEW FLOW)
    case "Q8_U18_Ja":
    case "Q8_U18_Nein":
    case "Q8_U18_Ausland_Nein":
      return "Q9_U18";
      
    // Under 18 Q9 final question (NEW FLOW)
    case "Q9_U18":
      return "final";
      
    // 18-24 activity options
    case "Q2_18_24":
      if (answer === "Schule") return "Q3_18_24_Schule";
      if (answer === "Ausbildung") return "Q3_18_24_Ausbildung";
      if (answer === "Studium") return "Q3_18_24_Studium";
      if (answer === "Arbeit") return "Q3_18_24_Arbeit";
      if (answer === "Übergangsphase") return "Q3_18_24_Übergangsphase";
      return "Q3_18_24_Arbeitssuchend";
      
    // 25-64 activity options
    case "Q2_25_64":
      if (answer === "Studium") return "Q3_25_64_Studium";
      if (answer === "Arbeiten") return "Q3_25_64_Arbeiten";
      if (answer === "Arbeitssuchend") return "Q3_25_64_Arbeitssuchend";
      if (answer === "Weiterbildung/Umschulung") return "Q3_25_64_Weiterbildung";
      if (answer === "Übergangsphase") return "Q3_25_64_Übergang";
      if (answer === "Pflege von Angehörigen oder Familienzeit") return "Q3_25_64_Familie";
      return "Q3_25_64_Sonstiges";
      
    // Over 65 activity options
    case "Q2_Ü65":
      if (answer === "Berufstätig") return "Q3_Ü65_Berufstätig";
      if (answer === "Übergang in den Ruhestand") return "Q3_Ü65_Übergang";
      if (answer === "In Rente") return "Q3_Ü65_Rente";
      if (answer === "Pflege oder Betreuung (selbst betroffen oder Angehörige)") return "Q3_Ü65_Pflege";
      return "Q3_Ü65_Sonstiges";

    // 25-64 Q3 paths
    case "Q3_25_64_Studium":
      if (answer === "Studienanfänger:in") return "Q4_25_64_Studium_Anfänger:in";
      if (answer === "Mittendrin") return "Q4_25_64_Studium_Mittendrin";
      return "Q4_25_64_Studium_Abschluss";
      
    case "Q3_25_64_Arbeiten":
      if (answer === "Vollzeit") return "Q4_25_64_Arbeiten_Voll";
      if (answer === "Teilzeit") return "Q4_25_64_Arbeiten_Teil";
      return "Q4_25_64_Arbeiten_Selbst";
      
    case "Q3_25_64_Arbeitssuchend":
      if (answer === "Jobsuche") return "Q4_25_64_Arbeitssuchend_Suche";
      if (answer === "Qualifizierung") return "Q4_25_64_Arbeitssuchend_Qualifizierung";
      if (answer === "Persönliche Unterstützung") return "Q4_25_64_Arbeitssuchend_Persönlich";
      return "Q4_25_64_Arbeitssuchend_Orientierung";
      
    case "Q3_25_64_Weiterbildung":
      if (answer === "Finanzierung") return "Q4_25_64_Weiterbildung_Finanzierung";
      if (answer === "Karriereplanung nach der Weiterbildung") return "Q4_25_64_Weiterbildung_Karriereplanung";
      if (answer === "Unterstützung beim Abschluss") return "Q4_25_64_Weiterbildung_Abschluss";
      return "Q4_25_64_Weiterbildung_Vernetzung";
      
    case "Q3_25_64_Übergang":
      if (answer === "Neuorientierung im Beruf") return "Q4_25_64_Übergang_Neuorientierung";
      if (answer === "Weiterbildung oder Qualifikation") return "Q4_25_64_Übergang_Weiterbildung";
      if (answer === "Persönliche Entwicklung oder Sabbatical") return "Q4_25_64_Übergang_Persönlich";
      return "Q4_25_64_Übergang_Gründung";
      
    case "Q3_25_64_Familie":
      if (answer === "Beruflicher Wiedereinstieg") return "Q4_25_64_Familie_Wiedereinstieg";
      if (answer === "Unterstützung der Familienzeit") return "Q4_25_64_Familie_Unterstützung";
      if (answer === "Qualifizierung während der Auszeit") return "Q4_25_64_Familie_Qualifizierung";
      return "final"; // Austausch mit anderen leads to final
      
    case "Q3_25_64_Sonstiges":
      if (answer === "Persönliche Entwicklung") return "Q4_25_64_Sonstiges_Persönlich";
      if (answer === "Berufliche Orientierung/Weiterbildung") return "Q4_25_64_Sonstiges_Weiterbildung";
      if (answer === "Soziales Engagement") return "Q4_25_64_Sonstiges_Soziales";
      return "Q4_25_64_Sonstiges_Unterstützung";

    // 25-64 Q4 paths that need Q5 questions
    case "Q4_25_64_Arbeiten_Voll":
      if (answer === "Umschulung für einen neuen Bereich") return "Q5_25_64_Arbeiten_Voll_Umschulung";
      return "final"; // All other options lead to final
      
    case "Q4_25_64_Arbeiten_Teil":
      if (answer === "Wechsel in Vollzeitbeschäftigung") return "Q5_25_64_Arbeiten_Teil_Wechsel";
      return "final"; // All other options lead to final
      
    case "Q4_25_64_Arbeiten_Selbst":
      if (answer === "Unternehmensfinanzierung") return "Q5_25_64_Arbeiten_Selbstständig_Finanzen";
      return "final"; // All other options lead to final
      
     // OLD U18 PATH LOGIC - REMOVED (these question IDs no longer exist in new flow)
      
    // 18-24 school path
    case "Q3_18_24_Schule":
      return answer === "Ja" ? "Q4_18_24_Schule_Ja" : "Q4_18_24_Schule_Nein";
      
    // 18-24 vocational training path - uses the same questions as under 18
    case "Q3_18_24_Ausbildung":
      if (answer === "1") return "Q4_U18_Ausbildung_1";
      if (answer === "2") return "Q4_U18_Ausbildung_2";
      if (answer === "3") return "Q4_U18_Ausbildung_3";
      return "Q4_U18_Ausbildung_Abschluss";
      
    // 18-24 university path
    case "Q3_18_24_Studium":
      if (answer === "Studienanfänger:in") return "Q4_18_24_Studium_Anfänger:in";
      if (answer === "Mittendrin") return "Q4_18_24_Studium_Mittendrin";
      return "Q4_18_24_Studium_Abschluss";
      
    // Direct to final for these cases according to the table
    case "Q3_18_24_Arbeit":
    case "Q3_18_24_Übergangsphase":
    case "Q3_18_24_Arbeitssuchend":
    case "Q4_18_24_Studium_Anfänger:in":
    case "Q4_18_24_Studium_Mittendrin":
    case "Q4_18_24_Studium_Abschluss":
    case "Q3_Ü65_Berufstätig":
    case "Q3_Ü65_Übergang":
    case "Q3_Ü65_Rente":
    case "Q3_Ü65_Pflege":
    case "Q3_Ü65_Sonstiges":
    case "Q4_U18_nichtsdavon_Suche":
    // All 25-64 Q4 paths that lead directly to final
    case "Q4_25_64_Studium_Anfänger:in":
    case "Q4_25_64_Studium_Mittendrin":
    case "Q4_25_64_Studium_Abschluss":
    case "Q4_25_64_Arbeitssuchend_Suche":
    case "Q4_25_64_Arbeitssuchend_Qualifizierung":
    case "Q4_25_64_Arbeitssuchend_Persönlich":
    case "Q4_25_64_Arbeitssuchend_Orientierung":
    case "Q4_25_64_Weiterbildung_Finanzierung":
    case "Q4_25_64_Weiterbildung_Karriereplanung":
    case "Q4_25_64_Weiterbildung_Abschluss":
    case "Q4_25_64_Weiterbildung_Vernetzung":
    case "Q4_25_64_Übergang_Neuorientierung":
    case "Q4_25_64_Übergang_Weiterbildung":
    case "Q4_25_64_Übergang_Persönlich":
    case "Q4_25_64_Übergang_Gründung":
    case "Q4_25_64_Familie_Wiedereinstieg":
    case "Q4_25_64_Familie_Unterstützung":
    case "Q4_25_64_Familie_Qualifizierung":
    case "Q4_25_64_Sonstiges_Persönlich":
    case "Q4_25_64_Sonstiges_Weiterbildung":
    case "Q4_25_64_Sonstiges_Soziales":
    case "Q4_25_64_Sonstiges_Unterstützung":
    // All Q5 paths for 25-64
    case "Q5_25_64_Arbeiten_Voll_Umschulung":
    case "Q5_25_64_Arbeiten_Teil_Wechsel":
    case "Q5_25_64_Arbeiten_Selbstständig_Finanzen":
      return "final";
      
    // Under 18 school paths
    case "Q4_U18_Schule_Ja":
      return answer === "Ja" ? "Q5_U18_Schule_Ja_Ja" : "Q5_U18_Schule_Ja_Nein";
      
    case "Q4_U18_Schule_Nein":
      if (answer === "Eigene Wohnung") return "Q5_U18_Schule_Nein_EigeneWohnung";
      if (answer === "Betreuungseinrichtung") return "Q5_U18_Schule_Nein_Betreeungseinrichtung";
      if (answer === "Ich wohne bei Verwandten") return "Q5_U18_Schule_Nein_Verwandte";
      return "Q5_U18_Schule_Nein_Sonstiges";
      
    // Vocational training financing questions
    case "Q4_U18_Ausbildung_1":
    case "Q4_U18_Ausbildung_2":
    case "Q4_U18_Ausbildung_3":
    case "Q4_U18_Ausbildung_Abschluss":
      const ausbildungsJahr = currentQuestionId.split("_")[3];
      return answer === "Ja" ? `Q5_U18_Ausbildung_${ausbildungsJahr}_Ja` : `Q5_U18_Ausbildung_${ausbildungsJahr}_Nein`;
      
    // Other activity preparation questions
    case "Q4_U18_nichtsdavon_Praktikum":
    case "Q4_U18_nichtsdavon_Warten":
    case "Q4_U18_nichtsdavon_Arbeiten":
      const aktivity = currentQuestionId.split("_")[3];
      return answer === "Ja" ? `Q5_U18_nichtsdavon_${aktivity}_Ja` : `Q5_U18_nichtsdavon_${aktivity}_Nein`;
      
    // 18-24 school support - FIXED: Correct ID generation
    case "Q4_18_24_Schule_Ja":
      return answer === "Ja" ? "Q5_18_24_Schule_Ja_Ja" : "Q5_18_24_Schule_Ja_Nein";
      
    case "Q4_18_24_Schule_Nein":
      return answer === "Ja" ? "Q5_18_24_Schule_Nein_Ja" : "Q5_18_24_Schule_Nein_Nein";
    
    // Additional support for vocational training
    case "Q5_U18_Ausbildung_1_Ja":
    case "Q5_U18_Ausbildung_2_Ja":
    case "Q5_U18_Ausbildung_3_Ja":
    case "Q5_U18_Ausbildung_Abschluss_Ja":
      const year = currentQuestionId.split("_")[3];
      return `Q6_U18_Ausbildung_${year}_Ja_Egal`;
      
    // All other Q5 and Q6 questions lead to final results according to the table
    default:
      console.log(`No specific next question defined for ID: ${currentQuestionId}, using final as default`);
      return "final"; // Default path for anything else
  }
};

// Check if the question is the last one (leads to results)
const isEndOfQuestionnaire = (nextQuestionId: string): boolean => {
  return nextQuestionId === "final";
};

// Key for storing questionnaire answers in localStorage
const QUESTIONNAIRE_ANSWERS_KEY = "questionnaire_answers";
const QUESTIONNAIRE_HISTORY_KEY = "questionnaire_history";

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState("Q1"); // Start with first question
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const [questionHistory, setQuestionHistory] = useState<string[]>(["Q1"]); // Track question path
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  const updateAnswer = (questionId: string, answer: any) => {
    console.log("updateAnswer called:", questionId, answer);
    setAnswers((prev) => {
      // Only update if the answer is actually different
      if (prev[questionId] === answer) {
        return prev;
      }
      
      const updatedAnswers = {
        ...prev,
        [questionId]: answer,
      };
      
      // Save to localStorage
      try {
        localStorage.setItem(QUESTIONNAIRE_ANSWERS_KEY, JSON.stringify(updatedAnswers));
      } catch (error) {
        console.error("Error saving answers to localStorage:", error);
      }
      
      return updatedAnswers;
    });
  };

  const goToNextQuestion = (currentQuestionId: string, answer: any): string => {
    console.log("goToNextQuestion called with:", currentQuestionId, answer);
    
    try {
      // Calculate next question based on current question and answer
      const nextQuestionId = getNextQuestionId(currentQuestionId, answer);
      console.log("Next question calculated:", nextQuestionId);
      
      // Store the current answer
      updateAnswer(currentQuestionId, answer);
      
      // Check if this is the last question
      const isLast = isEndOfQuestionnaire(nextQuestionId);
      setIsLastQuestion(isLast);
      
      // If not at the end, update the current question state
      if (!isLast) {
        console.log("Setting currentQuestionId to:", nextQuestionId);
        setCurrentQuestionId(nextQuestionId);
        
        // Update history
        setQuestionHistory(prev => {
          const newHistory = [...prev, nextQuestionId];
          console.log("Updated history:", newHistory);
          
          // Save history to localStorage
          try {
            localStorage.setItem(QUESTIONNAIRE_HISTORY_KEY, JSON.stringify(newHistory));
          } catch (error) {
            console.error("Error saving history to localStorage:", error);
          }
          
          return newHistory;
        });
      }
      
      return nextQuestionId;
    } catch (error) {
      console.error("Error navigating to next question:", error);
      // In case of error, stay on current question
      return currentQuestionId;
    }
  };

  const goToPreviousQuestion = () => {
    console.log("goToPreviousQuestion called, current history:", questionHistory);
    
    if (questionHistory.length > 1) {
      try {
        // Remove current question from history
        const newHistory = [...questionHistory];
        newHistory.pop();
        
        // Set the previous question as current
        const previousQuestionId = newHistory[newHistory.length - 1];
        console.log("Going back to question:", previousQuestionId);
        
        setCurrentQuestionId(previousQuestionId);
        setQuestionHistory(newHistory);
        setIsLastQuestion(false);
        
        // Save updated history to localStorage
        localStorage.setItem(QUESTIONNAIRE_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Error navigating to previous question:", error);
      }
    }
  };

  const resetQuestionnaire = () => {
    console.log("Resetting questionnaire");
    setCurrentQuestionId("Q1");
    setAnswers(initialAnswers);
    setQuestionHistory(["Q1"]);
    setIsLastQuestion(false);
    
    // Clear localStorage
    try {
      localStorage.removeItem(QUESTIONNAIRE_ANSWERS_KEY);
      localStorage.removeItem(QUESTIONNAIRE_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        currentQuestionId,
        answers,
        updateAnswer,
        goToNextQuestion,
        goToPreviousQuestion,
        resetQuestionnaire,
        questionHistory,
        isLastQuestion
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = (): QuestionnaireContextType => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider");
  }
  return context;
};

export default QuestionnaireContext;
