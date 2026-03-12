import { PlusIcon } from "@phosphor-icons/react/ssr";
import { WorkoutCard } from "@/components/workoutCard";
import Link from "next/link";

interface HomeWorkoutSectionProps {
  todayWorkout: any;
  activeWorkoutPlanId: string | null;
  isCompleted: boolean;
}

export function HomeWorkoutSection({
  todayWorkout,
  activeWorkoutPlanId,
  isCompleted,
}: HomeWorkoutSectionProps) {
  return (
    <div className="space-y-6">
      <div className="px-5 lg:px-0 flex items-end justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-foreground tracking-tight uppercase italic leading-none">
            Treino de Hoje
          </h2>
          <p className="text-[10px] lg:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1.5">
            {todayWorkout
              ? `Foco em ${todayWorkout.name}`
              : "Dia de descanso ou sem treino agendado"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/workout-templates"
            className="text-[10px] lg:text-xs font-black text-muted-foreground uppercase italic tracking-widest hover:text-primary transition-colors"
          >
            Mudar plano
          </Link>
          <Link
            href={`/workout-plans/${activeWorkoutPlanId}`}
            className="text-[10px] lg:text-xs font-black text-primary uppercase italic tracking-widest hover:underline"
          >
            Ver plano completo
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {todayWorkout ? (
          <WorkoutCard
            workout={todayWorkout}
            isActive={true}
            isCompleted={isCompleted}
            planId={activeWorkoutPlanId!}
          />
        ) : (
          <div className="bg-card border border-border rounded-[2rem] p-8 text-center space-y-4">
            <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <PlusIcon weight="duotone" className="size-8" />
            </div>
            <div className="space-y-1">
              <p className="font-syne text-lg font-black uppercase italic text-foreground tracking-tight">
                Sem treino hoje
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Aproveite para descansar ou revisar sua consistência.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
