"use client";

import { GetBodyProgressHistory200Item } from "@/lib/api/fetch-generated";
import { cn } from "@/lib/utils";
import {
  TrendUpIcon,
  TrendDownIcon,
  ScalesIcon,
  CalendarIcon,
} from "@phosphor-icons/react";
import dayjs from "dayjs";

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
            {/* Timeline Line */}
            {index !== history.length - 1 && (
              <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-linear-to-b from-border to-transparent" />
            )}

            {/* Timeline Dot */}
            <div className="absolute left-0 top-1.5 size-7 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/10 z-10">
              <div className="size-2 rounded-full bg-primary" />
            </div>

            <div className="bg-card border border-border rounded-[2rem] p-6 hover:border-primary/30 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon weight="duotone" className="size-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {dayjs(entry.loggedAt).format("DD MMM, YYYY")}
                  </span>
                </div>
                {weightDiff !== 0 && (
                  <div
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter",
                      weightDiff > 0
                        ? "bg-red-500/10 text-red-500"
                        : "bg-green-500/10 text-green-500",
                    )}
                  >
                    {weightDiff > 0 ? (
                      <TrendUpIcon weight="bold" />
                    ) : (
                      <TrendDownIcon weight="bold" />
                    )}
                    {Math.abs(weightDiff).toFixed(1)}kg
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    Peso
                  </p>
                  <p className="text-xl font-anton italic text-foreground leading-none">
                    {entry.weightInGrams / 1000}kg
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    BF
                  </p>
                  <p className="text-xl font-anton italic text-foreground leading-none">
                    {(entry.bodyFatPercentage * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    Altura
                  </p>
                  <p className="text-xl font-anton italic text-foreground leading-none">
                    {entry.heightInCentimeters}cm
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    Idade
                  </p>
                  <p className="text-xl font-anton italic text-foreground leading-none">
                    {entry.age} anos
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
