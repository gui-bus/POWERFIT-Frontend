import { getStats, getStatsResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
import { StreakBanner } from "@/components/stats/streakBanner";
import { ConsistencyHeatmap } from "@/components/stats/consistencyHeatmap";
import { StatCards } from "@/components/stats/statCards";
import { ChartBarIcon, CalendarIcon, ClockIcon } from "@phosphor-icons/react/ssr";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estatísticas",
};

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
    <Container>
      
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <PageHeader 
          title="Estatísticas" 
          subtitle="Evolução & Performance" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8">
          <StreakBanner streak={stats.workoutStreak} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center">
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 text-primary">
              <ChartBarIcon weight="duotone" className="size-5" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">Resumo Rápido</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <CalendarIcon weight="duotone" className="size-4 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mês Atual</span>
                </div>
                <span className="text-sm font-black italic capitalize">{dayjs().format("MMMM")}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <ClockIcon weight="duotone" className="size-4 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Última Sessão</span>
                </div>
                <span className="text-sm font-black italic">Hoje</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <ConsistencyHeatmap consistencyByDay={stats.consistencyByDay} />
      </div>

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
          totalVolumeInGrams={stats.totalVolumeInGrams}
        />
      </div>

    </Container>
  );
}
