"use client";

import { MuscleGroup } from "@/lib/utils/muscleMapper";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MuscleHeatmapProps {
  activeMuscles: MuscleGroup[];
  className?: string;
  title?: string;
  subtitle?: string;
}

const MUSCLE_POSITIONS: Record<MuscleGroup, { x: number; y: number; view: "front" | "back" }[]> = {
  chest: [{ x: 45, y: 22, view: "front" }, { x: 55, y: 22, view: "front" }],
  shoulders: [{ x: 38, y: 20, view: "front" }, { x: 62, y: 20, view: "front" }, { x: 38, y: 20, view: "back" }, { x: 62, y: 20, view: "back" }],
  abs: [{ x: 50, y: 32, view: "front" }],
  biceps: [{ x: 32, y: 28, view: "front" }, { x: 68, y: 28, view: "front" }],
  triceps: [{ x: 32, y: 28, view: "back" }, { x: 68, y: 28, view: "back" }],
  back: [{ x: 50, y: 25, view: "back" }, { x: 42, y: 32, view: "back" }, { x: 58, y: 32, view: "back" }],
  glutes: [{ x: 42, y: 48, view: "back" }, { x: 58, y: 48, view: "back" }],
  quads: [{ x: 42, y: 55, view: "front" }, { x: 58, y: 55, view: "front" }],
  hamstrings: [{ x: 42, y: 65, view: "back" }, { x: 58, y: 65, view: "back" }],
  calves: [{ x: 45, y: 85, view: "front" }, { x: 55, y: 85, view: "front" }, { x: 45, y: 85, view: "back" }, { x: 55, y: 85, view: "back" }],
};

export function MuscleHeatmap({ activeMuscles, className, title, subtitle }: MuscleHeatmapProps) {
  const renderView = (view: "front" | "back") => (
    <div className="relative aspect-[1/2] w-full max-w-[140px] bg-muted/20 rounded-3xl border border-border/50 overflow-hidden">
      {/* Estilização Blueprint do Fundo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
      
      {/* Contorno Humano Abstrato (Minimalista) */}
      <svg viewBox="0 0 100 200" className="absolute inset-0 size-full stroke-muted-foreground/30 fill-none opacity-40">
        <path d="M50,15 C55,15 60,18 60,25 L60,35 C65,35 72,38 72,45 L72,80 L68,80 L68,48 L62,48 L62,100 L55,100 L55,190 L45,190 L45,100 L38,100 L38,48 L32,48 L32,80 L28,80 L28,45 C28,38 35,35 40,35 L40,25 C40,18 45,15 50,15" strokeWidth="1" />
      </svg>

      {/* Heatmap Dots */}
      {Object.entries(MUSCLE_POSITIONS).map(([muscle, positions]) => {
        const isActive = activeMuscles.includes(muscle as MuscleGroup);
        return positions
          .filter(p => p.view === view)
          .map((p, i) => (
            <motion.div
              key={`${muscle}-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isActive ? 1 : 0.4, 
                opacity: isActive ? 1 : 0.1,
                boxShadow: isActive ? "0 0 20px var(--primary)" : "none"
              }}
              className={cn(
                "absolute size-4 -ml-2 -mt-2 rounded-full blur-[2px] transition-colors duration-500",
                isActive ? "bg-primary" : "bg-muted-foreground"
              )}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          ));
      })}

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50 italic">
          VIEW: {view.toUpperCase()}
        </span>
      </div>
    </div>
  );

  return (
    <div className={cn("bg-card border border-border rounded-[2.5rem] p-8 space-y-8", className)}>
      <div className="flex flex-col gap-1">
        <h3 className="font-anton text-2xl italic uppercase tracking-wider text-foreground leading-none">
          {title || "Mapa de Foco Muscular"}
        </h3>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">
          {subtitle || "Anatomia e Distribuição de Esforço"}
        </p>
      </div>

      <div className="flex justify-center gap-8 sm:gap-16">
        <div className="space-y-4 flex flex-col items-center">
          {renderView("front")}
        </div>
        <div className="space-y-4 flex flex-col items-center">
          {renderView("back")}
        </div>
      </div>

      {/* Muscle Legend */}
      <div className="flex flex-wrap gap-2 justify-center border-t border-border/50 pt-6">
        {activeMuscles.map(muscle => (
           <span key={muscle} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[8px] font-black text-primary uppercase tracking-widest italic">
              {muscle}
           </span>
        ))}
        {activeMuscles.length === 0 && (
           <span className="text-[9px] font-bold text-muted-foreground italic uppercase tracking-widest opacity-50">
              Nenhum grupo identificado
           </span>
        )}
      </div>
    </div>
  );
}
