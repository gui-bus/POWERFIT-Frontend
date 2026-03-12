import { 
  getChallenges, 
  getChallengesResponseSuccess 
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { ChallengeCard } from "@/components/gamification/challengeCard";
import { SwordIcon, TrophyIcon } from "@phosphor-icons/react/ssr";

export default async function ChallengesPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const response = await getChallenges();

  if (response.status !== 200) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-[2.5rem]">
          <p className="text-muted-foreground font-medium italic uppercase tracking-tighter">
            Erro ao carregar desafios.
          </p>
        </div>
      </Container>
    );
  }

  const challenges = (response as getChallengesResponseSuccess).data;
  
  const active = challenges.filter(c => c.status === "ACTIVE" || c.status === "PENDING");
  const duels = active.filter(c => c.type === "FRIEND_DUEL");
  const globalChallenges = active.filter(c => c.type === "GLOBAL");
  const completed = challenges.filter(c => c.status === "COMPLETED");

  return (
    <Container className="space-y-16 pb-20">
      <header>
        <PageHeader 
          title="DESAFIOS" 
          subtitle="Supere seus limites" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      {/* Featured Header */}
      <div className="bg-primary border border-primary/20 rounded-[3rem] p-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
          <SwordIcon weight="duotone" className="size-48 text-primary-foreground" />
        </div>
        
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="space-y-2">
            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
              Temporada de Verão
            </span>
            <h2 className="text-4xl font-anton italic text-primary-foreground uppercase leading-none mt-5">A Jornada do Campeão</h2>
          </div>
          <p className="text-primary-foreground/80 font-medium leading-relaxed">
            Complete desafios semanais, ganhe XP bônus e suba no ranking global. A cada desafio vencido, você fica mais próximo da elite.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-anton italic text-white">{active.length}</span>
              <span className="text-[9px] font-black text-primary-foreground/60 uppercase tracking-widest">Ativos</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-anton italic text-white">{completed.length}</span>
              <span className="text-[9px] font-black text-primary-foreground/60 uppercase tracking-widest">Concluídos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Friend Duels Section (if any) */}
      {duels.length > 0 && (
        <div className="space-y-12">
          <div className="px-2 flex items-center gap-3">
            <h2 className="text-base font-black uppercase tracking-[0.2em] italic">Duelos Ativos</h2>
            <div className="h-px flex-1 bg-black/20 dark:bg-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {duels.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {/* Global Challenges */}
      <div className="space-y-12">
        <div className="px-2 flex items-center gap-3">
          <h2 className="text-base font-black text-foreground uppercase tracking-[0.2em] italic">
            {duels.length > 0 ? "Desafios Globais" : "Desafios Disponíveis"}
          </h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {globalChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
          {globalChallenges.length === 0 && active.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4 bg-card/50 border border-dashed border-border rounded-[3rem]">
              <div className="size-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <TrophyIcon weight="duotone" className="size-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium uppercase italic tracking-widest text-sm">Nenhum desafio ativo no momento.</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Challenges */}
      {completed.length > 0 && (
        <div className="space-y-12 pt-8">
          <div className="px-2 flex items-center gap-3">
            <h2 className="text-base font-black text-muted-foreground uppercase tracking-[0.2em] italic opacity-60">Histórico de Glórias</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 opacity-70 grayscale-[0.5]">
            {completed.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
