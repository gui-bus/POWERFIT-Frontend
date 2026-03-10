"use client";

import { useState, useEffect, useRef } from "react";
import { TimerIcon, XIcon, ArrowsInSimpleIcon } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface RestTimerProps {
  initialSeconds: number;
  onFinish?: () => void;
  onClose?: () => void;
}

export function RestTimer({ initialSeconds, onFinish, onClose }: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
        
        if (nextValue <= 5 && nextValue > 0) {
          playSound(440, 0.1, 0.1);
          if ("vibrate" in navigator) window.navigator.vibrate(50);
        }
        
        return nextValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      playSound(880, 0.5, 0.2);
      if ("vibrate" in navigator) window.navigator.vibrate([100, 50, 100]);
      
      onFinish?.();
      
      const timeout = setTimeout(() => {
        onClose?.();
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [secondsLeft, onFinish, onClose]);

  const addTime = (seconds: number) => {
    setSecondsLeft((prev) => prev + seconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  if (!mounted) return null;

  const timerContent = (
    <div className="fixed bottom-12 left-12 z-100 pointer-events-none flex flex-col items-end gap-4">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ scale: 0.8, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: 20 }}
            onClick={() => setIsMinimized(false)}
            className="pointer-events-auto group relative size-16 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-95 transition-all overflow-hidden"
          >
             <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform" />
             <div className="flex flex-col items-center gap-0.5 relative z-10">
                <TimerIcon weight="fill" className="size-5" />
                <span className="text-[10px] font-anton italic leading-none">{formattedTime}</span>
             </div>
             {/* Progress ring simplified */}
             <svg className="absolute inset-0 size-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="176"
                  strokeDashoffset={176 - (176 * secondsLeft) / initialSeconds}
                  className="opacity-30"
                />
             </svg>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="pointer-events-auto w-70 bg-card border-2 border-primary/20 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative"
          >
             <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="size-8 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-90"
                >
                  <ArrowsInSimpleIcon weight="bold" className="size-4" />
                </button>
                <button 
                  onClick={onClose}
                  className="size-8 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-90"
                >
                  <XIcon weight="bold" className="size-4" />
                </button>
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary">
                  <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TimerIcon weight="fill" className="size-5 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest italic">Descanso Ativo</span>
                </div>

                <div className="flex flex-col items-center">
                  <motion.h4 
                    key={formattedTime}
                    className={cn(
                      "text-6xl font-anton italic tabular-nums leading-none tracking-tighter",
                      secondsLeft <= 5 ? "text-primary animate-pulse" : "text-foreground"
                    )}
                  >
                    {formattedTime}
                  </motion.h4>
                  
                  <div className="mt-4 w-full h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: "100%" }}
                      animate={{ width: `${(secondsLeft / initialSeconds) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addTime(15)}
                    className="py-2 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-border/50 text-[9px] font-black uppercase italic tracking-widest transition-all"
                  >
                    +15s
                  </button>
                  <button
                    onClick={() => addTime(30)}
                    className="py-2 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-border/50 text-[9px] font-black uppercase italic tracking-widest transition-all"
                  >
                    +30s
                  </button>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-anton text-sm italic uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  {secondsLeft === 0 ? "PRÓXIMA SÉRIE" : "PULAR"}
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(timerContent, document.body);
}
