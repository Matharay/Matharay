import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import translations, { Language } from "@/i18n/translations";
import { Course } from "@/lib/courseData";

export type Subject = "mathematics" | "physics" | "chemistry" | "calculus" | "economics";

export interface SolutionStep {
  title: string;
  explanation: string;
}

export type GraphType = "xy" | "multiline" | "bar" | "molecule";

export interface GraphSeries {
  key: string;
  label: string;
  color?: string;
}

export interface Solution {
  answer: string;
  steps: SolutionStep[];
  // Graph support
  graphType?:   GraphType;
  graphData?:   Record<string, number>[];  // e.g. [{x:0, y:0, y2:1}, ...]
  graphSeries?: GraphSeries[];
  graphTitle?:  string;
  graphXLabel?: string;
  graphYLabel?: string;
  // Molecule
  moleculeName?: string;  // key for molecule lookup
  moleculeSVG?:  string;  // raw SVG string
  // Variable selector (economics / multi-unknown)
  askVariable?: {
    question: { en: string; es: string };
    options: {
      symbol: string;
      label: { en: string; es: string };
    }[];
  };
}

export interface HistoryEntry {
  id: string;
  problem: string;
  answer: string;
  solution: Solution;
  subject: Subject;
  timestamp: number;
}

export interface SubjectState {
  input: string;
  solution: Solution | null;
  recommendedCourses: Course[];
  history: HistoryEntry[];
}

const emptySubjectState = (): SubjectState => ({
  input: "", solution: null, recommendedCourses: [], history: [],
});

type SubjectStates = Record<Subject, SubjectState>;
const initialSubjectStates = (): SubjectStates => ({
  mathematics: emptySubjectState(),
  physics:     emptySubjectState(),
  chemistry:   emptySubjectState(),
  calculus:    emptySubjectState(),
  economics:   emptySubjectState(),
});

interface AppContextType {
  language: Language; setLanguage: (l: Language) => void;
  t: (typeof translations)[Language];
  darkMode: boolean; toggleDarkMode: () => void;
  subject: Subject;  setSubject: (s: Subject) => void;
  currentState: SubjectState;
  setSubjectInput: (input: string) => void;
  setSubjectSolution: (solution: Solution | null, courses?: Course[]) => void;
  addToHistory: (entry: HistoryEntry) => void;
  solveCount: number;
}

const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language,      setLanguage]     = useState<Language>("es");
  const [darkMode,      setDarkMode]     = useState(false);
  const [subject,       setSubject]      = useState<Subject>("mathematics");
  const [subjectStates, setSubjectStates]= useState<SubjectStates>(initialSubjectStates);
  const [solveCount,    setSolveCount]   = useState(0);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);
  const currentState = subjectStates[subject];

  const setSubjectInput = useCallback((input: string) => {
    setSubjectStates((prev) => ({ ...prev, [subject]: { ...prev[subject], input } }));
  }, [subject]);

  const setSubjectSolution = useCallback((solution: Solution | null, courses: Course[] = []) => {
    setSubjectStates((prev) => ({ ...prev, [subject]: { ...prev[subject], solution, recommendedCourses: courses } }));
  }, [subject]);

  const addToHistory = useCallback((entry: HistoryEntry) => {
    setSubjectStates((prev) => ({
      ...prev,
      [entry.subject]: { ...prev[entry.subject], history: [entry, ...prev[entry.subject].history] },
    }));
    setSolveCount((c) => c + 1);
  }, []);

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);

  return (
    <AppContext.Provider value={{
      language, setLanguage, t: translations[language],
      darkMode, toggleDarkMode, subject, setSubject,
      currentState, setSubjectInput, setSubjectSolution, addToHistory, solveCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};
