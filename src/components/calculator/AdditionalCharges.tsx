
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, PlusCircle } from "lucide-react";
import { AdditionalCharge } from "@/types/calculator";
import { useLanguage } from "@/i18n/LanguageContext";

interface AdditionalChargesProps {
  charges: AdditionalCharge[];
  onChargeAdd: () => void;
  onChargeRemove: (id: string) => void;
  onChargeUpdate: (id: string, field: "description" | "amount", value: string) => void;
}

export default function AdditionalCharges({
  charges,
  onChargeAdd,
  onChargeRemove,
  onChargeUpdate
}: AdditionalChargesProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="flex items-center gap-2 text-white">
          <PlusCircle className="w-4 h-4 text-[#9b87f5]" />
          {t("additionalCharges")}
        </Label>
        <Button onClick={onChargeAdd} variant="outline" size="sm" className="glass-card hover:bg-white/20">
          <Plus className="w-4 h-4 me-1" /> {t("addCharge")}
        </Button>
      </div>

      {charges.map((charge) => (
        <div key={charge.id} className="flex gap-2 items-start">
          <Input
            placeholder={t("description")}
            value={charge.description}
            onChange={(e) => onChargeUpdate(charge.id, "description", e.target.value)}
            className="flex-grow glass-card !bg-transparent text-white"
          />
          <Input
            type="number"
            placeholder={t("amount")}
            value={charge.amount}
            onChange={(e) => onChargeUpdate(charge.id, "amount", e.target.value)}
            className="w-32 glass-card !bg-transparent text-white"
            step="0.01"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChargeRemove(charge.id)}
            className="text-red-500 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
