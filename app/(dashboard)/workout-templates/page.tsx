import { getWorkoutTemplates } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { TemplateCard } from "./_components/templateCard";
import { TemplateFilters } from "./_components/templateFilters";

export const metadata: Metadata = {
  title: "Modelos de Treino",
};

interface WorkoutTemplatesPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    query?: string;
  }>;
}

export default async function WorkoutTemplatesPage({ searchParams }: WorkoutTemplatesPageProps) {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const filters = await searchParams;
  const response = await getWorkoutTemplates(filters);

  if (response.status !== 200) {
    return (
      <Container>
        <div className="flex h-full items-center justify-center p-6 text-center bg-background">
          <p className="text-muted-foreground font-medium uppercase italic tracking-tighter">
            Erro ao carregar modelos de treino.
          </p>
        </div>
      </Container>
    );
  }

  const templates = response.data.templates;

  return (
    <Container className="space-y-12 pb-20">
      <header>
        <PageHeader 
          title="MODELOS" 
          subtitle="Escolha seu próximo desafio" 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <TemplateFilters initialFilters={filters} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-card/50 border border-dashed border-border rounded-[3rem]">
            <p className="text-muted-foreground font-medium uppercase italic tracking-widest text-sm">Nenhum modelo encontrado com esses filtros.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
