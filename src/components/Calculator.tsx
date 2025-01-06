import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Calculator as CalcIcon, Zap, PlusCircle, Car } from "lucide-react";
import { toast } from "sonner";
import { AdditionalCharge } from "@/types/calculator";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

export default function Calculator() {
  const [currentReading, setCurrentReading] = useState<number>(0);
  const [pricePerKwh, setPricePerKwh] = useState<number>(0.5);
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [cars, setCars] = useState<Array<{ id: string; car_number: string }>>([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Error fetching cars");
      return;
    }

    setCars(data || []);
    if (data && data.length > 0 && !selectedCar) {
      setSelectedCar(data[0].id);
    }
  };

  const handleAddCharge = () => {
    setAdditionalCharges([
      ...additionalCharges,
      { id: uuidv4(), description: "", amount: 0 },
    ]);
  };

  const handleRemoveCharge = (id: string) => {
    setAdditionalCharges(additionalCharges.filter(charge => charge.id !== id));
  };

  const handleChargeUpdate = (id: string, field: "description" | "amount", value: string) => {
    setAdditionalCharges(
      additionalCharges.map(charge =>
        charge.id === id
          ? { ...charge, [field]: field === "amount" ? Number(value) : value }
          : charge
      )
    );
  };

  const calculateCost = async () => {
    if (!selectedCar) {
      toast.error("Please select a car");
      return;
    }

    // Get the previous reading from Supabase
    const { data: previousReadings } = await supabase
      .from("charging_history")
      .select("current_reading")
      .eq("car_id", selectedCar)
      .order("created_at", { ascending: false })
      .limit(1);

    const previousReading = previousReadings && previousReadings[0] ? previousReadings[0].current_reading : 0;
    
    if (currentReading < previousReading) {
      toast.error("Current reading cannot be less than previous reading");
      return;
    }

    const consumption = currentReading - previousReading;
    const basicCost = consumption * pricePerKwh;
    const additionalCost = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const totalAmount = basicCost + additionalCost;

    // Store the reading in Supabase
    const { data: historyEntry, error: historyError } = await supabase
      .from("charging_history")
      .insert([{
        car_id: selectedCar,
        current_reading: currentReading,
        previous_reading: previousReading,
        price_per_kwh: pricePerKwh,
        total_amount: totalAmount,
      }])
      .select()
      .single();

    if (historyError) {
      toast.error("Error saving charging history");
      return;
    }

    // Store additional charges
    if (additionalCharges.length > 0) {
      const { error: chargesError } = await supabase
        .from("additional_charges")
        .insert(
          additionalCharges.map(charge => ({
            charging_history_id: historyEntry.id,
            description: charge.description,
            amount: charge.amount,
          }))
        );

      if (chargesError) {
        toast.error("Error saving additional charges");
        return;
      }
    }
    
    toast.success(`Calculation complete! Total amount: ₪${totalAmount.toFixed(2)}`);
    setAdditionalCharges([]);
  };

  const selectedCarNumber = cars.find(car => car.id === selectedCar)?.car_number;

  return (
    <Card className="glass-card p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <CalcIcon className="w-8 h-8 text-[#9b87f5]" />
        <h2 className="text-2xl font-bold futuristic-gradient">
          EV Charging Calculator
          {selectedCarNumber && (
            <span className="text-sm ml-2 opacity-75">
              (Car: {selectedCarNumber})
            </span>
          )}
        </h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="carSelect" className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#9b87f5]" />
            Select Car
          </Label>
          <Select value={selectedCar} onValueChange={setSelectedCar}>
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

        <div>
          <Label htmlFor="currentReading" className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#9b87f5]" />
            Current Meter Reading
          </Label>
          <Input
            id="currentReading"
            type="number"
            value={currentReading}
            onChange={(e) => setCurrentReading(Number(e.target.value))}
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
            onChange={(e) => setPricePerKwh(Number(e.target.value))}
            className="mt-1 glass-card bg-transparent"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#9b87f5]" />
              Additional Charges
            </Label>
            <Button onClick={handleAddCharge} variant="outline" size="sm" className="glass-card hover:bg-white/20">
              <Plus className="w-4 h-4 mr-1" /> Add Charge
            </Button>
          </div>

          {additionalCharges.map((charge) => (
            <div key={charge.id} className="flex gap-2 items-start">
              <Input
                placeholder="Description"
                value={charge.description}
                onChange={(e) => handleChargeUpdate(charge.id, "description", e.target.value)}
                className="flex-grow glass-card bg-transparent"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={charge.amount}
                onChange={(e) => handleChargeUpdate(charge.id, "amount", e.target.value)}
                className="w-32 glass-card bg-transparent"
                step="0.01"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCharge(charge.id)}
                className="text-red-500 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={calculateCost} className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6]">
          <CalcIcon className="w-4 h-4 mr-2" />
          Calculate Cost
        </Button>
      </div>
    </Card>
  );
}