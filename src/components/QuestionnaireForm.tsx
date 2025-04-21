
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
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

  const progressPercentage = (currentStep / totalSteps) * 100;

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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Wie alt sind Sie?</h3>
            <Input
              type="number"
              id="age"
              placeholder="Alter eingeben"
              className="w-full"
              value={answers.age || ""}
              onChange={(e) => updateAnswers("age", parseInt(e.target.value) || null)}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">In welchem Bezirk wohnen Sie?</h3>
            <Select
              value={answers.district || ""}
              onValueChange={(value) => updateAnswers("district", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bezirk auswählen" />
              </SelectTrigger>
              <SelectContent>
                {berlinDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Wie hoch ist Ihr jährliches Bruttoeinkommen?</h3>
            <Input
              type="number"
              id="income"
              placeholder="Jahreseinkommen in Euro"
              className="w-full"
              value={answers.income || ""}
              onChange={(e) => updateAnswers("income", parseInt(e.target.value) || null)}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Was ist Ihr Familienstand?</h3>
            <RadioGroup
              value={answers.maritalStatus || ""}
              onValueChange={(value) => updateAnswers("maritalStatus", value as 'single' | 'married' | 'partnered')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Ledig</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="married" id="married" />
                <Label htmlFor="married">Verheiratet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partnered" id="partnered" />
                <Label htmlFor="partnered">In Partnerschaft</Label>
              </div>
            </RadioGroup>
          </div>
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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Schritt {currentStep} von {totalSteps}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {renderStepContent()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
          >
            Zurück
          </Button>
          <Button onClick={handleNext}>
            {isLastStep ? "Ergebnisse anzeigen" : "Weiter"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
