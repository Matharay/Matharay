// Per-subject color palette
// Each subject has: accent (main color), bg (light bg), text, border

export const SUBJECT_COLORS: Record<string, {
  accent: string;       // CSS hex for icon/highlight
  bgClass: string;      // Tailwind bg class (sidebar selected)
  textClass: string;    // Tailwind text class
  borderClass: string;  // Tailwind border class
  badgeClass: string;   // Tailwind badge class
}> = {
  mathematics: {
    accent: "#3B5BDB",
    bgClass:    "bg-blue-100 dark:bg-blue-950",
    textClass:  "text-blue-700 dark:text-blue-300",
    borderClass:"border-blue-400",
    badgeClass: "bg-blue-600 text-white",
  },
  physics: {
    accent: "#7C3AED",
    bgClass:    "bg-violet-100 dark:bg-violet-950",
    textClass:  "text-violet-700 dark:text-violet-300",
    borderClass:"border-violet-400",
    badgeClass: "bg-violet-600 text-white",
  },
  chemistry: {
    accent: "#059669",
    bgClass:    "bg-emerald-100 dark:bg-emerald-950",
    textClass:  "text-emerald-700 dark:text-emerald-300",
    borderClass:"border-emerald-400",
    badgeClass: "bg-emerald-600 text-white",
  },
  calculus: {
    accent: "#D97706",
    bgClass:    "bg-amber-100 dark:bg-amber-950",
    textClass:  "text-amber-700 dark:text-amber-300",
    borderClass:"border-amber-400",
    badgeClass: "bg-amber-600 text-white",
  },
  biology: {
    accent: "#0891B2",
    bgClass:    "bg-cyan-100 dark:bg-cyan-950",
    textClass:  "text-cyan-700 dark:text-cyan-300",
    borderClass:"border-cyan-400",
    badgeClass: "bg-cyan-600 text-white",
  },
  engineering: {
    accent: "#DC2626",
    bgClass:    "bg-red-100 dark:bg-red-950",
    textClass:  "text-red-700 dark:text-red-300",
    borderClass:"border-red-400",
    badgeClass: "bg-red-600 text-white",
  },
  nutrition: {
    accent: "#DB2777",
    bgClass:    "bg-pink-100 dark:bg-pink-950",
    textClass:  "text-pink-700 dark:text-pink-300",
    borderClass:"border-pink-400",
    badgeClass: "bg-pink-600 text-white",
  },
  economics: {
    accent: "#0D9488",
    bgClass:    "bg-teal-100 dark:bg-teal-950",
    textClass:  "text-teal-700 dark:text-teal-300",
    borderClass:"border-teal-400",
    badgeClass: "bg-teal-700 text-white",
  },
  accounting: {
    accent: "#0F766E",
    bgClass:    "bg-teal-100 dark:bg-teal-950",
    textClass:  "text-teal-700 dark:text-teal-300",
    borderClass:"border-teal-400",
    badgeClass: "bg-teal-600 text-white",
  },
};

export const getSubjectColor = (subject: string) =>
  SUBJECT_COLORS[subject] ?? SUBJECT_COLORS.mathematics;
