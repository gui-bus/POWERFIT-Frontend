import { FireIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

interface StreakBannerProps {
  streak: number;
}

export function StreakBanner({ streak }: StreakBannerProps) {
  const hasStreak = streak > 0;

  return (
    <div className={cn(
      "relative w-full overflow-hidden rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center gap-6 shadow-2xl transition-all duration-500",
      hasStreak 
        ? "bg-gradient-to-br from-orange-600 via-red-600 to-red-900" 
        : "bg-gradient-to-br from-neutral-800 via-neutral-900 to-black"
    )}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 size-64 bg-white/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 size-64 bg-black/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <div className="size-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
          <FireIcon weight="duotone" className={cn("size-10", hasStreak ? "text-orange-400" : "text-white/40")} />
        </div>
        
        <div className="space-y-1">
          <p className="font-syne text-5xl sm:text-7xl font-black text-white uppercase italic leading-none tracking-tighter drop-shadow-2xl">
            {streak} {streak === 1 ? 'Dia' : 'Dias'}
          </p>
          <p className="text-sm sm:text-base font-bold text-white/60 uppercase tracking-[0.3em] italic">
            Sequência Atual
          </p>
        </div>
      </div>
    </div>
  );
}
