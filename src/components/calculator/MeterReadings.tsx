import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MeterReadingsProps {
  selectedCar: string;
  currentReading: number;
  onCurrentReadingChange: (value: number) => void;
  pricePerKwh: number;
  onPricePerKwhChange: (value: number) => void;
}

export default function MeterReadings({
  selectedCar,
  currentReading,
  onCurrentReadingChange,
  pricePerKwh,
  onPricePerKwhChange
}: MeterReadingsProps) {
  const [lastReading, setLastReading] = useState<number | null>(null);

  useEffect(() => {
    if (selectedCar) {
      fetchLastReading();
    }
  }, [selectedCar, currentReading]); // Added currentReading as dependency

  const fetchLastReading = async () => {
    const { data } = await supabase
      .from("charging_history")
      .select("current_reading")
      .eq("car_id", selectedCar)
      .order("date", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setLastReading(data[0].current_reading);
    } else {
      setLastReading(null);
    }
  };

  return (
    <div className="space-y-4">
      {lastReading !== null && (
        <div>
          <Label className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#9b87f5]" />
            Last Meter Reading
          </Label>
          <Input
            type="number"
            value={lastReading}
            readOnly
            className="mt-1 glass-card bg-transparent opacity-50"
          />
        </div>
      )}

      <div>
        <Label htmlFor="currentReading" className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#9b87f5]" />
          Current Meter Reading
        </Label>
        <Input
          id="currentReading"
          type="number"
          value={currentReading}
          onChange={(e) => onCurrentReadingChange(Number(e.target.value))}
          className="mt-1 glass-card bg-transparent"
        />
      </div>

      <div>
        <Label htmlFor="pricePerKwh" className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#9b87f5]" />
          Price per kWh (₪)
        </Label>
        <Input
          id="pricePerKwh"
          type="number"
          value={pricePerKwh}
          onChange={(e) => onPricePerKwhChange(Number(e.target.value))}
          className="mt-1 glass-card bg-transparent"
          step="0.01"
        />
      </div>
    </div>
  );
}