import { getStreakRanking, getHomeData } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { RankingPodium } from "@/components/ranking/rankingPodium";
import { RankingList } from "@/components/ranking/rankingList";
import { FireIcon } from "@phosphor-icons/react/ssr";
import dayjs from "dayjs";

export default async function RankingPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs().format("YYYY-MM-DD");
  
  // Parallel fetch for ranking and user home data (to get streak even if not in top 10)
  const [rankingResponse, homeResponse] = await Promise.all([
    getStreakRanking(),
    getHomeData(today)
  ]);

  if (rankingResponse.status !== 200 || homeResponse.status !== 200) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do ranking.
        </p>
      </div>
    );
  }

  const { ranking, currentUserPosition } = rankingResponse.data;
  const { workoutStreak: userStreak } = homeResponse.data;
  
  const top3 = ranking.slice(0, 3);
  const others = ranking.slice(3, 10);
  const isUserInTop10 = currentUserPosition !== null && currentUserPosition <= 10;
  const currentUserId = session.data.user.id;

  return (
    <Container className="space-y-16">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <PageHeader 
          title="RANKING" 
          subtitle="Os Mais Consistentes" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <section>
        <RankingPodium items={top3} />
      </section>

      <section className="space-y-8">
        <div className="px-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] whitespace-nowrap italic text-center">Elite da Comunidade</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <RankingList items={others} currentUserId={currentUserId} />

        {!isUserInTop10 && currentUserPosition && (
          <div className="mt-12 pt-8 border-t border-dashed border-border/50">
             <div className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-primary/5 transition-all hover:border-primary/40">
                <div className="flex items-center gap-6">
                   <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                      <div className="relative size-20 rounded-3xl bg-background border-2 border-primary flex items-center justify-center font-anton text-3xl italic text-primary shadow-xl">
                        {currentUserPosition}º
                      </div>
                   </div>
                   <div className="space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sua Posição Global</p>
                      <h3 className="font-anton text-2xl uppercase italic leading-none">{session.data.user.name}</h3>
                   </div>
                </div>
                
                <div className="flex flex-col items-center sm:items-end gap-2">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sua Sequência Atual</p>
                   <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl shadow-inner">
                      <FireIcon weight="fill" className="size-5 text-primary" />
                      <span className="font-anton text-xl italic text-foreground leading-none">{userStreak}</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </section>
    </Container>
  );
}
