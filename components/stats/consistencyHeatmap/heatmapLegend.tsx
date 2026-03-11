import { cn } from "@/lib/utils";

interface HeatmapLegendProps {
  className?: string;
}

export function HeatmapLegend({ className }: HeatmapLegendProps) {
  const legendItems = [
    { label: "Vazio", colorClass: "bg-muted/30 border-border/50", textClass: "text-muted-foreground" },
    { label: "Iniciado", colorClass: "bg-primary/20 border-primary/20", textClass: "text-muted-foreground" },
    { label: "Concluído", colorClass: "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.4)]", textClass: "text-primary" },
  ];

  return (
    <div className={cn("flex items-center gap-4 sm:gap-6", className)}>
      {legendItems.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={cn("size-3 rounded-[3px] border", item.colorClass)} />
          <span className={cn("text-[8px] sm:text-[9px] font-black uppercase tracking-widest", item.textClass)}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
