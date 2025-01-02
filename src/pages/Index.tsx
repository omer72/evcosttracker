import Calculator from "@/components/Calculator";
import History from "@/components/History";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CircuitBoard, LogOut, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Zap className="w-10 h-10 text-[#9b87f5]" />
            <span className="futuristic-gradient">EV Charging Calculator</span>
          </h1>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="glass-card hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-[#9b87f5]/20">
              <CircuitBoard className="w-4 h-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#9b87f5]/20">
              <CircuitBoard className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <Calculator />
          </TabsContent>
          
          <TabsContent value="history">
            <History />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;