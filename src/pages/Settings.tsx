
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Car, Plus, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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
import LanguageToggle from "@/components/LanguageToggle";

export default function Settings() {
  const [cars, setCars] = useState<Array<{ id: string; car_number: string }>>([]);
  const [newCarNumber, setNewCarNumber] = useState("");
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    checkUser();
    fetchCars();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
  };

  const fetchCars = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq('user_id', session.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error(t("errorFetchingCars"));
      console.error("Error fetching cars:", error);
      return;
    }

    setCars(data || []);
  };

  const addCar = async () => {
    if (!newCarNumber.trim()) {
      toast.error(t("enterCarNumberError"));
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error(t("pleaseLogin"));
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from("cars")
      .insert([{ 
        car_number: newCarNumber,
        user_id: session.user.id 
      }]);

    if (error) {
      toast.error(t("errorAddingCar"));
      console.error("Error adding car:", error);
      return;
    }

    toast.success(t("carAdded"));
    setNewCarNumber("");
    fetchCars();
  };

  const deleteCar = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("cars")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      toast.error(t("errorDeletingCar"));
      console.error("Error deleting car:", error);
      return;
    }

    toast.success(t("carDeleted"));
    setCarToDelete(null);
    fetchCars();
  };

  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-[#9b87f5]" />
              <h2 className="text-2xl font-bold futuristic-gradient">{t("carManagement")}</h2>
            </div>
            <div className="flex gap-2">
              <LanguageToggle />
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 me-2" />
                {t("back")}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Input
              placeholder={t("enterCarNumber")}
              value={newCarNumber}
              onChange={(e) => setNewCarNumber(e.target.value)}
              className="glass-card bg-transparent"
            />
            <Button onClick={addCar} className="bg-[#9b87f5] hover:bg-[#8B5CF6]">
              <Plus className="w-4 h-4 me-2" />
              {t("addCar")}
            </Button>
          </div>

          <div className="space-y-2">
            {cars.map((car) => (
              <div
                key={car.id}
                className="flex justify-between items-center p-3 glass-card rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#9b87f5]" />
                  <span>{car.car_number}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCarToDelete(car.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <AlertDialog open={!!carToDelete} onOpenChange={() => setCarToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmCar")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => carToDelete && deleteCar(carToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
