import { CheckCircleIcon, CircleIcon, TrophyIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Item as HistoryItem } from "@/lib/api/fetch-generated";

interface ExerciseSetRowProps {
  index: number;
  isSetDone: boolean;
  weight: string;
  reps: string;
  prevData?: HistoryItem;
  hasPR: boolean;
  inputRef: (el: HTMLInputElement | null) => void;
  onInputChange: (index: number, field: "weight" | "reps", value: string) => void;
  onToggleSet: (index: number) => void;
}

export function ExerciseSetRow({
  index,
  isSetDone,
  weight,
  reps,
  prevData,
  hasPR,
  inputRef,
  onInputChange,
  onToggleSet,
}: ExerciseSetRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-2 items-center p-2 rounded-2xl border transition-all relative overflow-hidden",
        isSetDone
          ? "bg-primary/10 border-primary/30"
          : "bg-muted/30 border-border/50",
      )}
    >
      {hasPR && !isSetDone && (
        <div className="absolute top-0 right-10 p-1">
          <TrophyIcon weight="fill" className="size-3 text-yellow-500 animate-bounce" />
        </div>
      )}
      
      <div className="col-span-1 flex justify-center">
        <span className="font-anton italic text-sm text-muted-foreground">
          {index + 1}
        </span>
      </div>

      <div className="col-span-3 pl-2 overflow-hidden">
        {prevData ? (
          <p className="text-[10px] font-bold text-muted-foreground truncate italic">
            {prevData.reps}x{prevData.weightInGrams / 1000}kg
          </p>
        ) : (
          <p className="text-[10px] font-bold text-muted-foreground/30 italic">
            --
          </p>
        )}
      </div>

      <div className="col-span-4 relative">
        <input
          ref={inputRef}
          type="number"
          step="0.5"
          disabled={isSetDone}
          value={weight}
          onChange={(e) =>
            onInputChange(index, "weight", e.target.value)
          }
          className={cn(
            "w-full bg-background border border-border rounded-xl py-2 text-center font-anton text-sm italic focus:border-primary transition-colors disabled:opacity-50",
            hasPR && !isSetDone && "border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
          )}
        />
      </div>

      <div className="col-span-3">
        <input
          type="number"
          disabled={isSetDone}
          value={reps}
          onChange={(e) =>
            onInputChange(index, "reps", e.target.value)
          }
          className="w-full bg-background border border-border rounded-xl py-2 text-center font-anton text-sm italic focus:border-primary transition-colors disabled:opacity-50"
        />
      </div>

      <div className="col-span-1 flex justify-end pr-1">
        <button
          onClick={() => onToggleSet(index)}
          className={cn(
            "size-8 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer",
            isSetDone
              ? "bg-primary text-white"
              : "bg-muted border border-border text-muted-foreground hover:border-primary/50",
          )}
          title="Marcar set como concluído"
        >
          {isSetDone ? (
            <CheckCircleIcon weight="fill" className="size-5" />
          ) : (
            <CircleIcon weight="bold" className="size-5" />
          )}
        </button>
      </div>
    </div>
  );
}
