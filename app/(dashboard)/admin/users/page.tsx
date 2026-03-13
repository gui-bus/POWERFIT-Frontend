import { getAdminUsers, getMe } from "@/lib/api/fetch-generated";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { ShieldIcon, UserIcon, EnvelopeIcon, CalendarIcon } from "@phosphor-icons/react/ssr";

export default async function AdminUsersPage() {
  const [usersResponse, meResponse] = await Promise.all([
    getAdminUsers(),
    getMe(),
  ]);

  if (usersResponse.status !== 200 || meResponse.status !== 200) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center p-20 bg-card rounded-[2.5rem] border border-border">
          <p className="text-muted-foreground font-medium italic uppercase tracking-widest text-sm">
            Erro ao carregar lista de usuários.
          </p>
        </div>
      </Container>
    );
  }

  const users = usersResponse.data.users;
  const userData = meResponse.data;

  return (
    <Container className="py-10 space-y-10">
      <PageHeader
        title="Usuários"
        subtitle="Gerenciamento de membros da plataforma"
        user={{
          ...userData,
          role: userData.role as "ADMIN" | "USER",
        }}
      />

      <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm rounded-[2.5rem] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Membro</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Progresso</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic text-right">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-primary/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-12 rounded-2xl border border-border shadow-sm group-hover:scale-105 transition-transform">
                        <AvatarImage src={user.image || ""} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-black uppercase italic">
                          {user.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-anton text-lg text-foreground uppercase italic tracking-wider leading-none">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <EnvelopeIcon weight="duotone" className="size-3" />
                          <span className="text-[10px] font-bold tracking-tight lowercase">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge 
                      className={`
                        rounded-full px-4 py-1.5 text-[10px] font-black uppercase italic tracking-widest border-none
                        ${user.role === 'ADMIN' 
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                          : 'bg-muted/50 text-muted-foreground'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {user.role === 'ADMIN' ? (
                          <ShieldIcon weight="duotone" className="size-3" />
                        ) : (
                          <UserIcon weight="duotone" className="size-3" />
                        )}
                        {user.role}
                      </div>
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic">
                        <span className="text-primary">Nível {user.level}</span>
                        <span className="text-muted-foreground">{user.xp} XP</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((user.xp / (user.level * 1000)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon weight="duotone" className="size-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest italic">
                          {dayjs(user.createdAt).format('DD MMM YYYY')}
                        </span>
                      </div>
                      <span className="text-[9px] font-medium text-muted-foreground/50 lowercase">
                        {dayjs(user.createdAt).fromNow()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  );
}
