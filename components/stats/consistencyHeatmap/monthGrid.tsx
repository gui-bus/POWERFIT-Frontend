import dayjs from "dayjs";
import { HeatmapDay } from "./heatmapDay";
import { GetStats200ConsistencyByDay } from "@/lib/api/fetch-generated";

interface MonthGridProps {
  month: dayjs.Dayjs;
  consistencyByDay: GetStats200ConsistencyByDay;
}

export function MonthGrid({ month, consistencyByDay }: MonthGridProps) {
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
    <div className="space-y-4 group">
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
              
              return (
                <HeatmapDay
                  key={dayIdx}
                  day={day}
                  isCurrentMonth={isCurrentMonth}
                  isCompleted={status?.workoutDayCompleted}
                  isStarted={status?.workoutDayStarted}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
