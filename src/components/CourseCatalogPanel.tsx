import { useState } from "react";
import { BookOpen, Lock, ChevronDown, ChevronRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { courses } from "@/lib/courseData";

const subjectOrder = ["mathematics", "calculus", "physics", "chemistry", "biology", "economics", "engineering", "nutrition"];

const CourseCatalogPanel = () => {
  const { t, language } = useApp();
  const lang = language as "en" | "es";
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleSubject = (s: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const grouped = subjectOrder.map((subj) => ({
    subject: subj,
    label: t.subjects[subj as keyof typeof t.subjects] ?? subj,
    items: courses.filter((c) => c.subject === subj),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="px-2 py-2">
      <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {lang === "es" ? "Catálogo de Cursos" : "Course Catalog"}
        </span>
      </div>

      <div className="space-y-0.5">
        {grouped.map(({ subject, label, items }) => {
          const isOpen = expanded.has(subject);
          return (
            <div key={subject}>
              <button
                onClick={() => toggleSubject(subject)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                {isOpen
                  ? <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                  : <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                }
                <span className="truncate">{label}</span>
                <span className="ml-auto text-[10px] text-muted-foreground/60">{items.length}</span>
              </button>

              {isOpen && (
                <div className="ml-4 mt-0.5 space-y-0.5 mb-1">
                  {items.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground opacity-60 cursor-not-allowed"
                    >
                      <Lock className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">{course.title[lang] ?? course.title.en}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseCatalogPanel;
