"use client";

import Link from "next/link";
import { House, Calendar, ChartNoAxesColumn, UserRound, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/authClient";
import { useEffect, useState } from "react";
import { getHomeData } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import { UserNav } from "@/components/userNav";
import { useQueryState, parseAsBoolean } from "nuqs";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  
  const [, setIsOpen] = useQueryState("chat_open", parseAsBoolean.withDefault(false));
  
  const [planOverviewLink, setPlanOverviewLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await getHomeData(dayjs().format("YYYY-MM-DD"));
        if (response.status === 200 && response.data.activeWorkoutPlanId) {
          setPlanOverviewLink(`/workout-plans/${response.data.activeWorkoutPlanId}`);
        }
      } catch (error) {
        console.error("Failed to fetch home data for nav link", error);
      }
    };

    fetchHomeData();
  }, []);

  const isWorkoutDayActive = pathname.includes("/workout-plans/");

  const navItems = [
    { icon: House, href: "/", active: pathname === "/" },
    { 
      icon: Calendar, 
      href: planOverviewLink || "#", 
      active: isWorkoutDayActive 
    },
    { icon: ChartNoAxesColumn, href: "/stats", active: pathname === "/stats" },
    { icon: UserRound, href: "/profile", active: pathname === "/profile" },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border px-6 py-4 flex items-center justify-between rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 2).map((item, i) => (
          <Link key={i} href={item.href} className="p-3">
            <item.icon className={cn("size-6 transition-all", item.active ? "text-primary scale-110" : "text-muted-foreground")} />
          </Link>
        ))}

        <div className="relative -mt-14">
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-primary p-5 rounded-full border-8 border-background shadow-2xl shadow-primary/40 transition-transform active:scale-95 text-primary-foreground"
          >
            <Sparkles className="size-6" />
          </button>
        </div>

        {navItems.slice(2).map((item, i) => (
          <Link key={i + 2} href={item.href} className="p-3">
            <item.icon className={cn("size-6 transition-all", item.active ? "text-primary scale-110" : "text-muted-foreground")} />
          </Link>
        ))}
      </nav>

      <nav className="hidden lg:flex sticky left-0 top-0 h-screen w-20 bg-card/50 backdrop-blur-xl border-r border-border flex-col items-center py-8 z-50 transition-all duration-300">
        <Link href="/" className="font-syne text-2xl font-black italic text-primary mb-10 tracking-tighter hover:scale-110 transition-transform">
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
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <item.icon className="size-5 stroke-[2.5]" />
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-6 items-center mb-2">
          {session?.user && (
            <div className="hover:scale-105 transition-transform">
              <UserNav user={session.user} />
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
