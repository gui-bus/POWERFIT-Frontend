"use client";

import { 
  GetFriendRequests200Item, 
  acceptFriendRequest, 
  declineFriendRequest 
} from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, XIcon, BellIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FriendRequestsProps {
  requests: GetFriendRequests200Item[];
}

export function FriendRequests({ requests }: FriendRequestsProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setLoadingId(id);
    try {
      const response = await acceptFriendRequest(id);
      if (response.status === 204) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to accept request", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setLoadingId(id);
    try {
      const response = await declineFriendRequest(id);
      if (response.status === 204) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to decline request", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-primary px-2">
        <BellIcon weight="duotone" className="size-6 animate-pulse" />
        <h3 className="text-base font-black uppercase tracking-[0.2em] italic">Novas Solicitações</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className="group bg-primary/3 border-2 border-primary/20 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <Avatar className="size-16 border-2 border-primary/20 shadow-lg rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <AvatarImage src={request.user.image || ""} alt={request.user.name} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl uppercase italic rounded-2xl">
                  {request.user.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left space-y-1">
                <p className="text-lg font-black uppercase italic tracking-tight text-foreground">{request.user.name}</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="size-1.5 bg-primary rounded-full animate-ping" />
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Quer se conectar</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => handleAccept(request.id)}
                disabled={loadingId !== null}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-90 hover:scale-105",
                  loadingId === request.id && "opacity-50"
                )}
              >
                <CheckIcon weight="bold" className="size-4" />
                Aceitar
              </button>
              <button
                onClick={() => handleDecline(request.id)}
                disabled={loadingId !== null}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-muted text-muted-foreground font-black uppercase italic tracking-widest text-[10px] hover:bg-destructive hover:text-white transition-all active:scale-90 hover:scale-105",
                  loadingId === request.id && "opacity-50"
                )}
              >
                <XIcon weight="bold" className="size-4" />
                Recusar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
