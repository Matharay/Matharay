import { useState } from "react";
import { Grid3X3, X } from "lucide-react";

interface Props {
  onInsert: (symbol: string) => void;
}

interface Element {
  z: number;
  sym: string;
  row: number;
  col: number;
}

// Standard periodic table layout: row (period), col (group)
const elements: Element[] = [
  // Period 1
  { z: 1, sym: "H", row: 1, col: 1 },
  { z: 2, sym: "He", row: 1, col: 18 },
  // Period 2
  { z: 3, sym: "Li", row: 2, col: 1 },
  { z: 4, sym: "Be", row: 2, col: 2 },
  { z: 5, sym: "B", row: 2, col: 13 },
  { z: 6, sym: "C", row: 2, col: 14 },
  { z: 7, sym: "N", row: 2, col: 15 },
  { z: 8, sym: "O", row: 2, col: 16 },
  { z: 9, sym: "F", row: 2, col: 17 },
  { z: 10, sym: "Ne", row: 2, col: 18 },
  // Period 3
  { z: 11, sym: "Na", row: 3, col: 1 },
  { z: 12, sym: "Mg", row: 3, col: 2 },
  { z: 13, sym: "Al", row: 3, col: 13 },
  { z: 14, sym: "Si", row: 3, col: 14 },
  { z: 15, sym: "P", row: 3, col: 15 },
  { z: 16, sym: "S", row: 3, col: 16 },
  { z: 17, sym: "Cl", row: 3, col: 17 },
  { z: 18, sym: "Ar", row: 3, col: 18 },
  // Period 4
  { z: 19, sym: "K", row: 4, col: 1 },
  { z: 20, sym: "Ca", row: 4, col: 2 },
  { z: 21, sym: "Sc", row: 4, col: 3 },
  { z: 22, sym: "Ti", row: 4, col: 4 },
  { z: 23, sym: "V", row: 4, col: 5 },
  { z: 24, sym: "Cr", row: 4, col: 6 },
  { z: 25, sym: "Mn", row: 4, col: 7 },
  { z: 26, sym: "Fe", row: 4, col: 8 },
  { z: 27, sym: "Co", row: 4, col: 9 },
  { z: 28, sym: "Ni", row: 4, col: 10 },
  { z: 29, sym: "Cu", row: 4, col: 11 },
  { z: 30, sym: "Zn", row: 4, col: 12 },
  { z: 31, sym: "Ga", row: 4, col: 13 },
  { z: 32, sym: "Ge", row: 4, col: 14 },
  { z: 33, sym: "As", row: 4, col: 15 },
  { z: 34, sym: "Se", row: 4, col: 16 },
  { z: 35, sym: "Br", row: 4, col: 17 },
  { z: 36, sym: "Kr", row: 4, col: 18 },
  // Period 5
  { z: 37, sym: "Rb", row: 5, col: 1 },
  { z: 38, sym: "Sr", row: 5, col: 2 },
  { z: 39, sym: "Y", row: 5, col: 3 },
  { z: 40, sym: "Zr", row: 5, col: 4 },
  { z: 41, sym: "Nb", row: 5, col: 5 },
  { z: 42, sym: "Mo", row: 5, col: 6 },
  { z: 43, sym: "Tc", row: 5, col: 7 },
  { z: 44, sym: "Ru", row: 5, col: 8 },
  { z: 45, sym: "Rh", row: 5, col: 9 },
  { z: 46, sym: "Pd", row: 5, col: 10 },
  { z: 47, sym: "Ag", row: 5, col: 11 },
  { z: 48, sym: "Cd", row: 5, col: 12 },
  { z: 49, sym: "In", row: 5, col: 13 },
  { z: 50, sym: "Sn", row: 5, col: 14 },
  { z: 51, sym: "Sb", row: 5, col: 15 },
  { z: 52, sym: "Te", row: 5, col: 16 },
  { z: 53, sym: "I", row: 5, col: 17 },
  { z: 54, sym: "Xe", row: 5, col: 18 },
  // Period 6
  { z: 55, sym: "Cs", row: 6, col: 1 },
  { z: 56, sym: "Ba", row: 6, col: 2 },
  // La-Lu in lanthanide row (row 9)
  { z: 57, sym: "La", row: 9, col: 3 },
  { z: 58, sym: "Ce", row: 9, col: 4 },
  { z: 59, sym: "Pr", row: 9, col: 5 },
  { z: 60, sym: "Nd", row: 9, col: 6 },
  { z: 61, sym: "Pm", row: 9, col: 7 },
  { z: 62, sym: "Sm", row: 9, col: 8 },
  { z: 63, sym: "Eu", row: 9, col: 9 },
  { z: 64, sym: "Gd", row: 9, col: 10 },
  { z: 65, sym: "Tb", row: 9, col: 11 },
  { z: 66, sym: "Dy", row: 9, col: 12 },
  { z: 67, sym: "Ho", row: 9, col: 13 },
  { z: 68, sym: "Er", row: 9, col: 14 },
  { z: 69, sym: "Tm", row: 9, col: 15 },
  { z: 70, sym: "Yb", row: 9, col: 16 },
  { z: 71, sym: "Lu", row: 9, col: 17 },
  { z: 72, sym: "Hf", row: 6, col: 4 },
  { z: 73, sym: "Ta", row: 6, col: 5 },
  { z: 74, sym: "W", row: 6, col: 6 },
  { z: 75, sym: "Re", row: 6, col: 7 },
  { z: 76, sym: "Os", row: 6, col: 8 },
  { z: 77, sym: "Ir", row: 6, col: 9 },
  { z: 78, sym: "Pt", row: 6, col: 10 },
  { z: 79, sym: "Au", row: 6, col: 11 },
  { z: 80, sym: "Hg", row: 6, col: 12 },
  { z: 81, sym: "Tl", row: 6, col: 13 },
  { z: 82, sym: "Pb", row: 6, col: 14 },
  { z: 83, sym: "Bi", row: 6, col: 15 },
  { z: 84, sym: "Po", row: 6, col: 16 },
  { z: 85, sym: "At", row: 6, col: 17 },
  { z: 86, sym: "Rn", row: 6, col: 18 },
  // Period 7
  { z: 87, sym: "Fr", row: 7, col: 1 },
  { z: 88, sym: "Ra", row: 7, col: 2 },
  // Ac-Lr in actinide row (row 10)
  { z: 89, sym: "Ac", row: 10, col: 3 },
  { z: 90, sym: "Th", row: 10, col: 4 },
  { z: 91, sym: "Pa", row: 10, col: 5 },
  { z: 92, sym: "U", row: 10, col: 6 },
  { z: 93, sym: "Np", row: 10, col: 7 },
  { z: 94, sym: "Pu", row: 10, col: 8 },
  { z: 95, sym: "Am", row: 10, col: 9 },
  { z: 96, sym: "Cm", row: 10, col: 10 },
  { z: 97, sym: "Bk", row: 10, col: 11 },
  { z: 98, sym: "Cf", row: 10, col: 12 },
  { z: 99, sym: "Es", row: 10, col: 13 },
  { z: 100, sym: "Fm", row: 10, col: 14 },
  { z: 101, sym: "Md", row: 10, col: 15 },
  { z: 102, sym: "No", row: 10, col: 16 },
  { z: 103, sym: "Lr", row: 10, col: 17 },
  { z: 104, sym: "Rf", row: 7, col: 4 },
  { z: 105, sym: "Db", row: 7, col: 5 },
  { z: 106, sym: "Sg", row: 7, col: 6 },
  { z: 107, sym: "Bh", row: 7, col: 7 },
  { z: 108, sym: "Hs", row: 7, col: 8 },
  { z: 109, sym: "Mt", row: 7, col: 9 },
  { z: 110, sym: "Ds", row: 7, col: 10 },
  { z: 111, sym: "Rg", row: 7, col: 11 },
  { z: 112, sym: "Cn", row: 7, col: 12 },
  { z: 113, sym: "Nh", row: 7, col: 13 },
  { z: 114, sym: "Fl", row: 7, col: 14 },
  { z: 115, sym: "Mc", row: 7, col: 15 },
  { z: 116, sym: "Lv", row: 7, col: 16 },
  { z: 117, sym: "Ts", row: 7, col: 17 },
  { z: 118, sym: "Og", row: 7, col: 18 },
];

