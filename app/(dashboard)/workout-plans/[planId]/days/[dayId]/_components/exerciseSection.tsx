import { ExerciseItem } from "@/components/workoutDay/exerciseItem";

interface ExerciseSectionProps {
  exercises: any[];
  activeSession: any;
}

export function ExerciseSection({ exercises, activeSession }: ExerciseSectionProps) {
  return (
    <div className="mt-12 space-y-10">
      <div className="px-2">
        <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic leading-none">
          Protocolo de Performance
        </h3>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">
          Siga a sequência para máxima ativação neuromuscular
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {exercises.map((exercise, index) => (
          <div key={exercise.id} className="flex gap-4 sm:gap-6 items-start">
            <div className="hidden sm:flex flex-col items-center gap-2 pt-4">
              <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic text-xs shadow-inner">
                {String(index + 1).padStart(2, "0")}
              </div>
              {index !== exercises.length - 1 && (
                <div className="w-0.5 flex-1 bg-linear-to-b from-primary/20 to-transparent rounded-full min-h-12" />
              )}
            </div>
            <div className="flex-1">
              <ExerciseItem 
                exercise={exercise} 
                canMarkAsCompleted={!!activeSession}
                activeSessionId={activeSession?.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
