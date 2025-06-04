
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import StepProgress from "./questionnaire/StepProgress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuestionData, getQuestionData } from "@/data/questionnaireData";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, Shield, Users } from "lucide-react";

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

  // Reset questionnaire when component mounts to start fresh
  useEffect(() => {
    resetQuestionnaire();
  }, [resetQuestionnaire]);

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
        setTimeout(() => {
          setIsProcessing(false);
        }, 300); // Small delay for better UX even when not navigating to results
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-2xl font-medium mb-4 text-red-800">Frage nicht gefunden</h3>
          <p className="text-red-600 mb-6">Die Frage mit der ID "{currentQuestionId}" konnte nicht gefunden werden.</p>
          <Button onClick={() => navigate("/")} className="bg-berlin-orange hover:bg-berlin-orange/90">
            Fragebogen neu starten
          </Button>
        </div>
      </div>
    );
  }

  // Render the current question
  return (
    <div className="max-w-4xl mx-auto">
      {/* Trust header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4 mb-6 rounded-t-lg">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Sicher & Vertraulich</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-berlin-blue" />
            <span>Von Berlinern für Berliner</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-berlin-orange" />
            <span>Offiziell verifiziert</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
        <div className="p-8">
          <StepProgress 
            currentStep={questionHistory.length} 
            totalSteps={estimatedTotalSteps} 
            value={progressPercentage} 
          />
          
          <div className="min-h-[450px] flex items-center justify-center py-8">
            <div className="space-y-8 animate-fade-in-up w-full">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-berlin-blue mb-4">
                  {questionData.question}
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Wähle die Option, die am besten zu deiner aktuellen Situation passt.
                </p>
              </div>

              {Array.isArray(questionData.options) && questionData.options.length > 0 && (
                <RadioGroup
                  value={answers[currentQuestionId] || ""}
                  onValueChange={handleSelect}
                  className="max-w-2xl mx-auto grid grid-cols-1 gap-4"
                  name={`question-${currentQuestionId}`}
                >
                  {questionData.options.map((option, index) => (
                    <div 
                      key={option} 
                      className={`flex items-center space-x-4 p-6 rounded-xl border-2 transition-all duration-300 hover:border-berlin-orange hover:shadow-md cursor-pointer ${
                        answers[currentQuestionId] === option 
                          ? 'border-berlin-orange bg-berlin-orange/5 shadow-md' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${currentQuestionId}-${option.replace(/\s/g, '-')}`}
                        className="text-berlin-orange border-berlin-orange" 
                      />
                      <Label 
                        htmlFor={`option-${currentQuestionId}-${option.replace(/\s/g, '-')}`}
                        className="flex-1 cursor-pointer text-lg font-medium text-gray-800"
                      >
                        {option}
                      </Label>
                      {answers[currentQuestionId] === option && (
                        <CheckCircle className="h-6 w-6 text-berlin-orange animate-fade-in-up" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </Button>
            
            <div className="text-sm text-gray-500">
              Alle Angaben werden vertraulich behandelt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicQuestionnaireForm;
