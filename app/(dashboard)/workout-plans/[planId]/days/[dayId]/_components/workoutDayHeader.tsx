import Image from "next/image";
import { CalendarIcon, TimerIcon, BarbellIcon } from "@phosphor-icons/react/ssr";
import { SessionAction } from "@/components/workoutDay/sessionAction";
import { WEEKDAY_TRANSLATIONS } from "@/lib/utils/date";

interface WorkoutDayHeaderProps {
  workoutDay: any;
  planId: string;
  dayId: string;
  activeSessionId?: string;
  isCompleted: boolean;
}

export function WorkoutDayHeader({
  workoutDay,
  planId,
  dayId,
  activeSessionId,
  isCompleted,
}: WorkoutDayHeaderProps) {
  return (
    <section className="group relative aspect-8/10 sm:aspect-21/9 lg:h-85 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
      <Image
        src={workoutDay.coverImageUrl || "/images/login-bg.png"}
        alt={workoutDay.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        priority
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent opacity-60" />
      
      <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 lg:p-14">
        <div className="flex justify-between items-start">
          <div className="group/badge flex items-center gap-2 bg-black/20 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full transition-all hover:bg-white/10">
            <div className="relative">
              <CalendarIcon weight="duotone" className="size-3.5 text-primary animate-pulse" />
              <div className="absolute inset-0 blur-sm bg-primary/40 size-3.5" />
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em]">
              {WEEKDAY_TRANSLATIONS[workoutDay.weekDay as keyof typeof WEEKDAY_TRANSLATIONS]}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-primary/60" />
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                  Sessão Atual
                </p>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-[0.9] drop-shadow-2xl">
                {workoutDay.name}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {[
                {
                  icon: TimerIcon,
                  text: `${Math.round(workoutDay.estimatedDurationInSeconds / 60)}m Estimados`,
                },
                {
                  icon: BarbellIcon,
                  text: `${workoutDay.exercises.length} Exercícios`,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 hover:border-white/30 transition-colors"
                >
                  <item.icon weight="duotone" className="size-4 text-primary" />
                  <span className="text-[11px] font-semibold text-zinc-100 uppercase tracking-wide">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-fit min-w-65 relative group/btn">
            <SessionAction
              planId={planId}
              dayId={dayId}
              activeSessionId={activeSessionId}
              isCompleted={isCompleted}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
