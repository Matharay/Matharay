import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getSubjectVariables, findApplicableFormulas } from "@/lib/formulaData";
import { FlaskConical, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onUseFormula?: (formula: string) => void;
}

const FormulaInterpreter = ({ onUseFormula }: Props) => {
  const { t, subject, language } = useApp();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const lang = language as "en" | "es";
  const variables = getSubjectVariables(subject);
  const applicable = findApplicableFormulas(Array.from(selected), subject);

  const toggle = (sym: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(sym) ? next.delete(sym) : next.add(sym);
      return next;
    });
  };

  if (!["physics", "chemistry", "mathematics", "calculus"].includes(subject)) return null;

  return (
    <div className="mt-4 rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors min-h-[44px]"
      >
        <FlaskConical className="h-4 w-4 text-primary shrink-0" />
        <span className="flex-1 text-left text-xs sm:text-sm">
          {lang === "es"
            ? "Intérprete de fórmulas — ¿qué puedo calcular?"
            : "Formula Interpreter — what can I calculate?"}
        </span>
        {open
          ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <p className="text-xs text-muted-foreground mt-3 mb-3">
            {lang === "es"
              ? "Selecciona las variables que conoces y te diremos qué puedes calcular:"
              : "Select the variables you know and we'll tell you what you can calculate:"}
          </p>

          {/* Variable chips — flex-wrap ensures proper wrapping on mobile */}
          <div className="flex flex-wrap gap-2 mb-4">
            {variables.map((v) => {
              const isSelected = selected.has(v.symbol);
              return (
                <button
                  key={v.symbol}
                  onClick={() => toggle(v.symbol)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium border transition-colors min-h-[36px] ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  <span className="font-mono font-bold">{v.symbol}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">{v.name[lang]}</span>
                  {v.unit && (
                    <span className="text-[10px] opacity-50 hidden sm:inline">({v.unit})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Results */}
          {selected.size > 0 && (
            <div>
              {applicable.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  {lang === "es"
                    ? "Con esas variables no hay una fórmula directa disponible aún. Intenta agregar más."
                    : "No direct formula available yet for those variables. Try adding more."}
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground mb-2">
                    {lang === "es" ? "Puedes calcular:" : "You can calculate:"}
                  </p>
                  {applicable.map((f) => (
                    <div key={f.id} className="rounded-lg border border-border bg-muted/30 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                            <span className="text-xs font-semibold text-foreground">
                              {f.topic[lang]}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {f.description[lang]}
                          </p>
                          <code className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded break-all">
                            {f.formula}
                          </code>
                        </div>
                        {onUseFormula && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs shrink-0 min-h-[36px]"
                            onClick={() => onUseFormula(f.formula)}
                          >
                            {lang === "es" ? "Usar" : "Use"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selected.size === 0 && (
            <p className="text-xs text-muted-foreground italic">
              {lang === "es"
                ? "Selecciona al menos una variable para ver qué puedes calcular."
                : "Select at least one variable to see what you can calculate."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormulaInterpreter;
