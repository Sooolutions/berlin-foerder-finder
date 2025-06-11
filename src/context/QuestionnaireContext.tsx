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
      
    // Under 18 activity options
    case "Q2_U18":
      if (answer === "Schule") return "Q3_U18_Schule";
      if (answer === "Ausbildung") return "Q3_U18_Ausbildung";
      return "Q3_U18_nichtsdavon";
      
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
      
    // Under 18 school path
    case "Q3_U18_Schule":
      return answer === "Ja" ? "Q4_U18_Schule_Ja" : "Q4_U18_Schule_Nein";
      
    // Under 18 vocational training path
    case "Q3_U18_Ausbildung":
      if (answer === "1") return "Q4_U18_Ausbildung_1";
      if (answer === "2") return "Q4_U18_Ausbildung_2";
      if (answer === "3") return "Q4_U18_Ausbildung_3";
      return "Q4_U18_Ausbildung_Abschluss";
      
    // Under 18 other activities
    case "Q3_U18_nichtsdavon":
      if (answer === "Suche nach Ausbildung/Schule") return "Q4_U18_nichtsdavon_Suche";
      if (answer === "Praktikum") return "Q4_U18_nichtsdavon_Praktikum";
      if (answer === "Warten") return "Q4_U18_nichtsdavon_Warten";
      return "Q4_U18_nichtsdavon_Arbeiten";
      
    // 18-24 school path
    case "Q3_18_24_Schule":
      return answer === "Ja" ? "Q4_18_24_Schule_Ja" : "Q4_18_24_Schule_Nein";
      
    // 18-24 vocational training path
    case "Q3_18_24_Ausbildung":
      if (answer === "1") return "Q4_U18_Ausbildung_1"; // Reuse the under 18 path
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
    case "Q3_Ü65_Berufstätig":
    case "Q3_Ü65_Übergang":
    case "Q3_Ü65_Rente":
    case "Q3_Ü65_Pflege":
    case "Q3_Ü65_Sonstiges":
    case "Q4_U18_nichtsdavon_Suche":
    case "Q4_18_24_Studium_Anfänger:in":
    case "Q4_18_24_Studium_Mittendrin":
    case "Q4_18_24_Studium_Abschluss":
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
      
    // 18-24 school support
    case "Q4_18_24_Schule_Ja":
    case "Q4_18_24_Schule_Nein":
      const graduationStatus = currentQuestionId.split("_")[3];
      return answer === "Ja" ? `Q5_18_24_Schule_${graduationStatus}_Ja` : `Q5_18_24_Schule_${graduationStatus}_Nein`;
    
    // Additional support for vocational training
    case "Q5_U18_Ausbildung_1_Ja":
    case "Q5_U18_Ausbildung_2_Ja":
    case "Q5_U18_Ausbildung_3_Ja":
    case "Q5_U18_Ausbildung_Abschluss_Ja":
      const year = currentQuestionId.split("_")[3];
      return `Q6_U18_Ausbildung_${year}_Ja_Egal`;
      
    // All other Q5 and Q6 questions lead to final results
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
    
    // Store the current answer first
    updateAnswer(currentQuestionId, answer);
    
    try {
      // Calculate next question based on current question and answer
      const nextQuestionId = getNextQuestionId(currentQuestionId, answer);
      console.log("Next question calculated:", nextQuestionId);
      
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
    if (questionHistory.length > 1) {
      try {
        // Remove current question from history
        const newHistory = [...questionHistory];
        newHistory.pop();
        
        // Set the previous question as current
        const previousQuestionId = newHistory[newHistory.length - 1];
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
