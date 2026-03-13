import { getAdminStats, getMe } from "@/lib/api/fetch-generated";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { Card } from "@/components/ui/card";
import { 
  UsersIcon, 
  UserMinusIcon, 
  BarbellIcon, 
  ActivityIcon,
  ArrowRightIcon,
  UsersThreeIcon
} from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [statsResponse, meResponse] = await Promise.all([
    getAdminStats(),
    getMe(),
  ]);

  if (statsResponse.status !== 200 || meResponse.status !== 200) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center p-20 bg-card rounded-[2.5rem] border border-border">
          <p className="text-muted-foreground font-medium italic uppercase tracking-widest text-sm">
            Erro ao carregar estatísticas administrativas.
          </p>
        </div>
      </Container>
    );
  }

  const stats = statsResponse.data;
  const userData = meResponse.data;

  const cards = [
    {
      label: "Total de Usuários",
      value: stats.totalUsers,
      icon: UsersThreeIcon,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Usuários Banidos",
      value: stats.bannedUsers,
      icon: UserMinusIcon,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Treinos Realizados",
      value: stats.totalActivities,
      icon: ActivityIcon,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Exercícios no Catálogo",
      value: stats.totalExercises,
      icon: BarbellIcon,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <Container className="py-10 space-y-10">
      <PageHeader
        title="Painel Admin"
        subtitle="Visão geral e métricas da plataforma"
        user={{
          ...userData,
          role: userData.role as "ADMIN" | "USER",
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.label} className="p-8 border-border bg-card/50 backdrop-blur-sm rounded-[2.5rem] shadow-xl hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                <card.icon weight="duotone" className="size-6" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                {card.label}
              </p>
              <p className="font-anton text-4xl text-foreground italic uppercase">
                {card.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Link href="/admin/users" className="group text-left">
          <Card className="p-8 border-border bg-card/50 backdrop-blur-sm rounded-[2.5rem] shadow-xl hover:bg-primary/[0.02] transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <UsersIcon weight="duotone" className="size-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-anton text-2xl text-foreground italic uppercase">Gerenciar Usuários</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visualize, bana ou altere permissões de membros da plataforma.
              </p>
              <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest italic">
                Acessar agora
                <ArrowRightIcon weight="duotone" className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/exercises" className="group text-left">
          <Card className="p-8 border-border bg-card/50 backdrop-blur-sm rounded-[2.5rem] shadow-xl hover:bg-primary/[0.02] transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BarbellIcon weight="duotone" className="size-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-anton text-2xl text-foreground italic uppercase tracking-wider">Biblioteca de Exercícios</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Adicione, edite ou remova exercícios oficiais do catálogo global.
              </p>
              <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest italic">
                Gerenciar Catálogo
                <ArrowRightIcon weight="duotone" className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/templates" className="group text-left">
          <Card className="p-8 border-border bg-card/50 backdrop-blur-sm rounded-[2.5rem] shadow-xl hover:bg-primary/[0.02] transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ActivityIcon weight="duotone" className="size-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-anton text-2xl text-foreground italic uppercase tracking-wider">Planos Recomendados</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crie templates de treino que servem de base para novos usuários.
              </p>
              <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest italic">
                Gerenciar Templates
                <ArrowRightIcon weight="duotone" className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </Container>
  );
}
