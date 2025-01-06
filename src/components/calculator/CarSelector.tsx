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
    <div>
      <Label htmlFor="carSelect" className="flex items-center gap-2">
        <Car className="w-4 h-4 text-[#9b87f5]" />
        Select Car
      </Label>
      <Select value={selectedCar} onValueChange={onCarSelect}>
        <SelectTrigger className="mt-1 glass-card bg-transparent">
          <SelectValue placeholder="Select a car" />
        </SelectTrigger>
        <SelectContent>
          {cars.map((car) => (
            <SelectItem key={car.id} value={car.id}>
              {car.car_number}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}