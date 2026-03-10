"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TimerIcon, XIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RestTimerProps {
  initialSeconds: number;
  onFinish?: () => void;
  onClose?: () => void;
}

export function RestTimer({ initialSeconds, onFinish, onClose }: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Função para tocar um beep senoidal sutil sem any
  const playSound = (frequency: number, duration: number, volume: number) => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
      }
      
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio feedback failed:", e);
    }
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const nextValue = prev - 1;
        
        if (nextValue <= 10 && nextValue > 0) {
          playSound(440, 0.1, 0.1);
          if ("vibrate" in navigator) window.navigator.vibrate(50);
        }
        
        return nextValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft > 0]);

  useEffect(() => {
    if (secondsLeft === 0) {
      playSound(880, 0.5, 0.2);
      if ("vibrate" in navigator) window.navigator.vibrate([100, 50, 100]);
      
      onFinish?.();
      
      // Auto-close automático após um pequeno delay visual
      const timeout = setTimeout(() => {
        onClose?.();
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [secondsLeft, onFinish, onClose]);

  const addTime = (seconds: number) => {
    setSecondsLeft((prev) => prev + seconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/60 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="relative w-full max-w-sm z-10"
      >
        <div className="bg-card border-2 border-primary/30 rounded-[3rem] p-8 shadow-[0_0_100px_rgba(var(--primary-rgb),0.2)] overflow-hidden">
          <div className="absolute inset-0 bg-primary/2 -z-10" />
          
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-primary">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <TimerIcon weight="fill" className="size-6 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Descanso Ativo</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Protocolo de Recuperação</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="size-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-90"
              >
                <XIcon weight="bold" className="size-5" />
              </button>
            </div>

            <div className="flex flex-col items-center py-4">
              <motion.h4 
                key={formattedTime}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "text-8xl font-anton italic tabular-nums leading-none tracking-tighter transition-colors",
                  secondsLeft <= 5 ? "text-primary drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]" : "text-foreground"
                )}
              >
                {formattedTime}
              </motion.h4>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(secondsLeft / initialSeconds) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "+10s", value: 10 },
                { label: "+30s", value: 30 },
                { label: "+1m", value: 60 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => addTime(btn.value)}
                  className="py-4 rounded-2xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-border/50 text-[10px] font-black uppercase italic tracking-widest transition-all active:scale-95 hover:border-primary/30"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={onClose}
                className="w-full h-16 rounded-[1.5rem] font-anton text-xl italic uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {secondsLeft === 0 ? "VOLTAR AO TREINO" : "PULAR PAUSA"}
              </Button>
              <p className="text-center text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50 italic">
                {secondsLeft === 0 ? "VAI VAI VAI!" : "A disciplina é a alma da performance"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
