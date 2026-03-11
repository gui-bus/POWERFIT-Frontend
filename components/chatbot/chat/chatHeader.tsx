import { Button } from "@/components/ui/button";
import { XIcon } from "@phosphor-icons/react";
import Link from "next/link";

interface ChatHeaderProps {
  embedded?: boolean;
  onClose?: () => void;
}

export function ChatHeader({ embedded = false, onClose }: ChatHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border/50 p-6 bg-card/50 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="font-heading text-base font-black uppercase italic tracking-tight text-foreground leading-none">
            Power AI
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Personal Trainer Virtual
          </span>
        </div>
      </div>
      {embedded ? (
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="rounded-xl font-black italic uppercase text-[10px] tracking-widest"
        >
          <Link href="/">Acessar FIT.AI</Link>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group"
        >
          <XIcon
            weight="duotone"
            className="size-5 text-muted-foreground group-hover:rotate-90 transition-transform"
          />
        </Button>
      )}
    </div>
  );
}
