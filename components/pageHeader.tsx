"use client";

import Image from "next/image";
import { UserNav } from "./userNav";
import { NotificationCenter } from "./notificationCenter";

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
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="h-5 flex items-center relative">
            <Image
              src="/images/powerfit-logo-dark.svg"
              alt="PowerFit"
              width={140}
              height={16}
              className="h-5 w-auto block dark:hidden"
              priority
            />
            <Image
              src="/images/powerfit-logo.svg"
              alt="PowerFit"
              width={140}
              height={16}
              className="h-5 w-auto hidden dark:block"
              priority
            />
          </div>
          <h1 className="font-anton text-3xl text-primary italic uppercase tracking-widest leading-none">
            {title}
          </h1>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] pl-1">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-4 lg:mt-0">
        <NotificationCenter />
        {user && (
          <div className="flex items-center">
            <UserNav user={user} />
          </div>
        )}
      </div>
    </div>
  );
}
