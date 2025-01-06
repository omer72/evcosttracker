import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Car, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [cars, setCars] = useState<Array<{ id: string; car_number: string }>>([]);
  const [newCarNumber, setNewCarNumber] = useState("");
  const navigate = useNavigate();

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
      toast.error("Error fetching cars");
      console.error("Error fetching cars:", error);
      return;
    }

    setCars(data || []);
  };

  const addCar = async () => {
    if (!newCarNumber.trim()) {
      toast.error("Please enter a car number");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please login to add cars");
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
      toast.error("Error adding car");
      console.error("Error adding car:", error);
      return;
    }

    toast.success("Car added successfully");
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
      toast.error("Error deleting car");
      console.error("Error deleting car:", error);
      return;
    }

    toast.success("Car deleted successfully");
    fetchCars();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-8 h-8 text-[#9b87f5]" />
            <h2 className="text-2xl font-bold futuristic-gradient">Car Management</h2>
          </div>

          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter car number"
              value={newCarNumber}
              onChange={(e) => setNewCarNumber(e.target.value)}
              className="glass-card bg-transparent"
            />
            <Button onClick={addCar} className="bg-[#9b87f5] hover:bg-[#8B5CF6]">
              <Plus className="w-4 h-4 mr-2" />
              Add Car
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
                  onClick={() => deleteCar(car.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}