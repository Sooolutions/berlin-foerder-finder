
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  value?: number; // Optional direct progress value
}

const StepProgress = ({ currentStep, totalSteps, value }: StepProgressProps) => {
  const [progressValue, setProgressValue] = useState(0);
  
  // Calculate progress as either the provided value or based on steps
  const progressPercentage = value !== undefined
    ? value
    : (currentStep / totalSteps) * 100;

  // Animate the progress bar
  useEffect(() => {
    setProgressValue(0);
    const timer = setTimeout(() => {
      setProgressValue(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>Schritt {currentStep} von {totalSteps}</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={progressValue} className="h-2 transition-all duration-500" />
    </div>
  );
};

export default StepProgress;
