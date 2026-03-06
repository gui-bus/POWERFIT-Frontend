"use client";

import { authClient } from "@/lib/authClient";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, Moon, Sun, Calendar } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getHomeData } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

interface UserNavProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [todayWorkoutLink, setTodayWorkoutLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await getHomeData(dayjs().format("YYYY-MM-DD"));
        if (!("error" in response) && response.data.activeWorkoutPlanId && response.data.todayWorkoutDay) {
          setTodayWorkoutLink(`/workout-plans/${response.data.activeWorkoutPlanId}/days/${response.data.todayWorkoutDay.id}`);
        }
      } catch (error) {
        console.error("Failed to fetch home data for user nav", error);
      }
    };

    fetchHomeData();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  const isWorkoutDayActive = pathname.includes("/workout-plans/");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-2xl p-0 bg-primary/10 hover:bg-primary/20 transition-all border-2 border-primary/20">
          <Avatar className="h-full w-full rounded-[14px] p-1">
            <AvatarImage src={user.image || ""} alt={user.name} className="rounded-xl object-cover border-2 border-background" />
            <AvatarFallback className="rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase">
              {user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mt-2 rounded-[1.5rem] p-3 border-border bg-card shadow-2xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black leading-none uppercase italic tracking-tight text-foreground">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem 
            className={cn(
              "rounded-xl p-3 focus:bg-primary focus:text-primary-foreground group cursor-pointer",
              isWorkoutDayActive && "bg-primary/5 text-primary"
            )}
            onClick={() => todayWorkoutLink && router.push(todayWorkoutLink)}
          >
            <Calendar className="mr-3 h-4 w-4 stroke-[2.5]" />
            <span className="font-bold text-xs uppercase tracking-wider">Treino de Hoje</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl p-3 focus:bg-primary focus:text-primary-foreground group cursor-pointer">
            <User className="mr-3 h-4 w-4 stroke-[2.5]" />
            <span className="font-bold text-xs uppercase tracking-wider">Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl p-3 focus:bg-primary focus:text-primary-foreground group cursor-pointer">
            <Settings className="mr-3 h-4 w-4 stroke-[2.5]" />
            <span className="font-bold text-xs uppercase tracking-wider">Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem 
            className="rounded-xl p-3 focus:bg-primary focus:text-primary-foreground group cursor-pointer flex items-center justify-between"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <div className="flex items-center">
              {theme === "dark" ? (
                <Sun className="mr-3 h-4 w-4 stroke-[2.5]" />
              ) : (
                <Moon className="mr-3 h-4 w-4 stroke-[2.5]" />
              )}
              <span className="font-bold text-xs uppercase tracking-wider">Alternar Tema</span>
            </div>
            <div className="text-[10px] font-black opacity-50 uppercase">{theme === "dark" ? "Claro" : "Escuro"}</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          className="rounded-xl p-3 text-destructive focus:bg-destructive focus:text-destructive-foreground font-bold text-xs uppercase tracking-wider cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4 stroke-[2.5]" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
