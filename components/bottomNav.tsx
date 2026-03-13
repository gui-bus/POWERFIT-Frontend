"use client";

import Link from "next/link";
import {
  HouseIcon,
  CalendarIcon,
  ChartBarIcon,
  UserIcon,
  SparkleIcon,
  TrophyIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQueryState, parseAsBoolean } from "nuqs";
import { useActiveWorkoutPlanId } from "@/hooks/use-active-workout-plan-id";

export function BottomNav() {
  const pathname = usePathname();
  const activePlanId = useActiveWorkoutPlanId();

  const [, setIsOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );

  const isWorkoutDayActive = pathname.includes("/workout-plans/");
  const planOverviewLink = activePlanId ? `/workout-plans/${activePlanId}` : null;

  const navItems = [
    { icon: HouseIcon, href: "/", active: pathname === "/" },
    {
      icon: CalendarIcon,
      href: planOverviewLink || "#",
      active: isWorkoutDayActive,
    },
    { icon: UsersIcon, href: "/feed", active: pathname === "/feed" },
    { icon: TrophyIcon, href: "/ranking", active: pathname === "/ranking" },
    { icon: ChartBarIcon, href: "/stats", active: pathname === "/stats" },
    { icon: UserIcon, href: "/profile", active: pathname === "/profile" },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card backdrop-blur-xl border-t border-border px-4 py-4 flex items-center justify-between rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 3).map((item, i) => (
          <Link key={i} href={item.href} className="p-2">
            <item.icon
              weight="duotone"
              className={cn(
                "size-5 transition-all",
                item.active
                  ? "text-primary scale-110"
                  : "text-muted-foreground",
              )}
            />
          </Link>
        ))}

        <div className="relative -mt-10">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary p-3.5 rounded-full border-4 border-background shadow-2xl shadow-primary/40 transition-transform active:scale-95 text-primary-foreground"
          >
            <SparkleIcon weight="duotone" className="size-5" />
          </button>
        </div>

        {navItems.slice(3).map((item, i) => (
          <Link key={i + 3} href={item.href} className="p-2">
            <item.icon
              weight="duotone"
              className={cn(
                "size-5 transition-all",
                item.active
                  ? "text-primary scale-110"
                  : "text-muted-foreground",
              )}
            />
          </Link>
        ))}
      </nav>

      <nav className="hidden lg:flex sticky left-0 top-0 h-screen w-20 bg-card backdrop-blur-xl border-r border-border flex-col items-center py-8 z-50 transition-all duration-300">
        <Link
          href="/"
          className="font-syne text-2xl font-black italic text-primary mb-10 tracking-tighter hover:scale-110 transition-transform"
        >
          P.
        </Link>

        <div className="flex flex-col gap-4 flex-1">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={cn(
                "p-3.5 rounded-2xl transition-all duration-300 group relative flex items-center justify-center",
                item.active
                  ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5",
              )}
            >
              <item.icon weight="duotone" className="size-5 stroke-[2.5]" />
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
