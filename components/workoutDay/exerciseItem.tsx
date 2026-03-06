import { GetWorkoutDayById200ExercisesItem } from "@/lib/api/fetch-generated";
import { CircleHelp, Zap } from "lucide-react";

interface ExerciseItemProps {
  exercise: GetWorkoutDayById200ExercisesItem;
}

export function ExerciseItem({ exercise }: ExerciseItemProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-[2rem] flex flex-col gap-4 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground leading-tight">
          {exercise.name}
        </h3>
        <button className="text-muted-foreground hover:text-primary transition-colors">
          <CircleHelp className="size-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="bg-muted px-3 py-1.5 rounded-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {exercise.sets} Séries
          </span>
        </div>
        <div className="bg-muted px-3 py-1.5 rounded-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {exercise.reps} Reps
          </span>
        </div>
        <div className="bg-muted px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Zap className="size-3 text-primary fill-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {exercise.restTimeInSeconds}s
          </span>
        </div>
      </div>
    </div>
  );
}
