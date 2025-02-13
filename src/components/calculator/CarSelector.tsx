
import { Car } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CarSelectorProps {
  selectedCar: string;
  onCarSelect: (value: string) => void;
  cars: Array<{ id: string; car_number: string }>;
}

export default function CarSelector({ selectedCar, onCarSelect, cars }: CarSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="carSelect" className="flex items-center gap-2 text-base sm:text-lg text-white">
        <Car className="w-4 h-4 text-[#9b87f5]" />
        Select Car
      </Label>
      <Select value={selectedCar} onValueChange={onCarSelect}>
        <SelectTrigger id="carSelect" className="mt-1 glass-card bg-transparent h-12 text-base">
          <SelectValue placeholder="Select a car" />
        </SelectTrigger>
        <SelectContent>
          {cars.map((car) => (
            <SelectItem key={car.id} value={car.id} className="text-base">
              {car.car_number}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
