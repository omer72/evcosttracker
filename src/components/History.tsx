import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import HistoryTable from "./history/HistoryTable";
import ExportButtons from "./history/ExportButtons";
import YearlyChart from "./history/YearlyChart";

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
      .select("*")
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

  return (
    <div className="space-y-6">
      <YearlyChart />
      <div className="flex justify-end">
        <ExportButtons readings={readings} />
      </div>
      <HistoryTable
        readings={readings}
        onDelete={handleDelete}
        onUpdate={fetchReadings}
      />
    </div>
  );
}
