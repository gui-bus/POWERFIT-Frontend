import { Item as HistoryItem } from "@/lib/api/fetch-generated";

interface MiniTrendChartProps {
  history: HistoryItem[];
}

export function MiniTrendChart({ history }: MiniTrendChartProps) {
  if (history.length <= 1) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest italic">
          Tendência de Carga
        </span>
        <div className="h-6 w-24 flex items-end gap-0.5 pt-1">
          {history.slice(0, 8).reverse().map((h, i) => {
            const weights = history.map(x => x.weightInGrams);
            const min = Math.min(...weights);
            const max = Math.max(...weights);
            const range = max - min || 1;
            const height = ((h.weightInGrams - min) / range) * 100;
            return (
              <div 
                key={i} 
                className="flex-1 bg-primary/20 rounded-t-[1px] relative group/bar"
                style={{ height: `${Math.max(height, 10)}%` }}
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-popover text-[6px] px-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                  {h.weightInGrams / 1000}kg
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[10px] font-anton italic text-primary leading-none">
          +{((history[0].weightInGrams - history[history.length - 1].weightInGrams) / 1000).toFixed(1)}kg
        </span>
        <span className="text-[6px] font-bold text-muted-foreground uppercase">
          Evolução Total
        </span>
      </div>
    </div>
  );
}
