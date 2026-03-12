import { getWorkoutPlans } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { PlanHistoryCard } from "./_components/planHistoryCard";

export const metadata: Metadata = {
  title: "Histórico de Planos",
};

export default async function WorkoutPlansHistoryPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  // GET /workout-plans sem filtros retorna todos os planos
  const response = await getWorkoutPlans();

  if (response.status !== 200) {
    return (
      <Container>
        <div className="flex h-full items-center justify-center p-6 text-center bg-background">
          <p className="text-muted-foreground font-medium uppercase italic tracking-tighter">
            Erro ao carregar histórico de planos.
          </p>
        </div>
      </Container>
    );
  }

  const plans = response.data;

  return (
    <Container className="space-y-12 pb-20">
      <header>
        <PageHeader 
          title="MEUS PLANOS" 
          subtitle="Gerencie seu histórico de treinamento" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <div className="space-y-6">
        <div className="px-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/50" />
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] whitespace-nowrap italic">Protocolos Registrados</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {plans.map((plan) => (
            <PlanHistoryCard key={plan.id} plan={plan} />
          ))}
          {plans.length === 0 && (
            <div className="py-20 text-center space-y-4 bg-card/50 border border-dashed border-border rounded-[3rem]">
              <p className="text-muted-foreground font-medium uppercase italic tracking-widest text-sm">Você ainda não possui planos de treino.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
