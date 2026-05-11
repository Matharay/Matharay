import { useApp } from "@/contexts/AppContext";
import { Globe, Lock, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Navbar = () => {
  const { t, language, setLanguage, darkMode, toggleDarkMode } = useApp();

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-foreground">{t.appName}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border text-sm overflow-hidden">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`px-3 py-1.5 transition-colors ${language === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              ES
            </button>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-foreground">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground cursor-default" disabled>
                <Lock size={14} />
                {t.login}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.comingSoon}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
