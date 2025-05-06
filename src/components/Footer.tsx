
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:omer72@gmail.com?subject=From%20EV%20Cost%20Tracker";
  };

  return (
    <footer className="w-full py-3 px-4 border-t border-white/10 mt-auto">
      <div className="max-w-4xl mx-auto flex justify-center items-center gap-2 text-sm text-white/70">
        <span>Created by Omer Etrog,</span>
        <Button 
          variant="link" 
          onClick={handleEmailClick} 
          className="p-0 h-auto text-[#9b87f5] hover:text-[#8B5CF6] flex items-center gap-1"
        >
          <Mail className="w-3.5 h-3.5" />
          omer72@gmail.com
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
