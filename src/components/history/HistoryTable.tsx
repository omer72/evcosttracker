import { Car, Trash2, Edit } from "lucide-react";
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
import { useLanguage } from "@/i18n/LanguageContext";

interface HistoryTableProps {
  readings: any[];
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function HistoryTable({ readings, onDelete, onUpdate }: HistoryTableProps) {
  const [editingReading, setEditingReading] = useState<any>(null);
  const [readingToDelete, setReadingToDelete] = useState<any>(null);
  const { t } = useLanguage();

  const handleDelete = async (readingId: string) => {
    const { error: deleteChargesError } = await supabase
      .from("additional_charges")
      .delete()
      .eq("charging_history_id", readingId);

    if (deleteChargesError) {
      toast.error(t("errorDeletingCharges"));
      return;
    }

    const { error: deleteReadingError } = await supabase
      .from("charging_history")
      .delete()
      .eq("id", readingId);

    if (deleteReadingError) {
      toast.error(t("errorDeletingReading"));
      return;
    }

    toast.success(t("readingDeleted"));
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
                  <th className="px-2 py-3 text-start">{t("date")}</th>
                  <th className="hidden sm:table-cell px-2 py-3 text-start">{t("car")}</th>
                  <th className="px-2 py-3 text-end">{t("current")}</th>
                  <th className="px-2 py-3 text-end">{t("previous")}</th>
                  <th className="hidden sm:table-cell px-2 py-3 text-end">{t("pricePerKwh")}</th>
                  <th className="px-2 py-3 text-end">{t("total")}</th>
                  <th className="px-2 py-3 text-end">{t("actions")}</th>
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
                        {reading.cars?.car_number || t("unknownCar")}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-end whitespace-nowrap">
                      {reading.current_reading}
                    </td>
                    <td className="px-2 py-3 text-end whitespace-nowrap">
                      {reading.previous_reading}
                    </td>
                    <td className="hidden sm:table-cell px-2 py-3 text-end whitespace-nowrap">
                      ₪{reading.price_per_kwh.toFixed(2)}
                    </td>
                    <td className="px-2 py-3 text-end whitespace-nowrap">
                      ₪{reading.total_amount.toFixed(2)}
                    </td>
                    <td className="px-2 py-3 text-end whitespace-nowrap">
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
            <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmReading")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => readingToDelete && handleDelete(readingToDelete.id)}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
