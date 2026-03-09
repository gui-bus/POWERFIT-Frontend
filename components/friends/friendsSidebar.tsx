"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddFriendForm } from "./addFriendForm";
import { UsersIcon, LightningIcon } from "@phosphor-icons/react";

interface FriendsSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  myFriendCode: string | null;
  friendsCount: number;
}

export function FriendsSidebar({ user, myFriendCode, friendsCount }: FriendsSidebarProps) {
  return (
    <div className="space-y-8 sticky top-8">
      {/* Profile Summary Card */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="h-24 bg-primary/10 relative">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
        </div>
        <div className="px-6 pb-8 -mt-12 relative text-center">
          <Avatar className="size-24 border-4 border-card shadow-xl mx-auto rounded-[2rem]">
            <AvatarImage src={user.image || ""} alt={user.name} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black uppercase italic">
              {user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="mt-4 space-y-1">
            <h3 className="text-xl font-black uppercase italic tracking-tight text-foreground">
              {user.name}
            </h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {user.email}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-2xl p-4 text-center">
              <UsersIcon weight="duotone" className="size-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-black italic uppercase leading-none">{friendsCount}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Amigos</p>
            </div>
            <div className="bg-muted/50 rounded-2xl p-4 text-center">
              <LightningIcon weight="duotone" className="size-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-black italic uppercase leading-none">--</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Nível</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Friend Section */}
      <AddFriendForm myFriendCode={myFriendCode} />
    </div>
  );
}
