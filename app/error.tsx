"use client";

import { useEffect } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ArrowsClockwiseIcon, WifiSlashIcon, WarningCircleIcon } from "@phosphor-icons/react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro Global da Aplicação:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />

      <Container className="max-w-3xl relative z-10">
        <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 md:p-24 text-center shadow-[0_0_100px_rgba(0,0,0,0.4)] space-y-12 relative overflow-hidden group">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
          
          <div className="relative inline-block">
            <div className="size-40 bg-primary/10 rounded-[3rem] flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)] group-hover:scale-105 transition-transform duration-700">
              <WifiSlashIcon weight="duotone" className="size-20 text-primary animate-pulse" />
            </div>
            
            <div className="absolute -bottom-2 -right-2 bg-background border border-primary/30 size-12 rounded-2xl flex items-center justify-center shadow-xl">
              <WarningCircleIcon weight="fill" className="size-6 text-primary" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="font-anton text-6xl md:text-8xl text-foreground italic uppercase tracking-tighter leading-[0.85]">
                SERVIDOR <br />
                <span className="text-transparent bg-clip-text bg-linear-to-b from-primary to-primary/50">DESCONECTADO</span>
              </h1>
            </div>
            
            <div className="h-px w-32 bg-primary/20 mx-auto" />

            <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-medium max-w-lg mx-auto">
              Perdemos contato com os servidores da <span className="text-foreground font-black italic">POWER.FIT</span>. 
              Verifique sua conexão ou tente restabelecer o link abaixo.
            </p>
          </div>

          <div className="pt-4 max-w-sm mx-auto">
            <Button 
              onClick={() => reset()}
              className="w-full h-20 rounded-[2rem] bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-black uppercase italic tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_25px_50px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 active:translate-y-0 group"
            >
              <ArrowsClockwiseIcon weight="bold" className="mr-3 size-6 group-active:rotate-180 transition-transform duration-700" />
              Restabelecer Conexão
            </Button>
          </div>

          <div className="pt-10 flex flex-col items-center gap-4 border-t border-white/5">
            <p className="text-[10px] text-muted-foreground/20 font-black uppercase tracking-[0.6em] italic">
              POWER.FIT RECOVERY SYSTEM
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
