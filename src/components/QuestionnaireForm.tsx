import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import StepProgress from "./questionnaire/StepProgress";
import AgeStep from "./questionnaire/steps/AgeStep";
import DistrictStep from "./questionnaire/steps/DistrictStep";
import IncomeStep from "./questionnaire/steps/IncomeStep";
import MaritalStatusStep from "./questionnaire/steps/MaritalStatusStep";
import QuestionnaireNav from "./questionnaire/steps/QuestionnaireNav";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { berlinDistricts, educationLevels, employmentStatus, interestAreas } from "@/data/mockData";

const QuestionnaireForm = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    answers,
    updateAnswers,
    goToNextStep,
    goToPreviousStep,
    isLastStep,
    totalSteps
  } = useQuestionnaire();

  const handleNext = () => {
    if (isLastStep) {
      navigate("/results");
    } else {
      goToNextStep();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AgeStep 
            value={answers.age}
            onChange={(value) => updateAnswers("age", value)}
          />
        );
      case 2:
        return (
          <DistrictStep
            value={answers.district}
            onChange={(value) => updateAnswers("district", value)}
          />
        );
      case 3:
        return (
          <IncomeStep
            value={answers.income}
            onChange={(value) => updateAnswers("income", value)}
          />
        );
      case 4:
        return (
          <MaritalStatusStep
            value={answers.maritalStatus}
            onChange={(value) => updateAnswers("maritalStatus", value)}
          />
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Haben Sie Kinder?</h3>
            <RadioGroup
              value={answers.hasChildren === null ? "" : answers.hasChildren ? "yes" : "no"}
              onValueChange={(value) => updateAnswers("hasChildren", value === "yes")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="children-yes" />
                <Label htmlFor="children-yes">Ja</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="children-no" />
                <Label htmlFor="children-no">Nein</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Was ist Ihr höchster Bildungsabschluss?</h3>
            <Select
              value={answers.educationLevel || ""}
              onValueChange={(value) => updateAnswers("educationLevel", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bildungsabschluss auswählen" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Was ist Ihr aktueller Beschäftigungsstatus?</h3>
            <Select
              value={answers.employmentStatus || ""}
              onValueChange={(value) => updateAnswers("employmentStatus", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Beschäftigungsstatus auswählen" />
              </SelectTrigger>
              <SelectContent>
                {employmentStatus.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Welche Themen interessieren Sie besonders?</h3>
            <div className="grid grid-cols-2 gap-2">
              {interestAreas.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={answers.interests.includes(interest)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateAnswers("interests", [...answers.interests, interest]);
                      } else {
                        updateAnswers(
                          "interests",
                          answers.interests.filter((i) => i !== interest)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`interest-${interest}`}>{interest}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-8">
        <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
        <div className="min-h-[400px] flex items-center justify-center py-8">
          {renderStepContent()}
        </div>
        <QuestionnaireNav
          onPrevious={goToPreviousStep}
          onNext={handleNext}
          isFirstStep={currentStep === 1}
          isLastStep={isLastStep}
        />
      </div>
    </div>
  );
};

export default QuestionnaireForm;
