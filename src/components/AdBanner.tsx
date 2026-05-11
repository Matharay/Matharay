import { useApp } from "@/contexts/AppContext";

const AdBanner = () => {
  const { t, solveCount } = useApp();
  if (solveCount < 5) return null;

  return (
    <div className="rounded-lg border border-border bg-muted p-4 mt-4">
      <p className="text-sm text-muted-foreground text-center">{t.adBanner}</p>
      <div className="mt-2 rounded bg-secondary h-16 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">{t.adPlaceholder}</span>
      </div>
    </div>
  );
};

export default AdBanner;
