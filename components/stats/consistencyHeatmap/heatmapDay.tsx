import { cn } from "@/lib/utils";
import dayjs from "dayjs";

interface HeatmapDayProps {
  day: dayjs.Dayjs;
  isCurrentMonth: boolean;
  isCompleted?: boolean;
  isStarted?: boolean;
}

export function HeatmapDay({ day, isCurrentMonth, isCompleted, isStarted }: HeatmapDayProps) {
  return (
    <div
      title={isCurrentMonth ? day.format("DD/MM/YYYY") : ""}
      className={cn(
        "size-3 sm:size-4 rounded-[3px] transition-all duration-700 ease-out hover:scale-125 hover:z-10 cursor-default",
        !isCurrentMonth 
          ? "opacity-0 pointer-events-none" 
          : isCompleted
          ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]"
          : isStarted
          ? "bg-primary/20 border border-primary/20"
          : "bg-muted/30 border border-border/50 hover:border-primary/30"
      )}
    />
  );
}
