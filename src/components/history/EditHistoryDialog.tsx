import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditHistoryDialogProps {
  reading: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditHistoryDialog({ reading, onClose, onUpdate }: EditHistoryDialogProps) {
  const [currentReading, setCurrentReading] = useState("");
  const [pricePerKwh, setPricePerKwh] = useState("");

  useEffect(() => {
    if (reading) {
      setCurrentReading(reading.current_reading.toString());
      setPricePerKwh(reading.price_per_kwh.toString());
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
      toast.error("Error updating reading");
      return;
    }

    toast.success("Reading updated successfully");
    onUpdate();
    onClose();
  };

  return (
    <Dialog open={!!reading} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Reading</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentReading">Current Reading</Label>
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
            <Label htmlFor="pricePerKwh">Price per kWh</Label>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}