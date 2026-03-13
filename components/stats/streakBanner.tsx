"use client";

import { cn } from "@/lib/utils";
import { FireIcon, HeartBreakIcon, WrenchIcon } from "@phosphor-icons/react";
import { authClient } from "@/lib/authClient";
import { streakRepair } from "@/lib/api/fetch-generated";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StreakBannerProps {
  streak: number;
}

export function StreakBanner({ streak }: StreakBannerProps) {
  const { data: session } = authClient.useSession();
  const [isRepairing, setIsRepairing] = useState(false);
  const router = useRouter();

  const handleRepair = async () => {
    if (isRepairing) return;
    
    if ((session?.user?.xp || 0) < 500) {
      toast.error("XP insuficiente", {
        description: "Você precisa de 500 XP para recuperar sua streak."
      });
      return;
    }

    setIsRepairing(true);
    try {
      const response = await streakRepair();
      if (response.status === 200) {
        toast.success("Streak recuperada!", {
          description: `Sua ofensiva voltou para ${response.data.newStreak} dias!`
        });
        router.refresh();
      } else {
        toast.error("Erro ao recuperar streak.");
      }
    } catch {
      toast.error("Erro na conexão.");
    } finally {
      setIsRepairing(false);
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between rounded-2xl p-4 mt-2 overflow-hidden relative group transition-all duration-500",
      streak > 0 ? "bg-foreground text-background" : "bg-muted/30 text-muted-foreground border border-dashed border-border"
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
        {streak > 0 ? <FireIcon weight="duotone" size={60} /> : <HeartBreakIcon weight="duotone" size={60} />}
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "size-12 rounded-xl flex items-center justify-center shadow-lg transition-all",
          streak > 0 ? "bg-primary shadow-primary/20" : "bg-muted border border-border"
        )}>
          {streak > 0 ? (
            <FireIcon weight="duotone" className="size-7 text-primary-foreground" />
          ) : (
            <HeartBreakIcon weight="duotone" className="size-7" />
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            {streak > 0 ? "Ofensiva Atual" : "Ofensiva Quebrada"}
          </p>
          <p className={cn(
            "text-2xl font-black leading-none",
            streak > 0 ? "" : "text-foreground/40"
          )}>
            {streak} {streak === 1 ? 'Dia' : 'Dias'}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-end">
        {streak === 0 && (
          <button
            onClick={handleRepair}
            disabled={isRepairing}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <WrenchIcon weight="bold" className={cn("size-3", isRepairing && "animate-spin")} />
            Recuperar (500 XP)
          </button>
        )}
        
        {streak > 0 && (
          <>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
              Meta
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1 w-4 rounded-full",
                    i <= (streak % 5 || 5) ? "bg-primary" : "bg-muted/20"
                  )} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
