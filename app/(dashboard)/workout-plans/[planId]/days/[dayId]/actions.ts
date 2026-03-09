"use server";

import { startWorkoutSession, completeWorkoutSession, CompleteWorkoutSessionBody } from "@/lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

export async function startWorkoutAction(planId: string, dayId: string) {
  const response = await startWorkoutSession(planId, dayId);
  
  if (!("error" in response)) {
    revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
    revalidatePath("/");
  }
  
  return response;
}

export async function completeWorkoutAction(
  planId: string, 
  dayId: string, 
  sessionId: string,
  body: CompleteWorkoutSessionBody = {}
) {
  const response = await completeWorkoutSession(planId, dayId, sessionId, body);
  
  if (!("error" in response)) {
    revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
    revalidatePath("/");
    revalidatePath("/feed");
  }
  
  return response;
}
