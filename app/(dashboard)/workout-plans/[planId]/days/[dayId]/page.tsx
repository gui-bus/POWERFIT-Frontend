import {
  getWorkoutDayById,
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ExerciseItem } from "@/components/workoutDay/exerciseItem";
import { SessionAction } from "@/components/workoutDay/sessionAction";
import {
  CalendarIcon,
  TimerIcon,
  BarbellIcon,
  CoffeeIcon,
  LightningIcon,
  MoonIcon,
  DropIcon,
} from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { MuscleHeatmap } from "@/components/gamification/muscleHeatmap";
import { getWorkoutMuscles } from "@/lib/utils/muscleMapper";

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

  if (response.status !== 200) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do treino.
        </p>
      </div>
    );
  }

  const workoutDay = response.data;
  const activeMuscles = getWorkoutMuscles(workoutDay.exercises);

  const activeSession = workoutDay.sessions.find((s) => !s.completedAt);
  const isCompleted = workoutDay.sessions.some((s) => !!s.completedAt);

  if (workoutDay.isRestDay) {
    return (
      <div className="relative min-h-full flex flex-col overflow-hidden selection:bg-primary/20 selection:text-primary">
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <Container className="max-w-250 flex-1 flex flex-col">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <PageHeader 
              title="RECOVERY" 
              subtitle={WEEKDAY_TRANSLATIONS[workoutDay.weekDay]} 
              user={{
                name: session.data.user.name,
                email: session.data.user.email,
                image: session.data.user.image,
              }}
            />
          </header>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 py-10">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl animate-pulse" />
              <div className="relative size-32 sm:size-40 rounded-[3rem] bg-card border border-border shadow-2xl flex items-center justify-center group transition-transform duration-700 hover:scale-110">
                <CoffeeIcon weight="duotone" className="size-16 sm:size-20 text-primary stroke-[1.5]" />
                <div className="absolute -top-2 -right-2 size-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <LightningIcon weight="duotone" className="size-4 text-primary-foreground fill-primary-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <h2 className="font-syne text-3xl sm:text-5xl font-black text-foreground uppercase italic leading-none tracking-tighter text-balance px-4">
                REGENERAÇÃO <br />{" "}
                <span className="text-primary">ESTRATÉGICA</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-lg mx-auto">
                Seu corpo constrói músculos durante o descanso. Honre este
                momento com a mesma intensidade que honra seu treino.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl px-4">
              {[
                {
                  icon: MoonIcon,
                  title: "Sono",
                  val: "7-9h",
                  color: "text-indigo-400",
                },
                {
                  icon: DropIcon,
                  title: "Água",
                  val: "3.5L",
                  color: "text-blue-400",
                },
                {
                  icon: CoffeeIcon,
                  title: "Nutrição",
                  val: "Limpa",
                  color: "text-orange-400",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-[2rem] flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
                >
                  <item.icon weight="duotone" className={cn("size-6 mb-1", item.color)} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {item.title}
                  </span>
                  <span className="text-sm font-bold uppercase italic">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full max-w-[320px] pt-4 px-4">
              <SessionAction
                planId={planId}
                dayId={dayId}
                activeSessionId={activeSession?.id}
                isCompleted={isCompleted}
              />
              <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Marque para validar sua disciplina
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <Container>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <PageHeader 
          title="WORKOUT" 
          subtitle={WEEKDAY_TRANSLATIONS[workoutDay.weekDay]} 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <div className="lg:pt-10 pt-4">
        <section className="group relative aspect-8/10 sm:aspect-21/9 lg:h-85 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          <Image
            src={workoutDay.coverImageUrl || "/images/login-bg.png"}
            alt={workoutDay.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            priority
          />

          <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent opacity-60" />
          
          <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 lg:p-14">
            <div className="flex justify-between items-start">
              <div className="group/badge flex items-center gap-2 bg-black/20 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full transition-all hover:bg-white/10">
                <div className="relative">
                  <CalendarIcon weight="duotone" className="size-3.5 text-primary animate-pulse" />
                  <div className="absolute inset-0 blur-sm bg-primary/40 size-3.5" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em]">
                  {WEEKDAY_TRANSLATIONS[workoutDay.weekDay]}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-8 bg-primary/60" />
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                      Sessão Atual
                    </p>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-[0.9] drop-shadow-2xl">
                    {workoutDay.name}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {[
                    {
                      icon: TimerIcon,
                      text: `${Math.round(workoutDay.estimatedDurationInSeconds / 60)}m Estimados`,
                    },
                    {
                      icon: BarbellIcon,
                      text: `${workoutDay.exercises.length} Exercícios`,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 hover:border-white/30 transition-colors"
                    >
                      <item.icon weight="duotone" className="size-4 text-primary" />
                      <span className="text-[11px] font-semibold text-zinc-100 uppercase tracking-wide">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-fit min-w-65 relative group/btn">
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

      <div className="mt-8">
        <MuscleHeatmap 
          activeMuscles={activeMuscles} 
          title="Foco de Ativação"
          subtitle={`Distribuição Anatômica para ${workoutDay.name}`}
        />
      </div>

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
          {workoutDay.exercises.map((exercise, index) => (
            <div key={exercise.id} className="flex gap-4 sm:gap-6 items-start">
              <div className="hidden sm:flex flex-col items-center gap-2 pt-4">
                <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic text-xs shadow-inner">
                  {String(index + 1).padStart(2, "0")}
                </div>
                {index !== workoutDay.exercises.length - 1 && (
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
    </Container>
  );
}
