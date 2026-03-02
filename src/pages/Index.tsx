
import Calculator from "@/components/Calculator";
import History from "@/components/History";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CircuitBoard, LogOut, Zap, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Hero } from "@/components/blocks/hero";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    
    if (!session) {
      return;
    }
    
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

    if(data.length === 0) {
      navigate("/settings");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setIsAuthenticated(false);
      toast.success(t("signedOutSuccess"));
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error(t("errorSigningOut"));
    }
  };

  if (isAuthenticated === null) {
    return <div>{t("loading")}</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <div className="absolute top-4 end-4 z-50">
          <LanguageToggle />
        </div>
        <Hero
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
          actions={[
            {
              label: t("signIn"),
              href: "/login",
              variant: "default"
            },
            {
              label: t("signUp"),
              href: "/login",
              variant: "outline"
            }
          ]}
          titleClassName="text-5xl md:text-6xl font-extrabold text-[#9b87f5]"
          subtitleClassName="text-lg md:text-xl max-w-[800px]"
          actionsClassName="mt-8"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-2 sm:gap-3">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-[#9b87f5]" />
            <span className="futuristic-gradient">{t("appTitle")}</span>
          </h1>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <LanguageToggle />
            <Button 
              variant="outline" 
              onClick={() => navigate("/settings")}
              className="glass-card hover:bg-white/20"
              size="sm"
            >
              <SettingsIcon className="w-4 h-4 me-2" />
              <span className="hidden sm:inline">{t("settings")}</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="glass-card hover:bg-white/20"
              size="sm"
            >
              <LogOut className="w-4 h-4 me-2" />
              <span className="hidden sm:inline">{t("signOut")}</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 glass-card">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-[#9b87f5]/20">
              <CircuitBoard className="w-4 h-4 me-2" />
              {t("calculator")}
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#9b87f5]/20">
              <CircuitBoard className="w-4 h-4 me-2" />
              {t("history")}
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
