import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NumberFlow } from "@/components/ui/number-flow";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Calculation Result</DialogTitle>
        </DialogHeader>
        {result && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#9b87f5] mb-4">
                ₪<NumberFlow value={result.totalAmount} />
              </div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">Consumption</div>
                <div className="text-muted-foreground">
                  <NumberFlow value={result.consumption} /> kWh
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Basic Cost</div>
                <div className="text-muted-foreground">
                  ₪<NumberFlow value={result.basicCost} />
                </div>
              </div>
              {result.additionalCost > 0 && (
                <>
                  <div className="space-y-1">
                    <div className="font-medium">Additional Charges</div>
                    <div className="text-muted-foreground">
                      ₪<NumberFlow value={result.additionalCost} />
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