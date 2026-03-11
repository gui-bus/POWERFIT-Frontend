import { GetFriendRequests200Item } from "@/lib/api/fetch-generated";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SentRequestAvatar } from "./sentRequestAvatar";

interface SentRequestItemProps {
  request: GetFriendRequests200Item;
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function SentRequestItem({
  request,
  isLoading,
  onDelete,
}: SentRequestItemProps) {
  return (
    <div className="group bg-muted/20 border border-border/50 rounded-[2rem] p-4 flex items-center justify-between gap-4 transition-all hover:bg-muted/30">
      <div className="flex items-center gap-3 overflow-hidden">
        <SentRequestAvatar 
          name={request.user.name} 
          image={request.user.image} 
        />
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
        onClick={() => onDelete(request.id)}
        disabled={isLoading}
        className={cn(
          "size-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-all active:scale-90 shadow-sm cursor-pointer",
          isLoading && "animate-pulse opacity-50"
        )}
        title="Cancelar Pedido"
      >
        <XIcon weight="bold" className="size-4" />
      </button>
    </div>
  );
}
