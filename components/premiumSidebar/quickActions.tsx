import Link from "next/link";
import { TrophyIcon, UsersIcon, StarIcon, SwordIcon } from "@phosphor-icons/react/ssr";

export function QuickActions() {
  const actions = [
    { href: "/ranking", icon: TrophyIcon, label: "Ranking" },
    { href: "/friends", icon: UsersIcon, label: "Amigos" },
    { href: "/achievements", icon: StarIcon, label: "Conquistas" },
    { href: "/challenges", icon: SwordIcon, label: "Desafios" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <button className="w-full bg-background dark:bg-zinc-800 border border-border hover:border-primary/30 rounded-3xl p-4 text-center transition-all hover:shadow-xl group cursor-pointer">
            <action.icon weight="duotone" className="size-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-[9px] font-black uppercase italic tracking-widest text-foreground">{action.label}</p>
          </button>
        </Link>
      ))}
    </div>
  );
}
