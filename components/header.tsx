"use client";

import { ListIcon } from "@phosphor-icons/react";
import { UserNav } from "@/components/userNav";
import { NotificationCenter } from "@/components/notificationCenter";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "@/components/premiumSidebar/sidebarContent";
import { GetHomeData200, GetMe200 } from "@/lib/api/fetch-generated";
import Link from "next/link";

interface HeaderProps {
  homeData: GetHomeData200;
  userData: GetMe200;
}

export function Header({ homeData, userData }: HeaderProps) {
  return (
    <header className="2xl:hidden sticky top-0 z-40 w-full bg-card backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between mb-5">
      <Link
        href="/"
        className="font-syne text-2xl font-black italic text-primary tracking-tighter hover:scale-105 transition-transform"
      >
        P.
      </Link>

      <div className="flex items-center gap-2">
        <NotificationCenter />
        
        <UserNav 
          user={{
            name: userData.name,
            email: userData.email,
            image: userData.image,
          }} 
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-12 rounded-2xl hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary cursor-pointer"
            >
              <ListIcon weight="duotone" className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 border-l border-border overflow-y-auto custom-scrollbar bg-card">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent homeData={homeData} userData={userData} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
