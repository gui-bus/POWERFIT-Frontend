import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FriendRequestActionsProps {
  loading: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function FriendRequestActions({ loading, onAccept, onDecline }: FriendRequestActionsProps) {
  return (
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <button
        onClick={onAccept}
        disabled={loading}
        className={cn(
          "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-90 hover:scale-105 cursor-pointer",
          loading && "opacity-50"
        )}
      >
        <CheckIcon weight="bold" className="size-4" />
        Aceitar
      </button>
      <button
        onClick={onDecline}
        disabled={loading}
        className={cn(
          "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-muted text-muted-foreground font-black uppercase italic tracking-widest text-[10px] hover:bg-destructive hover:text-white transition-all active:scale-90 hover:scale-105 cursor-pointer",
          loading && "opacity-50"
        )}
      >
        <XIcon weight="bold" className="size-4" />
        Recusar
      </button>
    </div>
  );
}
