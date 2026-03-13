import {
  getHomeData,
  getMeProfile,
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { BottomNav } from "@/components/bottomNav";
import { PremiumSidebar } from "@/components/premiumSidebar";
import { Header } from "@/components/header";
import BackgroundImages from "@/components/common/backgroundImages";
import { Chat } from "@/components/chatbot/chatInterface";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await authClient.getSession({
      fetchOptions: { headers: await headers() },
    });

    if (!session.data?.user) {
      redirect("/auth");
    }

    const today = dayjs();
    const [homeResponse, meResponse] = await Promise.all([
      getHomeData(today.format("YYYY-MM-DD")),
      getMeProfile()
    ]);

    if ((meResponse as any).status === 403 && (meResponse.data as any)?.code === "USER_BANNED") {
      redirect("/suspended");
    }

    if (homeResponse.status !== 200 || meResponse.status !== 200) {
      throw new Error("API_ERROR");
    }

    const homeData = homeResponse.data;
    const userData = (meResponse.data as any).data;

    return (
      <div className="relative min-h-screen flex flex-col lg:flex-row overflow-x-hidden selection:bg-primary/20 selection:text-primary transition-colors duration-500 w-full max-w-440 mx-auto">
        <BackgroundImages />
        <BottomNav />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header homeData={homeData} userData={userData} />
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </main>
        </div>

        <PremiumSidebar
          homeData={homeData}
          userData={userData}
        />

        <Chat />
      </div>
    );
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    
    if (error.message?.includes("Dynamic server usage") || error.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }

    console.error("DashboardLayout Critical Error:", error);
    throw error;
  }
}