import { useState, useRef, useEffect } from "react";
import { useApp, HistoryEntry } from "@/contexts/AppContext";
import { solve } from "@/lib/solver";
import { detectRelevantCourses } from "@/lib/courseData";
import { getSubjectColor } from "@/lib/subjectColors";
import AppSidebar from "@/components/AppSidebar";
import SymbolKeyboard from "@/components/SymbolKeyboard";
import SolutionDisplay from "@/components/SolutionDisplay";
import HistoryPanel from "@/components/HistoryPanel";
import AdBanner from "@/components/AdBanner";
import PricingBanner from "@/components/PricingBanner";
import CourseRecommendations from "@/components/CourseRecommendations";
import FormulaInterpreter from "@/components/FormulaInterpreter";
import { Button } from "@/components/ui/button";
import { Camera, Lock, Zap, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const {
    t, subject, language, darkMode,
    currentState, setSubjectInput, setSubjectSolution, addToHistory,
  } = useApp();

  const [method, setMethod] = useState("auto");
  const [solving, setSolving] = useState(false);
  const [flash, setFlash]    = useState(false);
  const [solveKey, setSolveKey] = useState(0); // forces solution re-render

  const colors = getSubjectColor(subject);

  // Use refs to always read latest values inside async handler
  const inputRef      = useRef(currentState.input);
  const subjectRef    = useRef(subject);
  const languageRef   = useRef(language);

  useEffect(() => { inputRef.current   = currentState.input; }, [currentState.input]);
  useEffect(() => { subjectRef.current = subject; },           [subject]);
  useEffect(() => { languageRef.current = language; },         [language]);

  // Clear solution when user starts typing a new problem
  const prevInput = useRef(currentState.input);
  useEffect(() => {
    if (currentState.input !== prevInput.current) {
      prevInput.current = currentState.input;
    }
  }, [currentState.input]);

  const handleSolve = async () => {
    const currentInput   = inputRef.current.trim();
    const currentSubject = subjectRef.current;
    const currentLang    = languageRef.current;
    if (!currentInput || solving) return;

    setSolving(true);
    setFlash(false);

    // Small delay so spinner is visible
    await new Promise((r) => setTimeout(r, 300));

    try {
      const result  = solve(currentInput, currentSubject as any, currentLang as any);
      const courses = detectRelevantCourses(currentInput, currentSubject);
      setSubjectSolution(result, courses);
      addToHistory({
        id: crypto.randomUUID(),
        problem: currentInput,
        answer: result.answer,
        solution: result,
        subject: currentSubject as any,
        timestamp: Date.now(),
      });
      setSolveKey((k) => k + 1); // force SolutionDisplay to re-mount
      setFlash(true);
      setTimeout(() => setFlash(false), 900);
    } catch (err) {
      console.error("Solver error:", err);
      setSubjectSolution({
        answer: currentLang === "es" ? "Error al resolver" : "Solver error",
        steps: [{
          title: "Error",
          explanation: currentLang === "es"
            ? "Hubo un error interno. Intenta reformular el problema."
            : "An internal error occurred. Try rephrasing the problem.",
        }],
      });
      setSolveKey((k) => k + 1);
    } finally {
      setSolving(false);
    }
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setSubjectInput(entry.problem);
    setSubjectSolution(entry.solution, detectRelevantCourses(entry.problem, entry.subject));
    setSolveKey((k) => k + 1);
  };

  const { input, solution, recommendedCourses, history } = currentState;
  const showMethodSelector = subject === "mathematics" || subject === "calculus";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">

          {/* ── Header with subject accent ── */}
          <header
            className="h-14 flex items-center border-b sticky top-0 z-50 px-4 transition-all duration-300"
            style={{
              borderBottomWidth: "2px",
              borderBottomColor: colors.accent + "60",
              background: `linear-gradient(to right, ${colors.accent}08, transparent)`,
              backgroundColor: "hsl(var(--background))",
            }}
          >
            <SidebarTrigger />
            <div className="ml-3 flex items-center gap-2 lg:hidden">
              <img src={darkMode ? "/logo_white.png" : "/logo_black.png"} alt="Matharay" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold tracking-tight">{t.appName}</span>
            </div>
            <div className="ml-auto">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm"
                style={{ backgroundColor: colors.accent, color: "white" }}
              >
                {t.subjects[subject as keyof typeof t.subjects]}
              </span>
            </div>
          </header>

          <main className="flex-1 py-6 pb-24 lg:pb-6 px-4 lg:px-6">
            <div className="flex flex-col lg:flex-row gap-6">

              {/* ── Main area ── */}
              <div className="flex-1 min-w-0">

                {/* Textarea — colored border when has content */}
                <div
                  className="rounded-xl transition-all duration-300"
                  style={{
                    boxShadow: input
                      ? `0 0 0 2px ${colors.accent}50, 0 4px 12px ${colors.accent}15`
                      : "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    placeholder={t.problemPlaceholder}
                    rows={3}
                    className="w-full rounded-xl border-2 bg-card p-4 text-foreground text-base resize-none focus:outline-none placeholder:text-muted-foreground transition-colors duration-200"
                    style={{
                      borderColor: input ? colors.accent + "80" : "hsl(var(--border))",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSolve();
                    }}
                  />
                </div>

                <SymbolKeyboard onInsert={(sym) => setSubjectInput(input + sym)} />

                {/* Action bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-3">

                  {/* Solve button */}
                  <Button
                    onClick={handleSolve}
                    disabled={solving || !input.trim()}
                    size="lg"
                    className={`w-full sm:w-auto font-bold gap-2 shadow-md transition-all duration-200 ${
                      flash ? "scale-105 brightness-110" : ""
                    }`}
                    style={{
                      background: solving
                        ? `${colors.accent}99`
                        : `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
                      border: `2px solid ${colors.accent}`,
                      color: "white",
                      minWidth: 130,
                    }}
                  >
                    {solving
                      ? <Loader2 size={16} className="animate-spin" />
                      : <Zap size={16} className={flash ? "animate-bounce" : ""} />
                    }
                    {solving
                      ? (language === "es" ? "Calculando..." : "Solving...")
                      : t.solve}
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="lg" disabled className="gap-1.5 text-muted-foreground">
                        <Lock size={14} /><Camera size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t.comingSoon}</TooltipContent>
                  </Tooltip>

                  {showMethodSelector && (
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger className="w-[160px]" style={{ borderColor: colors.accent + "50" }}>
                        <SelectValue placeholder={t.method} />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(t.methods) as Array<keyof typeof t.methods>).map((k) => (
                          <SelectItem key={k} value={k}>{t.methods[k]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Formula interpreter */}
                <FormulaInterpreter onUseFormula={(f) => setSubjectInput(f)} />

                {/* Solving pulse overlay */}
                {solving && (
                  <div className="mt-6 rounded-xl border-2 p-6 flex items-center gap-4 animate-pulse"
                    style={{ borderColor: colors.accent + "40", backgroundColor: colors.accent + "08" }}>
                    <Loader2 size={24} className="animate-spin" style={{ color: colors.accent }} />
                    <span className="text-sm font-medium" style={{ color: colors.accent }}>
                      {language === "es" ? "Analizando el problema..." : "Analyzing problem..."}
                    </span>
                  </div>
                )}

                {/* Solution — key forces fresh mount on each new solve */}
                {!solving && solution && (
                  <div
                    key={solveKey}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <SolutionDisplay solution={solution} />
                    <CourseRecommendations courses={recommendedCourses} />
                  </div>
                )}

                <AdBanner />
                <PricingBanner />
              </div>

              {/* Desktop history */}
              <div className="hidden lg:block w-72 flex-shrink-0">
                <HistoryPanel onSelect={handleSelectHistory} history={history} />
              </div>
            </div>
          </main>

          <HistoryPanel onSelect={handleSelectHistory} history={history} mobile />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
