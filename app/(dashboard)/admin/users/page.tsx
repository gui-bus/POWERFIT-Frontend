import { getAdminUsers, getMe } from "@/lib/api/fetch-generated";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils/date";
import { UserActions } from "@/components/admin/userActions";
import dayjs from "dayjs";
import Link from "next/link";
import { 
  ShieldIcon, 
  UserIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  CaretUpIcon,
  CaretDownIcon,
  ArrowsDownUpIcon,
  WarningIcon
} from "@phosphor-icons/react/ssr";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SortableFields = "createdAt" | "role" | "xp" | "name";

interface SortIconProps {
  field: SortableFields;
  orderBy: SortableFields;
  orderDir: "asc" | "desc";
}

const SortIcon = ({ field, orderBy, orderDir }: SortIconProps) => {
  if (orderBy !== field) return <ArrowsDownUpIcon weight="duotone" className="size-3 opacity-30" />;
  return orderDir === "asc" 
    ? <CaretUpIcon weight="duotone" className="size-3 text-primary" /> 
    : <CaretDownIcon weight="duotone" className="size-3 text-primary" />;
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const orderBy = (params.orderBy as SortableFields) || "createdAt";
  const orderDir = (params.orderDir as "asc" | "desc") || "desc";

  const [usersResponse, meResponse] = await Promise.all([
    getAdminUsers({ 
      page: currentPage, 
      pageSize, 
      orderBy, 
      orderDir 
    }),
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

  const { users, total, pageSize: actualPageSize } = usersResponse.data;
  const userData = meResponse.data;
  const totalPages = Math.ceil(total / actualPageSize);

  const getSortUrl = (field: SortableFields) => {
    const newOrderDir = orderBy === field && orderDir === "asc" ? "desc" : "asc";
    return `?page=${currentPage}&pageSize=${pageSize}&orderBy=${field}&orderDir=${newOrderDir}`;
  };

  const getPageUrl = (pageNumber: number) => {
    return `?page=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&orderDir=${orderDir}`;
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href={getPageUrl(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={getPageUrl(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Container className="py-10 space-y-10">
      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic mb-8">
        <Link href="/admin" className="hover:text-primary transition-colors">Painel</Link>
        <span>/</span>
        <span className="text-foreground">Usuários</span>
      </div>
      
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
                <th className="px-8 py-6">
                  <Link 
                    href={getSortUrl("name")}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic hover:text-primary transition-colors group"
                  >
                    Membro
                    <SortIcon field="name" orderBy={orderBy} orderDir={orderDir} />
                  </Link>
                </th>
                <th className="px-8 py-6">
                  <Link 
                    href={getSortUrl("role")}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic hover:text-primary transition-colors group"
                  >
                    Role
                    <SortIcon field="role" orderBy={orderBy} orderDir={orderDir} />
                  </Link>
                </th>
                <th className="px-8 py-6">
                  <Link 
                    href={getSortUrl("xp")}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic hover:text-primary transition-colors group"
                  >
                    Progresso
                    <SortIcon field="xp" orderBy={orderBy} orderDir={orderDir} />
                  </Link>
                </th>
                <th className="px-8 py-6">
                  <Link 
                    href={getSortUrl("createdAt")}
                    className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic hover:text-primary transition-colors group"
                  >
                    Cadastrado em
                    <SortIcon field="createdAt" orderBy={orderBy} orderDir={orderDir} />
                  </Link>
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className={`
                    group transition-colors
                    ${user.isBanned ? 'bg-destructive/3 hover:bg-destructive/6' : 'hover:bg-primary/2'}
                  `}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className={`size-12 rounded-full border shadow-sm group-hover:scale-105 transition-transform ${user.isBanned ? 'border-destructive/30' : 'border-border'}`}>
                          <AvatarImage src={user.image || ""} alt={user.name} className="object-cover" />
                          <AvatarFallback className={`${user.isBanned ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'} font-black uppercase italic`}>
                            {user.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {user.isBanned && (
                          <div className="absolute -top-1 -right-1 bg-destructive text-white size-5 rounded-full flex items-center justify-center shadow-lg">
                            <WarningIcon weight="bold" className="size-3" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-anton text-lg uppercase italic tracking-wider leading-none ${user.isBanned ? 'text-destructive' : 'text-foreground'}`}>
                            {user.name}
                          </p>
                          {user.isBanned && (
                            <Badge variant="destructive" className="rounded-full h-4 px-2 text-[8px] font-black uppercase italic tracking-tighter">
                              Suspenso
                            </Badge>
                          )}
                        </div>
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
                        <span className={`${user.isBanned ? 'text-destructive' : 'text-primary'}`}>Nível {user.level}</span>
                        <span className="text-muted-foreground">{user.xp} XP</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${user.isBanned ? 'bg-destructive' : 'bg-primary'}`}
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
                        {formatRelativeTime(user.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <UserActions 
                      userId={user.id} 
                      userName={user.name} 
                      isBanned={user.isBanned} 
                      role={user.role} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-border/50 bg-muted/10 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
              Mostrando {users.length} de {total} membros
            </p>
            
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      href={getPageUrl(currentPage - 1)} 
                      className="rounded-xl border-border bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:text-primary transition-all group"
                    />
                  </PaginationItem>
                )}
                
                {renderPaginationItems()}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      href={getPageUrl(currentPage + 1)} 
                      className="rounded-xl border-border bg-background/50 backdrop-blur-sm hover:bg-primary/5 hover:text-primary transition-all group"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </Container>
  );
}

