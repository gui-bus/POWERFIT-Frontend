import { getWorkoutPlanById, getHomeData } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import { WorkoutCard } from "@/components/workoutCard";
import { TargetIcon } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/pageHeader";

interface PageProps {
  params: Promise<{
    planId: string;
  }>;
}

export default async function WorkoutPlanDetailsPage({ params }: PageProps) {
  const { planId } = await params;
  
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const [planResponse, homeResponse] = await Promise.all([
    getWorkoutPlanById(planId),
    getHomeData(today.format("YYYY-MM-DD"))
  ]);

  if (planResponse.status !== 200 || homeResponse.status !== 200) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do plano.
        </p>
      </div>
    );
  }

  const plan = planResponse.data;
  const homeData = homeResponse.data;

  const activeWorkoutDayId = homeData.todayWorkoutDay?.id;

  const weekDayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const sortedWorkoutDays = [...plan.workoutDays].sort((a, b) => 
    weekDayOrder.indexOf(a.weekDay) - weekDayOrder.indexOf(b.weekDay)
  );

  return (
    <div className="relative z-10 max-w-350 mx-auto p-6 sm:p-10 lg:p-16 space-y-12">
      
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <PageHeader title="Plano" subtitle="Seu Cronograma Semanal" />
      </header>

      <div className="lg:pt-0">
        <section className="relative aspect-16/10 sm:aspect-21/9 lg:h-80 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl border">
          <Image
            src="/images/login-bg.png"
            alt="Plano Banner"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-95" />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                <TargetIcon weight="duotone" className="size-4 text-primary-foreground" />
                <span className="text-[10px] sm:text-xs font-black text-primary-foreground uppercase tracking-widest italic">
                  {plan.name}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">
                Plano de <span className="text-primary">Treino</span>.
              </h2>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <div className="px-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] whitespace-nowrap italic">Dias de Treinamento</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sortedWorkoutDays.map((day) => {
            const todayDate = dayjs().startOf('day');
            const startOfWeek = todayDate.startOf('week').add(1, 'day').subtract(todayDate.day() === 0 ? 7 : 0, 'day');
            
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
                planId={planId}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
