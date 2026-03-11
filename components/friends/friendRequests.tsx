"use client";

import { 
  GetFriendRequests200Item, 
  acceptFriendRequest, 
  declineFriendRequest 
} from "@/lib/api/fetch-generated";
import { BellIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FriendRequestItem } from "./friendRequests/friendRequestItem";

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
          <FriendRequestItem
            key={request.id}
            request={request}
            isLoading={loadingId === request.id}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>
    </div>
  );
}
