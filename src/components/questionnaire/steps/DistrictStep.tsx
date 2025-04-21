
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { berlinDistricts } from "@/data/mockData";

interface DistrictStepProps {
  value: string | null;
  onChange: (value: string) => void;
}

const DistrictStep = ({ value, onChange }: DistrictStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">In welchem Bezirk wohnen Sie?</h3>
      <Select value={value || ""} onValueChange={onChange}>
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
};

export default DistrictStep;
