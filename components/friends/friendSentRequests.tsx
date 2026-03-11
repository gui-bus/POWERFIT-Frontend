"use client";

import { 
  GetFriendRequests200Item, 
  declineFriendRequest 
} from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { XIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FriendSentRequestsProps {
  requests: GetFriendRequests200Item[];
}

export function FriendSentRequests({ requests }: FriendSentRequestsProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      const response = await declineFriendRequest(id);
      if (response.status === 204) {
        toast.success("Solicitação cancelada.");
        router.refresh(); // Sincroniza a lista instantaneamente após cancelar
      }
    } catch {
      toast.error("Erro ao cancelar solicitação.");
    } finally {
      setLoadingId(null);
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-muted-foreground px-2">
        <PaperPlaneTiltIcon weight="duotone" className="size-5" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] italic">Pedidos Enviados</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className="group bg-muted/20 border border-border/50 rounded-[2rem] p-4 flex items-center justify-between gap-4 transition-all hover:bg-muted/30"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar className="size-10 border border-border rounded-xl">
                <AvatarImage src={request.user.image || ""} className="object-cover" />
                <AvatarFallback className="bg-muted text-[10px] font-bold">
                  {request.user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-xs font-black uppercase italic tracking-tight text-foreground truncate">
                  {request.user.name}
                </p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                  Aguardando resposta
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(request.id)}
              disabled={loadingId !== null}
              className={cn(
                "size-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-all active:scale-90 shadow-sm",
                loadingId === request.id && "animate-pulse"
              )}
              title="Cancelar Pedido"
            >
              <XIcon weight="bold" className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
