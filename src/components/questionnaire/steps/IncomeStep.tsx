
import { Input } from "@/components/ui/input";

interface IncomeStepProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const IncomeStep = ({ value, onChange }: IncomeStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-3xl font-medium text-center mb-8">
        Wie hoch ist Ihr jährliches Bruttoeinkommen?
      </h3>
      <Input
        type="number"
        id="income"
        placeholder="Jahreseinkommen in Euro"
        className="w-full max-w-md mx-auto text-lg"
        value={value || ""}
        onChange={(e) => onChange(parseInt(e.target.value) || null)}
      />
    </div>
  );
};

export default IncomeStep;
