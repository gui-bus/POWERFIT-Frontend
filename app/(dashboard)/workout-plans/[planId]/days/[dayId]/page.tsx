import {
  getWorkoutDayById,
} from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/authClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/common/container";
import { PageHeader } from "@/components/pageHeader";
import { WEEKDAY_TRANSLATIONS } from "@/lib/utils/date";
import { RestDayView } from "./_components/restDayView";
import { WorkoutDayHeader } from "./_components/workoutDayHeader";
import { ExerciseSection } from "./_components/exerciseSection";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    planId: string;
    dayId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { planId, dayId } = await params;
  const response = await getWorkoutDayById(planId, dayId);

  if (response.status !== 200) {
    return { title: "Dia de Treino" };
  }

  const day = response.data;
  const dayName = WEEKDAY_TRANSLATIONS[day.weekDay as keyof typeof WEEKDAY_TRANSLATIONS] || "Dia de Treino";
  return { title: `${dayName} | Dia de Treino` };
}

export default async function WorkoutDayPage({ params }: PageProps) {
  const { planId, dayId } = await params;

  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const response = await getWorkoutDayById(planId, dayId);

  if (response.status !== 200) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center bg-background">
        <p className="text-muted-foreground font-medium text-lg italic uppercase tracking-tighter">
          Erro ao carregar dados do treino.
        </p>
      </div>
    );
  }

  const workoutDay = response.data;

  const activeSession = workoutDay.sessions.find((s) => !s.completedAt);
  const isCompleted = workoutDay.sessions.some((s) => !!s.completedAt);

  if (workoutDay.isRestDay) {
    return (
      <RestDayView
        workoutDay={workoutDay}
        user={session.data.user}
        planId={planId}
        dayId={dayId}
        activeSessionId={activeSession?.id}
        isCompleted={isCompleted}
      />
    );
  }

  return (
    <Container>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <PageHeader 
          title="WORKOUT" 
          subtitle={WEEKDAY_TRANSLATIONS[workoutDay.weekDay as keyof typeof WEEKDAY_TRANSLATIONS]} 
          user={{
            name: session.data.user.name,
            email: session.data.user.email,
            image: session.data.user.image,
          }}
        />
      </header>

      <div className="lg:pt-10 pt-4">
        <WorkoutDayHeader
          workoutDay={workoutDay}
          planId={planId}
          dayId={dayId}
          activeSessionId={activeSession?.id}
          isCompleted={isCompleted}
        />
      </div>

      <ExerciseSection
        exercises={workoutDay.exercises}
        activeSession={activeSession}
      />
    </Container>
  );
}
