"use client";

import { 
  GetFriendRequests200Item, 
  declineFriendRequest 
} from "@/lib/api/fetch-generated";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SentRequestItem } from "./sentRequests/sentRequestItem";

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
        router.refresh();
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
          <SentRequestItem
            key={request.id}
            request={request}
            isLoading={loadingId === request.id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
