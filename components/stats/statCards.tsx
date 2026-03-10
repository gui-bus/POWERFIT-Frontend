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

  const getVolumeComparison = (grams: number) => {
    const kg = grams / 1000;
    if (kg >= 5000) return `≈ ${(kg / 5000).toFixed(1)} Elefantes`;
    if (kg >= 1200) return `≈ ${(kg / 1200).toFixed(1)} Carros`;
    if (kg >= 500) return `≈ ${(kg / 20).toFixed(0)} Sacos de Cimento`;
    if (kg >= 100) return `≈ ${(kg / 5).toFixed(0)} Galões de Água`;
    return "Rumo ao topo! 🚀";
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
      subValue: getVolumeComparison(totalVolumeInGrams)
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
          className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 flex flex-col items-center text-center gap-6 group hover:bg-primary/10 transition-colors"
        >
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <stat.icon weight="duotone" className="size-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-syne text-3xl font-black text-foreground uppercase italic tracking-tighter">
              {stat.value}
            </p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </p>
            {"subValue" in stat && (
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-2 animate-pulse">
                {stat.subValue}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
