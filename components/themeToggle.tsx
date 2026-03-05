"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col gap-4 bg-muted/50 p-1.5 rounded-2xl border border-border">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-2.5 rounded-xl transition-all",
          theme === "light" 
            ? "bg-background text-primary shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="size-5 stroke-[2.5]" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-2.5 rounded-xl transition-all",
          theme === "dark" 
            ? "bg-background text-primary shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="size-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
