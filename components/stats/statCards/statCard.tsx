import { Icon } from "@phosphor-icons/react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: Icon;
  subValue?: string;
}

export function StatCard({ label, value, icon: Icon, subValue }: StatCardProps) {
  return (
    <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 flex flex-col items-center text-center gap-6 group hover:bg-primary/10 transition-colors">
      <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon weight="duotone" className="size-6 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="font-syne text-3xl font-black text-foreground uppercase italic tracking-tighter">
          {value}
        </p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        {subValue && (
          <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-2">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
