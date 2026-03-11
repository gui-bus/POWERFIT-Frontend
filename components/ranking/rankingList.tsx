"use client";

import { GetRanking200RankingItem } from "@/lib/api/fetch-generated";
import { motion } from "framer-motion";
import { containerStagger } from "@/lib/utils/animations";
import { RankingItem } from "./rankingList/rankingItem";

interface RankingListProps {
  items: GetRanking200RankingItem[];
  type: "STREAK" | "XP";
  currentUserId?: string;
}

export function RankingList({ items, type, currentUserId }: RankingListProps) {
  return (
    <motion.div 
      variants={containerStagger}
      initial="initial"
      animate="animate"
      className="space-y-3"
    >
      {items.map((item, index) => (
        <RankingItem
          key={item.id}
          item={item}
          position={index + 4}
          type={type}
          isCurrentUser={item.id === currentUserId}
        />
      ))}
    </motion.div>
  );
}
