import { getWorkoutTemplates, getMe } from "@/lib/api/fetch-generated";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { TemplateCard } from "../../workout-templates/_components/templateCard";
import { TemplateActions } from "@/components/admin/templateActions";
import { CreateTemplateDialog } from "@/components/admin/createTemplateDialog";
import Link from "next/link";

interface AdminTemplatesPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    query?: string;
  }>;
}

export default async function AdminTemplatesPage({
  searchParams,
}: AdminTemplatesPageProps) {
  const filters = await searchParams;
  const [templatesResponse, meResponse] = await Promise.all([
    getWorkoutTemplates(filters),
    getMe(),
  ]);

  if (templatesResponse.status !== 200 || meResponse.status !== 200) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center p-20 bg-card rounded-[2.5rem] border border-border">
          <p className="text-muted-foreground font-medium italic uppercase tracking-widest text-sm">
            Erro ao carregar templates de treino.
          </p>
        </div>
      </Container>
    );
  }

  const templates = templatesResponse.data.templates;
  const userData = meResponse.data;

  return (
    <Container className="py-10 space-y-10">
      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic mb-8">
        <Link href="/admin" className="hover:text-primary transition-colors">
          Painel
        </Link>
        <span>/</span>
        <span className="text-foreground">Planos Recomendados</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Curadoria"
          subtitle="Gestão de templates e planos oficiais"
          user={{
            ...userData,
            role: userData.role as "ADMIN" | "USER",
          }}
        />
        <CreateTemplateDialog />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {templates.map((template) => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            hideApplyButton
            mainAction={<TemplateActions templateId={template.id} templateName={template.name} />}
          />
        ))}

        {templates.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-card/50 border border-dashed border-border rounded-[3rem]">
            <p className="text-muted-foreground font-medium uppercase italic tracking-widest text-sm">
              Nenhum template oficial criado ainda.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
