import { GetWorkoutPlanById200WorkoutDaysItem } from "@/lib/api/fetch-generated";
import {
  TimerIcon,
  BarbellIcon,
  LockIcon,
  CoffeeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  workout: GetWorkoutPlanById200WorkoutDaysItem;
  isActive?: boolean;
  isCompleted?: boolean;
  planId: string;
}

const WEEKDAY_TRANSLATIONS = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export function WorkoutCard({
  workout,
  isActive = false,
  isCompleted = false,
  planId,
}: WorkoutCardProps) {
  if (!workout) return null;

  const { isRestDay } = workout;

  const CardContent = (
    <div
      className={cn(
        "relative w-full aspect-4/3 sm:aspect-21/9 rounded-[2rem] overflow-hidden group transition-all duration-500 border bg-card",
        isActive ? "shadow-2xl shadow-primary/10" : "hover:border-primary/20",
      )}
    >
      {isRestDay ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={cn(
                "absolute -top-24 -right-24 size-64 rounded-full blur-[100px] transition-colors duration-1000",
                isActive ? "bg-primary/15" : "bg-primary/5",
              )}
            />
            <div className="absolute -bottom-24 -left-24 size-64 bg-primary/5 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 space-y-4">
            <div
              className={cn(
                "size-16 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 shadow-xl",
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {isCompleted ? (
                <CheckCircleIcon weight="duotone" className="size-8 stroke-2" />
              ) : (
                <CoffeeIcon weight="duotone" className="size-8 stroke-2" />
              )}
            </div>

            <div className="space-y-1">
              <p
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  isCompleted
                    ? "text-green-500"
                    : isActive
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              >
                {WEEKDAY_TRANSLATIONS[workout.weekDay]}
              </p>
              <h3 className="font-syne text-2xl sm:text-4xl font-black text-foreground uppercase italic leading-none tracking-tighter">
                {isCompleted ? "RECUPERADO" : "RECONSTRUÇÃO"}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium max-w-60 mx-auto leading-relaxed">
                {isCompleted
                  ? "Corpo pronto para o próximo desafio."
                  : "Hipertrofia passiva em progresso."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Image
            src={workout.coverImageUrl || "/images/login-bg.png"}
            alt={workout.name}
            fill
            className={cn(
              "object-cover transition-all duration-700 group-hover:scale-110",
              !isActive && !isCompleted
                ? "grayscale brightness-[0.5]"
                : "brightness-[0.8] group-hover:brightness-100",
            )}
            priority={isActive}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0),rgba(0,0,0,0.8))] opacity-60" />

          <div className="absolute inset-0 p-16 flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div
                className={cn(
                  "backdrop-blur-xl border rounded-full px-4 py-1.5 flex items-center gap-2.5 transition-all duration-500 shadow-2xl",
                  isCompleted
                    ? "bg-green-500/10 border-green-500/40 text-green-400"
                    : isActive
                      ? "bg-primary/10 border-primary/50 text-white shadow-primary/20"
                      : "bg-black/40 border-white/10 text-white/30",
                )}
              >
                {isCompleted ? (
                  <CheckCircleIcon weight="duotone" className="size-3.5" />
                ) : isActive ? (
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
                  </span>
                ) : (
                  <LockIcon weight="duotone" className="size-3" />
                )}
                <span className="text-[10px] font-black uppercase tracking-[0.25em] leading-none">
                  {isCompleted
                    ? "CONCLUÍDO"
                    : isActive
                      ? "TREINO DE HOJE"
                      : "BLOQUEADO"}
                </span>
              </div>

              {isActive && !isCompleted && (
                <div className="hidden sm:flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    TREINAR
                  </span>
                  <ArrowRightIcon weight="duotone" className="size-4" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-0.5 w-8",
                      isActive ? "bg-primary" : "bg-white/20",
                    )}
                  />
                  <p
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.3em]",
                      isActive ? "text-primary" : "text-white/40",
                    )}
                  >
                    {WEEKDAY_TRANSLATIONS[workout.weekDay]}
                  </p>
                </div>

                <h3 className="font-syne text-3xl font-black text-white uppercase italic leading-[0.85] tracking-tighter drop-shadow-2xl group-hover:text-primary transition-colors duration-500">
                  {workout.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {[
                  {
                    icon: TimerIcon,
                    label: `Tempo estimado: ${Math.round(workout.estimatedDurationInSeconds / 60)} MIN`,
                  },
                  {
                    icon: BarbellIcon,
                    label: `${workout.exercisesCount} EXERCÍCIOS`,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group/pill flex items-center gap-2 bg-white/3 hover:bg-white/8 backdrop-blur-md px-4 py-2 rounded-sm border border-white/10 transition-colors"
                  >
                    <item.icon
                      weight="duotone"
                      className="size-3 text-primary"
                    />
                    <span className="text-[9px] font-black text-white/90 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {isActive || isRestDay ? (
        <Link
          href={`/workout-plans/${planId}/days/${workout.id}`}
          className="block w-full transition-transform active:scale-[0.98]"
        >
          {CardContent}
        </Link>
      ) : (
        <div className="w-full cursor-not-allowed">{CardContent}</div>
      )}
    </div>
  );
}
