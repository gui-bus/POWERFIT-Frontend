"use client";

import { GetFriends200Item } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersIcon, EyeIcon, ActivityIcon } from "@phosphor-icons/react";
import dayjs from "dayjs";
import Link from "next/link";

interface FriendsListProps {
  friends: GetFriends200Item[];
}

export function FriendsList({ friends }: FriendsListProps) {
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
              <Link href={`/feed/users/${friend.id}`}>
                <button
                  className="p-3 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all active:scale-90 cursor-pointer"
                  title="Ver Atividades"
                >
                  <ActivityIcon weight="duotone" className="size-5" />
                </button>
              </Link>

              <Link href={`/profile/${friend.id}`}>
                <button
                  className="p-3 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all active:scale-90 cursor-pointer"
                  title="Ver perfil público"
                >
                  <EyeIcon weight="duotone" className="size-5" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
