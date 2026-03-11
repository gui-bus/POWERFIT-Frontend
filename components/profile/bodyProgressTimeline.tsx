"use client";

import { GetBodyProgressHistory200Item } from "@/lib/api/fetch-generated";
import { ScalesIcon } from "@phosphor-icons/react";
import { BodyProgressCard } from "./bodyProgressCard";

interface BodyProgressTimelineProps {
  history: GetBodyProgressHistory200Item[];
}

export function BodyProgressTimeline({ history }: BodyProgressTimelineProps) {
  if (history.length === 0)
    return (
      <div className="py-12 text-center bg-muted/20 rounded-[2rem] border border-dashed border-border/50">
        <ScalesIcon
          weight="duotone"
          className="size-10 text-muted-foreground mx-auto mb-3 opacity-30"
        />
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
          Nenhum registro de evolução
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      {history.map((entry, index) => {
        const prevEntry = history[index + 1];
        const weightDiff = prevEntry
          ? (entry.weightInGrams - prevEntry.weightInGrams) / 1000
          : 0;

        return (
          <div key={entry.id} className="relative pl-8 pb-6 last:pb-0 group">
            {index !== history.length - 1 && (
              <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-linear-to-b from-border to-transparent" />
            )}

            <div className="absolute left-0 top-1.5 size-7 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/10 z-10">
              <div className="size-2 rounded-full bg-primary" />
            </div>

            <BodyProgressCard entry={entry} weightDiff={weightDiff} />
          </div>
        );
      })}
    </div>
  );
}
