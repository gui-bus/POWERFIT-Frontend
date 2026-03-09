"use client";

import { startWorkoutAction, completeWorkoutAction } from "@/app/(dashboard)/workout-plans/[planId]/days/[dayId]/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface SessionActionProps {
  planId: string;
  dayId: string;
  activeSessionId?: string;
  isCompleted?: boolean;
}

export function SessionAction({ planId, dayId, activeSessionId, isCompleted }: SessionActionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const response = await startWorkoutAction(planId, dayId);
      if ("error" in response) {
        toast.error("Erro ao iniciar treino");
      }
    } catch (error) {
      toast.error("Erro inesperado ao iniciar treino");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!activeSessionId) return;
    setIsLoading(true);
    try {
      const response = await completeWorkoutAction(planId, dayId, activeSessionId);
      if ("error" in response) {
        toast.error("Erro ao concluir treino");
      }
    } catch (error) {
      toast.error("Erro inesperado ao concluir treino");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <Button variant="ghost" disabled className="w-full h-12 rounded-full font-bold uppercase italic tracking-widest border border-border cursor-pointer text-white">
        Concluído!
      </Button>
    );
  }

  if (activeSessionId) {
    return (
      <Button 
        onClick={handleComplete} 
        disabled={isLoading}
        className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold uppercase italic tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
      >
        {isLoading ? "Concluindo..." : "Marcar como concluído"}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleStart} 
      disabled={isLoading}
      className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold uppercase italic tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
    >
      {isLoading ? "Iniciando..." : "Iniciar Treino"}
    </Button>
  );
}
