import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("relative z-10 max-w-350 mx-auto p-6 sm:p-10 lg:p-16 pb-32 lg:pb-16 space-y-12", className)}>
      {children}
    </div>
  );
}
