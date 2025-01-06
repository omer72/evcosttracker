import { Car, FileDown, Download, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditHistoryDialog from "./EditHistoryDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HistoryTableProps {
  readings: any[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function HistoryTable({ readings, onDelete, onUpdate }: HistoryTableProps) {
  const [editingReading, setEditingReading] = useState<any>(null);
  const [readingToDelete, setReadingToDelete] = useState<any>(null);

  const handleDelete = async (readingId: string) => {
    const { error: deleteChargesError } = await supabase
      .from("additional_charges")
      .delete()
      .eq("charging_history_id", readingId);

    if (deleteChargesError) {
      toast.error("Error deleting additional charges");
      return;
    }

    const { error: deleteReadingError } = await supabase
      .from("charging_history")
      .delete()
      .eq("id", readingId);

    if (deleteReadingError) {
      toast.error("Error deleting reading");
      return;
    }

    toast.success("Reading deleted successfully");
    onDelete(readingId);
    setReadingToDelete(null);
  };

  return (
    <>
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
              <th className="text-right p-2">Actions</th>
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
                <td className="text-right p-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingReading(reading)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setReadingToDelete(reading)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditHistoryDialog
        reading={editingReading}
        onClose={() => setEditingReading(null)}
        onUpdate={onUpdate}
      />
      <AlertDialog open={!!readingToDelete} onOpenChange={() => setReadingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the reading
              and all associated additional charges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => readingToDelete && handleDelete(readingToDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}