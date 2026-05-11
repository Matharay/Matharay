import { useState, useEffect } from "react";
import { X, Check, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApp } from "@/contexts/AppContext";

const SESSION_KEY = "matharay_pricing_seen";

const PricingBanner = () => {
  const { language } = useApp();
  const lang = language as "en" | "es";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const freePlus: { text: string; included: boolean }[] = [
    { text: lang === "es" ? "10 problemas sin anuncios" : "10 problems ad-free", included: true },
    { text: lang === "es" ? "2 cursos por materia" : "2 courses per subject", included: true },
    { text: lang === "es" ? "Desbloquea cursos viendo videos" : "Unlock courses by watching videos", included: true },
    { text: lang === "es" ? "Anuncios a partir del problema 10" : "Ads after problem 10", included: false },
  ];

  const plusFeatures: { text: string }[] = [
    { text: lang === "es" ? "Sin anuncios" : "No ads" },
    { text: lang === "es" ? "Catálogo completo de cursos" : "Full course catalog" },
    { text: lang === "es" ? "Historial permanente" : "Permanent history" },
    { text: lang === "es" ? "Guarda hasta 50 problemas" : "Save up to 50 problems" },
    { text: lang === "es" ? "Soporte por email" : "Email support" },
  ];

  return (
    <div className="mt-6 relative">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute -top-1 -right-1 z-10 rounded-full bg-muted hover:bg-muted/80 p-1 transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <div className="rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/50 border-b border-border">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {lang === "es" ? "Planes" : "Plans"}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row">
          {/* FREE */}
          <div className="flex-1 p-5 border-b sm:border-b-0 sm:border-r border-border bg-card">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Free</span>
              <div className="mt-1 flex items-end gap-1">
                <span className="text-3xl font-black text-foreground">$0</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "es" ? "Siempre gratis" : "Always free"}
              </p>
            </div>
            <ul className="space-y-2">
              {freePlus.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check
                    className={`h-4 w-4 mt-0.5 shrink-0 ${f.included ? "text-green-500" : "text-destructive"}`}
                    style={{ rotate: f.included ? "0deg" : "45deg" }}
                  />
                  <span className={`text-xs ${f.included ? "text-foreground" : "text-muted-foreground line-through"}`}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* PLUS */}
          <div
            className="flex-1 p-5 relative"
            style={{ background: "linear-gradient(135deg, #3B5BDB, #2f4abe)" }}
          >
            {/* Badge */}
            <div className="absolute top-3 right-3 rounded-full bg-white/20 px-2 py-0.5">
              <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                {lang === "es" ? "Recomendado" : "Recommended"}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="h-4 w-4 text-yellow-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">Plus</span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-white">$49</span>
                <span className="text-sm text-white/70 mb-0.5">MXN/{lang === "es" ? "mes" : "mo"}</span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                {lang === "es" ? "Anual: $399 MXN (ahorra 2 meses)" : "Annual: $399 MXN (save 2 months)"}
              </p>
            </div>

            <ul className="space-y-2 mb-5">
              {plusFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-300 mt-0.5 shrink-0" />
                  <span className="text-xs text-white">{f.text}</span>
                </li>
              ))}
            </ul>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  disabled
                  className="w-full rounded-lg py-2.5 text-sm font-bold text-white/50 bg-white/10 border border-white/20 cursor-not-allowed"
                >
                  {lang === "es" ? "Obtener Plus" : "Get Plus"}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {lang === "es" ? "Próximamente" : "Coming soon"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingBanner;
