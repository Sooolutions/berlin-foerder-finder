
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import StepProgress from "./questionnaire/StepProgress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuestionData, getQuestionData } from "@/data/questionnaireData";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const DynamicQuestionnaireForm = () => {
  const navigate = useNavigate();
  const {
    currentQuestionId,
    answers,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    questionHistory,
    isLastQuestion,
    resetQuestionnaire
  } = useQuestionnaire();

  // Track loading state to prevent multiple clicks
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get the current question data
  const questionData = getQuestionData(currentQuestionId);

  // Constant total steps to make progress more predictable
  // Most paths have around 4-6 questions based on the provided structure
  const estimatedTotalSteps = 6;
  
  // Calculate progress based on how far we are in our question history
  const progressPercentage = Math.min(
    ((questionHistory.length) / estimatedTotalSteps) * 100,
    100
  );

  // Handle the selection of an answer
  const handleSelect = (value: string) => {
    if (isProcessing) return; // Prevent multiple clicks
    
    setIsProcessing(true);
    updateAnswer(currentQuestionId, value);
    
    try {
      const nextQuestionId = goToNextQuestion(currentQuestionId, value);
      
      // Navigate to results if we've reached the final step
      if (nextQuestionId === "final") {
        setTimeout(() => {
          navigate("/results");
          setIsProcessing(false);
        }, 500); // Small delay for better UX
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error navigating to next question:", error);
      setIsProcessing(false);
    }
  };

  // If no question data is found, provide option to reset the questionnaire
  if (!questionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <h3 className="text-2xl font-medium mb-4">Frage nicht gefunden</h3>
        <p className="text-gray-500 mb-6">Die Frage mit der ID "{currentQuestionId}" konnte nicht gefunden werden.</p>
        <Button onClick={resetQuestionnaire}>Fragebogen neu starten</Button>
      </div>
    );
  }

  // Render the current question
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-8">
        <StepProgress 
          currentStep={questionHistory.length} 
          totalSteps={estimatedTotalSteps} 
          value={progressPercentage} 
        />
        
        <div className="min-h-[400px] flex items-center justify-center py-8">
          <div className="space-y-6 animate-fade-in w-full">
            <h3 className="text-3xl font-medium text-center mb-8">{questionData.question}</h3>

            {Array.isArray(questionData.options) && questionData.options.length > 0 && (
              <RadioGroup
                value={answers[currentQuestionId] || ""}
                onValueChange={handleSelect}
                className="max-w-md mx-auto grid grid-cols-1 gap-4"
                name={`question-${currentQuestionId}`}
              >
                {questionData.options.map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-4 rounded-lg border border-input hover:border-primary transition-colors">
                    <RadioGroupItem value={option} id={`option-${currentQuestionId}-${option.replace(/\s/g, '-')}`} />
                    <Label 
                      htmlFor={`option-${currentQuestionId}-${option.replace(/\s/g, '-')}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                    {answers[currentQuestionId] === option && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={questionHistory.length <= 1 || isProcessing}
          >
            Zurück
          </Button>

          {/* Remove the "Ergebnisse anzeigen" button as we now auto-navigate */}
        </div>
      </div>
    </div>
  );
};

export default DynamicQuestionnaireForm;
