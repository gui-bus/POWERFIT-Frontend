import { QuestionIcon, TimerIcon, CopyIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { MiniTrendChart } from "./miniTrendChart";
import { Item as HistoryItem } from "@/lib/api/fetch-generated";

interface ExerciseHeaderProps {
  name: string;
  formattedPausa: string;
  isAllCompleted: boolean;
  canMarkAsCompleted?: boolean;
  completedCount: number;
  setsTotal: number;
  history: HistoryItem[];
  onHelpClick: (e: React.MouseEvent) => void;
  onCopyFirstSet: () => void;
}

export function ExerciseHeader({
  name,
  formattedPausa,
  isAllCompleted,
  canMarkAsCompleted,
  completedCount,
  setsTotal,
  history,
  onHelpClick,
  onCopyFirstSet,
}: ExerciseHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-4 flex-1">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onHelpClick}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-[9px] font-black tracking-widest border border-border px-3 py-1.5 rounded-xl bg-background/50 active:scale-95 cursor-pointer"
          >
            <QuestionIcon size={14} /> Instruções
          </button>
          <div className="inline-flex items-center gap-2 text-primary uppercase text-[9px] font-black tracking-widest border border-primary/20 px-3 py-1.5 rounded-xl bg-primary/5">
            <TimerIcon size={14} /> {formattedPausa} Pausa
          </div>
          {canMarkAsCompleted && !isAllCompleted && (
            <button
              onClick={onCopyFirstSet}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-[9px] font-black tracking-widest border border-border px-3 py-1.5 rounded-xl bg-background/50 active:scale-95 cursor-pointer"
            >
              <CopyIcon size={14} /> Replicar Carga
            </button>
          )}
        </div>

        <h3
          className={cn(
            "text-2xl sm:text-3xl font-anton uppercase tracking-tight italic leading-none transition-all",
            isAllCompleted ? "text-primary" : "text-foreground",
          )}
        >
          {name}
        </h3>

        <MiniTrendChart history={history} />
      </div>

      <div className="pt-2">
        {isAllCompleted ? (
          <CheckCircleIcon
            weight="fill"
            className="size-10 text-primary animate-in zoom-in duration-300"
          />
        ) : (
          <div className="size-10 rounded-2xl bg-muted/30 border border-border flex items-center justify-center text-[10px] font-black italic text-muted-foreground">
            {completedCount}/{setsTotal}
          </div>
        )}
      </div>
    </div>
  );
}
