"use client";

import { GetWorkoutPlans200Item, activateWorkoutPlan, deleteWorkoutPlan } from "@/lib/api/fetch-generated";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarbellIcon, 
  CheckCircleIcon, 
  TrashIcon,
  EyeIcon,
  PlayIcon
} from "@phosphor-icons/react";
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
        toast.success(`Protocolo "${plan.name}" ativado.`);
        router.refresh();
      } else {
        toast.error("Erro ao ativar protocolo.");
      }
    } catch {
      toast.error("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteWorkoutPlan(plan.id);
      if (response.status === 204) {
        toast.success("Protocolo removido.");
        router.refresh();
      } else {
        toast.error("Erro ao remover protocolo.");
      }
    } catch {
      toast.error("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  const totalExercises = plan.workoutDays.reduce((acc, day) => acc + day.exercises.length, 0);

  return (
    <div className="md:ml-20">
      <Card className={`overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
        plan.isActive 
          ? "bg-primary/5 border-primary/30 shadow-2xl shadow-primary/10" 
          : "bg-card border-border hover:border-primary/20 shadow-sm"
      }`}>
        <div className="p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className={`text-3xl font-anton italic uppercase leading-none tracking-tight ${
                  plan.isActive ? "text-primary" : "text-foreground"
                }`}>
                  {plan.name}
                </h3>
                {plan.isActive && (
                  <Badge className="bg-primary text-white border-none uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-full">
                    Ativo
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-6">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Frequência</p>
                  <p className="text-sm font-bold italic text-foreground uppercase">{plan.workoutDays.length} Sessões / Semana</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Volume Total</p>
                  <p className="text-sm font-bold italic text-foreground uppercase">{totalExercises} Exercícios</p>
                </div>
              </div>
            </div>

            <div className="size-16 rounded-2xl bg-muted/30 border border-border flex items-center justify-center shrink-0 hidden sm:flex">
              <BarbellIcon weight={plan.isActive ? "fill" : "duotone"} className={`size-8 ${plan.isActive ? "text-primary" : "text-muted-foreground"}`} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Link href={`/workout-plans/${plan.id}`}>
                <Button variant="outline" className="h-11 rounded-2xl border-border bg-background hover:border-primary/50 gap-2 font-black uppercase italic tracking-widest text-[10px] px-6 cursor-pointer transition-all active:scale-95 shadow-sm">
                  <EyeIcon weight="bold" className="size-4" />
                  Analisar Protocolo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {plan.isActive ? (
                <div className="flex items-center gap-2 text-primary px-6 h-11 bg-primary/10 rounded-2xl border border-primary/20">
                  <CheckCircleIcon weight="fill" className="size-5" />
                  <span className="text-[10px] font-black uppercase italic tracking-widest">Status: Em Operação</span>
                </div>
              ) : (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        disabled={loading}
                        className="h-11 rounded-2xl bg-primary hover:bg-orange-600 text-white font-black uppercase italic tracking-widest text-[10px] px-8 transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/20 gap-2"
                      >
                        <PlayIcon weight="fill" className="size-4" />
                        Reativar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-anton italic uppercase">Retomar Protocolo</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                          Deseja tornar o plano <span className="text-foreground font-black italic">{plan.name}</span> seu protocolo ativo novamente?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-3 mt-4">
                        <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">Voltar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleActivate}
                          disabled={loading}
                          className="bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 cursor-pointer"
                        >
                          Ativar Agora
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost"
                        disabled={loading}
                        className="size-11 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all active:scale-90"
                      >
                        <TrashIcon weight="bold" className="size-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-anton italic uppercase text-destructive">Remover Definitivamente</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                          Confirmar exclusão permanente de <span className="text-foreground font-black italic">{plan.name}</span>? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-3 mt-4">
                        <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          disabled={loading}
                          className="bg-destructive hover:bg-red-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-destructive/20 cursor-pointer"
                        >
                          Sim, Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
