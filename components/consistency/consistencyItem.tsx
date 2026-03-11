import { cn } from "@/lib/utils";
import { CheckIcon, PlayIcon } from "@phosphor-icons/react/ssr";

interface ConsistencyItemProps {
  label: string;
  isToday: boolean;
  isCompleted: boolean;
  isStarted: boolean;
}

export function ConsistencyItem({ label, isToday, isCompleted, isStarted }: ConsistencyItemProps) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className={cn(
          "relative size-12 rounded-2xl flex items-center justify-center transition-all duration-300",
          isCompleted
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : isStarted
            ? "bg-primary/5 border-2 border-dashed border-primary/40 text-primary"
            : "bg-muted/50 border border-border text-muted-foreground",
          isToday && !isCompleted && !isStarted && "ring-2 ring-primary ring-offset-2"
        )}
      >
        {isCompleted ? (
          <CheckIcon className="size-5 stroke-3" />
        ) : isStarted ? (
          <div className="relative">
            <PlayIcon weight="duotone" className="size-4 fill-current" />
            <span className="absolute inset-0 size-4 bg-primary animate-ping rounded-full opacity-20" />
          </div>
        ) : (
          <span className="text-[10px] font-bold">{label}</span>
        )}
        
        {isToday && (
          <span className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-background" />
        )}
      </div>
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-widest",
        isToday ? "text-primary" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  );
}
