
import { Button } from "@/components/ui/button";

interface QuestionnaireNavProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const QuestionnaireNav = ({ onPrevious, onNext, isFirstStep, isLastStep }: QuestionnaireNavProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        Zurück
      </Button>
      <Button onClick={onNext}>
        {isLastStep ? "Ergebnisse anzeigen" : "Weiter"}
      </Button>
    </div>
  );
};

export default QuestionnaireNav;
