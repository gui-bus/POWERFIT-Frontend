"use client";

import { GetWorkoutPlans200Item, activateWorkoutPlan, deleteWorkoutPlan } from "@/lib/api/fetch-generated";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarbellIcon, 
  CheckCircleIcon, 
  PlayIcon, 
  TrashIcon,
  WarningIcon,
  CalendarBlankIcon,
  ActivityIcon,
  EyeIcon
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
        toast.success(`Plano "${plan.name}" ativado com sucesso!`);
        router.refresh();
      } else {
        toast.error("Erro ao ativar plano.");
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
        toast.success("Plano removido permanentemente.");
        router.refresh();
      } else {
        toast.error("Erro ao remover plano.");
      }
    } catch {
      toast.error("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
      plan.isActive 
        ? "bg-primary/5 border-primary/30 shadow-xl shadow-primary/5" 
        : "bg-card border-border hover:border-primary/20"
    }`}>
      {/* Background Decorative Element */}
      <div className={`absolute -top-12 -right-12 size-40 rounded-full blur-3xl transition-colors duration-700 ${
        plan.isActive ? "bg-primary/10" : "bg-primary/0 group-hover:bg-primary/5"
      }`} />

      <div className="p-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6 flex-1">
            <div className={`size-20 rounded-3xl flex items-center justify-center border transition-all duration-500 ${
              plan.isActive 
                ? "bg-primary border-primary shadow-lg shadow-primary/20 rotate-3" 
                : "bg-muted/50 border-border group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:-rotate-3"
            }`}>
              <BarbellIcon weight={plan.isActive ? "fill" : "duotone"} className={`size-10 ${plan.isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-anton italic uppercase text-foreground leading-none tracking-tight">
                  {plan.name}
                </h3>
                {plan.isActive && (
                  <Badge className="bg-primary text-white border-none uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                    Ativo Agora
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarBlankIcon weight="bold" className="size-3.5 text-primary/60" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">{plan.workoutDays.length} Dias / Semana</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5">
                  <ActivityIcon weight="bold" className="size-3.5 text-primary/60" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Protocolo Personalizado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href={`/workout-plans/${plan.id}`} className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full h-12 rounded-2xl border-border bg-background hover:border-primary/50 gap-2 font-black uppercase italic tracking-widest text-[10px] px-6 cursor-pointer transition-all active:scale-95">
                <EyeIcon weight="bold" className="size-4" />
                Detalhes
              </Button>
            </Link>

            {!plan.isActive && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={loading}
                    className="flex-1 sm:flex-none bg-primary hover:bg-orange-600 text-white rounded-2xl px-8 h-12 font-black uppercase italic tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <PlayIcon weight="fill" className="size-4" />
                    Ativar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                  <AlertDialogHeader>
                    <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                      <PlayIcon weight="duotone" className="size-6 text-primary" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-anton italic uppercase text-foreground">Reativar Protocolo</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                      Deseja tornar o plano <span className="text-foreground font-black italic">{plan.name}</span> seu protocolo ativo? Isso interromperá o cronograma atual.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3 mt-4">
                    <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer flex-1">Manter Atual</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleActivate}
                      disabled={loading}
                      className="bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-primary/20 cursor-pointer flex-2"
                    >
                      Ativar Agora
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {!plan.isActive && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost"
                    disabled={loading}
                    className="size-12 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all active:scale-90"
                  >
                    <TrashIcon weight="bold" className="size-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                  <AlertDialogHeader>
                    <div className="size-12 bg-destructive/10 rounded-2xl flex items-center justify-center mb-2">
                      <WarningIcon weight="duotone" className="size-6 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-anton italic uppercase text-foreground">Remover Permanentemente</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                      Você está prestes a excluir o plano <span className="text-foreground font-black italic">{plan.name}</span>. Todos os dados de estrutura deste protocolo serão perdidos. Esta ação <span className="text-destructive font-black underline italic">não pode ser desfeita</span>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3 mt-4">
                    <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer flex-1">Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={loading}
                      className="bg-destructive hover:bg-red-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-destructive/20 cursor-pointer flex-2"
                    >
                      Excluir Definitivamente
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {plan.isActive && (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl px-6 h-12 flex items-center gap-3">
                <CheckCircleIcon weight="fill" className="size-5 text-primary" />
                <span className="text-[10px] font-black uppercase italic tracking-widest text-primary">Protocolo Atual</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
