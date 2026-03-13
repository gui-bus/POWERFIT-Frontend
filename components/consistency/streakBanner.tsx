import { cn } from "@/lib/utils";
import { FireIcon } from "@phosphor-icons/react/ssr";

interface StreakBannerProps {
  streak: number;
}

export function StreakBanner({ streak }: StreakBannerProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:justify-center justify-between bg-foreground rounded-2xl p-4 mt-2 overflow-hidden relative group">
      <div className="flex">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-background">
          <FireIcon weight="duotone" size={60} />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <FireIcon
              weight="duotone"
              className="size-7 text-primary-foreground"
              fill="currentColor"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Ofensiva Atual
            </p>
            <p className="text-2xl font-black text-background leading-none">
              {streak} {streak === 1 ? "Dia" : "Dias"}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-right">
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
          Meta
        </p>
        <div className="flex gap-1 items-center justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1 w-11 md:w-4 rounded-full",
                i <= (streak % 5 || 5) ? "bg-primary" : "bg-muted/20",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
