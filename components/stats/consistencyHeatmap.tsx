"use client";

import { GetStats200ConsistencyByDay } from "@/lib/api/fetch-generated";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

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
        
        {/* Legenda Desktop */}
        <div className="hidden sm:flex items-center gap-6 bg-background/50 border border-border px-5 py-2.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-[3px] bg-muted/30 border border-border/50" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Vazio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-[3px] bg-primary/20 border border-primary/20" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Iniciado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-[3px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.4)]" />
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Foco Total</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
        {months.map((month, monthIdx) => {
          const monthName = month.format("MMMM");
          const yearName = month.format("YYYY");
          const startOfMonth = month.startOf("month");
          const endOfMonth = month.endOf("month");
          
          let currentDay = startOfMonth.startOf("week").add(1, "day");
          if (startOfMonth.day() === 0) {
            currentDay = startOfMonth.subtract(6, "day");
          } else {
            currentDay = startOfMonth.day(1);
          }

          const weeks = [];
          while (currentDay.isBefore(endOfMonth) || currentDay.isSame(endOfMonth, "day")) {
            const week = [];
            for (let i = 0; i < 7; i++) {
              week.push(currentDay);
              currentDay = currentDay.add(1, "day");
            }
            weeks.push(week);
          }

          return (
            <div key={monthIdx} className="space-y-4 group">
              <div className="flex items-center gap-2 pl-0.5 border-l-2 border-primary/0 group-hover:border-primary transition-all duration-500">
                <p className="text-[10px] font-black text-foreground uppercase tracking-widest">
                  {monthName}
                </p>
                <span className="text-[8px] font-bold text-muted-foreground/50">{yearName}</span>
              </div>
              
              <div className="flex gap-1.5">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1.5">
                    {week.map((day, dayIdx) => {
                      const dateKey = day.format("YYYY-MM-DD");
                      const isCurrentMonth = day.isSame(month, "month");
                      const status = consistencyByDay[dateKey];
                      
                      const isCompleted = status?.workoutDayCompleted;
                      const isStarted = status?.workoutDayStarted;

                      return (
                        <div
                          key={dayIdx}
                          title={isCurrentMonth ? day.format("DD/MM/YYYY") : ""}
                          className={cn(
                            "size-3 sm:size-4 rounded-[3px] transition-all duration-700 ease-out hover:scale-125 hover:z-10 cursor-default",
                            !isCurrentMonth 
                              ? "opacity-0 pointer-events-none" 
                              : isCompleted
                              ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                              : isStarted
                              ? "bg-primary/20 border border-primary/20"
                              : "bg-muted/30 border border-border/50 hover:border-primary/30"
                          )}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda Mobile */}
      <div className="sm:hidden pt-6 border-t border-border/50 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-[3px] bg-muted/30 border border-border/50" />
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Vazio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-[3px] bg-primary/20 border border-primary/20" />
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Iniciado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-[3px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
          <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Concluído</span>
        </div>
      </div>
    </div>
  );
}
