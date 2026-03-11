import { GetBodyProgressHistory200Item } from "@/lib/api/fetch-generated";
import { cn } from "@/lib/utils";
import { CalendarIcon, TrendUpIcon, TrendDownIcon } from "@phosphor-icons/react";
import dayjs from "dayjs";

interface BodyProgressCardProps {
  entry: GetBodyProgressHistory200Item;
  weightDiff: number;
}

export function BodyProgressCard({ entry, weightDiff }: BodyProgressCardProps) {
  return (
    <div className="bg-card border border-border rounded-[2rem] p-6 hover:border-primary/30 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon weight="duotone" className="size-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {dayjs(entry.loggedAt).format("DD MMM, YYYY")}
          </span>
        </div>
        {weightDiff !== 0 && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter",
              weightDiff > 0
                ? "bg-red-500/10 text-red-500"
                : "bg-green-500/10 text-green-500",
            )}
          >
            {weightDiff > 0 ? (
              <TrendUpIcon weight="bold" />
            ) : (
              <TrendDownIcon weight="bold" />
            )}
            {Math.abs(weightDiff).toFixed(1)}kg
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            Peso
          </p>
          <p className="text-xl font-anton italic text-foreground leading-none">
            {entry.weightInGrams / 1000}kg
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            BF
          </p>
          <p className="text-xl font-anton italic text-foreground leading-none">
            {(entry.bodyFatPercentage * 100).toFixed(1)}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            Altura
          </p>
          <p className="text-xl font-anton italic text-foreground leading-none">
            {entry.heightInCentimeters}cm
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            Idade
          </p>
          <p className="text-xl font-anton italic text-foreground leading-none">
            {entry.age} anos
          </p>
        </div>
      </div>
    </div>
  );
}
