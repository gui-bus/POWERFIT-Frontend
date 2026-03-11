import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PodiumPedestalProps {
  height: string;
  position: number;
  border: string;
  isGold?: boolean;
  isMe: boolean;
}

export function PodiumPedestal({ height, position, border, isGold, isMe }: PodiumPedestalProps) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
      className="w-full origin-bottom"
    >
      <div className={cn(
        "w-full rounded-t-3xl border-t border-x relative overflow-hidden",
        height,
        border,
        "bg-linear-to-b from-card/80 to-muted/10 backdrop-blur-sm",
        isMe && "border-primary/40 bg-primary/3"
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "font-anton text-4xl sm:text-7xl opacity-5 italic select-none",
            isGold ? "text-amber-500" : "text-foreground"
          )}>
            {position}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
