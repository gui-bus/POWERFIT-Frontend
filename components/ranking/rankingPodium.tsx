import { GetStreakRanking200RankingItem } from "@/lib/api/fetch-generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CrownIcon, FireIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

interface RankingPodiumProps {
  items: GetStreakRanking200RankingItem[];
}

export function RankingPodium({ items }: RankingPodiumProps) {
  const top1 = items[0];
  const top2 = items[1];
  const top3 = items[2];

  const podiumItems = [
    { 
      item: top2, 
      position: 2, 
      height: "h-32 sm:h-40", 
      color: "bg-zinc-400/10 border-zinc-400/20", 
      textColor: "text-zinc-400",
      borderColor: "border-zinc-400"
    },
    { 
      item: top1, 
      position: 1, 
      height: "h-44 sm:h-56", 
      color: "bg-primary/10 border-primary/20", 
      textColor: "text-primary",
      borderColor: "border-primary",
      isMain: true 
    },
    { 
      item: top3, 
      position: 3, 
      height: "h-24 sm:h-32", 
      color: "bg-amber-700/10 border-amber-700/20", 
      textColor: "text-amber-700",
      borderColor: "border-amber-700"
    },
  ];

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-6 pt-12 pb-2">
      {podiumItems.map((slot, index) => (
        slot.item ? (
          <div key={slot.item.id} className="flex flex-col items-center flex-1 max-w-27.5 sm:max-w-40">
            <div className="relative mb-4">
              {slot.position === 1 && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-primary animate-bounce">
                  <CrownIcon weight="fill" className="size-8 sm:size-10" />
                </div>
              )}
              <div className={cn(
                "relative size-16 sm:size-28 rounded-full p-1 border-4 transition-all duration-500",
                slot.borderColor,
                slot.position === 1 ? "shadow-2xl shadow-primary/30 scale-110 z-10" : "shadow-xl opacity-90"
              )}>
                <Avatar className="size-full rounded-full border border-background">
                  <AvatarImage src={slot.item.image || ""} alt={slot.item.name} className="object-cover" />
                  <AvatarFallback className="bg-muted text-lg font-black uppercase">
                    {slot.item.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-2 -right-1 size-6 sm:size-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black italic border-2 border-background shadow-lg",
                  slot.position === 1 ? "bg-primary text-white" : 
                  slot.position === 2 ? "bg-zinc-400 text-black" : 
                  "bg-amber-700 text-white"
                )}>
                  {slot.position}º
                </div>
              </div>
            </div>
            
            <div className="text-center mb-4 space-y-1 overflow-hidden w-full px-1">
              <p className="font-anton text-xs sm:text-lg uppercase italic leading-none truncate tracking-tight">
                {slot.item.name.split(' ')[0]}
              </p>
              <div className="flex items-center justify-center gap-1 text-primary">
                <FireIcon weight="fill" className="size-3 sm:size-4" />
                <span className="font-black text-[10px] sm:text-sm italic">{slot.item.streak}</span>
              </div>
            </div>

            <div className={cn(
              "w-full rounded-t-[2rem] border-t border-x transition-all duration-1000 ease-out",
              slot.height,
              slot.color
            )}>
               <div className="size-full flex items-start justify-center pt-4">
                  <span className={cn("font-anton text-2xl sm:text-4xl opacity-20 italic", slot.textColor)}>
                    {slot.position}
                  </span>
               </div>
            </div>
          </div>
        ) : (
          <div key={`empty-${index}`} className="flex-1 max-w-27.5 sm:max-w-40" />
        )
      ))}
    </div>
  );
}
