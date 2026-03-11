import { motion } from "framer-motion";
import { SparkleIcon } from "@phosphor-icons/react";

interface ChatToggleProps {
  onOpen: () => void;
}

export function ChatToggle({ onOpen }: ChatToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.8 }}
      className="hidden lg:flex absolute bottom-12 right-12 z-50"
    >
      <button
        onClick={onOpen}
        className="group relative flex items-center gap-3 bg-card border border-border pl-4 pr-6 py-3 rounded-full shadow-2xl hover:shadow-primary/20 hover:border-primary/30 transition-all duration-500 active:scale-95 cursor-pointer"
      >
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-500">
          <SparkleIcon weight="duotone" className="size-5 fill-current" />
          <div className="absolute -top-0.5 -right-0.5 size-3 bg-lime-500 rounded-full border-2 border-card shadow-[0_0_8px_rgba(132,204,22,0.5)]" />
        </div>

        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-black text-primary uppercase italic tracking-[0.2em] mb-0.5">
            Power AI
          </span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            Assistente Online
          </span>
        </div>

        <div className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <div className="size-1.5 border-t-2 border-r-2 border-primary rotate-45" />
        </div>
      </button>
    </motion.div>
  );
}
