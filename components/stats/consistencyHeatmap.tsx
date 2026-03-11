"use client";

import { GetStats200ConsistencyByDay } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { HeatmapLegend } from "./consistencyHeatmap/heatmapLegend";
import { MonthGrid } from "./consistencyHeatmap/monthGrid";

dayjs.locale("pt-br");

interface ConsistencyHeatmapProps {
  consistencyByDay: GetStats200ConsistencyByDay;
}

export function ConsistencyHeatmap({ consistencyByDay }: ConsistencyHeatmapProps) {
  const months = Array.from({ length: 12 }, (_, i) => 
    dayjs().subtract(11 - i, "month")
  );

  return (
    <div className="w-full bg-card/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-6 sm:p-10 space-y-10 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-syne text-2xl sm:text-3xl font-black text-foreground uppercase italic tracking-tighter">
            Jornada Anual
          </h3>
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">
            Consistência nos últimos 12 meses
          </p>
        </div>
        
        <HeatmapLegend className="hidden sm:flex bg-background/50 border border-border px-5 py-2.5 rounded-2xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
        {months.map((month, monthIdx) => (
          <MonthGrid
            key={monthIdx}
            month={month}
            consistencyByDay={consistencyByDay}
          />
        ))}
      </div>

      <HeatmapLegend className="sm:hidden pt-6 border-t border-border/50 flex flex-wrap" />
    </div>
  );
}
