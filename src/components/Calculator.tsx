import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X, Calculator as CalcIcon, Zap, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { AdditionalCharge, Reading } from "@/types/calculator";
import { v4 as uuidv4 } from "uuid";

export default function Calculator() {
  const [currentReading, setCurrentReading] = useState<number>(0);
  const [pricePerKwh, setPricePerKwh] = useState<number>(0.5);
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([]);

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

  const calculateCost = () => {
    const previousReadings = JSON.parse(localStorage.getItem("readings") || "[]") as Reading[];
    const previousReading = previousReadings[0]?.currentReading || 0;
    
    if (currentReading < previousReading) {
      toast.error("Current reading cannot be less than previous reading");
      return;
    }

    const consumption = currentReading - previousReading;
    const basicCost = consumption * pricePerKwh;
    const additionalCost = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
    const totalAmount = basicCost + additionalCost;

    const newReading: Reading = {
      id: uuidv4(),
      date: new Date().toISOString(),
      currentReading,
      previousReading,
      pricePerKwh,
      additionalCharges,
      totalAmount,
    };

    const updatedReadings = [newReading, ...previousReadings];
    localStorage.setItem("readings", JSON.stringify(updatedReadings));
    
    toast.success(`Calculation complete! Total amount: ₪${totalAmount.toFixed(2)}`);
  };

  return (
    <Card className="glass-card p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <CalcIcon className="w-8 h-8 text-[#9b87f5]" />
        <h2 className="text-2xl font-bold futuristic-gradient">EV Charging Calculator</h2>
      </div>
      
      <div className="space-y-4">
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