import { GetHomeData200ConsistencyByDay } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { calculateStreak } from "@/lib/utils/consistency";
import { WEEKDAYS_LABELS } from "@/lib/utils/date";
import { ConsistencyItem } from "./consistency/consistencyItem";
import { StreakBanner } from "./consistency/streakBanner";

dayjs.locale("pt-br");

interface ConsistencyGridProps {
  consistencyByDay: GetHomeData200ConsistencyByDay;
  streak: number;
}

export function ConsistencyGrid({ consistencyByDay, streak }: ConsistencyGridProps) {
  const today = dayjs().startOf('day');
  const startOfWeek = today.startOf('week').add(1, 'day').subtract(today.day() === 0 ? 7 : 0, 'day');

  const calculatedStreak = calculateStreak(consistencyByDay, today);
  const finalStreak = Math.max(streak, calculatedStreak);

  return (
    <div className="w-full flex flex-col gap-4 lg:p-8 dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            Consistência
          </h2>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Sua jornada semanal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-6">
        {WEEKDAYS_LABELS.map((label, index) => {
          const currentDate = startOfWeek.add(index, "day");
          const dateKey = currentDate.format("YYYY-MM-DD");
          const status = consistencyByDay[dateKey];
          
          const isToday = currentDate.isSame(today, "day");
          const isCompleted = status?.workoutDayCompleted || false;
          const isStarted = status?.workoutDayStarted || false;

          return (
            <ConsistencyItem
              key={dateKey}
              label={label}
              isToday={isToday}
              isCompleted={isCompleted}
              isStarted={isStarted}
            />
          );
        })}
      </div>

      <StreakBanner streak={finalStreak} />
    </div>
  );
}
