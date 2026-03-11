import { GetRanking200RankingItem } from "@/lib/api/fetch-generated";
import { FireIcon, StarIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/utils/animations";
import { RankingAvatar } from "./rankingAvatar";

interface RankingItemProps {
  item: GetRanking200RankingItem;
  position: number;
  type: "STREAK" | "XP";
  isCurrentUser: boolean;
}

export function RankingItem({ item, position, type, isCurrentUser }: RankingItemProps) {
  return (
    <motion.div 
      variants={fadeIn}
      className={cn(
        "flex items-center justify-between p-4 rounded-[2rem] border transition-all duration-300",
        isCurrentUser 
          ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5 scale-[1.01]" 
          : "bg-card border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/2"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 flex justify-center">
          <span className="font-anton text-lg italic text-muted-foreground/50">
            {position}º
          </span>
        </div>
        
        <RankingAvatar 
          name={item.name} 
          image={item.image} 
          isCurrentUser={isCurrentUser} 
        />

        <div className="flex flex-col">
          <span className={cn(
            "text-sm sm:text-base font-black uppercase italic tracking-tight",
            isCurrentUser ? "text-primary" : "text-foreground"
          )}>
            {item.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Nível {item.level}</span>
            {isCurrentUser && (
              <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none bg-primary/10 px-1.5 py-0.5 rounded">Você</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-muted/30 px-5 py-2.5 rounded-2xl border border-border/50 shadow-inner min-w-25 justify-center">
        {type === "STREAK" ? (
          <>
            <FireIcon weight="fill" className="size-4 text-primary" />
            <span className="font-anton text-sm sm:text-base italic text-foreground leading-none">{item.streak}</span>
          </>
        ) : (
          <>
            <StarIcon weight="fill" className="size-4 text-primary" />
            <span className="font-anton text-sm sm:text-base italic text-foreground leading-none">{item.xp}</span>
          </>
        )}
      </div>
    </motion.div>
  );
}
