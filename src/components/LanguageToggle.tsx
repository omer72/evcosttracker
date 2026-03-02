import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "he" ? "en" : "he")}
      className="glass-card hover:bg-white/20 min-w-[70px]"
    >
      <Languages className="w-4 h-4 me-2" />
      {language === "he" ? "EN" : "עב"}
    </Button>
  );
}
