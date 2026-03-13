"use client";

import { GetFriends200Item, removeFriend } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon, EyeIcon, ActivityIcon, TrashIcon, WarningIcon } from "@phosphor-icons/react";
import dayjs from "dayjs";
import Link from "next/link";
import { CreateDuelDialog } from "@/components/gamification/createDuelDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FriendsListProps {
  friends: GetFriends200Item[];
}

export function FriendsList({ friends }: FriendsListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleRemoveFriend = async (friendId: string) => {
    setLoading(friendId);
    try {
      const response = await removeFriend(friendId);
      if (response.status === 204) {
        toast.success("Conexão removida com sucesso.");
        router.refresh();
      } else {
        toast.error("Erro ao remover amigo.");
      }
    } catch {
      toast.error("Erro na conexão ao remover amigo.");
    } finally {
      setLoading(null);
    }
  };

  if (friends.length === 0)
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center bg-card/50 border border-dashed border-border rounded-[3rem] space-y-6">
        <div className="size-20 bg-muted rounded-full flex items-center justify-center">
          <UsersIcon
            weight="duotone"
            className="size-10 text-muted-foreground"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase italic tracking-tight">
            Sem conexões ainda
          </h3>
          <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
            Sua rede de atletas está vazia. Comece a adicionar amigos para
            acompanhar seus treinos!
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3 text-foreground">
          <UsersIcon weight="duotone" className="size-6 text-primary" />
          <h3 className="text-base font-black uppercase tracking-[0.2em] italic">
            Seus Amigos
          </h3>
        </div>
        <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
          {friends.length} Atletas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="group bg-card border border-border rounded-[2.5rem] p-5 flex items-center justify-between gap-4 shadow-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-14 border-2 border-border shadow-sm group-hover:scale-105 group-hover:border-primary/50 transition-all duration-300 rounded-2xl">
                  <AvatarImage
                    src={friend.image || ""}
                    alt={friend.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-black uppercase italic rounded-2xl">
                    {friend.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-card rounded-full" />
              </div>
              <div>
                <p className="text-base font-black uppercase italic tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {friend.name}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                  Membro desde {dayjs(friend.since).format("MMM YYYY")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CreateDuelDialog friend={friend} />

              <Link href={`/feed/users/${friend.id}`}>
                <button
                  className="p-3 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all active:scale-90 cursor-pointer text-muted-foreground"
                  title="Ver Atividades"
                >
                  <ActivityIcon weight="duotone" className="size-5" />
                </button>
              </Link>

              <Link href={`/profile/${friend.id}`}>
                <button
                  className="p-3 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all active:scale-90 cursor-pointer text-muted-foreground"
                  title="Ver perfil público"
                >
                  <EyeIcon weight="duotone" className="size-5" />
                </button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={loading === friend.id}
                    className="p-3 bg-muted/50 hover:bg-destructive hover:text-destructive-foreground rounded-2xl transition-all active:scale-90 cursor-pointer text-muted-foreground"
                    title="Remover Amigo"
                  >
                    {loading === friend.id ? (
                      <div className="size-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <TrashIcon weight="duotone" className="size-5" />
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                  <AlertDialogHeader>
                    <div className="size-12 bg-destructive/10 rounded-2xl flex items-center justify-center mb-2">
                      <WarningIcon weight="duotone" className="size-6 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-anton italic uppercase text-foreground">
                      Encerrar Conexão
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                      Tem certeza que deseja remover <span className="text-foreground font-black italic">{friend.name}</span> da sua rede? Você deixará de acompanhar as atividades deste atleta.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3 mt-4">
                    <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="bg-destructive hover:bg-red-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-destructive/20 cursor-pointer"
                    >
                      Remover Conexão
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
