import { Button } from "@/components/ui/button";
import { FileDown, Download, Upload } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ExportButtonsProps {
  readings: any[];
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ExportButtons({ readings, onImport }: ExportButtonsProps) {
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
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => document.getElementById('csvImport')?.click()}
        className="glass-card hover:bg-white/20"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import CSV
      </Button>
      <input
        type="file"
        id="csvImport"
        accept=".csv"
        className="hidden"
        onChange={onImport}
      />
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
  );
}