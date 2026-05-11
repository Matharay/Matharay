import { useApp, Solution } from "@/contexts/AppContext";
import { getSubjectColor } from "@/lib/subjectColors";
import GraphDisplay from "./GraphDisplay";
import MoleculeDisplay from "./MoleculeDisplay";

interface Props { solution: Solution; }

function isFormula(text: string): boolean {
  return /[=→↔]/.test(text) && /[·×²³√∫π\+\-\/\^]|[a-zA-Z₀₁₂]\s*[=]/.test(text);
}
function isSummaryStep(title: string): boolean {
  return /📋|interpret|valores?\s+conocidos|given\s+values|resumen/i.test(title);
}

const SolutionDisplay = ({ solution }: Props) => {
  const { t, subject, language } = useApp();
  const colors = getSubjectColor(subject);

  return (
    <div className="space-y-4 mt-6 animate-solution">
      {/* ── Final answer ── */}
      <div
        className="rounded-xl p-4 sm:p-5 border-l-4 transition-colors duration-300"
        style={{ borderLeftColor: colors.accent, backgroundColor: colors.accent + "12" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: colors.accent }}
        >
          {t.finalAnswer}
        </p>
        {/* Responsive font: smaller on mobile so long answers don't overflow */}
        <p
          className="text-lg sm:text-2xl font-bold font-mono whitespace-pre-line leading-snug break-words"
          style={{ color: colors.accent }}
        >
          {solution.answer}
        </p>
      </div>

      {/* ── Variable selector (askVariable) ── */}
      {solution.askVariable && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground mb-3">
            {solution.askVariable.question[language as "en" | "es"] ?? solution.askVariable.question.es}
          </p>
          <div className="flex flex-wrap gap-2">
            {solution.askVariable.options.map((opt) => (
              <button
                key={opt.symbol}
                className="rounded-lg border-2 px-4 py-2 text-sm font-bold transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                style={{ borderColor: colors.accent, color: colors.accent }}
              >
                <span className="font-mono mr-1">{opt.symbol}</span>
                <span className="text-xs font-normal opacity-80">
                  — {opt.label[language as "en" | "es"] ?? opt.label.es}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Molecule visualization ── */}
      {solution.moleculeName && (
        <MoleculeDisplay name={solution.moleculeName} svg={solution.moleculeSVG} />
      )}

      {/* ── Graph — already ResponsiveContainer width="100%" ── */}
      {solution.graphData && solution.graphData.length > 0 && (
        <GraphDisplay solution={solution} />
      )}

      {/* ── Steps ── */}
      {solution.steps.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            {t.stepByStep}
          </h3>
          <div className="space-y-3">
            {solution.steps.map((step, i) => {
              const summary = isSummaryStep(step.title);
              const formula = isFormula(step.title);
              return (
                <div key={i} className="flex gap-3 items-start">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: summary ? "#94a3b8" : colors.accent }}
                  >
                    {summary ? "∑" : i}
                  </span>
                  <div className="flex-1 min-w-0">
                    {formula ? (
                      <div
                        className="rounded-lg px-3 py-2 mb-1.5 inline-block max-w-full overflow-x-auto"
                        style={{ backgroundColor: colors.accent + "15" }}
                      >
                        <code
                          className="text-sm sm:text-base font-bold font-mono break-all"
                          style={{ color: colors.accent }}
                        >
                          {step.title}
                        </code>
                      </div>
                    ) : (
                      <p className="font-semibold text-foreground text-sm mb-0.5">{step.title}</p>
                    )}
                    <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed break-words">
                      {step.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionDisplay;
