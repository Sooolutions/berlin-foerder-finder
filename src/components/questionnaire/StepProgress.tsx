
import { Progress } from "@/components/ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress = ({ currentStep, totalSteps }: StepProgressProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>Schritt {currentStep} von {totalSteps}</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default StepProgress;
