import {
  QuestionIcon,
  TimerIcon,
  CopyIcon,
  CheckCircleIcon,
  HeartIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { MiniTrendChart } from "./miniTrendChart";
import {
  Item as HistoryItem,
  toggleFavoriteExercise,
} from "@/lib/api/fetch-generated";
import { useState } from "react";
import { toast } from "sonner";

interface ExerciseHeaderProps {
  id: string;
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
  id,
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
  const [isFavorite, setIsFavorite] = useState(false); // Default to false as GET doesn't provide it yet
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleToggleFavorite = async () => {
    if (isFavoriting) return;
    setIsFavoriting(true);
    try {
      const response = await toggleFavoriteExercise(id);
      if (response.status === 200) {
        setIsFavorite(response.data.isFavorite);
        toast.success(
          response.data.isFavorite
            ? "Adicionado aos favoritos!"
            : "Removido dos favoritos.",
        );
      }
    } catch {
      toast.error("Erro ao favoritar exercício.");
    } finally {
      setIsFavoriting(false);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-4">
      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-2.5">
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

          <button
            onClick={handleToggleFavorite}
            disabled={isFavoriting}
            className={cn(
              "inline-flex items-center gap-2 transition-all uppercase text-[9px] font-black tracking-widest border px-3 py-1.5 rounded-xl bg-background/50 active:scale-95 cursor-pointer",
              isFavorite
                ? "text-red-500 border-red-500/20 bg-red-500/5"
                : "text-muted-foreground border-border hover:text-red-500 hover:border-red-500/20",
            )}
          >
            <HeartIcon
              size={14}
              weight={isFavorite ? "fill" : "bold"}
              className={cn(isFavoriting && "animate-pulse")}
            />
            {isFavorite ? "Favorito" : "Favoritar"}
          </button>
        </div>

        <MiniTrendChart history={history} />
      </div>

      <div className="pt-2 flex items-center gap-5 justify-between w-full pb-5">
        <h3
          className={cn(
            "text-2xl sm:text-3xl font-anton uppercase tracking-tight italic leading-none transition-all",
            isAllCompleted ? "text-primary" : "text-foreground",
          )}
        >
          {name}
        </h3>

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
