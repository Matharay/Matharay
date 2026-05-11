import { useApp, Subject } from "@/contexts/AppContext";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const subjects: { key: string; active: boolean }[] = [
  { key: "mathematics", active: true },
  { key: "physics", active: true },
  { key: "chemistry", active: true },
  { key: "calculus", active: true },
  { key: "biology", active: false },
  { key: "engineering", active: false },
  { key: "nutrition", active: false },
  { key: "economics", active: false },
];

const SubjectSelector = () => {
  const { t, subject, setSubject } = useApp();

  return (
    <div className="border-b border-border bg-background">
      <div className="container py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {subjects.map((s) => {
            const label = t.subjects[s.key as keyof typeof t.subjects];
            const isActive = s.active;
            const isSelected = subject === s.key;

            if (!isActive) {
              return (
                <Tooltip key={s.key}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-muted text-muted-foreground cursor-not-allowed opacity-60 whitespace-nowrap select-none">
                      <Lock size={12} />
                      {label}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{t.comingSoon}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <button
                key={s.key}
                onClick={() => setSubject(s.key as Subject)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
