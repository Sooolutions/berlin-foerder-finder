
import React, { createContext, useState, useContext, ReactNode } from "react";
import { berlinDistricts, educationLevels, employmentStatus, interestAreas } from "@/data/mockData";

interface QuestionnaireContextType {
  currentStep: number;
  answers: UserAnswers;
  setCurrentStep: (step: number) => void;
  updateAnswers: (field: keyof UserAnswers, value: any) => void;
  resetQuestionnaire: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isLastStep: boolean;
  totalSteps: number;
}

export interface UserAnswers {
  age: number | null;
  district: string | null;
  income: number | null;
  maritalStatus: 'single' | 'married' | 'partnered' | null;
  hasChildren: boolean | null;
  educationLevel: string | null;
  employmentStatus: string | null;
  interests: string[];
}

const initialAnswers: UserAnswers = {
  age: null,
  district: null,
  income: null,
  maritalStatus: null,
  hasChildren: null,
  educationLevel: null,
  employmentStatus: null,
  interests: [],
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);

  const totalSteps = 8; // Anzahl der Schritte im Fragebogen
  const isLastStep = currentStep === totalSteps;

  const updateAnswers = (field: keyof UserAnswers, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetQuestionnaire = () => {
    setCurrentStep(1);
    setAnswers(initialAnswers);
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        currentStep,
        answers,
        setCurrentStep,
        updateAnswers,
        resetQuestionnaire,
        goToNextStep,
        goToPreviousStep,
        isLastStep,
        totalSteps
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
