import { getWorkoutDayById, getWorkoutDayByIdResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { WorkoutDayHeader } from "@/components/workoutDay/workoutDayHeader";
import { ExerciseItem } from "@/components/workoutDay/exerciseItem";
import { SessionAction } from "@/components/workoutDay/sessionAction";
import { Calendar, Timer, Dumbbell, Coffee, Zap, Moon, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    planId: string;
    dayId: string;
  }>;
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

export default async function WorkoutDayPage({ params }: PageProps) {
  const { planId, dayId } = await params;

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const response = await getWorkoutDayById(planId, dayId);

  if ("error" in response) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do treino.
        </p>
      </div>
    );
  }

  const { data: workoutDay } = response as getWorkoutDayByIdResponseSuccess;

  const activeSession = workoutDay.sessions.find(s => !s.completedAt);
  const isCompleted = workoutDay.sessions.some(s => !!s.completedAt);

  if (workoutDay.isRestDay) {
    return (
      <div className="relative min-h-full flex flex-col overflow-hidden selection:bg-primary/20 selection:text-primary">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-[1000px] mx-auto flex-1 flex flex-col px-6 py-10 lg:py-16">
          <WorkoutDayHeader title={WEEKDAY_TRANSLATIONS[workoutDay.weekDay]} />

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 py-10">
            {/* Central Zen Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl animate-pulse" />
              <div className="relative size-32 sm:size-40 rounded-[3rem] bg-card border border-border shadow-2xl flex items-center justify-center group transition-transform duration-700 hover:scale-110">
                <Coffee className="size-16 sm:size-20 text-primary stroke-[1.5]" />
                <div className="absolute -top-2 -right-2 size-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="size-4 text-primary-foreground fill-primary-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <h2 className="font-syne text-4xl sm:text-6xl font-black text-foreground uppercase italic leading-none tracking-tighter">
                REGENERAÇÃO <br /> <span className="text-primary">ESTRATÉGICA</span>
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground font-medium leading-relaxed">
                Hoje seu corpo está construindo o que você treinou ontem. <br className="hidden sm:block" />
                Honre seu descanso com a mesma intensidade que honra seu treino.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
              {[
                { icon: Moon, title: "Sono", val: "7-9h", color: "text-indigo-400" },
                { icon: Droplets, title: "Água", val: "3.5L", color: "text-blue-400" },
                { icon: Coffee, title: "Nutrição", val: "Limpa", color: "text-orange-400" }
              ].map((item, i) => (
                <div key={i} className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-[2rem] flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
                  <item.icon className={cn("size-6 mb-1", item.color)} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.title}</span>
                  <span className="text-sm font-bold uppercase italic">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="w-full max-w-[320px] pt-4">
              <SessionAction 
                planId={planId} 
                dayId={dayId} 
                activeSessionId={activeSession?.id}
                isCompleted={isCompleted}
              />
              <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Marque como concluído para manter sua ofensiva
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pb-32 lg:pb-12 px-5 sm:px-10 lg:px-12">
      <WorkoutDayHeader title={WEEKDAY_TRANSLATIONS[workoutDay.weekDay]} />

      <div className="lg:pt-10 pt-4">
        <section className="relative aspect-[16/10] sm:aspect-[21/9] lg:h-[420px] w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl shadow-primary/10">
          <Image
            src={workoutDay.coverImageUrl || "/images/login-bg.png"}
            alt={workoutDay.name}
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-16">
            <div className="absolute top-6 sm:top-10 left-6 sm:left-10">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                <Calendar className="size-3.5 text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {WEEKDAY_TRANSLATIONS[workoutDay.weekDay]}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-2 lg:space-y-4 max-w-2xl">
                <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] drop-shadow-2xl">
                  {workoutDay.name}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                    <Timer className="size-4 text-primary" />
                    <span className="text-xs font-black text-white uppercase">
                      {workoutDay.isRestDay ? "REGENERAÇÃO" : `${Math.round(workoutDay.estimatedDurationInSeconds / 60)}min`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                    {workoutDay.isRestDay ? (
                      <>
                        <Zap className="size-4 text-primary" />
                        <span className="text-xs font-black text-white uppercase">Recuperação Ativa</span>
                      </>
                    ) : (
                      <>
                        <Dumbbell className="size-4 text-primary" />
                        <span className="text-xs font-black text-white uppercase">
                          {workoutDay.exercises.length} Exercícios
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-fit min-w-[200px]">
                <SessionAction 
                  planId={planId} 
                  dayId={dayId} 
                  activeSessionId={activeSession?.id}
                  isCompleted={isCompleted}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 space-y-8">
        <div className="px-2">
          <h3 className="text-xl font-black text-foreground tracking-tight uppercase italic leading-none">
            {workoutDay.isRestDay ? "Protocolo de Recuperação" : "Exercícios"}
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
            {workoutDay.isRestDay ? "Otimize sua reconstrução muscular" : "Siga o protocolo de performance"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workoutDay.exercises.map((exercise) => (
            <ExerciseItem key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
    </div>
  );
}
