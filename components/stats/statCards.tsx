import { CheckCircleIcon, PercentIcon, HourglassIcon, BarbellIcon } from "@phosphor-icons/react/ssr";

interface StatCardsProps {
  completedWorkoutsCount: number;
  completedRestDays: number;
  conclusionRate: number;
  totalTimeInSeconds: number;
  totalVolumeInGrams: number;
}

export function StatCards({ 
  completedWorkoutsCount, 
  completedRestDays,
  conclusionRate, 
  totalTimeInSeconds,
  totalVolumeInGrams
}: StatCardsProps) {
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}h${minutes}m`;
  };

  const formatVolume = (grams: number) => {
    const kg = grams / 1000;
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)}t`;
    }
    return `${Math.round(kg)}kg`;
  };

  const stats = [
    {
      label: "Treinos Feitos",
      value: completedWorkoutsCount,
      icon: CheckCircleIcon,
    },
    {
      label: "Descansos Feitos",
      value: completedRestDays,
      icon: CheckCircleIcon,
    },
    {
      label: "Volume Total",
      value: formatVolume(totalVolumeInGrams),
      icon: BarbellIcon,
    },
    {
      label: "Taxa de conclusão",
      value: `${Math.round(conclusionRate * 100)}%`,
      icon: PercentIcon,
    },
    {
      label: "Tempo Total",
      value: formatTime(totalTimeInSeconds),
      icon: HourglassIcon,
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 flex flex-col items-center text-center gap-6"
        >
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <stat.icon weight="duotone" className="size-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-syne text-3xl font-black text-foreground uppercase italic tracking-tighter">
              {stat.value}
            </p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
