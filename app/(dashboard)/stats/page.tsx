import { getStats, getStatsResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
import { ConsistencyHeatmap } from "@/components/stats/consistencyHeatmap";
import { StatCards } from "@/components/stats/statCards";
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
            role: (session.data.user as any).role as "ADMIN" | "USER",
          }}
        />
      </header>

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
