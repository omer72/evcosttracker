import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NumberFlow } from "@/components/ui/number-flow";
import { useEffect, useState } from "react";

interface CalculationResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    totalAmount: number;
    consumption: number;
    basicCost: number;
    additionalCost: number;
  } | null;
}

export default function CalculationResultDialog({
  open,
  onOpenChange,
  result
}: CalculationResultDialogProps) {
  const [displayedResult, setDisplayedResult] = useState<typeof result>(null);

  useEffect(() => {
    if (open && result) {
      // First set all values to 0
      setDisplayedResult({
        totalAmount: 0,
        consumption: 0,
        basicCost: 0,
        additionalCost: 0
      });

      // Then after a short delay, set the actual values
      const timer = setTimeout(() => {
        setDisplayedResult(result);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open, result]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Calculation Result</DialogTitle>
        </DialogHeader>
        {displayedResult && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#9b87f5] mb-4 flex items-center justify-center gap-0.5">
                <span>₪</span>
                <NumberFlow value={displayedResult.totalAmount} />
              </div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">Consumption</div>
                <div className="text-muted-foreground">
                  <NumberFlow value={displayedResult.consumption} /> kWh
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Basic Cost</div>
                <div className="text-muted-foreground flex items-center gap-0.5">
                  <span>₪</span>
                  <NumberFlow value={displayedResult.basicCost} />
                </div>
              </div>
              {displayedResult.additionalCost > 0 && (
                <>
                  <div className="space-y-1">
                    <div className="font-medium">Additional Charges</div>
                    <div className="text-muted-foreground flex items-center gap-0.5">
                      <span>₪</span>
                      <NumberFlow value={displayedResult.additionalCost} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}