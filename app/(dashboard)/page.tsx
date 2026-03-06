import { getHomeData, getWorkoutPlanById } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import { ConsistencyGrid } from "@/components/consistencyGrid";
import { WorkoutCard } from "@/components/workoutCard";
import { Bell, Sparkles, Plus } from "lucide-react";
import { UserNav } from "@/components/userNav";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const homeResponse = await getHomeData(today.format("YYYY-MM-DD"));

  if (homeResponse.status !== 200) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <div className="max-w-xs space-y-4">
          <div className="size-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <p className="text-2xl font-bold">!</p>
          </div>
          <p className="text-muted-foreground font-medium">Erro ao carregar dados. Verifique sua conexão.</p>
        </div>
      </div>
    );
  }

  const homeData = homeResponse.data;
  const hasPlan = !!homeData.activeWorkoutPlanId;
  const todayWorkout = homeData.todayWorkoutDay;

  const consistencyValues = Object.values(homeData.consistencyByDay);
  const totalDays = consistencyValues.length;
  const completedDays = consistencyValues.filter(day => day.workoutDayCompleted).length;
  const weeklyProgress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return (
    <div className="max-w-300 mx-auto pb-32 lg:pb-12 px-5 sm:px-10 lg:px-12">
      
      <header className="flex items-center justify-between py-8 lg:py-10">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight uppercase italic leading-none">Dashboard</h1>
          <p className="hidden sm:block text-xs lg:text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Bem-vindo de volta, {session.data.user.name.split(" ")[0]}!
          </p>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-6 lg:hidden">
          <button className="relative size-12 bg-card border border-border rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            <Bell className="size-5" />
            <span className="absolute top-3 right-3 size-2 bg-primary rounded-full border-2 border-background" />
          </button>
          
          <UserNav user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image
          }} />
        </div>
      </header>

      <div className="lg:pt-0">
        <section className="relative aspect-16/10 sm:aspect-21/9 lg:h-105 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl">
          <Image
            src="/images/login-bg.png"
            alt="Banner"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent opacity-60" />
          
          <div className="absolute inset-0 flex flex-col justify-end lg:justify-between p-6 sm:p-10 lg:p-16">
            <div className="hidden lg:block">
              <h1 className="font-syne text-2xl font-black text-white uppercase italic tracking-tighter">
                P.
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
              <div className="space-y-2 lg:space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary-foreground px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg shadow-primary/20">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary-foreground"></span>
                  </span>
                  Meta Semanal
                </div>
                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] drop-shadow-2xl">
                  {hasPlan ? (
                    <>
                      FOCO <br className="hidden lg:block" />
                      <span className="text-primary">TOTAL</span>.
                    </>
                  ) : (
                    <>
                      CRIE SEU <br className="hidden lg:block" />
                      <span className="text-primary">PLANO</span>.
                    </>
                  )}
                </h2>
                <p className="text-[10px] sm:text-sm lg:text-lg text-white/70 font-medium max-w-xs sm:max-w-md drop-shadow">
                  {hasPlan 
                    ? `Seu plano atual está ${weeklyProgress}% completo. Mantenha o ritmo!`
                    : "Você ainda não possui um plano de treino ativo. Use nossa IA para montar um agora!"
                  }
                </p>
              </div>

              <Link 
                href={hasPlan 
                  ? (todayWorkout ? `/workout-plans/${homeData.activeWorkoutPlanId}/days/${todayWorkout.id}` : `/workout-plans/${homeData.activeWorkoutPlanId}`)
                  : "?chat_open=true&chat_initial_message=Monte meu plano de treino"
                }
                className="group bg-white hover:bg-primary text-black hover:text-white px-6 sm:px-8 py-3 sm:py-4 lg:px-10 lg:py-5 rounded-2xl sm:rounded-[2rem] text-[10px] sm:text-sm lg:text-base font-black uppercase italic transition-all shadow-2xl active:scale-95 flex items-center gap-3 sm:gap-4 w-fit"
              >
                {hasPlan ? "Bora Treinar" : "Montar Plano"}
                <div className="size-6 sm:size-8 lg:size-10 bg-black group-hover:bg-white rounded-full flex items-center justify-center transition-colors">
                  <Sparkles className="size-3 sm:size-4 lg:size-5 text-white group-hover:text-primary" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 space-y-12">
        <div className="space-y-6">
          <div className="px-5 lg:px-0 flex items-end justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-foreground tracking-tight uppercase italic leading-none">
                {hasPlan ? "Treino de Hoje" : "Comece Agora"}
              </h2>
              <p className="text-[10px] lg:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                {hasPlan 
                  ? (todayWorkout ? `Foco em ${todayWorkout.name}` : "Dia de descanso ou sem treino agendado")
                  : "Crie seu primeiro plano de treino com IA"
                }
              </p>
            </div>
            {hasPlan && (
              <Link href={`/workout-plans/${homeData.activeWorkoutPlanId}`} className="text-[10px] lg:text-xs font-black text-primary uppercase italic tracking-widest hover:underline">
                Ver plano completo
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {hasPlan ? (
              todayWorkout ? (
                <WorkoutCard 
                  workout={todayWorkout} 
                  isActive={true}
                  isCompleted={homeData.consistencyByDay[today.format("YYYY-MM-DD")]?.workoutDayCompleted}
                  planId={homeData.activeWorkoutPlanId!}
                />
              ) : (
                <div className="bg-card border border-border rounded-[2rem] p-8 text-center space-y-4">
                  <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <Plus className="size-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-syne text-lg font-black uppercase italic text-foreground tracking-tight">Sem treino hoje</p>
                    <p className="text-sm text-muted-foreground font-medium">Aproveite para descansar ou revisar sua consistência.</p>
                  </div>
                </div>
              )
            ) : (
              <Link 
                href="?chat_open=true&chat_initial_message=Monte meu plano de treino"
                className="group bg-card border border-border rounded-[2rem] p-10 text-center space-y-6 hover:border-primary/50 transition-all active:scale-[0.99]"
              >
                <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Sparkles className="size-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-syne text-2xl font-black uppercase italic text-foreground tracking-tight">Fale com o Coach AI</h3>
                  <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                    Nossa inteligência artificial está pronta para criar um plano de treino personalizado baseado nos seus objetivos e rotina.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-primary font-black uppercase italic tracking-widest text-sm">
                  Iniciar conversa
                  <Plus className="size-4" />
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="lg:hidden px-5 pb-10">
           <ConsistencyGrid 
            consistencyByDay={homeData.consistencyByDay} 
            streak={homeData.workoutStreak} 
          />
        </div>
      </div>
    </div>
  );
}
