import { GetWorkoutPlanById200WorkoutDaysItem } from "@/lib/api/fetch-generated";
import { Timer, Dumbbell, Lock, Coffee, Zap, CheckCircle2, ArrowRight } from "lucide-react";
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

export function WorkoutCard({ workout, isActive = false, isCompleted = false, planId }: WorkoutCardProps) {
  if (!workout) return null;

  const { isRestDay } = workout;

  const CardContent = (
    <div 
      className={cn(
        "relative w-full aspect-[4/3] sm:aspect-[21/9] rounded-[2rem] overflow-hidden group transition-all duration-500 border border-border/40 bg-card",
        isActive 
          ? "ring-1 ring-primary/30 border-primary/20 shadow-2xl shadow-primary/10" 
          : "hover:border-primary/20",
        isCompleted && "ring-1 ring-green-500/30 border-green-500/20"
      )}
    >
      {isRestDay ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute inset-0 overflow-hidden">
             <div className={cn(
               "absolute -top-24 -right-24 size-64 rounded-full blur-[100px] transition-colors duration-1000",
               isActive ? "bg-primary/15" : "bg-primary/5"
             )} />
             <div className="absolute -bottom-24 -left-24 size-64 bg-primary/5 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className={cn(
              "size-16 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 shadow-xl",
              isCompleted 
                ? "bg-green-500 text-white"
                : isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
            )}>
              {isCompleted ? <CheckCircle2 className="size-8 stroke-2" /> : <Coffee className="size-8 stroke-2" />}
            </div>
            
            <div className="space-y-1">
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                isCompleted ? "text-green-500" : isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {WEEKDAY_TRANSLATIONS[workout.weekDay]}
              </p>
              <h3 className="font-syne text-2xl sm:text-4xl font-black text-foreground uppercase italic leading-none tracking-tighter">
                {isCompleted ? "RECUPERADO" : "RECONSTRUÇÃO"}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium max-w-[240px] mx-auto leading-relaxed">
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
              "object-cover transition-transform duration-1000 group-hover:scale-105",
              (!isActive && !isCompleted) && "grayscale-[0.3] brightness-[0.7]"
            )}
            priority={isActive}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-40" />

          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               {/* Status Badge */}
              <div className={cn(
                "backdrop-blur-md border rounded-full px-4 py-1.5 flex items-center gap-2 transition-all",
                isCompleted 
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : isActive 
                    ? "bg-white/10 border-white/20 text-white" 
                    : "bg-black/40 border-white/5 text-white/40"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="size-3" />
                ) : isActive ? (
                  <div className="size-1.5 bg-primary rounded-full animate-pulse" />
                ) : (
                  <Lock className="size-3" />
                )}
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                  {isCompleted ? "CONCLUÍDO" : isActive ? "EM FOCO" : "BLOQUEADO"}
                </span>
              </div>

              {isActive && !isCompleted && (
                <div className="hidden sm:flex items-center gap-2 text-white/60 font-black text-[10px] uppercase italic tracking-widest group-hover:text-white transition-colors">
                  Iniciar agora
                  <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest italic",
                  isCompleted ? "text-green-400" : isActive ? "text-primary" : "text-white/40"
                )}>
                  {WEEKDAY_TRANSLATIONS[workout.weekDay]}
                </p>
                <h3 className="font-syne text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase italic leading-none tracking-tighter drop-shadow-2xl max-w-lg">
                  {workout.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                  <Timer className="size-3 text-white/60" />
                  <span className="text-[10px] font-black text-white uppercase italic">
                    {Math.round(workout.estimatedDurationInSeconds / 60)}m
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg">
                  <Dumbbell className="size-3 text-white/60" />
                  <span className="text-[10px] font-black text-white uppercase italic">
                    {workout.exercisesCount} EXS
                  </span>
                </div>
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
        <Link href={`/workout-plans/${planId}/days/${workout.id}`} className="block w-full transition-transform active:scale-[0.98]">
          {CardContent}
        </Link>
      ) : (
        <div className="w-full cursor-not-allowed">
          {CardContent}
        </div>
      )}
    </div>
  );
}
