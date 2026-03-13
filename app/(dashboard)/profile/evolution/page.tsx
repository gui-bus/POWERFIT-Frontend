import { getBodyProgressHistory, getBodyProgressHistoryResponseSuccess } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { BodyProgressTimeline } from "@/components/profile/bodyProgressTimeline";
import { LogBodyProgressDialog } from "@/components/profile/logBodyProgressDialog";
import { ScalesIcon, CaretLeftIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Evolução",
};

export default async function BodyEvolutionPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const historyRes = await getBodyProgressHistory();

  if (historyRes.status !== 200) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-[2.5rem]">
          <p className="text-muted-foreground font-medium italic uppercase tracking-tighter">
            Erro ao carregar histórico de evolução.
          </p>
        </div>
      </Container>
    );
  }

  const history = (historyRes as getBodyProgressHistoryResponseSuccess).data;

  return (
    <Container className="space-y-12 pb-24">
      <header className="flex items-center gap-6">
        <Link href="/profile">
          <button className="p-4 bg-card border border-border hover:border-primary/50 rounded-[1.5rem] transition-all active:scale-90 group shadow-sm cursor-pointer">
            <CaretLeftIcon weight="bold" className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </Link>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <PageHeader 
            title="EVOLUÇÃO" 
            subtitle="Sua Jornada Corporal" 
            user={{
              name: session.data.user.name,
              email: session.data.user.email,
              image: session.data.user.image,
              role: (session.data.user as any).role as "ADMIN" | "USER",
            }}          />
          <LogBodyProgressDialog />
        </div>
      </header>

      {/* Featured Insight */}
      <div className="bg-primary border border-primary/20 rounded-[3rem] p-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
          <ScalesIcon weight="fill" className="size-48 text-primary-foreground" />
        </div>
        
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="space-y-2">
            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
              Body Analytics
            </span>
            <h2 className="text-4xl font-anton italic text-primary-foreground uppercase leading-none mt-5">Visão de Progresso</h2>
          </div>
          <p className="text-primary-foreground/80 font-medium leading-relaxed">
            A constância nos treinos é refletida aqui. Acompanhe suas medidas e veja o impacto real do protocolo PowerFit no seu corpo ao longo do tempo.
          </p>
        </div>
      </div>

      <div className="w-full pt-4">
        <div className="px-2 flex items-center gap-3 mb-10">
          <h2 className="text-base font-black text-foreground uppercase tracking-[0.2em] italic">Timeline de Composição</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <BodyProgressTimeline history={history} />
      </div>
    </Container>
  );
}
