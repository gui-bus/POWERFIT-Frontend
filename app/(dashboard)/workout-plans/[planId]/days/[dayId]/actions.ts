"use server";

import { startWorkoutSession, completeWorkoutSession } from "@/lib/api/fetch-generated";
import { revalidatePath } from "next/cache";

export async function startWorkoutAction(planId: string, dayId: string) {
  const response = await startWorkoutSession(planId, dayId);
  
  if (!("error" in response)) {
    revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
    revalidatePath("/");
  }
  
  return response;
}

export async function completeWorkoutAction(planId: string, dayId: string, sessionId: string) {
  const response = await completeWorkoutSession(planId, dayId, sessionId);
  
  if (!("error" in response)) {
    revalidatePath(`/workout-plans/${planId}/days/${dayId}`);
    revalidatePath("/");
  }
  
  return response;
}
