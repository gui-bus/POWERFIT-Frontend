import { CheckCircleIcon, PercentIcon, HourglassIcon, BarbellIcon } from "@phosphor-icons/react/ssr";
import { formatTime, formatVolume, getVolumeComparison } from "@/lib/utils/stats";
import { StatCard } from "./statCards/statCard";

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
        <StatCard
          key={i}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          subValue={"subValue" in stat ? stat.subValue : undefined}
        />
      ))}
    </div>
  );
}
