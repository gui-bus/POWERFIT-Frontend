import { getHomeData } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import dayjs from "dayjs";
import { ConsistencyGrid } from "@/components/consistencyGrid";
import { PageHeader } from "@/components/pageHeader";
import { Container } from "@/components/common/container";
import { HomeBanner } from "./_components/home/homeBanner";
import { HomeWorkoutSection } from "./_components/home/homeWorkoutSection";
import { HomeNoPlanView } from "./_components/home/homeNoPlanView";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const dateStr = today.format("YYYY-MM-DD");
  const homeResponse = await getHomeData(dateStr);

  if (homeResponse.status !== 200) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <div className="max-w-xs space-y-4">
          <div className="size-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <p className="text-2xl font-bold">!</p>
          </div>
          <p className="text-muted-foreground font-medium">
            Erro ao carregar dados. Verifique sua conexão.
          </p>
        </div>
      </div>
    );
  }

  const homeData = homeResponse.data;
  const hasPlan = !!homeData.activeWorkoutPlanId;
  const todayWorkout = homeData.todayWorkoutDay;
  const isCompleted = homeData.consistencyByDay[dateStr]?.workoutDayCompleted || false;

  return (
    <Container>
      <header className="flex items-center justify-between">
        <PageHeader 
          title="DASHBOARD" 
          subtitle={`Bem-vindo de volta, ${session.data.user.name.split(" ")[0]}!`} 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <div className="lg:pt-0">
        <HomeBanner 
          hasPlan={hasPlan} 
          activeWorkoutPlanId={homeData.activeWorkoutPlanId || null}
          todayWorkoutId={todayWorkout?.id || null}
        />
      </div>

      <div className="mt-12 space-y-12">
        {hasPlan ? (
          <HomeWorkoutSection 
            todayWorkout={todayWorkout}
            activeWorkoutPlanId={homeData.activeWorkoutPlanId || null}
            isCompleted={isCompleted}
          />
        ) : (
          <HomeNoPlanView />
        )}

        <div className="lg:hidden px-5 pb-10">
          <ConsistencyGrid
            consistencyByDay={homeData.consistencyByDay}
            streak={homeData.workoutStreak}
          />
        </div>
      </div>
    </Container>
  );
}
