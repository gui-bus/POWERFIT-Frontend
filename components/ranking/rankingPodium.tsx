"use client";

import { GetRanking200RankingItem } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CrownIcon, MedalIcon, StarIcon, FireIcon } from "@phosphor-icons/react";
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
      glow: "shadow-[0_0_30px_rgba(148,163,184,0.2)]",
      icon: <MedalIcon weight="fill" className="size-6 text-slate-400" />,
      order: "order-1",
      avatarSize: "size-20 sm:size-28",
      height: "h-24 sm:h-32",
    },
    {
      item: top1,
      position: 1,
      label: "Ouro",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      glow: "shadow-[0_0_50px_rgba(245,158,11,0.3)]",
      icon: <CrownIcon weight="fill" className="size-10 text-amber-500" />,
      order: "order-2",
      avatarSize: "size-28 sm:size-40",
      height: "h-36 sm:h-48",
      isGold: true,
    },
    {
      item: top3,
      position: 3,
      label: "Bronze",
      color: "text-orange-700",
      bg: "bg-orange-700/10",
      border: "border-orange-700/20",
      glow: "shadow-[0_0_30px_rgba(154,52,18,0.15)]",
      icon: <MedalIcon weight="fill" className="size-6 text-orange-700" />,
      order: "order-3",
      avatarSize: "size-16 sm:size-24",
      height: "h-16 sm:h-24",
    },
  ];

  return (
    <motion.div 
      variants={containerStagger}
      initial="initial"
      animate="animate"
      className="relative pt-12 pb-8"
    >
      <div className="flex items-end justify-end gap-2 sm:gap-8 px-4 relative z-10">
        {podiumSlots.map((slot) => {
          if (!slot.item) return <div key={`empty-${slot.position}`} className={cn("flex-1", slot.order)} />;
          
          const isMe = slot.item.id === currentUserId;

          return (
            <div
              key={slot.item.id}
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
                      <AvatarImage src={slot.item.image || ""} alt={slot.item.name} className="object-cover" />
                      <AvatarFallback className="bg-muted text-xl font-black italic">
                        {slot.item.name.substring(0, 2)}
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
                  {slot.item.name.split(' ')[0]}
                </p>
                
                <div className="flex items-center justify-center gap-1.5 font-black italic text-[10px] text-muted-foreground opacity-80">
                  {type === "STREAK" ? (
                    <>
                      <FireIcon weight="fill" className="size-3.5 text-primary" />
                      <span>{slot.item.streak}</span>
                    </>
                  ) : (
                    <>
                      <StarIcon weight="fill" className="size-3.5 text-primary" />
                      <span>Lvl {slot.item.level} - {slot.item.xp} XP</span>
                    </>
                  )}
                </div>
              </div>

              {/* Pedestal Base */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
                className="w-full origin-bottom"
              >
                <div className={cn(
                  "w-full rounded-t-3xl border-t border-x relative overflow-hidden",
                  slot.height,
                  slot.border,
                  "bg-linear-to-b from-card/80 to-muted/10 backdrop-blur-sm",
                  isMe && "border-primary/40 bg-primary/3"
                )}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                      "font-anton text-4xl sm:text-7xl opacity-5 italic select-none",
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
