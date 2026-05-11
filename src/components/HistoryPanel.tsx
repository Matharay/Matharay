import { useApp, HistoryEntry } from "@/contexts/AppContext";
import { Clock, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  onSelect: (entry: HistoryEntry) => void;
  history: HistoryEntry[];
  mobile?: boolean;
}

const HistoryItem = ({ entry, onClick }: { entry: HistoryEntry; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors border border-border"
  >
    <p className="text-sm font-semibold text-primary truncate">{entry.answer}</p>
    <p className="text-xs text-muted-foreground truncate mt-0.5">{entry.problem}</p>
  </button>
);

const HistoryPanel = ({ onSelect, history, mobile }: Props) => {
  const { t } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const recent = history.slice(0, 7);

  const content = (
    <>
      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">{t.noHistory}</p>
      ) : (
        <div className="space-y-2">
          {recent.map((entry) => (
            <HistoryItem key={entry.id} entry={entry} onClick={() => onSelect(entry)} />
          ))}
        </div>
      )}
      {history.length > 7 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mt-3">
              {t.fullHistory}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.allHistory}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {history.map((entry) => (
                <HistoryItem key={entry.id} entry={entry} onClick={() => onSelect(entry)} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );

  if (mobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border lg:hidden">
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-muted-foreground"
        >
          <Clock size={14} />
          {t.recentHistory}
          <ChevronUp size={14} className={`transition-transform ${drawerOpen ? "rotate-180" : ""}`} />
        </button>
        {drawerOpen && <div className="px-4 pb-4 max-h-64 overflow-y-auto">{content}</div>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Clock size={14} />
        {t.recentHistory}
      </h3>
      {content}
    </div>
  );
};

export default HistoryPanel;
