"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkoutDayHeaderProps {
  title: string;
}

export function WorkoutDayHeader({ title }: WorkoutDayHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between py-6 px-5 sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b border-border/50 lg:hidden">
      <button 
        onClick={() => router.back()}
        className="size-10 flex items-center justify-center rounded-xl bg-card border border-border hover:bg-accent transition-colors"
      >
        <ChevronLeft className="size-6 text-foreground" />
      </button>
      <h1 className="font-syne text-lg font-black uppercase italic tracking-tighter text-foreground">
        {title}
      </h1>
      <div className="size-10" />
    </div>
  );
}
