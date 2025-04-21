
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MaritalStatusStepProps {
  value: 'single' | 'married' | 'partnered' | null;
  onChange: (value: 'single' | 'married' | 'partnered') => void;
}

const MaritalStatusStep = ({ value, onChange }: MaritalStatusStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-3xl font-medium text-center mb-8">
        Was ist Ihr Familienstand?
      </h3>
      <RadioGroup
        value={value || ""}
        onValueChange={onChange}
        className="max-w-md mx-auto grid grid-cols-1 gap-4"
      >
        {[
          { value: "single", label: "Ledig" },
          { value: "married", label: "Verheiratet" },
          { value: "partnered", label: "In Partnerschaft" },
        ].map((option) => (
          <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-input hover:border-primary transition-colors">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MaritalStatusStep;
