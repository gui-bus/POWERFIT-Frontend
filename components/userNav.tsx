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
import { SignOutIcon, UserIcon, MoonIcon, SunIcon, CalendarIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useThemeTransition } from "@/lib/hooks/useThemeTransition";
import { useActiveWorkoutPlanId } from "@/hooks/use-active-workout-plan-id";

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
  const { theme, toggleTheme } = useThemeTransition();
  const activePlanId = useActiveWorkoutPlanId();

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
  const planOverviewLink = activePlanId ? `/workout-plans/${activePlanId}` : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-auto rounded-full px-3 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-all">
          <Avatar className="h-10 w-10 rounded-full p-0.5">
            <AvatarImage src={user.image || ""} alt={user.name} className="rounded-full object-cover" />
            <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase">
              {user.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left sm:flex">
            <p className="text-[11px] font-black leading-none uppercase italic tracking-tight text-foreground">{user.name}</p>
            <p className="text-[9px] font-bold leading-none text-muted-foreground uppercase tracking-widest mt-1">
              {user.email.length > 20 ? `${user.email.substring(0, 20)}...` : user.email}
            </p>
          </div>
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
            onClick={() => planOverviewLink && router.push(planOverviewLink)}
            disabled={!planOverviewLink}
          >
            <CalendarIcon weight="duotone" className="mr-3 h-4 w-4 stroke-[2.5] focus:text-white" />
            <span className="font-bold text-xs uppercase tracking-wider">Plano de Treino</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="rounded-xl p-3 focus:bg-primary focus:text-primary-foreground group cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <UserIcon weight="duotone" className="mr-3 h-4 w-4 stroke-[2.5] focus:text-white" />
            <span className="font-bold text-xs uppercase tracking-wider">Perfil</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem 
            className="rounded-xl p-3 focus:bg-primary focus:text-primary-foreground group cursor-pointer flex items-center justify-between"
            onClick={toggleTheme}
          >
            <div className="flex items-center">
              {theme === "dark" ? (
                <SunIcon weight="duotone" className="mr-3 h-4 w-4 stroke-[2.5] focus:text-white" />
              ) : (
                <MoonIcon weight="duotone" className="mr-3 h-4 w-4 stroke-[2.5] focus:text-white" />
              )}
              <span className="font-bold text-xs uppercase tracking-wider">Alternar Tema</span>
            </div>
            <div className="text-[10px] font-black opacity-50 uppercase">{theme === "dark" ? "Claro" : "Escuro"}</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem 
          className="rounded-xl p-3 text-destructive focus:bg-destructive focus:text-destructive-foreground focus:text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
          onClick={handleLogout}
        >
          <SignOutIcon weight="duotone" className="mr-3 h-4 w-4 stroke-[2.5] focus:text-white" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
