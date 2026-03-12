"use client";

import { GetWorkoutPlans200Item, activateWorkoutPlan } from "@/lib/api/fetch-generated";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarbellIcon, CheckCircleIcon, PlayIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PlanHistoryCardProps {
  plan: GetWorkoutPlans200Item;
}

export function PlanHistoryCard({ plan }: PlanHistoryCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const response = await activateWorkoutPlan(plan.id);
      if (response.status === 200) {
        toast.success(`Plano "${plan.name}" ativado com sucesso!`);
        router.refresh();
      } else {
        toast.error("Erro ao ativar plano.");
      }
    } catch (error) {
      toast.error("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
      plan.isActive 
        ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5" 
        : "bg-card border-border hover:border-primary/20"
    }`}>
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 w-full sm:w-auto">
          <div className={`size-16 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
            plan.isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          }`}>
            <BarbellIcon weight="duotone" className="size-8" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-anton italic uppercase text-foreground leading-none">{plan.name}</h3>
              {plan.isActive && (
                <Badge className="bg-primary text-white border-none uppercase text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full">Ativo</Badge>
              )}
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
              {plan.workoutDays.length} Dias de Treinamento
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link href={`/workout-plans/${plan.id}`} className="flex-1 sm:flex-none">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto rounded-xl text-[10px] font-black uppercase italic tracking-widest h-10 gap-2 cursor-pointer">
              Ver Detalhes
              <ArrowRightIcon weight="bold" className="size-3" />
            </Button>
          </Link>

          {!plan.isActive && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={loading}
                  className="flex-1 sm:flex-none bg-primary hover:bg-orange-600 text-white rounded-xl px-6 h-10 font-black uppercase italic tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/10 transition-all active:scale-95 cursor-pointer"
                >
                  <PlayIcon weight="fill" className="size-3" />
                  Ativar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-anton italic uppercase text-foreground">Reativar Protocolo</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Deseja tornar o plano <span className="text-foreground font-black italic">{plan.name}</span> seu plano ativo novamente? Isso desativará o plano atual.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 mt-4">
                  <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">Voltar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleActivate}
                    disabled={loading}
                    className="bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-primary/20 cursor-pointer"
                  >
                    Confirmar Reativação
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {plan.isActive && (
            <div className="flex items-center gap-2 text-primary px-4">
              <CheckCircleIcon weight="fill" className="size-5" />
              <span className="text-[10px] font-black uppercase italic tracking-widest">Protocolo Atual</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
