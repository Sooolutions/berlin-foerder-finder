
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { berlinDistricts } from "@/data/mockData";

interface DistrictStepProps {
  value: string | null;
  onChange: (value: string) => void;
}

const DistrictStep = ({ value, onChange }: DistrictStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-3xl font-medium text-center mb-8">
        In welchem Bezirk wohnen Sie?
      </h3>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="w-full max-w-md mx-auto text-lg">
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
};

export default DistrictStep;
