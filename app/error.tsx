"use client";

import { useEffect } from "react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ArrowsClockwiseIcon, WifiSlashIcon } from "@phosphor-icons/react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Dashboard Layout Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Container className="max-w-md relative z-10">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[3rem] p-12 text-center shadow-2xl space-y-8">
          <div className="size-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto border border-primary/20 shadow-lg shadow-primary/5">
            <WifiSlashIcon weight="duotone" className="size-12 text-primary" />
          </div>

          <div className="space-y-4">
            <h1 className="font-anton text-4xl text-foreground italic uppercase tracking-wider leading-none">
              Falha de <br /> <span className="text-primary">Conexão</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed text-sm font-medium">
              Não conseguimos nos comunicar com o servidor. Isso pode ser uma instabilidade temporária na API ou na sua conexão.
            </p>
          </div>

          <div className="pt-4">
            <Button 
              onClick={() => reset()}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-black uppercase italic tracking-widest shadow-lg shadow-primary/20 group"
            >
              <ArrowsClockwiseIcon weight="bold" className="mr-2 size-5 group-active:rotate-180 transition-transform duration-500" />
              Tentar Novamente
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.2em] italic">
            PowerFIT Recovery System
          </p>
        </div>
      </Container>
    </div>
  );
}
