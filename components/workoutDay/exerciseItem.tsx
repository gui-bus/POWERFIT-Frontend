"use client";

import { GetWorkoutDayById200ExercisesItem } from "@/lib/api/fetch-generated";
import { QuestionIcon, CheckCircleIcon, CircleIcon, TimerIcon } from "@phosphor-icons/react";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { RestTimer } from "./restTimer";
import { AnimatePresence, motion } from "framer-motion";
import { playSoftPing } from "@/lib/utils/audio";

interface ExerciseItemProps {
  exercise: GetWorkoutDayById200ExercisesItem;
  canMarkAsCompleted?: boolean;
}

export function ExerciseItem({ exercise, canMarkAsCompleted }: ExerciseItemProps) {
  const [showTimer, setShowTimer] = useState(false);
  
  const [setsString, setSetsString] = useQueryState(
    `sets_${exercise.id}`,
    parseAsString.withDefault(new Array(exercise.sets).fill("0").join(","))
  );

  const [chatOpen, setChatOpen] = useQueryState("chat_open", parseAsBoolean.withDefault(false));
  const [, setChatInitialMessage] = useQueryState("chat_initial_message", parseAsString);

  // Converte a string da URL para um array de booleanos
  const completedSets = useMemo(() => {
    return (setsString || "").split(",").map(val => val === "1");
  }, [setsString]);

  const isAllCompleted = completedSets.every(set => set);

  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatOpen(true);
    setChatInitialMessage(`Poderia me dar instruções sobre como executar o ${exercise.name}?`);
  };

  const toggleSet = async (index: number) => {
    if (!canMarkAsCompleted) return;
    
    const newSets = [...completedSets];
    const isNowCompleted = !newSets[index];
    newSets[index] = isNowCompleted;
    
    const urlString = newSets.map(s => s ? "1" : "0").join(",");
    await setSetsString(urlString);

    if (isNowCompleted) {
      setShowTimer(true);
    }
  };

  const minutes = Math.floor(exercise.restTimeInSeconds / 60);
  const seconds = exercise.restTimeInSeconds % 60;
  const formattedPausa = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div 
      className={cn(
        "group bg-background border-b border-border p-6 sm:p-10 transition-all duration-500",
        isAllCompleted ? "bg-primary/2 border-primary/20" : "hover:bg-muted/30"
      )}
    >
      <div className="flex flex-col gap-8 sm:gap-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4 flex-1">
            <button
              onClick={handleHelpClick}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-[10px] font-black tracking-[0.2em] border border-border px-3 py-1.5 rounded-sm bg-background/50 active:scale-95 cursor-help"
            >
              <QuestionIcon size={16} />
              Instruções
            </button>

            <h3 className={cn(
              "text-3xl sm:text-4xl font-bold uppercase tracking-[-0.04em] leading-[0.9] max-w-4xl transition-all duration-500",
              isAllCompleted ? "text-primary italic opacity-50 line-through" : "text-foreground"
            )}>
              {exercise.name}
            </h3>
          </div>

          <div className="pt-2 flex flex-col items-end gap-2">
            {isAllCompleted ? (
              <CheckCircleIcon weight="fill" className="size-10 sm:size-12 text-primary animate-in zoom-in duration-300" />
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">
                  {completedSets.filter(s => s).length}/{exercise.sets} Séries
                </span>
                <CircleIcon weight="thin" className="size-10 sm:size-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-3 gap-4 sm:gap-12 max-w-5xl transition-opacity duration-500",
          isAllCompleted && "opacity-40"
        )}>
          <div className="flex flex-col gap-2">
            <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Séries
            </span>
            <span className="text-3xl sm:text-4xl font-anton italic text-foreground leading-none tabular-nums tracking-tighter">
              {exercise.sets.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-col gap-2 border-l border-border/50 pl-4 sm:pl-12">
            <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Reps
            </span>
            <span className="text-3xl sm:text-4xl font-anton italic text-foreground leading-none tracking-tighter tabular-nums">
              {exercise.reps}
            </span>
          </div>

          <div className="flex flex-col gap-2 border-l border-border/50 pl-4 sm:pl-12">
            <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Pausa
            </span>
            <div className="flex items-center gap-2">
              <TimerIcon className="size-4 text-primary" />
              <span className="text-3xl sm:text-4xl font-anton italic text-foreground tabular-nums tracking-tighter">
                {formattedPausa}
              </span>
            </div>
          </div>
        </div>

        {canMarkAsCompleted && !isAllCompleted && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-4 space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Checklist de Séries</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {completedSets.map((isSetDone, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleSet(idx)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] group/set",
                    isSetDone 
                      ? "bg-primary/10 border-primary/30 shadow-inner" 
                      : "bg-muted/30 border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "size-8 rounded-xl flex items-center justify-center font-anton italic transition-colors",
                      isSetDone ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground group-hover/set:text-primary"
                    )}>
                      {idx + 1}
                    </div>
                    <span className={cn(
                      "text-sm font-bold uppercase italic tracking-tight",
                      isSetDone ? "text-primary" : "text-foreground"
                    )}>
                      Série {idx + 1}
                    </span>
                  </div>

                  <div className={cn(
                    "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                    isSetDone ? "bg-primary border-primary scale-110" : "border-border"
                  )}>
                    {isSetDone && <CheckCircleIcon weight="fill" className="size-4 text-primary-foreground" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showTimer && (
          <RestTimer 
            initialSeconds={exercise.restTimeInSeconds} 
            onClose={() => setShowTimer(false)}
            onFinish={() => {
              playSoftPing();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
