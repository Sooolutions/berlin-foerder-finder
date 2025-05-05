
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
    // Reset progress to create animation effect
    setProgressValue(0);
    
    // Use requestAnimationFrame for smoother animation
    const animationFrame = requestAnimationFrame(() => {
      // Small delay to ensure the animation is visible
      setTimeout(() => {
        setProgressValue(progressPercentage);
      }, 50);
    });
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [progressPercentage]);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>Schritt {currentStep} von {totalSteps}</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <Progress 
        value={progressValue} 
        className="h-2 transition-all duration-500" 
        aria-label="Fragebogen-Fortschritt" 
      />
    </div>
  );
};

export default StepProgress;
