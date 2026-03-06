"use client";

import Link from "next/link";
import { House, Calendar, Sparkles, ChartNoAxesColumn, UserRound, LogOut, Settings } from "lucide-react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/authClient";
import { useEffect, useState } from "react";
import { getHomeData } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  
  const [todayWorkoutLink, setTodayWorkoutLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await getHomeData(dayjs().format("YYYY-MM-DD"));
        if (!("error" in response) && response.data.activeWorkoutPlanId && response.data.todayWorkoutDay) {
          setTodayWorkoutLink(`/workout-plans/${response.data.activeWorkoutPlanId}/days/${response.data.todayWorkoutDay.id}`);
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
      href: todayWorkoutLink || "#", 
      active: isWorkoutDayActive 
    },
    { icon: ChartNoAxesColumn, href: "/stats", active: pathname === "/stats" },
    { icon: UserRound, href: "#" },
  ];

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border px-6 py-4 flex items-center justify-between rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          if (i === 2) return (
            <div key="special" className="relative -mt-14">
              <button className="bg-primary p-5 rounded-full border-[8px] border-background shadow-2xl shadow-primary/40 transition-transform active:scale-95 text-primary-foreground">
                <Sparkles className="size-6" />
              </button>
            </div>
          );
          
          return (
            <Link key={i} href={item.href} className="p-3">
              <Icon className={cn("size-6 transition-all", item.active ? "text-primary scale-110" : "text-muted-foreground")} />
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 xl:w-28 bg-card border-r border-border flex-col items-center py-10 z-50">
        <Link href="/" className="font-syne text-3xl font-black italic text-primary mb-12 tracking-tighter hover:scale-110 transition-transform">
          P.
        </Link>

        <div className="flex flex-col gap-6 flex-1">
          {navItems.map((item, i) => (
            <Link 
              key={i}
              href={item.href} 
              className={cn(
                "p-4 rounded-2xl transition-all duration-300 group relative flex items-center justify-center",
                item.active 
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              )}
            >
              <item.icon className="size-6 stroke-[2.5]" />
              {item.active && (
                <span className="absolute -left-10 w-2 h-10 bg-primary rounded-r-full shadow-[4px_0_12px_rgba(var(--primary),0.4)]" />
              )}
            </Link>
          ))}
          
          <button className="mt-4 p-4 rounded-2xl text-muted-foreground hover:text-primary hover:bg-accent transition-all">
            <Settings className="size-6 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex flex-col gap-8 items-center mb-4">
          <button className="bg-primary p-5 rounded-3xl shadow-2xl hover:opacity-90 transition-all active:scale-95 group relative text-primary-foreground">
            <Sparkles className="size-7 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 size-4 bg-background rounded-full border-4 border-primary" />
          </button>
          
          <div className="h-px w-8 bg-border" />
          
          <button 
            onClick={handleLogout}
            className="p-4 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          >
            <LogOut className="size-6" />
          </button>
        </div>
      </nav>
    </>
  );
}
