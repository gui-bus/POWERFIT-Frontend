import { getHomeData, getHomeDataResponseSuccess, getWorkoutPlanById, getWorkoutPlanByIdResponseSuccess, GetWorkoutPlanById200WorkoutDaysItem } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import { ConsistencyGrid } from "@/components/consistencyGrid";
import { WorkoutCard } from "@/components/workoutCard";
import { Bell, Sparkles } from "lucide-react";
import { UserNav } from "@/components/userNav";
import Link from "next/link";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const homeResponse = await getHomeData(today.format("YYYY-MM-DD"));

  if ("error" in homeResponse) {
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

  const { data: homeData } = homeResponse as getHomeDataResponseSuccess;

  let workoutDays: GetWorkoutPlanById200WorkoutDaysItem[] = [];
  if (homeData.activeWorkoutPlanId) {
    const planResponse = await getWorkoutPlanById(homeData.activeWorkoutPlanId);
    if (!("error" in planResponse)) {
      const { data: planData } = planResponse as getWorkoutPlanByIdResponseSuccess;
      workoutDays = planData.workoutDays;
    }
  }

  const consistencyValues = Object.values(homeData.consistencyByDay);
  const totalDays = consistencyValues.length;
  const completedDays = consistencyValues.filter(day => day.workoutDayCompleted).length;
  const weeklyProgress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const activeWorkoutDayId = homeData.todayWorkoutDay?.id;

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
                  FOCO <br className="hidden lg:block" />
                  <span className="text-primary">TOTAL</span>.
                </h2>
                <p className="text-[10px] sm:text-sm lg:text-lg text-white/70 font-medium max-w-xs sm:max-w-md drop-shadow">
                  Seu plano atual está {weeklyProgress}% completo. Mantenha o ritmo!
                </p>
              </div>

              <Link 
                href={homeData.activeWorkoutPlanId ? `/workout-plans/${homeData.activeWorkoutPlanId}` : "#"}
                className="group bg-white hover:bg-primary text-black hover:text-white px-6 sm:px-8 py-3 sm:py-4 lg:px-10 lg:py-5 rounded-2xl sm:rounded-[2rem] text-[10px] sm:text-sm lg:text-base font-black uppercase italic transition-all shadow-2xl active:scale-95 flex items-center gap-3 sm:gap-4 w-fit"
              >
                Bora Treinar
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
              <h2 className="text-xl lg:text-2xl font-black text-foreground tracking-tight uppercase italic leading-none">Seu Plano</h2>
              <p className="text-[10px] lg:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Todos os treinos da semana</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {workoutDays.map((day) => {
              const todayDate = dayjs().startOf('day');
              const startOfWeek = todayDate.startOf('week').add(1, 'day').subtract(todayDate.day() === 0 ? 7 : 0, 'day');
              
              const weekDayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
              const dayDate = startOfWeek.add(weekDayOrder.indexOf(day.weekDay), 'day');
              const dateKey = dayDate.format("YYYY-MM-DD");
              
              const status = homeData.consistencyByDay[dateKey];
              const isCompleted = status?.workoutDayCompleted || (dayDate.isBefore(todayDate) && status?.workoutDayStarted);

              return (
                <WorkoutCard 
                  key={day.id} 
                  workout={day} 
                  isActive={day.id === activeWorkoutDayId}
                  isCompleted={isCompleted}
                  planId={homeData.activeWorkoutPlanId!}
                />
              );
            })}
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
