import { GetWorkoutPlanById200WorkoutDaysItem } from "@/lib/api/fetch-generated";
import { Timer, Dumbbell, PlayCircle, Lock, Coffee, Zap, CheckCircle2 } from "lucide-react";
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
        "relative w-full aspect-4/3 sm:aspect-16/10 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group shadow-2xl transition-all duration-500 border border-transparent",
        isActive 
          ? "ring-2 ring-primary/20 border-primary/10" 
          : "shadow-black/5 opacity-80 hover:opacity-100 border-border/50",
        isCompleted && "ring-2 ring-green-500/20 border-green-500/10"
      )}
    >
      {isRestDay ? (
        <div className="absolute inset-0 bg-card flex flex-col items-center justify-center p-8 text-center">
          <div className="absolute inset-0 overflow-hidden">
             <div className={cn(
               "absolute -top-24 -right-24 size-64 rounded-full blur-[100px] transition-colors duration-1000",
               isActive ? "bg-primary/20" : "bg-primary/5"
             )} />
             <div className="absolute -bottom-24 -left-24 size-64 bg-primary/5 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className={cn(
              "size-20 rounded-[2rem] flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 shadow-xl",
              isCompleted 
                ? "bg-green-500 text-white shadow-green-500/20"
                : isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground shadow-black/5"
            )}>
              {isCompleted ? <CheckCircle2 className="size-10 stroke-2" /> : <Coffee className="size-10 stroke-2" />}
            </div>
            
            <div className="space-y-2">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em]",
                isCompleted ? "text-green-500" : isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {WEEKDAY_TRANSLATIONS[workout.weekDay]}
              </p>
              <h3 className="font-syne text-3xl sm:text-5xl font-black text-foreground uppercase italic leading-none tracking-tighter">
                {isCompleted ? "MISSÃO" : "RECONSTRUÇÃO"} <br /> <span className={cn(isCompleted ? "text-green-500" : isActive ? "text-primary" : "text-muted-foreground/50")}>{isCompleted ? "CUMPRIDA" : "TOTAL"}</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-70 mx-auto leading-relaxed">
                {isCompleted 
                  ? "Sua recuperação foi concluída com sucesso. Corpo e mente prontos para o próximo nível."
                  : "Momento de hipertrofia passiva. Recupere suas energias para a próxima sessão de elite."}
              </p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className={cn(
              "flex items-center gap-2 border px-4 py-2 rounded-2xl backdrop-blur-sm",
              isCompleted ? "bg-green-500/5 border-green-500/20" : "bg-muted/50 border border-border"
            )}>
              <Zap className={cn("size-3.5", isCompleted ? "text-green-500 fill-green-500" : isActive ? "text-primary fill-primary" : "text-muted-foreground")} />
              <span className={cn("text-[10px] font-black uppercase tracking-widest italic", isCompleted ? "text-green-600" : "text-foreground")}>
                {isCompleted ? "Recuperação Concluída" : "Modo de Recuperação Máxima"}
              </span>
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
              "object-cover transition-transform duration-700 group-hover:scale-110",
              (!isActive && !isCompleted) && "grayscale-[0.5] contrast-[0.8]"
            )}
            priority={isActive}
          />
          
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-95" />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent opacity-60" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-5 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                isCompleted ? "text-green-400" : isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {WEEKDAY_TRANSLATIONS[workout.weekDay]}
              </p>
              <h3 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase italic leading-none tracking-tighter drop-shadow-2xl">
                {workout.name}
              </h3>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/10 shadow-lg">
                  <Timer className={cn("size-3.5 sm:size-4", isCompleted ? "text-green-400" : isActive ? "text-primary" : "text-white/40")} />
                  <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">
                    {Math.round(workout.estimatedDurationInSeconds / 60)}min
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/10 shadow-lg">
                  <Dumbbell className={cn("size-3.5 sm:size-4", isCompleted ? "text-green-400" : isActive ? "text-primary" : "text-white/40")} />
                  <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">
                    {workout.exercisesCount} EXS
                  </span>
                </div>
              </div>
            </div>

            {isActive && !isCompleted && (
              <div className="flex items-center gap-3 group/btn bg-primary hover:bg-primary/90 text-primary-foreground pl-6 pr-3 py-2.5 rounded-[1.5rem] transition-all shadow-xl shadow-primary/30 active:scale-95 w-fit">
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest italic">Iniciar Sessão</span>
                <PlayCircle className="size-8 sm:size-10 fill-primary-foreground/20 text-primary-foreground" />
              </div>
            )}

            {isCompleted && (
              <div className="flex items-center gap-3 group/btn bg-green-500/20 border border-green-500/30 text-green-400 pl-6 pr-3 py-2.5 rounded-[1.5rem] transition-all w-fit backdrop-blur-md">
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest italic">Treino Concluído</span>
                <CheckCircle2 className="size-8 sm:size-10 fill-green-400/20 text-green-400" />
              </div>
            )}
          </div>
        </>
      )}

      {/* Top Badge (Status) */}
      {!isRestDay && (
        <div className="absolute top-4 sm:top-8 left-4 sm:left-10">
          <div className={cn(
            "backdrop-blur-2xl border rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2.5 shadow-2xl",
            isCompleted 
              ? "bg-green-500/20 border-green-500/30 text-green-400"
              : isActive 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-black/40 border-white/5 text-white/40"
          )}>
            {isCompleted ? (
              <CheckCircle2 className="size-3 sm:size-4" />
            ) : isActive ? (
              <div className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
            ) : (
              <Lock className="size-3 sm:size-4" />
            )}
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.25em]">
              {isCompleted ? "SESSÃO CONCLUÍDA" : isActive ? "PRONTO PARA TREINAR" : "SESSÃO BLOQUEADA"}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4 px-5 lg:px-0 py-4">
      {isActive || isRestDay ? (
        <Link href={`/workout-plans/${planId}/days/${workout.id}`} className="block w-full">
          {CardContent}
        </Link>
      ) : (
        <div className="w-full">
          {CardContent}
        </div>
      )}
    </div>
  );
}
