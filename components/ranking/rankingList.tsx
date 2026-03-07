import { GetStreakRanking200RankingItem } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FireIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

interface RankingListProps {
  items: GetStreakRanking200RankingItem[];
  currentUserId?: string;
}

export function RankingList({ items, currentUserId }: RankingListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isCurrentUser = item.id === currentUserId;
        const position = index + 4;

        return (
          <div 
            key={item.id} 
            className={cn(
              "flex items-center justify-between p-4 rounded-[2rem] border transition-all",
              isCurrentUser 
                ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5 scale-[1.01]" 
                : "bg-card/50 border-border/50 hover:border-primary/20"
            )}
          >
            <div className="flex items-center gap-4">
              <span className="font-anton text-lg italic text-muted-foreground w-8 text-center">
                {position}º
              </span>
              <Avatar className="size-10 sm:size-12 rounded-2xl border border-border">
                <AvatarImage src={item.image || ""} alt={item.name} className="object-cover" />
                <AvatarFallback className="bg-muted text-xs font-black uppercase">
                  {item.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm sm:text-base font-black uppercase italic tracking-tight",
                  isCurrentUser ? "text-primary" : "text-foreground"
                )}>
                  {item.name}
                </span>
                {isCurrentUser && (
                  <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em] leading-none mt-0.5">Sua Posição</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-2xl border border-border/50 shadow-inner">
              <FireIcon weight="fill" className="size-4 text-primary" />
              <span className="font-anton text-sm sm:text-base italic text-foreground leading-none">{item.streak}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
