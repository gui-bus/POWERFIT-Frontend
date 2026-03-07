"use client";

import Image from "next/image";
import { UserNav } from "./userNav";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  user?: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function PageHeader({ title, subtitle, user }: PageHeaderProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita erro de hidratação garantindo que o componente só renderize o logo após o mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "light" 
    ? "/images/powerfit-logo-dark.svg" 
    : "/images/powerfit-logo.svg";

  return (
    <div className="flex items-center justify-between w-full">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="h-5 flex items-center">
            {mounted ? (
              <Image
                src={logoSrc}
                alt="PowerFit"
                width={140}
                height={16}
                className="h-5 w-auto"
                priority
              />
            ) : (
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            )}
          </div>
          <h1 className="font-anton text-3xl text-primary italic uppercase tracking-widest leading-none">
            {title}
          </h1>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] pl-1">
          {subtitle}
        </p>
      </div>

      {user && (
        <div className="flex items-center">
          <UserNav user={user} />
        </div>
      )}
    </div>
  );
}
