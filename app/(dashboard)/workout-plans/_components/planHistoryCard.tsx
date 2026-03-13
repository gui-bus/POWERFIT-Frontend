"use client";

import {
  GetWorkoutPlans200Item,
  renameWorkoutPlan,
  cloneWorkoutPlan,
  activateWorkoutPlan,
  deleteWorkoutPlan,
} from "@/lib/api/fetch-generated";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  BarbellIcon,
  CheckCircleIcon,
  CopyIcon,
  DotsThreeVerticalIcon,
  EyeIcon,
  PencilSimpleIcon,
  PlayIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PlanHistoryCardProps {
  plan: GetWorkoutPlans200Item;
}

export function PlanHistoryCard({ plan }: PlanHistoryCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState(plan.name);

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

  const handleRename = async () => {
    if (!newName.trim() || newName === plan.name) {
      setIsRenameOpen(false);
      return;
    }
    setLoading(true);
    try {
      const response = await renameWorkoutPlan(plan.id, { name: newName });
      if (response.status === 200) {
        toast.success("Protocolo renomeado!");
        setIsRenameOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Erro ao renomear protocolo.");
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async () => {
    setLoading(true);
    try {
      const response = await cloneWorkoutPlan(plan.id);
      if (response.status === 201) {
        toast.success("Protocolo clonado com sucesso!");
        router.refresh();
      }
    } catch {
      toast.error("Erro ao clonar protocolo.");
    } finally {
      setLoading(false);
    }
  };

  const totalExercises = plan.workoutDays.reduce(
    (acc, day) => acc + day.exercises.length,
    0,
  );

  return (
    <div className="md:ml-20">
      <Card
        className={`overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
          plan.isActive
            ? "bg-primary/5 border-primary/30 shadow-2xl shadow-primary/10"
            : "bg-card border-border hover:border-primary/20 shadow-sm"
        }`}
      >
        <div className="p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3
                  className={`text-3xl font-anton italic uppercase leading-none tracking-tight ${
                    plan.isActive ? "text-primary" : "text-foreground"
                  }`}
                >
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
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Frequência
                  </p>
                  <p className="text-sm font-bold italic text-foreground uppercase">
                    {plan.workoutDays.length} Sessões / Semana
                  </p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    Volume Total
                  </p>
                  <p className="text-sm font-bold italic text-foreground uppercase">
                    {totalExercises} Exercícios
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-muted/30 border border-border items-center justify-center shrink-0 hidden sm:flex">
                <BarbellIcon
                  weight={plan.isActive ? "fill" : "duotone"}
                  className={`size-8 ${plan.isActive ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-10 rounded-xl text-muted-foreground hover:text-primary cursor-pointer"
                    aria-label="Abrir menu de opções"
                  >
                    <DotsThreeVerticalIcon weight="bold" className="size-6" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border rounded-xl p-2 min-w-40"
                >
                  <DropdownMenuItem
                    onClick={() => setIsRenameOpen(true)}
                    className="rounded-lg text-[10px] font-black uppercase italic tracking-widest gap-3 py-3 cursor-pointer"
                  >
                    <PencilSimpleIcon
                      weight="bold"
                      className="size-4 text-primary"
                    />
                    Renomear
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleClone}
                    className="rounded-lg text-[10px] font-black uppercase italic tracking-widest gap-3 py-3 cursor-pointer"
                  >
                    <CopyIcon weight="bold" className="size-4 text-primary" />
                    Duplicar
                  </DropdownMenuItem>
                  {!plan.isActive && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="rounded-lg text-[10px] font-black uppercase italic tracking-widest gap-3 py-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <TrashIcon weight="bold" className="size-4" />
                          Excluir
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-anton uppercase">
                            Remover Definitivamente
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                            Confirmar exclusão permanente de{" "}
                            <span className="text-foreground font-black uppercase">
                              {plan.name}
                            </span>
                            ? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3 mt-4">
                          <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-800! hover:bg-red-700! text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-destructive/20 cursor-pointer"
                          >
                            Sim, Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Link href={`/workout-plans/${plan.id}`}>
                <Button
                  variant="outline"
                  className="h-11 rounded-2xl border-border bg-background hover:border-primary/50 gap-2 font-black uppercase italic tracking-widest text-[10px] px-6 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  <EyeIcon weight="bold" className="size-4" />
                  Analisar Protocolo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {plan.isActive ? (
                <div className="flex items-center gap-2 text-primary px-6 h-11 bg-primary/10 rounded-2xl border border-primary/20">
                  <CheckCircleIcon weight="fill" className="size-5" />
                  <span className="text-[10px] font-black uppercase italic tracking-widest">
                    Status: Em Operação
                  </span>
                </div>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={loading}
                      className="h-11 px-16! rounded-2xl bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/20 gap-2"
                    >
                      <PlayIcon weight="fill" className="size-4" />
                      Reativar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-anton uppercase">
                        Retomar Protocolo
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
                        Deseja tornar o plano{" "}
                        <span className="text-foreground font-black uppercase">
                          {plan.name}{" "}
                        </span>{" "}
                        ativo novamente?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 mt-4">
                      <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">
                        Voltar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleActivate}
                        disabled={loading}
                        className="bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 cursor-pointer"
                      >
                        Ativar Agora
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-anton italic uppercase text-foreground">
              Renomear Protocolo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Novo Nome
              </Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Treino de Força"
                className="h-12 bg-background border-border rounded-xl font-bold uppercase italic"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameOpen(false)}
              className="rounded-xl h-12 font-black uppercase italic tracking-widest text-[10px] cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRename}
              disabled={loading || !newName.trim() || newName === plan.name}
              className="bg-primary hover:bg-orange-600 text-white rounded-xl h-12 font-black uppercase italic tracking-widest text-[10px] shadow-xl shadow-primary/20 px-8 cursor-pointer"
            >
              Salvar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
