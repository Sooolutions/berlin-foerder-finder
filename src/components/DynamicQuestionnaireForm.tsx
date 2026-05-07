
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import StepProgress from "./questionnaire/StepProgress";
import { Button } from "@/components/ui/button";
import { getQuestionData } from "@/data/questionnaireData";
import { useState, useEffect } from "react";
import { CheckCircle, ArrowLeft, Shield, Users, ArrowRight } from "lucide-react";

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
  } = useQuestionnaire();

  const [isProcessing, setIsProcessing] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'slide-out' | 'slide-in'>('idle');
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  
  // Multi-select: track currently checked items
  const [multiSelections, setMultiSelections] = useState<string[]>([]);
  
  const questionData = getQuestionData(currentQuestionId);
  const isMultiSelect = questionData?.multiSelect === true;
  const maxSelections = questionData?.maxSelections || 3;

  // Reset multi-selections when question changes
  useEffect(() => {
    const existing = answers[currentQuestionId];
    if (Array.isArray(existing)) {
      setMultiSelections(existing);
    } else {
      setMultiSelections([]);
    }
  }, [currentQuestionId]);

  const estimatedTotalSteps = 10;
  const progressPercentage = Math.min(
    ((questionHistory.length) / estimatedTotalSteps) * 100,
    95
  );

  const handleBack = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setAnimationDirection('backward');
    setAnimationState('slide-out');
    setTimeout(() => {
      if (questionHistory.length > 1) {
        goToPreviousQuestion();
      } else {
        navigate("/");
      }
      setAnimationState('slide-in');
      setTimeout(() => {
        setAnimationState('idle');
        setIsProcessing(false);
      }, 250);
    }, 250);
  };

  const animateForward = (answerValue?: string) => {
    setAnimationDirection('forward');
    setAnimationState('slide-out');
    setTimeout(() => {
      if (isLastQuestion) {
        navigate("/results");
      } else {
        goToNextQuestion(answerValue);
      }
      setAnimationState('slide-in');
      setTimeout(() => {
        setAnimationState('idle');
        setIsProcessing(false);
      }, 250);
    }, 250);
  };

  const handleSingleSelect = (value: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    updateAnswer(currentQuestionId, value);
    animateForward(value);
  };

  const handleMultiToggle = (value: string) => {
    if (isProcessing) return;
    setMultiSelections(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      }
      if (prev.length >= maxSelections) return prev;
      return [...prev, value];
    });
  };

  const handleMultiConfirm = () => {
    if (isProcessing || multiSelections.length === 0) return;
    setIsProcessing(true);
    updateAnswer(currentQuestionId, multiSelections);
    animateForward();
  };

  if (!questionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-2xl font-medium mb-4 text-red-800">Frage nicht gefunden</h3>
          <p className="text-red-600 mb-6">Die Frage mit der ID &quot;{currentQuestionId}&quot; konnte nicht gefunden werden.</p>
          <Button onClick={() => navigate("/")} className="bg-berlin-orange hover:bg-berlin-orange/90">
            Fragebogen neu starten
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm border-b border-gray-100 p-3 mb-4 rounded-t-lg">
        <div className="flex items-center justify-center space-x-4 md:space-x-6 text-xs md:text-sm text-gray-600">
          <div className="flex items-center space-x-1 md:space-x-2">
            <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
            <span className="hidden sm:inline">Sicher & Vertraulich</span>
            <span className="sm:hidden">Sicher</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <Users className="w-3 h-3 md:w-4 md:h-4 text-berlin-blue" />
            <span className="hidden sm:inline">Von Berlinern für Berliner</span>
            <span className="sm:hidden">Berlin</span>
          </div>
        </div>
      </div>

      <div className={`bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 transition-all duration-250 ease-out ${
        animationState === 'slide-out' ? 
          (animationDirection === 'forward' ? 'animate-slide-out-left' : 'animate-slide-out-right') :
        animationState === 'slide-in' ? 
          (animationDirection === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left') :
        'animate-fade-in'
      }`}>
        <div className="p-6">
          <StepProgress 
            currentStep={questionHistory.length} 
            totalSteps={estimatedTotalSteps} 
            value={progressPercentage} 
          />
          
          <div className="py-6">
            <div className="space-y-6 w-full">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-berlin-blue mb-3">
                  {questionData.question}
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                  {isMultiSelect 
                    ? `Wähle bis zu ${maxSelections} Optionen, die auf dich zutreffen.`
                    : "Wähle die Option, die am besten zu deiner aktuellen Situation passt."
                  }
                </p>
              </div>

              {Array.isArray(questionData.options) && questionData.options.length > 0 && (
                <div className={`max-w-4xl mx-auto grid gap-3 ${
                  questionData.options.length <= 3 ? 'grid-cols-1' :
                  questionData.options.length <= 6 ? 'grid-cols-1 md:grid-cols-2' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {questionData.options.map((option, index) => {
                    const isSelected = isMultiSelect
                      ? multiSelections.includes(option)
                      : answers[currentQuestionId] === option;
                    
                    const isDisabled = isMultiSelect && !isSelected && multiSelections.length >= maxSelections;

                    return (
                      <div 
                        key={`${currentQuestionId}-${option}`}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-berlin-orange bg-berlin-orange/5 shadow-md' 
                            : isDisabled
                              ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 bg-white hover:border-berlin-orange hover:shadow-md hover:bg-gray-50'
                        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => {
                          if (isDisabled) return;
                          if (isMultiSelect) {
                            handleMultiToggle(option);
                          } else {
                            handleSingleSelect(option);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          {isMultiSelect ? (
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isSelected 
                                ? 'border-berlin-orange bg-berlin-orange' 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          ) : (
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected 
                                ? 'border-berlin-orange bg-berlin-orange' 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              )}
                            </div>
                          )}
                          <span className="flex-1 text-sm md:text-base font-medium text-gray-800 leading-tight">
                            {option}
                          </span>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-berlin-orange animate-fade-in-up flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2 hover:bg-gray-50"
              disabled={isProcessing}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </Button>
            
            {isMultiSelect ? (
              <Button
                onClick={handleMultiConfirm}
                disabled={isProcessing || multiSelections.length === 0}
                className="flex items-center space-x-2 bg-berlin-orange hover:bg-berlin-orange/90 text-white"
              >
                <span>Weiter ({multiSelections.length}/{maxSelections})</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="text-xs md:text-sm text-gray-500">
                Alle Angaben werden vertraulich behandelt
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicQuestionnaireForm;