const PeriodicTable = ({ onInsert }: Props) => {
  const [showTable, setShowTable] = useState(true);

  return (
    <div className="py-3 space-y-3">
      {/* Chemistry operator buttons */}
      <div className="flex flex-wrap gap-1.5">
        {["+", "→", "⇌", "₁", "₂", "₃", "₄", "(", ")", "="].map((s, i) => (
          <button
            key={`chem-op-${i}`}
            onClick={() => onInsert(s)}
            className="min-w-[36px] h-9 px-2 rounded-md border border-border bg-surface text-surface-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Toggle button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowTable((v) => !v)}
          className="flex items-center gap-1.5 px-3 h-8 rounded-md border border-border bg-surface text-surface-foreground text-xs font-medium hover:bg-muted transition-colors"
        >
          {showTable ? (
            <>
              <X size={14} />
              Hide table
            </>
          ) : (
            <>
              <Grid3X3 size={14} />
              Show periodic table
            </>
          )}
        </button>
      </div>

      {/* Periodic table grid with collapse animation */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: showTable ? "600px" : "0px",
          opacity: showTable ? 1 : 0,
        }}
      >
        <div className="overflow-x-auto rounded-lg border border-border bg-surface p-2">
          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
              gridTemplateRows: "repeat(10, auto)",
              minWidth: "540px",
            }}
          >
            {elements.map((el) => (
              <button
                key={el.z}
                onClick={() => onInsert(el.sym)}
                title={`${el.sym} (${el.z})`}
                className="flex flex-col items-center justify-center rounded border border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                style={{
                  gridRow: el.row,
                  gridColumn: el.col,
                  padding: "2px",
                  minHeight: "32px",
                  fontSize: "10px",
                }}
              >
                <span className="text-[8px] text-muted-foreground leading-none">{el.z}</span>
                <span className="font-semibold text-[11px] leading-tight">{el.sym}</span>
              </button>
            ))}
            <div
              className="flex items-center justify-center text-[8px] text-muted-foreground"
              style={{ gridRow: 6, gridColumn: 3 }}
            >
              *
            </div>
            <div
              className="flex items-center justify-center text-[8px] text-muted-foreground"
              style={{ gridRow: 7, gridColumn: 3 }}
            >
              **
            </div>
            <div
              className="flex items-center text-[8px] text-muted-foreground col-span-2"
              style={{ gridRow: 9, gridColumn: "1 / 3" }}
            >
              *
            </div>
            <div
              className="flex items-center text-[8px] text-muted-foreground col-span-2"
              style={{ gridRow: 10, gridColumn: "1 / 3" }}
            >
              **
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
