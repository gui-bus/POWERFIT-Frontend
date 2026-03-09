"use client";

import { GetRanking200RankingItem } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CrownIcon, FireIcon, StarIcon, MedalIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { springUp, containerStagger, floatingBadge } from "@/lib/utils/animations";

interface RankingPodiumProps {
  items: GetRanking200RankingItem[];
  type: "STREAK" | "XP";
  currentUserId?: string;
}

export function RankingPodium({ items, type, currentUserId }: RankingPodiumProps) {
  const top1 = items[0];
  const top2 = items[1];
  const top3 = items[2];

  const podiumSlots = [
    {
      item: top2,
      position: 2,
      height: "h-20 sm:h-28",
      color: "from-slate-400/20 to-transparent",
      border: "border-slate-400/30",
      icon: <MedalIcon weight="fill" className="size-5 text-slate-400" />,
      order: "order-1",
      avatarSize: "size-20 sm:size-28",
    },
    {
      item: top1,
      position: 1,
      height: "h-28 sm:h-40",
      color: "from-amber-400/25 to-transparent",
      border: "border-amber-400/40",
      icon: <CrownIcon weight="fill" className="size-8 text-amber-500" />,
      order: "order-2",
      isGold: true,
      avatarSize: "size-28 sm:size-40",
    },
    {
      item: top3,
      position: 3,
      height: "h-14 sm:h-20",
      color: "from-orange-800/20 to-transparent",
      border: "border-orange-800/30",
      icon: <MedalIcon weight="fill" className="size-5 text-orange-800" />,
      order: "order-3",
      avatarSize: "size-16 sm:size-24",
    },
  ];

  return (
    <motion.div 
      variants={containerStagger}
      initial="initial"
      animate="animate"
      className="relative pt-16 pb-4"
    >
      <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-4xl mx-auto px-4 relative z-10">
        {podiumSlots.map((slot) => {
          if (!slot.item) return <div key={`empty-${slot.position}`} className={cn("flex-1", slot.order)} />;
          
          const isMe = slot.item.id === currentUserId;

          return (
            <div
              key={slot.item.id}
              className={cn(
                "flex flex-col items-center flex-1 transition-all duration-700",
                slot.order,
                slot.position === 1 ? "z-20 -mb-2" : "z-10"
              )}
            >
              {/* Profile Head */}
              <motion.div variants={springUp} className="relative mb-4">
                <motion.div 
                  variants={floatingBadge}
                  animate="animate"
                  className="absolute -top-10 left-1/2 -translate-x-1/2"
                >
                  {slot.icon}
                </motion.div>

                <div className={cn(
                  "relative rounded-full p-1 transition-all duration-500",
                  slot.avatarSize,
                  isMe ? "ring-4 ring-primary ring-offset-4 ring-offset-background" : "ring-2 ring-border/50"
                )}>
                  <Avatar className="size-full rounded-full border-2 border-background shadow-2xl">
                    <AvatarImage src={slot.item.image || ""} alt={slot.item.name} className="object-cover" />
                    <AvatarFallback className="bg-muted text-lg font-black italic">
                      {slot.item.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Rank Badge Small */}
                  <div className={cn(
                    "absolute -bottom-1 -right-1 size-6 sm:size-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black italic border-2 border-background shadow-lg",
                    slot.position === 1 ? "bg-amber-500 text-white" : 
                    slot.position === 2 ? "bg-slate-400 text-black" : 
                    "bg-orange-800 text-white"
                  )}>
                    {slot.position}º
                  </div>
                </div>
              </motion.div>

              {/* Name & Score */}
              <div className="text-center mb-4 space-y-1">
                <p className={cn(
                  "font-anton uppercase italic leading-none truncate max-w-[80px] sm:max-w-[120px]",
                  isMe ? "text-primary" : "text-foreground",
                  slot.position === 1 ? "text-sm sm:text-xl" : "text-[10px] sm:text-sm"
                )}>
                  {slot.item.name.split(' ')[0]}
                </p>
                <div className="flex items-center justify-center gap-1">
                  {type === "STREAK" ? (
                    <FireIcon weight="fill" className="size-3 text-primary" />
                  ) : (
                    <StarIcon weight="fill" className="size-3 text-primary" />
                  )}
                  <span className="font-black italic text-[9px] sm:text-xs opacity-80">
                    {type === "STREAK" ? slot.item.streak : `${slot.item.xp} XP`}
                  </span>
                </div>
              </div>

              {/* Refined Pedestal */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
                className="w-full origin-bottom"
              >
                <div className={cn(
                  "w-full rounded-t-2xl sm:rounded-t-[2rem] border-t border-x backdrop-blur-md relative overflow-hidden",
                  slot.height,
                  slot.border,
                  "bg-linear-to-b from-card/80 to-transparent",
                  isMe && "border-primary/50 bg-primary/5 shadow-[inset_0_1px_20px_rgba(var(--primary-rgb),0.1)]"
                )}>
                  {slot.position === 1 && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-400 to-transparent" />
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                      "font-anton text-3xl sm:text-6xl opacity-5 italic select-none",
                      slot.isGold ? "text-amber-500" : "text-foreground"
                    )}>
                      {slot.position}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
