"use client";

import { GetRanking200RankingItem } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CrownIcon, TrophyIcon, MedalIcon } from "@phosphor-icons/react";
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
      label: "Prata",
      color: "text-slate-400",
      bg: "bg-slate-400/10",
      border: "border-slate-400/20",
      icon: <MedalIcon weight="fill" className="size-6 text-slate-400" />,
      order: "order-1",
      avatarSize: "size-20 sm:size-28",
    },
    {
      item: top1,
      position: 1,
      label: "Ouro",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: <CrownIcon weight="fill" className="size-10 text-amber-500" />,
      order: "order-2",
      avatarSize: "size-28 sm:size-40",
    },
    {
      item: top3,
      position: 3,
      label: "Bronze",
      color: "text-orange-700",
      bg: "bg-orange-700/10",
      border: "border-orange-700/20",
      icon: <MedalIcon weight="fill" className="size-6 text-orange-700" />,
      order: "order-3",
      avatarSize: "size-16 sm:size-24",
    },
  ];

  return (
    <motion.div 
      variants={containerStagger}
      initial="initial"
      animate="animate"
      className="relative pt-12 pb-8"
    >
      <div className="flex items-end justify-center gap-4 sm:gap-12 max-w-4xl mx-auto px-4 relative z-10">
        {podiumSlots.map((slot) => {
          if (!slot.item) return <div key={`empty-${slot.position}`} className={cn("flex-1", slot.order)} />;
          
          const isMe = slot.item.id === currentUserId;

          return (
            <div
              key={slot.item.id}
              className={cn(
                "flex flex-col items-center flex-1 transition-all duration-700",
                slot.order,
                slot.position === 1 ? "z-20 scale-110 sm:scale-125" : "z-10 opacity-90"
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
                  "relative rounded-[2rem] p-1 transition-all duration-500",
                  slot.avatarSize,
                  isMe ? "ring-4 ring-primary ring-offset-4 ring-offset-background" : "ring-2 ring-border/50"
                )}>
                  <div className="size-full rounded-[1.8rem] overflow-hidden border-2 border-background shadow-2xl">
                    <Avatar className="size-full rounded-none">
                      <AvatarImage src={slot.item.image || ""} alt={slot.item.name} className="object-cover" />
                      <AvatarFallback className="bg-muted text-xl font-black italic">
                        {slot.item.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </motion.div>

              <div className="text-center space-y-2">
                <div className={cn(
                  "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest inline-block",
                  slot.bg, slot.border, slot.color
                )}>
                  {slot.label}
                </div>
                
                <p className={cn(
                  "font-anton uppercase italic leading-none truncate max-w-[100px]",
                  isMe ? "text-primary" : "text-foreground",
                  slot.position === 1 ? "text-base sm:text-2xl" : "text-xs sm:text-base"
                )}>
                  {slot.item.name.split(' ')[0]}
                </p>
                
                <p className="font-black italic text-[10px] text-muted-foreground opacity-70">
                  {type === "STREAK" ? `${slot.item.streak} DIAS` : `${slot.item.xp} XP`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
