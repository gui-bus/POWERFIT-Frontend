import { getWorkoutPlanById, getWorkoutPlanByIdResponseSuccess, getHomeData } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import { WorkoutCard } from "@/components/workoutCard";
import { Goal } from "lucide-react";

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

  if ("error" in planResponse || "error" in homeResponse) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do plano.
        </p>
      </div>
    );
  }

  const { data: plan } = planResponse as getWorkoutPlanByIdResponseSuccess;
  const homeData = homeResponse.data;

  const activeWorkoutDayId = homeData.todayWorkoutDay?.id;

  return (
    <div className="max-w-[1000px] mx-auto pb-32 lg:pb-12">
      
      {/* Top Banner */}
      <div className="relative h-[296px] w-full overflow-hidden rounded-b-[2.5rem] lg:rounded-b-[3.5rem] shadow-2xl">
        <Image
          src="/images/login-bg.png"
          alt="Plano Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
          <h1 className="font-syne text-2xl font-black text-white uppercase italic tracking-tighter">
            Fit.ai
          </h1>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#2B54FF] px-4 py-1.5 rounded-full shadow-lg shadow-blue-600/20">
              <Goal className="size-4 text-white" />
              <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest italic">
                {plan.name}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">
              Plano de Treino
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-8 px-5 sm:px-10 lg:px-12 space-y-2">
        {plan.workoutDays.map((day) => {
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
              planId={planId}
            />
          );
        })}
      </div>
    </div>
  );
}
