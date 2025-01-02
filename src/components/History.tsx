import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Reading } from "@/types/calculator";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { History as HistoryIcon, Upload, Zap } from "lucide-react";

export default function History() {
  const readings = JSON.parse(localStorage.getItem("readings") || "[]") as Reading[];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split("\n").slice(1); // Skip header row
        
        const csvReadings: Reading[] = rows
          .filter(row => row.trim()) // Skip empty rows
          .map(row => {
            const [date, currentReading, previousReading, pricePerKwh, totalAmount] = row.split(",");
            return {
              id: uuidv4(),
              date,
              currentReading: Number(currentReading),
              previousReading: Number(previousReading),
              pricePerKwh: Number(pricePerKwh),
              additionalCharges: [],
              totalAmount: Number(totalAmount),
            };
          });

        const existingReadings = JSON.parse(localStorage.getItem("readings") || "[]") as Reading[];
        const updatedReadings = [...csvReadings, ...existingReadings];
        localStorage.setItem("readings", JSON.stringify(updatedReadings));
        
        toast.success("CSV file imported successfully");
        window.location.reload(); // Refresh to show new data
      } catch (error) {
        toast.error("Error importing CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="glass-card p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-[#9b87f5]" />
          <h2 className="text-2xl font-bold futuristic-gradient">Charging History</h2>
        </div>
        <div>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("csv-upload")?.click()}
            className="glass-card hover:bg-white/20"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-2">Date</th>
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
                <td className="text-right p-2">{reading.currentReading}</td>
                <td className="text-right p-2">{reading.previousReading}</td>
                <td className="text-right p-2">₪{reading.pricePerKwh.toFixed(2)}</td>
                <td className="text-right p-2">₪{reading.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}