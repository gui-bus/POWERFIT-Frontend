import { GetHomeData200ConsistencyByDay } from "@/lib/api/fetch-generated";
import { cn } from "@/lib/utils";
import { FireIcon, CheckIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

interface ConsistencyGridProps {
  consistencyByDay: GetHomeData200ConsistencyByDay;
  streak: number;
}

const WEEKDAYS_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

export function ConsistencyGrid({ consistencyByDay, streak }: ConsistencyGridProps) {
  const today = dayjs().startOf('day');
  const startOfWeek = today.startOf('week').add(1, 'day').subtract(today.day() === 0 ? 7 : 0, 'day');

  const dates = Object.keys(consistencyByDay).sort().reverse();
  let calculatedStreak = 0;
  for (const date of dates) {
    const currentDate = dayjs(date);
    if (currentDate.isAfter(today, 'day')) continue;
    
    const status = consistencyByDay[date];
    const isCompleted = status.workoutDayCompleted;
    
    if (isCompleted) {
      calculatedStreak++;
    } else if (currentDate.isSame(today, "day")) {
      continue;
    } else {
      break;
    }
  }
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
          const isPast = currentDate.isBefore(today, "day");
          
          const isCompleted = status?.workoutDayCompleted;
          const isStarted = status?.workoutDayStarted;

          return (
            <div key={dateKey} className="flex flex-col items-center gap-2.5">
              <div
                className={cn(
                  "relative size-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isCompleted
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : isStarted
                    ? "bg-primary/5 border-2 border-dashed border-primary/40 text-primary"
                    : "bg-muted/50 border border-border text-muted-foreground",
                  isToday && !isCompleted && !isStarted && "ring-2 ring-primary ring-offset-2"
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="size-5 stroke-3" />
                ) : isStarted ? (
                  <div className="relative">
                    <PlayIcon weight="duotone" className="size-4 fill-current" />
                    <span className="absolute inset-0 size-4 bg-primary animate-ping rounded-full opacity-20" />
                  </div>
                ) : (
                  <span className="text-[10px] font-bold">{label}</span>
                )}
                
                {isToday && (
                  <span className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-background" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                isToday ? "text-primary" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between bg-foreground rounded-2xl p-4 mt-2 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-background">
          <FireIcon weight="duotone" size={60} />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <FireIcon weight="duotone" className="size-7 text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Ofensiva Atual
            </p>
            <p className="text-2xl font-black text-background leading-none">
              {finalStreak} {finalStreak === 1 ? 'Dia' : 'Dias'}
            </p>
          </div>
        </div>

        <div className="relative z-10 text-right">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
            Meta
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 w-4 rounded-full",
                  i <= (finalStreak % 5 || 5) ? "bg-primary" : "bg-muted/20"
                )} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
