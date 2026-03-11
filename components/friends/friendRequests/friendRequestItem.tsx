import { GetFriendRequests200Item } from "@/lib/api/fetch-generated";
import { FriendRequestAvatar } from "./friendRequestAvatar";
import { FriendRequestActions } from "./friendRequestActions";

interface FriendRequestItemProps {
  request: GetFriendRequests200Item;
  isLoading: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export function FriendRequestItem({
  request,
  isLoading,
  onAccept,
  onDecline,
}: FriendRequestItemProps) {
  return (
    <div className="group bg-primary/3 border-2 border-primary/20 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:border-primary/40 transition-all duration-300">
      <div className="flex items-center gap-5">
        <FriendRequestAvatar 
          name={request.user.name} 
          image={request.user.image} 
        />
        <div className="text-center sm:text-left space-y-1">
          <p className="text-lg font-black uppercase italic tracking-tight text-foreground">
            {request.user.name}
          </p>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="size-1.5 bg-primary rounded-full animate-ping" />
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              Quer se conectar
            </p>
          </div>
        </div>
      </div>

      <FriendRequestActions
        loading={isLoading}
        onAccept={() => onAccept(request.id)}
        onDecline={() => onDecline(request.id)}
      />
    </div>
  );
}
