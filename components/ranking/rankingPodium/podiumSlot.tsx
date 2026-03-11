import { GetRanking200RankingItem } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FireIcon, StarIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { springUp, floatingBadge } from "@/lib/utils/animations";
import { PodiumPedestal } from "./podiumPedestal";

interface PodiumSlotProps {
  item?: GetRanking200RankingItem;
  slot: any;
  type: "STREAK" | "XP";
  isMe: boolean;
}

export function PodiumSlot({ item, slot, type, isMe }: PodiumSlotProps) {
  if (!item) return <div className={cn("flex-1", slot.order)} />;

  return (
    <div
      className={cn(
        "flex flex-col items-center flex-1 transition-all duration-700",
        slot.order,
        slot.position === 1 ? "z-20" : "z-10"
      )}
    >
      <motion.div variants={springUp} className="relative mb-6">
        <motion.div 
          variants={floatingBadge}
          animate="animate"
          className="absolute -top-12 left-1/2 -translate-x-1/2"
        >
          {slot.icon}
        </motion.div>

        <div className={cn(
          "relative rounded-full p-1 transition-all duration-500",
          slot.avatarSize,
          isMe ? "ring-4 ring-primary ring-offset-4 ring-offset-background shadow-2xl" : "ring-2 ring-border/50"
        )}>
          <div className="size-full rounded-full overflow-hidden border-2 border-background bg-card">
            <Avatar className="size-full rounded-none">
              <AvatarImage src={item.image || ""} alt={item.name} className="object-cover" />
              <AvatarFallback className="bg-muted text-xl font-black italic">
                {item.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.div>

      <div className="text-center space-y-3 w-full mb-6">
        <div className={cn(
          "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-[0.2em] inline-block",
          slot.bg, slot.border, slot.color
        )}>
          {slot.label}
        </div>
        
        <p className={cn(
          "font-anton uppercase italic leading-none truncate w-full px-2",
          isMe ? "text-primary" : "text-foreground",
          slot.position === 1 ? "text-base sm:text-2xl" : "text-xs sm:text-base"
        )}>
          {item.name.split(' ')[0]}
        </p>
        
        <div className="flex items-center justify-center gap-1.5 font-black italic text-[10px] text-muted-foreground opacity-80">
          {type === "STREAK" ? (
            <>
              <FireIcon weight="fill" className="size-3.5 text-primary" />
              <span>{item.streak}</span>
            </>
          ) : (
            <>
              <StarIcon weight="fill" className="size-3.5 text-primary" />
              <span>Lvl {item.level} - {item.xp} XP</span>
            </>
          )}
        </div>
      </div>

      <PodiumPedestal
        height={slot.height}
        position={slot.position}
        border={slot.border}
        isGold={slot.isGold}
        isMe={isMe}
      />
    </div>
  );
}
