"use client";

import { LightningIcon, StarIcon } from "@phosphor-icons/react";
import { GetMe200 } from "@/lib/api/fetch-generated";

interface LevelProgressProps {
  userData: GetMe200;
}

export function LevelProgress({ userData }: LevelProgressProps) {
  const xpInCurrentLevel = userData.xp % 1000;
  const progressPercent = (xpInCurrentLevel / 1000) * 100;

  return (
    <div className="bg-primary border border-primary/20 rounded-[2.5rem] p-8 shadow-lg shadow-primary/10 overflow-hidden relative group">
      <div className="absolute -bottom-4 -right-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
        <StarIcon weight="fill" className="size-32 text-primary-foreground" />
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-[0.2em]">Seu Progresso</p>
            <h3 className="font-anton text-3xl italic text-primary-foreground uppercase leading-none">Nível {userData.level}</h3>
          </div>
          <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
            <LightningIcon weight="fill" className="size-7" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-primary-foreground uppercase tracking-widest">{userData.xp} XP Total</p>
            <p className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-widest">{xpInCurrentLevel} / 1000 XP</p>
          </div>
          <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
