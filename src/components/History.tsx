import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import HistoryTable from "./history/HistoryTable";
import ExportButtons from "./history/ExportButtons";
import YearlyChart from "./history/YearlyChart";
import { toast } from "sonner";

export default function History() {
  const [readings, setReadings] = useState<any[]>([]);
  
  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { data, error } = await supabase
      .from("charging_history")
      .select("*, cars(*)")
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

    try {
      const text = await file.text();
      const rows = text.split('\n').slice(1); // Skip header row
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      for (const row of rows) {
        const [date, carNumber, currentReading, previousReading, pricePerKwh, totalAmount] = row.split(',');
        
        // Find car by number
        const { data: cars } = await supabase
          .from('cars')
          .select('id')
          .eq('car_number', carNumber)
          .eq('user_id', session.session.user.id)
          .single();

        if (!cars) {
          toast.error(`Car ${carNumber} not found`);
          continue;
        }

        const { error } = await supabase
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

        if (error) {
          toast.error(`Error importing reading for ${carNumber}`);
          console.error(error);
        }
      }

      toast.success('Import completed');
      fetchReadings();
    } catch (error) {
      toast.error('Error importing CSV file');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <YearlyChart />
      <div className="flex justify-end">
        <ExportButtons readings={readings} onImport={handleImport} />
      </div>
      <HistoryTable
        readings={readings}
        onDelete={handleDelete}
        onUpdate={fetchReadings}
      />
    </div>
  );
}