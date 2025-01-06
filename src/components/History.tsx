import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { History as HistoryIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HistoryTable from "./history/HistoryTable";
import ExportButtons from "./history/ExportButtons";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [readings, setReadings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndFetchReadings();
  }, []);

  const checkUserAndFetchReadings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    fetchReadings();
  };

  const fetchReadings = async () => {
    const { data, error } = await supabase
      .from("charging_history")
      .select(`
        *,
        cars (
          car_number
        ),
        additional_charges (
          description,
          amount
        )
      `)
      .order("date", { ascending: false });

    if (error) {
      toast.error("Error fetching history");
      return;
    }

    setReadings(data || []);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const data = rows.slice(1);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please login to import data");
          return;
        }

        const { data: userCars } = await supabase
          .from('cars')
          .select('id, car_number')
          .eq('user_id', session.user.id);

        for (const row of data) {
          if (row.length < 6) continue;

          const carNumber = row[1]?.trim();
          const car = userCars?.find(c => c.car_number === carNumber);
          
          if (!car) {
            toast.error(`Car ${carNumber} not found. Please add it first.`);
            continue;
          }

          const reading = {
            car_id: car.id,
            user_id: session.user.id,
            date: new Date(row[0]).toISOString(),
            current_reading: parseFloat(row[2]),
            previous_reading: parseFloat(row[3]),
            price_per_kwh: parseFloat(row[4]),
            total_amount: parseFloat(row[5])
          };

          const { error } = await supabase
            .from('charging_history')
            .insert([reading]);

          if (error) {
            console.error('Error importing row:', error);
            toast.error(`Error importing reading for ${carNumber}`);
          }
        }

        toast.success('Import completed');
        fetchReadings();
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Error parsing CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = (id: string) => {
    setReadings(readings.filter(reading => reading.id !== id));
  };

  return (
    <Card className="glass-card p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-[#9b87f5]" />
          <h2 className="text-2xl font-bold futuristic-gradient">Charging History</h2>
        </div>
        <ExportButtons readings={readings} onImport={handleImportCSV} />
      </div>

      <HistoryTable 
        readings={readings} 
        onDelete={handleDelete}
        onUpdate={fetchReadings}
      />
    </Card>
  );
}