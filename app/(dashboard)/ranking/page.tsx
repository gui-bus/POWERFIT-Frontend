import { getRanking, getHomeData, GetRankingSortBy } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { RankingPodium } from "@/components/ranking/rankingPodium";
import { RankingList } from "@/components/ranking/rankingList";
import { FireIcon, StarIcon } from "@phosphor-icons/react/ssr";
import dayjs from "dayjs";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RankingPageProps {
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const { type = "STREAK" } = await searchParams;
  const rankingType = type.toUpperCase() as GetRankingSortBy;

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs().format("YYYY-MM-DD");
  
  const [rankingResponse, homeResponse] = await Promise.all([
    getRanking({ sortBy: rankingType }),
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
  const others = ranking.slice(3, 15);
  const isUserInTop3 = currentUserPosition !== null && currentUserPosition <= 3;
  const currentUserId = session.data.user.id;

  const tabs = [
    { id: "STREAK", label: "Ofensiva", icon: FireIcon },
    { id: "XP", label: "Experiência", icon: StarIcon },
  ];

  return (
    <Container className="space-y-12 pb-20">
      <header className="space-y-8">
        <PageHeader 
          title="RANKING" 
          subtitle="A Elite do PowerFit" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />

        {/* Tab Toggle */}
        <div className="flex items-center justify-center sm:justify-start">
          <div className="flex bg-muted/50 p-1.5 rounded-[1.5rem] border border-border/50 shadow-inner">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/ranking?type=${tab.id}`}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic tracking-widest transition-all",
                  rankingType === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <tab.icon weight={rankingType === tab.id ? "fill" : "duotone"} className="size-4" />
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <section>
        <RankingPodium 
          items={top3} 
          type={rankingType as "STREAK" | "XP"} 
          currentUserId={currentUserId}
        />
      </section>

      <section className="space-y-8">
        <div className="px-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] whitespace-nowrap italic text-center">Top Atletas</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <RankingList items={others} type={rankingType as "STREAK" | "XP"} currentUserId={currentUserId} />

        {/* Current User Floating Status (if not in top podium) */}
        {!isUserInTop3 && currentUserPosition && (
          <div className="mt-12 pt-8 border-t border-dashed border-border/50">
             <div className="bg-card border border-primary/20 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-primary/5 transition-all hover:border-primary/40 group">
                <div className="flex items-center gap-6">
                   <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:scale-110 transition-transform" />
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
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sua Pontuação</p>
                   <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl shadow-inner">
                      {rankingType === "STREAK" ? (
                        <>
                          <FireIcon weight="fill" className="size-5 text-primary" />
                          <span className="font-anton text-xl italic text-foreground leading-none">{userStreak} DIAS</span>
                        </>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-primary uppercase tracking-widest leading-none mb-1">Nível {rankingResponse.data.ranking.find(r => r.id === currentUserId)?.level || 0}</span>
                            <div className="flex items-center gap-2">
                              <StarIcon weight="fill" className="size-4 text-primary" />
                              <span className="font-anton text-xl italic text-foreground leading-none">{(rankingResponse.data.ranking.find(r => r.id === currentUserId)?.xp || 0)} XP</span>
                            </div>
                          </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}
      </section>
    </Container>
  );
}
