import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import HistoryTable from "./history/HistoryTable";
import { History as HistoryIcon } from "lucide-react";
import ExportButtons from "./history/ExportButtons";
import YearlyChart from "./history/YearlyChart";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

export default function History() {
  const [readings, setReadings] = useState<any[]>([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { data, error } = await supabase
      .from("charging_history")
      .select("*, cars(*)")
      .order("date", {ascending:false})
      .eq("user_id", session.session.user.id);

    if (error) {
      console.error("Error fetching readings:", error);
      return;
    }

    setReadings(data);
  };

  const handleDelete = (id: string) => {
    setReadings((prev) => prev.filter((reading) => reading.id !== id));
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.split('\n').slice(1);
    
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to import data');
    }

    for (const row of rows) {
      const [date, carNumber, currentReading, previousReading, pricePerKwh, totalAmount] = row.split(',');
      
      if (!date || !carNumber || !currentReading || !previousReading || !pricePerKwh || !totalAmount) {
        throw new Error('Invalid CSV format. Please make sure all columns are present: Date, Car Number, Current Reading, Previous Reading, Price per kWh, Total Amount');
      }

      const { data: cars, error: carError } = await supabase
        .from('cars')
        .select('id')
        .eq('car_number', carNumber)
        .eq('user_id', session.session.user.id)
        .single();

      if (carError || !cars) {
        throw new Error(`Car ${carNumber} not found in your account`);
      }

      const { error: insertError } = await supabase
        .from('charging_history')
        .insert({
          date: new Date(date).toISOString(),
          car_id: cars.id,
          user_id: session.session.user.id,
          current_reading: Number(currentReading),
          previous_reading: Number(previousReading),
          price_per_kwh: Number(pricePerKwh),
          total_amount: Number(totalAmount)
        });

      if (insertError) {
        throw new Error(`Error importing reading for ${carNumber}: ${insertError.message}`);
      }
    }

    await fetchReadings();
  };

  return (
    <Card className="glass-card p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-[#9b87f5]" />
          <h2 className="text-2xl font-bold futuristic-gradient">{t("chargingHistory")}</h2>
        </div>

        <ExportButtons readings={readings} onImport={handleImport} />
      </div>
      <HistoryTable
        readings={readings}
        onDelete={handleDelete}
        onUpdate={fetchReadings}
      />
    </Card>
  );
}
