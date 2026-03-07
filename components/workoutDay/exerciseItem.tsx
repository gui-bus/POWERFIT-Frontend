"use client";

import { GetWorkoutDayById200ExercisesItem } from "@/lib/api/fetch-generated";
import { QuestionIcon, CheckCircleIcon, CircleIcon } from "@phosphor-icons/react";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ExerciseItemProps {
  exercise: GetWorkoutDayById200ExercisesItem;
  canMarkAsCompleted?: boolean;
}

export function ExerciseItem({ exercise, canMarkAsCompleted }: ExerciseItemProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatParams({
      chat_open: true,
      chat_initial_message: `Poderia me dar instruções sobre como executar o ${exercise.name}?`,
    });
  };

  const minutes = Math.floor(exercise.restTimeInSeconds / 60);
  const seconds = exercise.restTimeInSeconds % 60;

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div 
      onClick={() => canMarkAsCompleted && setIsCompleted(!isCompleted)}
      className={cn(
        "group bg-background border-b border-border p-6 sm:p-10 transition-all duration-500",
        canMarkAsCompleted && "cursor-pointer active:scale-[0.99]",
        isCompleted ? "bg-primary/[0.02] border-primary/20" : "hover:bg-muted/30"
      )}
    >
      <div className="flex flex-col gap-10 sm:gap-12">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4 sm:space-y-6 flex-1">
            <button
              onClick={handleHelpClick}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-[10px] font-black tracking-[0.2em] border border-border px-3 py-1.5 rounded-sm bg-background/50 active:scale-95 cursor-help"
            >
              <QuestionIcon size={16} />
              Instruções
            </button>

            <h3 className={cn(
              "text-3xl sm:text-4xl font-bold uppercase tracking-[-0.04em] leading-[0.9] max-w-4xl transition-all duration-500",
              isCompleted ? "text-primary italic opacity-50 line-through" : "text-foreground"
            )}>
              {exercise.name}
            </h3>
          </div>

          {canMarkAsCompleted && (
            <div className="pt-2">
              {isCompleted ? (
                <CheckCircleIcon weight="fill" className="size-10 sm:size-12 text-primary animate-in zoom-in duration-300" />
              ) : (
                <CircleIcon weight="thin" className="size-10 sm:size-12 text-muted-foreground/30 hover:text-primary/50 transition-colors" />
              )}
            </div>
          )}
        </div>

        <div className={cn(
          "grid grid-cols-3 gap-4 sm:gap-12 max-w-5xl transition-opacity duration-500",
          isCompleted && "opacity-40"
        )}>
          <div className="flex flex-col gap-2 sm:gap-4">
            <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Séries
            </span>
            <span className="text-4xl sm:text-5xl font-light text-foreground leading-none tabular-nums tracking-tighter">
              {exercise.sets.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:gap-4 border-l border-border/50 pl-4 sm:pl-12">
            <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Reps
            </span>
            <span className="text-4xl sm:text-5xl font-light text-foreground leading-none tracking-tighter tabular-nums">
              {exercise.reps}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:gap-4 border-l border-border/50 pl-4 sm:pl-12">
            <span className="text-[9px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Pausa
            </span>
            <span className="text-4xl sm:text-5xl font-light text-foreground italic tabular-nums tracking-tighter">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
