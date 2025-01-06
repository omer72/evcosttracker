import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { History as HistoryIcon, Download, FileDown, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function History() {
  const [readings, setReadings] = useState<any[]>([]);

  useEffect(() => {
    fetchReadings();
  }, []);

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

  const exportToCSV = () => {
    const csvContent = [
      ["Date", "Car Number", "Current Reading", "Previous Reading", "Price/kWh", "Total Amount"],
      ...readings.map(reading => [
        new Date(reading.date).toLocaleDateString(),
        reading.cars.car_number,
        reading.current_reading,
        reading.previous_reading,
        reading.price_per_kwh,
        reading.total_amount
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "charging-history.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("EV Charging History", 14, 22);

    const tableData = readings.map(reading => [
      new Date(reading.date).toLocaleDateString(),
      reading.cars.car_number,
      reading.current_reading.toString(),
      reading.previous_reading.toString(),
      `₪${reading.price_per_kwh.toFixed(2)}`,
      `₪${reading.total_amount.toFixed(2)}`
    ]);

    (doc as any).autoTable({
      head: [["Date", "Car Number", "Current Reading", "Previous Reading", "Price/kWh", "Total"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [155, 135, 245] }
    });

    doc.save("charging-history.pdf");
  };

  return (
    <Card className="glass-card p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-[#9b87f5]" />
          <h2 className="text-2xl font-bold futuristic-gradient">Charging History</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="glass-card hover:bg-white/20"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={exportToPDF}
            className="glass-card hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Car</th>
              <th className="text-right p-2">Current Reading</th>
              <th className="text-right p-2">Previous Reading</th>
              <th className="text-right p-2">Price/kWh</th>
              <th className="text-right p-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id} className="border-b border-white/10">
                <td className="p-2">
                  {new Date(reading.date).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#9b87f5]" />
                    {reading.cars.car_number}
                  </div>
                </td>
                <td className="text-right p-2">{reading.current_reading}</td>
                <td className="text-right p-2">{reading.previous_reading}</td>
                <td className="text-right p-2">₪{reading.price_per_kwh.toFixed(2)}</td>
                <td className="text-right p-2">₪{reading.total_amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}