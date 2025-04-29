
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { berlinDistricts, educationLevels, employmentStatus, interestAreas } from "@/data/mockData";

interface QuestionnaireContextType {
  currentQuestionId: string;
  answers: UserAnswers;
  updateAnswer: (questionId: string, answer: any) => void;
  goToNextQuestion: (currentQuestionId: string, answer: any) => string; // Changed to return string
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

// Define question branching logic
const getNextQuestionId = (currentQuestionId: string, answer: any): string => {
  // Define the branching logic based on the provided question flow
  switch (currentQuestionId) {
    case "Q1": // Age question
      if (answer === "unter 18") return "Q2_U18";
      if (answer === "18-24") return "Q2_18_24";
      if (answer === "25-64") return "Q2_25_64";
      if (answer === "über 65") return "Q2_Ü65";
      return "Q2_18_24"; // Default path
      
    case "Q2_U18": // Under 18 activity
      if (answer === "Schule") return "Q3_U18_Schule";
      if (answer === "Ausbildung") return "Q3_U18_Ausbildung";
      return "Q3_U18_nichtsdavon";
      
    case "Q2_18_24": // 18-24 activity
      if (answer === "Schule") return "Q3_18_24_Schule";
      if (answer === "Ausbildung") return "Q3_18_24_Ausbildung";
      if (answer === "Studium") return "Q3_18_24_Studium";
      if (answer === "Arbeit") return "Q3_18_24_Arbeit";
      if (answer === "Übergangsphase") return "Q3_18_24_Übergangsphase";
      return "Q3_18_24_Arbeitssuchend";
      
    case "Q3_U18_Schule": // Under 18 school, living with parents
      if (answer === "Ja") return "Q4_U18_Schule_Ja";
      return "Q4_U18_Schule_Nein";
      
    case "Q3_U18_Ausbildung": // Under 18 vocational training year
      if (answer === "1") return "Q4_U18_Ausbildung_1";
      if (answer === "2") return "Q4_U18_Ausbildung_2";
      if (answer === "3") return "Q4_U18_Ausbildung_3";
      return "Q4_U18_Ausbildung_Abschluss";
      
    case "Q3_U18_nichtsdavon": // Under 18 other activities
      if (answer === "Suche nach Ausbildung/Schule") return "Q4_U18_nichtsdavon_Suche";
      if (answer === "Praktikum") return "Q4_U18_nichtsdavon_Praktikum";
      if (answer === "Warten") return "Q4_U18_nichtsdavon_Warten";
      return "Q4_U18_nichtsdavon_Arbeiten";
      
    case "Q3_18_24_Schule": // 18-24 school, graduating soon
      if (answer === "Ja") return "Q4_18_24_Schule_Ja";
      return "Q4_18_24_Schule_Nein";
      
    case "Q3_18_24_Ausbildung": // 18-24 vocational training year
      return "Q3_U18_Ausbildung"; // Reuse under 18 vocational path
      
    case "Q3_18_24_Studium": // 18-24 university situation
      if (answer === "Studienanfänger:in") return "Q4_18_24_Studium_Anfänger:in";
      if (answer === "Mittendrin") return "Q4_18_24_Studium_Mittendrin";
      return "Q4_18_24_Studium_Abschluss";
      
    // Direct to final results for these cases
    case "Q3_18_24_Arbeit":
    case "Q3_18_24_Übergangsphase":
    case "Q3_18_24_Arbeitssuchend":
    case "Q4_U18_nichtsdavon_Suche":
    case "Q4_18_24_Studium_Anfänger:in":
    case "Q4_18_24_Studium_Mittendrin":
    case "Q4_18_24_Studium_Abschluss":
      return "final";
      
    case "Q4_U18_Schule_Ja": // Under 18 school, needs support
      if (answer === "Ja") return "Q5_U18_Schule_Ja_Ja";
      return "Q5_U18_Schule_Ja_Nein";
      
    case "Q4_U18_Schule_Nein": // Under 18 school, housing situation
      if (answer === "Eigene Wohnung") return "Q5_U18_Schule_Nein_EigeneWohnung";
      if (answer === "Betreuungseinrichtung") return "Q5_U18_Schule_Nein_Betreeungseinrichtung";
      if (answer === "Ich wohne bei Verwandten") return "Q5_U18_Schule_Nein_Verwandte";
      return "Q5_U18_Schule_Nein_Sonstiges";
      
    // Financing issues during vocational training
    case "Q4_U18_Ausbildung_1":
    case "Q4_U18_Ausbildung_2":
    case "Q4_U18_Ausbildung_3":
    case "Q4_U18_Ausbildung_Abschluss":
      if (answer === "Ja") {
        // Extract the year from the question ID for the next step
        const year = currentQuestionId.split("_")[3];
        return `Q5_U18_Ausbildung_${year}_Ja`;
      } else {
        const year = currentQuestionId.split("_")[3];
        return `Q5_U18_Ausbildung_${year}_Nein`;
      }
      
    // Preparation for school/vocational training/work
    case "Q4_U18_nichtsdavon_Praktikum":
    case "Q4_U18_nichtsdavon_Warten":
    case "Q4_U18_nichtsdavon_Arbeiten":
      if (answer === "Ja") {
        const activity = currentQuestionId.split("_")[3];
        return `Q5_U18_nichtsdavon_${activity}_Ja`;
      } else {
        const activity = currentQuestionId.split("_")[3];
        return `Q5_U18_nichtsdavon_${activity}_Nein`;
      }
      
    // School support for 18-24 year olds  
    case "Q4_18_24_Schule_Ja":
    case "Q4_18_24_Schule_Nein":
      if (answer === "Ja") {
        const status = currentQuestionId.split("_")[3];
        return `Q5_18_24_Schule_${status}_Ja`;
      } else {
        const status = currentQuestionId.split("_")[3];
        return `Q5_18_24_Schule_${status}_Nein`;
      }
      
    // Support needed during vocational training
    case "Q5_U18_Ausbildung_1_Ja":
    case "Q5_U18_Ausbildung_2_Ja":
    case "Q5_U18_Ausbildung_3_Ja":
    case "Q5_U18_Ausbildung_Abschluss_Ja":
      const year = currentQuestionId.split("_")[3];
      return `Q6_U18_Ausbildung_${year}_Ja_Egal`;
    
    // All other Q5 questions lead to final results
    case "Q5_U18_Schule_Ja_Ja":
    case "Q5_U18_Schule_Ja_Nein":
    case "Q5_U18_Schule_Nein_EigeneWohnung":
    case "Q5_U18_Schule_Nein_Betreeungseinrichtung":
    case "Q5_U18_Schule_Nein_Verwandte":
    case "Q5_U18_Schule_Nein_Sonstiges":
    case "Q5_U18_Ausbildung_1_Nein":
    case "Q5_U18_Ausbildung_2_Nein":
    case "Q5_U18_Ausbildung_3_Nein":
    case "Q5_U18_Ausbildung_Abschluss_Nein":
    case "Q5_U18_nichtsdavon_Praktikum_Ja":
    case "Q5_U18_nichtsdavon_Warten_Ja":
    case "Q5_U18_nichtsdavon_Arbeiten_Ja":
    case "Q5_U18_nichtsdavon_Praktikum_Nein":
    case "Q5_U18_nichtsdavon_Warten_Nein":
    case "Q5_U18_nichtsdavon_Arbeiten_Nein":
    case "Q5_18_24_Schule_Ja_Ja":
    case "Q5_18_24_Schule_Nein_Ja":
    case "Q5_18_24_Schule_Ja_Nein":
    case "Q5_18_24_Schule_Nein_Nein":
    case "Q6_U18_Ausbildung_1_Ja_Egal":
    case "Q6_U18_Ausbildung_2_Ja_Egal":
    case "Q6_U18_Ausbildung_3_Ja_Egal":
    case "Q6_U18_Ausbildung_Abschluss_Ja_Egal":
      return "final";
      
    default:
      return "final"; // Default path for anything else
  }
};

// Check if the question is the last one (leads to results)
const isEndOfQuestionnaire = (nextQuestionId: string): boolean => {
  return nextQuestionId === "final";
};

// Key for storing questionnaire answers in localStorage
const QUESTIONNAIRE_ANSWERS_KEY = "questionnaire_answers";

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState("Q1"); // Start with first question
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const [questionHistory, setQuestionHistory] = useState<string[]>(["Q1"]); // Track question path
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  // Load answers from localStorage if available
  useEffect(() => {
    const savedAnswers = localStorage.getItem(QUESTIONNAIRE_ANSWERS_KEY);
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setAnswers(parsedAnswers);
      } catch (error) {
        console.error("Error parsing saved answers:", error);
      }
    }
  }, []);

  const updateAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [questionId]: answer,
      };
      
      // Save to localStorage
      localStorage.setItem(QUESTIONNAIRE_ANSWERS_KEY, JSON.stringify(updatedAnswers));
      
      return updatedAnswers;
    });
  };

  const goToNextQuestion = (currentQuestionId: string, answer: any): string => {
    // Store the current answer
    updateAnswer(currentQuestionId, answer);
    
    try {
      // Calculate next question based on current question and answer
      const nextQuestionId = getNextQuestionId(currentQuestionId, answer);
      
      // Check if this is the last question
      const isLast = isEndOfQuestionnaire(nextQuestionId);
      setIsLastQuestion(isLast);
      
      // If not at the end, go to next question
      if (!isLast) {
        setCurrentQuestionId(nextQuestionId);
        setQuestionHistory((prev) => [...prev, nextQuestionId]);
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
      } catch (error) {
        console.error("Error navigating to previous question:", error);
      }
    }
  };

  const resetQuestionnaire = () => {
    setCurrentQuestionId("Q1");
    setAnswers(initialAnswers);
    setQuestionHistory(["Q1"]);
    setIsLastQuestion(false);
    localStorage.removeItem(QUESTIONNAIRE_ANSWERS_KEY);
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
