import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

interface EditHistoryDialogProps {
  reading: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditHistoryDialog({ reading, onClose, onUpdate }: EditHistoryDialogProps) {
  const [currentReading, setCurrentReading] = useState("");
  const [pricePerKwh, setPricePerKwh] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (reading) {
      setIsOpen(true);
      setCurrentReading(reading.current_reading.toString());
      setPricePerKwh(reading.price_per_kwh.toString());
    } else {
      setIsOpen(false);
    }
  }, [reading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reading) return;

    const newCurrentReading = parseFloat(currentReading);
    const newPricePerKwh = parseFloat(pricePerKwh);
    const consumption = newCurrentReading - reading.previous_reading;
    const newTotalAmount = consumption * newPricePerKwh;

    const { error } = await supabase
      .from("charging_history")
      .update({
        current_reading: newCurrentReading,
        price_per_kwh: newPricePerKwh,
        total_amount: newTotalAmount
      })
      .eq("id", reading.id);

    if (error) {
      toast.error(t("errorUpdating"));
      return;
    }

    toast.success(t("updatedSuccess"));
    onUpdate();
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("editReading")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentReading">{t("currentReading")}</Label>
            <Input
              id="currentReading"
              value={currentReading}
              onChange={(e) => setCurrentReading(e.target.value)}
              type="number"
              step="0.01"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerKwh">{t("pricePerKwh")}</Label>
            <Input
              id="pricePerKwh"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(e.target.value)}
              type="number"
              step="0.01"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
