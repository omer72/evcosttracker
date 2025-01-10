import { Button } from "@/components/ui/button";
import { FileDown, Download, Upload } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExportButtonsProps {
  readings: any[];
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ExportButtons({ readings, onImport }: ExportButtonsProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await onImport(event);
      toast.success('Import completed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV file');
    } finally {
      setIsImporting(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Date", "Current Reading", "Previous Reading", "Total Amount"],
      ...readings.map(reading => [
        new Date(reading.date).toLocaleDateString(),
        reading.current_reading,
        reading.previous_reading,
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
    
    doc.setFontSize(16);
    doc.text("EV Charging History", 14, 20);

    const tableData = readings.map(reading => [
      new Date(reading.date).toLocaleDateString(),
      reading.current_reading.toString(),
      reading.previous_reading.toString(),
      `₪${reading.total_amount.toFixed(2)}`
    ]);

    (doc as any).autoTable({
      head: [["Date", "Current", "Previous", "Total"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [155, 135, 245] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' }
      }
    });

    doc.save("charging-history.pdf");
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => document.getElementById('csvImport')?.click()}
          className="glass-card hover:bg-white/20 text-xs sm:text-sm h-8 px-2 sm:px-4"
          disabled={isImporting}
        >
          {isImporting ? (
            <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          )}
          <span className="hidden sm:inline">{isImporting ? 'Importing...' : 'Import'}</span>
          <span className="sm:hidden">CSV</span>
        </Button>
        <input
          type="file"
          id="csvImport"
          accept=".csv"
          className="hidden"
          onChange={handleImport}
          disabled={isImporting}
        />
        <Button
          variant="outline"
          onClick={exportToCSV}
          className="glass-card hover:bg-white/20 text-xs sm:text-sm h-8 px-2 sm:px-4"
        >
          <FileDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
          <span className="sm:hidden">CSV</span>
        </Button>
        <Button
          variant="outline"
          onClick={exportToPDF}
          className="glass-card hover:bg-white/20 text-xs sm:text-sm h-8 px-2 sm:px-4"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Error</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}