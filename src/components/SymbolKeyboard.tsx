import { useState } from "react";
import { useApp, Subject } from "@/contexts/AppContext";
import PeriodicTable from "./PeriodicTable";
import { Input } from "./ui/input";

const numberKeys = ["0","1","2","3","4","5","6","7","8","9",".","-"];

const symbolSets: Record<string, string[]> = {
  mathematics: ["+","−","×","÷","=","(",")","√","^","π"],
  calculus: ["+","−","×","÷","=","(",")","√","^","π","∫","d/dx","lim","Σ","∞","∂"],
  physics: ["+","−","×","÷","=","(",")","√","^","π","α","β","θ","λ","μ","m/s","kg","N","J","W"],
  economics: ["+","−","×","÷","=","(",")","%","Σ","Δ","$","≈","≥","≤","→","∞"],
};

interface Props {
  onInsert: (symbol: string) => void;
}

const SymbolKeyboard = ({ onInsert }: Props) => {
  const { subject } = useApp();
  const [showNumbers, setShowNumbers] = useState(false);
  const [showFraction, setShowFraction] = useState(false);
  const [numerator, setNumerator] = useState("");
  const [denominator, setDenominator] = useState("");

  // Chemistry uses PeriodicTable component
  if (subject === "chemistry") {
    return <PeriodicTable onInsert={onInsert} />;
  }

  const symbols = symbolSets[subject] ?? [];

  const insertFraction = () => {
    if (numerator && denominator) {
      onInsert(`(${numerator}/${denominator})`);
      setNumerator("");
      setDenominator("");
      setShowFraction(false);
    }
  };

  return (
    <div className="py-3 space-y-2">
      {/* Number toggle + number pad */}
      <div className="flex flex-wrap gap-1.5 items-start">
        <button
          onClick={() => setShowNumbers((v) => !v)}
          className={`min-w-[36px] h-9 px-2.5 rounded-md border text-sm font-semibold transition-colors ${
            showNumbers
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-surface text-surface-foreground hover:bg-muted"
          }`}
        >
          123
        </button>

        {showNumbers &&
          numberKeys.map((s, i) => (
            <button
              key={`num-${s}-${i}`}
              onClick={() => onInsert(s)}
              className="min-w-[36px] h-9 px-2 rounded-md border border-border bg-surface text-surface-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              {s}
            </button>
          ))}
      </div>

      {/* Subject-specific symbols + fraction creator */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {symbols.map((s, i) => (
          <button
            key={`${s}-${i}`}
            onClick={() => onInsert(s)}
            className="min-w-[36px] h-9 px-2 rounded-md border border-border bg-surface text-surface-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            {s}
          </button>
        ))}

        {/* Quick ½ shortcut */}
        <button
          onClick={() => onInsert("½")}
          className="min-w-[36px] h-9 px-2 rounded-md border border-border bg-surface text-surface-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          ½
        </button>

        {/* Fraction creator toggle */}
        <button
          onClick={() => setShowFraction((v) => !v)}
          className={`min-w-[36px] h-9 px-2.5 rounded-md border text-sm font-semibold transition-colors ${
            showFraction
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-surface text-surface-foreground hover:bg-muted"
          }`}
        >
          a/b
        </button>
      </div>

      {/* Fraction inline panel */}
      {showFraction && (
        <div className="flex items-center gap-2 p-2 rounded-md border border-border bg-surface">
          <Input
            type="number"
            placeholder="a"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            className="w-16 h-8 text-center text-sm"
          />
          <span className="text-surface-foreground font-bold">/</span>
          <Input
            type="number"
            placeholder="b"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            className="w-16 h-8 text-center text-sm"
          />
          <button
            onClick={insertFraction}
            disabled={!numerator || !denominator}
            className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            Insert
          </button>
        </div>
      )}
    </div>
  );
};

export default SymbolKeyboard;
