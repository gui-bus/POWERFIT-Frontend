import { getStats, getStatsResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Image from "next/image";

dayjs.locale("pt-br");
import { StreakBanner } from "@/components/stats/streakBanner";
import { ConsistencyHeatmap } from "@/components/stats/consistencyHeatmap";
import { StatCards } from "@/components/stats/statCards";
import { BarChart3, TrendingUp, Calendar as CalendarIcon, Clock } from "lucide-react";

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const from = today.subtract(11, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.format("YYYY-MM-DD");

  const statsResponse = await getStats({ from, to });

  if ("error" in statsResponse) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar estatísticas.
        </p>
      </div>
    );
  }

  const { data: stats } = statsResponse as getStatsResponseSuccess;

  console.log("data", stats);

  return (
    <div className="relative z-10 max-w-350 mx-auto p-6 sm:p-10 lg:p-16 space-y-12">
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/powerfit-logo.svg" 
              alt="PowerFit" 
              width={140} 
              height={16} 
              className="h-5 w-auto" 
            />
            <h1 className="font-anton text-3xl text-primary italic uppercase tracking-widest leading-none">
              STATS
            </h1>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] pl-1">
            Evolução & Performance
          </p>
        </div>

        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md border border-border px-6 py-3 rounded-[1.5rem] shadow-sm">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Status Global</p>
            <p className="text-sm font-black uppercase italic text-foreground leading-none">Elite Performance</p>
          </div>
        </div>
      </header>

      {/* Top Row: Streak and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8">
          <StreakBanner streak={stats.workoutStreak} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center">
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 text-primary">
              <BarChart3 className="size-5" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">Resumo Rápido</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mês Atual</span>
                </div>
                <span className="text-sm font-black italic capitalize">{dayjs().format("MMMM")}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Última Sessão</span>
                </div>
                <span className="text-sm font-black italic">Hoje</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Anual Heatmap (Full Width) */}
      <div className="w-full">
        <ConsistencyHeatmap consistencyByDay={stats.consistencyByDay} />
      </div>

      {/* Bottom Row: Detail Cards */}
      <div className="w-full">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="h-px flex-1 bg-border/50" />
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] whitespace-nowrap italic">Métricas de Performance</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <StatCards 
          completedWorkoutsCount={stats.completedWorkoutsCount}
          completedRestDays={stats.completedRestDays}
          conclusionRate={stats.conclusionRate}
          totalTimeInSeconds={stats.totalTimeInSeconds}
        />
      </div>

      {/* Mobile Spacer */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
