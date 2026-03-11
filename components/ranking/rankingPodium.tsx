"use client";

import { GetRanking200RankingItem } from "@/lib/api/fetch-generated";
import { CrownIcon, MedalIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { containerStagger } from "@/lib/utils/animations";
import { PodiumSlot } from "./rankingPodium/podiumSlot";

interface RankingPodiumProps {
  items: GetRanking200RankingItem[];
  type: "STREAK" | "XP";
  currentUserId?: string;
}

export function RankingPodium({ items, type, currentUserId }: RankingPodiumProps) {
  const podiumSlots = [
    {
      item: items[1],
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
      item: items[0],
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
      item: items[2],
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
        {podiumSlots.map((slot, index) => (
          <PodiumSlot
            key={slot.item?.id || `empty-${index}`}
            item={slot.item}
            slot={slot}
            type={type}
            isMe={slot.item?.id === currentUserId}
          />
        ))}
      </div>
    </motion.div>
  );
}
