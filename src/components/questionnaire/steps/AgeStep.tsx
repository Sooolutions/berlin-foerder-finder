
import { Input } from "@/components/ui/input";

interface AgeStepProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const AgeStep = ({ value, onChange }: AgeStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Wie alt sind Sie?</h3>
      <Input
        type="number"
        id="age"
        placeholder="Alter eingeben"
        className="w-full"
        value={value || ""}
        onChange={(e) => onChange(parseInt(e.target.value) || null)}
      />
    </div>
  );
};

export default AgeStep;
