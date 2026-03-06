import {
  getHomeData,
  getHomeDataResponseSuccess,
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { BottomNav } from "@/components/bottomNav";
import { PremiumSidebar } from "@/components/premiumSidebar";
import BackgroundImages from "@/components/common/backgroundImages";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const homeResponse = await getHomeData(today.format("YYYY-MM-DD"));

  if (homeResponse.status !== 200) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do dashboard.
        </p>
      </div>
    );
  }

  const homeData = homeResponse.data;

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-x-hidden selection:bg-primary/20 selection:text-primary transition-colors duration-500 w-full max-w-440 mx-auto">
      <BackgroundImages />
      <BottomNav />

      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        {children}
      </main>

      <PremiumSidebar
        user={{
          name: session.data.user.name,
          email: session.data.user.email,
          image: session.data.user.image,
        }}
        homeData={homeData}
      />
    </div>
  );
}
