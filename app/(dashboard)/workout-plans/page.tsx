import { getWorkoutPlans } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { PlanHistoryCard } from "./_components/planHistoryCard";
import { ActivityIcon } from "@phosphor-icons/react/ssr";

export const metadata: Metadata = {
  title: "Histórico de Planos",
};

export default async function WorkoutPlansHistoryPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

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
  const sortedPlans = [...plans].sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));

  return (
    <Container className="pb-32">
      <header className="mb-16">
        <PageHeader 
          title="PROTOCOLOS" 
          subtitle="Cronologia de Treinamento" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
            role: (session.data.user as any).role as "ADMIN" | "USER",
          }}
        />
      </header>

      <div className="relative">
        {/* Central Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-linear-to-b from-primary/50 via-border to-transparent hidden md:block" />

        <div className="space-y-12">
          {sortedPlans.map((plan) => (
            <div key={plan.id} className="relative">
              <div className={`absolute left-8 -translate-x-1/2 mt-10 size-3 rounded-full border-4 border-background hidden md:block z-20 ${
                plan.isActive ? "bg-primary shadow-[0_0_10px_rgba(255,100,0,0.5)]" : "bg-muted-foreground/30"
              }`} />
              
              <PlanHistoryCard plan={plan} />
            </div>
          ))}

          {plans.length === 0 && (
            <div className="py-20 text-center space-y-6 bg-card/30 border border-dashed border-border rounded-[3rem]">
              <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <ActivityIcon weight="duotone" className="size-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium uppercase italic tracking-widest text-xs">
                Nenhum protocolo registrado em seu histórico.
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
