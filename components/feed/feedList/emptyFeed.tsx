import { ActivityIcon, UsersIcon, PlusIcon, UserPlusIcon } from "@phosphor-icons/react";
import Link from "next/link";

interface EmptyFeedProps {
  isUserProfile?: boolean;
}

export function EmptyFeed({ isUserProfile }: EmptyFeedProps) {
  if (isUserProfile) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center bg-card/50 border border-dashed border-border rounded-[3rem] space-y-6">
        <div className="size-24 bg-muted rounded-full flex items-center justify-center opacity-50">
          <ActivityIcon weight="duotone" className="size-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase italic tracking-tight opacity-80">Sem treinos recentes</h3>
          <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
            Este atleta ainda não registrou atividades públicas no feed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-16 text-center bg-card/50 border border-dashed border-border rounded-[3rem] space-y-8">
      <div className="relative">
        <div className="size-24 bg-muted rounded-full flex items-center justify-center">
          <UsersIcon weight="duotone" className="size-12 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-full flex items-center justify-center shadow-lg text-primary-foreground">
          <PlusIcon weight="bold" className="size-5" />
        </div>
      </div>
      
      <div className="space-y-3 max-w-sm mx-auto">
        <h3 className="text-2xl font-black uppercase italic tracking-tight">O feed está em silêncio</h3>
        <p className="text-sm text-muted-foreground font-medium">
          Sua rede de atletas ainda não registrou atividades hoje. Que tal ser o primeiro a postar um treino?
        </p>
      </div>

      <Link href="/friends">
        <button className="bg-primary text-primary-foreground px-10 py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer">
          <UserPlusIcon weight="bold" className="size-4" />
          Encontrar Atletas
        </button>
      </Link>
    </div>
  );
}
