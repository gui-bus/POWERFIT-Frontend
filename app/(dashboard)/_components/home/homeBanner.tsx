import Image from "next/image";
import Link from "next/link";

interface HomeBannerProps {
  hasPlan: boolean;
  activeWorkoutPlanId: string | null;
  todayWorkoutId: string | null;
}

export function HomeBanner({ hasPlan, activeWorkoutPlanId, todayWorkoutId }: HomeBannerProps) {
  const actionLink = hasPlan
    ? todayWorkoutId
      ? `/workout-plans/${activeWorkoutPlanId}/days/${todayWorkoutId}`
      : `/workout-plans/${activeWorkoutPlanId}`
    : "?chat_open=true&chat_initial_message=Monte meu plano de treino";

  return (
    <section className="relative aspect-16/10 sm:aspect-21/9 lg:h-105 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl border border-border">
      <Image
        src="/images/login-bg.png"
        alt="Banner"
        fill
        className="object-cover scale-105"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent opacity-60" />

      <div className="absolute inset-0 flex flex-col justify-end lg:justify-between p-6 sm:p-10 lg:p-16">
        <div className="hidden lg:block">
          <Image
            src="/images/powerfit-logo.svg"
            alt="PowerFit Logo"
            width={120}
            height={14}
            className="h-auto"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
          <div className="space-y-2 lg:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary-foreground px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg shadow-primary/20">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary-foreground"></span>
              </span>
              Meta Semanal
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] drop-shadow-2xl">
              {hasPlan ? (
                <>
                  FOCO <br className="hidden lg:block" />
                  <span className="text-primary">TOTAL</span>.
                </>
              ) : (
                <>
                  CRIE SEU <br className="hidden lg:block" />
                  <span className="text-primary">PLANO</span>.
                </>
              )}
            </h2>
          </div>

          <Link
            href={actionLink}
            className="group bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 lg:px-10 lg:py-5 rounded-2xl sm:rounded-[2rem] text-[10px] sm:text-sm lg:text-base font-black uppercase italic transition-all shadow-2xl active:scale-95 flex items-center gap-3 sm:gap-4 w-full md:w-fit"
          >
            {hasPlan ? "Iniciar Treino de hoje" : "Montar Plano"}
          </Link>
        </div>
      </div>
    </section>
  );
}
