"use client";

import { GetWorkoutDayById200ExercisesItem } from "@/lib/api/fetch-generated";
import { CircleHelp, Zap, Repeat, Layers } from "lucide-react";
import { useQueryStates, parseAsBoolean, parseAsString } from "nuqs";

interface ExerciseItemProps {
  exercise: GetWorkoutDayById200ExercisesItem;
}

export function ExerciseItem({ exercise }: ExerciseItemProps) {
  const [, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const handleHelpClick = () => {
    setChatParams({
      chat_open: true,
      chat_initial_message: `Qual a forma correta de executar o exercício ${exercise.name}?`,
    });
  };
  return (
    <div className="group bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-[2rem] flex flex-col gap-6 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
      {/* Side Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/10 group-hover:bg-primary transition-colors" />
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-syne text-lg font-black text-foreground uppercase italic leading-tight tracking-tight">
            {exercise.name}
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protocolo de Execução</p>
        </div>
        <button 
          onClick={handleHelpClick}
          className="size-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
        >
          <CircleHelp className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 p-3 rounded-2xl flex flex-col gap-1 items-center justify-center border border-transparent hover:border-primary/10 transition-colors">
          <Layers className="size-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
            {exercise.sets} Séries
          </span>
        </div>
        <div className="bg-secondary/50 p-3 rounded-2xl flex flex-col gap-1 items-center justify-center border border-transparent hover:border-primary/10 transition-colors">
          <Repeat className="size-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
            {exercise.reps} Reps
          </span>
        </div>
        <div className="bg-secondary/50 p-3 rounded-2xl flex flex-col gap-1 items-center justify-center border border-transparent hover:border-primary/10 transition-colors text-center">
          <Zap className="size-3.5 text-primary fill-primary/20" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
            {exercise.restTimeInSeconds}s Desc
          </span>
        </div>
      </div>
    </div>
  );
}
