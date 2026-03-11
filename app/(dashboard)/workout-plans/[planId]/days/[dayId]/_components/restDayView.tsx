import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { CoffeeIcon, LightningIcon, MoonIcon, DropIcon } from "@phosphor-icons/react/ssr";
import { SessionAction } from "@/components/workoutDay/sessionAction";
import { cn } from "@/lib/utils";
import { WEEKDAY_TRANSLATIONS } from "@/lib/utils/date";

interface RestDayViewProps {
  workoutDay: any;
  user: any;
  planId: string;
  dayId: string;
  activeSessionId?: string;
  isCompleted: boolean;
}

export function RestDayView({
  workoutDay,
  user,
  planId,
  dayId,
  activeSessionId,
  isCompleted,
}: RestDayViewProps) {
  return (
    <div className="relative min-h-full flex flex-col overflow-hidden selection:bg-primary/20 selection:text-primary">
      <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <Container className="max-w-250 flex-1 flex flex-col">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <PageHeader 
            title="RECOVERY" 
            subtitle={WEEKDAY_TRANSLATIONS[workoutDay.weekDay as keyof typeof WEEKDAY_TRANSLATIONS]} 
            user={user}
          />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 py-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl animate-pulse" />
            <div className="relative size-32 sm:size-40 rounded-[3rem] bg-card border border-border shadow-2xl flex items-center justify-center group transition-transform duration-700 hover:scale-110">
              <CoffeeIcon weight="duotone" className="size-16 sm:size-20 text-primary stroke-[1.5]" />
              <div className="absolute -top-2 -right-2 size-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <LightningIcon weight="duotone" className="size-4 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">
            <h2 className="font-syne text-3xl sm:text-5xl font-black text-foreground uppercase italic leading-none tracking-tighter text-balance px-4">
              REGENERAÇÃO <br />{" "}
              <span className="text-primary">ESTRATÉGICA</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-lg mx-auto">
              Seu corpo constrói músculos durante o descanso. Honre este
              momento com a mesma intensidade que honra seu treino.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl px-4">
            {[
              {
                icon: MoonIcon,
                title: "Sono",
                val: "7-9h",
                color: "text-indigo-400",
              },
              {
                icon: DropIcon,
                title: "Água",
                val: "3.5L",
                color: "text-blue-400",
              },
              {
                icon: CoffeeIcon,
                title: "Nutrição",
                val: "Limpa",
                color: "text-orange-400",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-[2rem] flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
              >
                <item.icon weight="duotone" className={cn("size-6 mb-1", item.color)} />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {item.title}
                </span>
                <span className="text-sm font-bold uppercase italic">
                  {item.val}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-[320px] pt-4 px-4">
            <SessionAction
              planId={planId}
              dayId={dayId}
              activeSessionId={activeSessionId}
              isCompleted={isCompleted}
            />
            <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Marque para validar sua disciplina
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
