import { GetHomeData200, GetMe200 } from "@/lib/api/fetch-generated";
import { SidebarContent } from "./premiumSidebar/sidebarContent";

interface PremiumSidebarProps {
  homeData: GetHomeData200;
  userData: GetMe200;
}

export function PremiumSidebar({ homeData, userData }: PremiumSidebarProps) {
  return (
    <aside className="hidden 2xl:flex w-120 xl:w-130 bg-card border-l border-border flex-col h-screen overflow-y-auto custom-scrollbar sticky top-0">
      <SidebarContent homeData={homeData} userData={userData} />
    </aside>
  );
}
