import { LightningIcon, ChatTeardropIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FeedInteractionsProps {
  hasPowerup: boolean;
  powerupsCount: number;
  commentsCount: number;
  isLoading: boolean;
  isOwnPost: boolean;
  showComments: boolean;
  onTogglePowerup: () => void;
  onToggleComments: () => void;
}

export function FeedInteractions({
  hasPowerup,
  powerupsCount,
  commentsCount,
  isLoading,
  isOwnPost,
  showComments,
  onTogglePowerup,
  onToggleComments,
}: FeedInteractionsProps) {
  return (
    <div className="p-6 sm:p-8 pt-4 space-y-6">
      {(powerupsCount > 0 || commentsCount > 0) && (
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="size-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <LightningIcon
                weight="fill"
                className="size-3 text-primary-foreground"
              />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {powerupsCount} Powerups
            </span>
          </div>
          <button
            onClick={onToggleComments}
            className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
          >
            {commentsCount} Comentários
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePowerup}
          disabled={isLoading || isOwnPost}
          title={
            isOwnPost ? "Você não pode dar Powerup no seu próprio treino" : ""
          }
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.15em] transition-all active:scale-95 border border-transparent",
            hasPowerup
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
            isOwnPost && "opacity-50 cursor-not-allowed grayscale",
          )}
        >
          <LightningIcon
            weight={hasPowerup ? "fill" : "duotone"}
            className="size-5"
          />
          {hasPowerup ? "POWERUP!" : "POWERUP"}
        </button>

        <button
          onClick={onToggleComments}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-[0.15em] transition-all active:scale-95 border border-transparent group/comment cursor-pointer",
            showComments
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
          )}
        >
          <ChatTeardropIcon weight="duotone" className="size-5" />
          Comentar
        </button>
      </div>
    </div>
  );
}
