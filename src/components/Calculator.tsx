import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator as CalcIcon } from "lucide-react";
import { toast } from "sonner";
import { AdditionalCharge } from "@/types/calculator";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import CarSelector from "./calculator/CarSelector";
import MeterReadings from "./calculator/MeterReadings";
import AdditionalCharges from "./calculator/AdditionalCharges";
import { useNavigate } from "react-router-dom";
import CalculationResultDialog from "./calculator/CalculationResultDialog";

export default function Calculator() {
  const [currentReading, setCurrentReading] = useState<number>(0);
  const [pricePerKwh, setPricePerKwh] = useState<number>(0.5);
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([]);
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [cars, setCars] = useState<Array<{ id: string; car_number: string }>>([]);
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [calculationResult, setCalculationResult] = useState<{
    totalAmount: number;
    consumption: number;
    basicCost: number;
    additionalCost: number;
  } | null>(null);

  useEffect(() => {
    checkUserAndFetchCars();
  }, []);

  const checkUserAndFetchCars = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    fetchCars();
  };

  const fetchCars = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please login to view cars");
      return;
    }

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq('user_id', session.user.id)
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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please login to calculate cost");
      return;
    }

    if (!selectedCar) {
      toast.error("Please select a car");
      return;
    }

    const { data: previousReadings } = await supabase
      .from("charging_history")
      .select("current_reading")
      .eq("car_id", selectedCar)
      .eq("user_id", session.user.id)
      .order("date", { ascending: false })
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

    setCalculationResult({
      totalAmount,
      consumption,
      basicCost,
      additionalCost
    });
    setShowResult(true);

    const { data: historyEntry, error: historyError } = await supabase
      .from("charging_history")
      .insert([{
        car_id: selectedCar,
        user_id: session.user.id,
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
    
    // Reset form and refresh meter readings
    setAdditionalCharges([]);
    setCurrentReading(0);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setCalculationResult(null);
  };

  const selectedCarNumber = cars.find(car => car.id === selectedCar)?.car_number;

  return (
    <>
      <Card className="glass-card p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <CalcIcon className="w-8 h-8 text-[#9b87f5]" />
          <h2 className="text-2xl font-bold futuristic-gradient">
            EV Charging Calculator App
            {selectedCarNumber && (
              <span className="text-sm ml-2 opacity-75">
                (Car: {selectedCarNumber})
              </span>
            )}
          </h2>
        </div>
        
        <div className="space-y-4">
          <CarSelector
            selectedCar={selectedCar}
            onCarSelect={setSelectedCar}
            cars={cars}
          />

          <MeterReadings
            selectedCar={selectedCar}
            currentReading={currentReading}
            onCurrentReadingChange={setCurrentReading}
            pricePerKwh={pricePerKwh}
            onPricePerKwhChange={setPricePerKwh}
          />

          <AdditionalCharges
            charges={additionalCharges}
            onChargeAdd={handleAddCharge}
            onChargeRemove={handleRemoveCharge}
            onChargeUpdate={handleChargeUpdate}
          />

          <Button onClick={calculateCost} className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6]">
            <CalcIcon className="w-4 h-4 mr-2" />
            Calculate Cost
          </Button>
        </div>
      </Card>

      <CalculationResultDialog
        open={showResult}
        onOpenChange={handleCloseResult}
        result={calculationResult}
      />
    </>
  );
}
