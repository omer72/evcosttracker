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
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr className="text-xs sm:text-sm">
                  <th className="px-2 py-3 text-left">Date</th>
                  <th className="hidden sm:table-cell px-2 py-3 text-left">Car</th>
                  <th className="px-2 py-3 text-right">Current</th>
                  <th className="px-2 py-3 text-right">Previous</th>
                  <th className="hidden sm:table-cell px-2 py-3 text-right">Price/kWh</th>
                  <th className="px-2 py-3 text-right">Total</th>
                  <th className="px-2 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {readings.map((reading) => (
                  <tr key={reading.id} className="text-xs sm:text-sm">
                    <td className="px-2 py-3 whitespace-nowrap">
                      {new Date(reading.date).toLocaleDateString()}
                    </td>
                    <td className="hidden sm:table-cell px-2 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#9b87f5]" />
                        {reading.cars?.car_number || 'Unknown Car'}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right whitespace-nowrap">
                      {reading.current_reading}
                    </td>
                    <td className="px-2 py-3 text-right whitespace-nowrap">
                      {reading.previous_reading}
                    </td>
                    <td className="hidden sm:table-cell px-2 py-3 text-right whitespace-nowrap">
                      ₪{reading.price_per_kwh.toFixed(2)}
                    </td>
                    <td className="px-2 py-3 text-right whitespace-nowrap">
                      ₪{reading.total_amount.toFixed(2)}
                    </td>
                    <td className="px-2 py-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingReading(reading)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
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
        </div>
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