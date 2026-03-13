"use client";

import { GetWorkoutTemplates200TemplatesItem, applyWorkoutTemplate } from "@/lib/api/fetch-generated";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarbellIcon, 
  PlusIcon, 
  EyeIcon, 
  ClockIcon, 
  WarningIcon,
  ChartLineUpIcon,
  SwordIcon,
  TargetIcon,
  TrendUpIcon
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { WEEKDAY_TRANSLATIONS } from "@/lib/utils/date";

interface TemplateCardProps {
  template: GetWorkoutTemplates200TemplatesItem;
  actions?: React.ReactNode;
  mainAction?: React.ReactNode;
  hideApplyButton?: boolean;
}

const DIFFICULTY_MAP: Record<string, { label: string, color: string, icon: any }> = {
  BEGINNER: { label: "Iniciante", color: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10", icon: ChartLineUpIcon },
  INTERMEDIATE: { label: "Intermediário", color: "text-amber-500 border-amber-500/20 bg-amber-500/10", icon: TrendUpIcon },
  ADVANCED: { label: "Avançado", color: "text-destructive border-destructive/20 bg-destructive/10", icon: SwordIcon },
};

export function TemplateCard({ template, mainAction, hideApplyButton }: TemplateCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      const response = await applyWorkoutTemplate(template.id);
      if (response.status === 201) {
        toast.success(`Plano "${template.name}" aplicado com sucesso!`);
        router.push("/");
      } else {
        toast.error("Erro ao aplicar plano.");
      }
    } catch {
      toast.error("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  const difficulty = DIFFICULTY_MAP[template.difficulty?.toUpperCase() || ""] || { 
    label: template.difficulty || "Padrão", 
    color: "text-primary border-primary/20 bg-primary/10",
    icon: TargetIcon 
  };

  return (
    <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-sm flex flex-col h-full relative">
      <div className="absolute -top-12 -right-12 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
      
      <div className="p-8 space-y-8 flex-1 flex flex-col relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap gap-2">
              {template.category && (
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg">
                  {template.category}
                </Badge>
              )}
              <Badge className={`uppercase text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg border ${difficulty.color}`}>
                <difficulty.icon weight="bold" className="size-2 mr-1 inline-block" />
                {difficulty.label}
              </Badge>
            </div>
            
            <h3 className="text-3xl font-anton italic uppercase text-foreground leading-[0.9] tracking-tight group-hover:text-primary transition-colors duration-500">
              {template.name}
            </h3>
          </div>

          <div className="size-14 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors relative">
            <BarbellIcon weight="duotone" className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3 italic flex-1">
          {template.description || "Este protocolo foi desenhado para elevar sua performance ao próximo nível através de uma estrutura de treinamento otimizada."}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Frequência</span>
            <p className="text-sm font-anton italic uppercase text-foreground">{template.days.length} Dias / Semana</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic">Volume</span>
            <p className="text-sm font-anton italic uppercase text-foreground">
              {template.days.reduce((acc, day) => acc + day.exercises.length, 0)} Exercícios
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline"
                className="w-full sm:flex-1 rounded-2xl border-border bg-background hover:border-primary/50 gap-2 font-black uppercase italic tracking-widest text-[10px] h-12 cursor-pointer transition-all"
              >
                <EyeIcon weight="bold" className="size-4" />
                Explorar
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl bg-card border-l border-border p-0 overflow-y-auto custom-scrollbar">
              <div className="p-8 space-y-10 pb-32">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 text-left">
                      <SheetTitle className="text-4xl font-anton italic uppercase text-foreground leading-none tracking-tight">
                        {template.name}
                      </SheetTitle>
                      <SheetDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
                        Detalhamento do Protocolo
                      </SheetDescription>
                    </div>
                    <Badge className={`uppercase text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full border ${difficulty.color}`}>
                      {difficulty.label}
                    </Badge>
                  </div>
                </SheetHeader>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                    {template.description || "Análise detalhada da estrutura de treinamento, volume e intensidade sugerida para este modelo."}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 px-2">
                    <BarbellIcon weight="duotone" className="size-5 text-primary" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] italic">Estrutura Semanal</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {template.days.map((day, idx) => (
                      <div key={idx} className="bg-muted/30 border border-border/50 rounded-3xl p-6 space-y-6 hover:border-primary/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 text-left">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest italic leading-none mb-1">
                              {WEEKDAY_TRANSLATIONS[day.weekDay as keyof typeof WEEKDAY_TRANSLATIONS]}
                            </p>
                            <h5 className="text-2xl font-anton italic uppercase leading-none">{day.name}</h5>
                          </div>
                          {day.isRestDay ? (
                            <Badge variant="outline" className="rounded-full uppercase text-[9px] font-black tracking-widest border-border/50 bg-background/50">Descanso</Badge>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <ClockIcon weight="bold" className="size-3" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">
                                  {Math.round(day.estimatedDurationInSeconds / 60)} MIN
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-primary">
                                <BarbellIcon weight="bold" className="size-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                  {day.exercises.length} EXERCÍCIOS
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {!day.isRestDay && day.exercises.length > 0 && (
                          <div className="space-y-3">
                            {day.exercises.sort((a, b) => a.order - b.order).map((ex, exIdx) => (
                              <div key={exIdx} className="flex items-center justify-between p-4 bg-background/50 border border-border/40 rounded-2xl group/ex hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                  <span className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary italic">
                                    {ex.order + 1}
                                  </span>
                                  <p className="text-sm font-black italic uppercase text-foreground">{ex.name}</p>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">
                                  <span>{ex.sets} SÉRIES</span>
                                  <div className="w-1 h-1 rounded-full bg-border" />
                                  <span>{ex.reps} REPS</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {!hideApplyButton && (
                  <div className="pt-10 border-t border-border">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          className="w-full bg-primary hover:bg-orange-600 text-white rounded-2xl h-14 font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95 cursor-pointer"
                        >
                          Ativar Protocolo Agora
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                        <AlertDialogHeader>
                          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                            <WarningIcon weight="duotone" className="size-6 text-primary" />
                          </div>
                          <AlertDialogTitle className="text-2xl font-anton italic uppercase">Confirmar Substituição</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                            Ao ativar o <span className="text-foreground font-black italic">{template.name}</span>, seu plano de treino atual será <span className="text-destructive font-black italic underline decoration-destructive/30">permanentemente substituído</span>. Deseja prosseguir com a mudança de protocolo?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3 mt-4">
                          <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleApply}
                            disabled={loading}
                            className="bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-primary/20 cursor-pointer"
                          >
                            Sim, Substituir Plano
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {mainAction ? (
            <div className="w-full sm:flex-2">
              {mainAction}
            </div>
          ) : !hideApplyButton && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={loading}
                  className="w-full sm:flex-2 bg-primary hover:bg-orange-600 text-white rounded-2xl h-12 gap-2 font-black uppercase italic tracking-widest text-[10px] shadow-xl shadow-primary/20 group/btn transition-all active:scale-95 cursor-pointer"
                >
                  <PlusIcon weight="bold" className="size-4" />
                  Ativar Plano
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
                <AlertDialogHeader>
                  <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                    <WarningIcon weight="duotone" className="size-6 text-primary" />
                  </div>
                  <AlertDialogTitle className="text-2xl font-anton italic uppercase">Alterar Protocolo Ativo</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Você está prestes a substituir seu plano atual pelo <span className="text-foreground font-black italic">{template.name}</span>. Esta ação não pode ser desfeita. Confirmar alteração?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 mt-4">
                  <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">Manter Atual</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleApply}
                    disabled={loading}
                    className="bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-primary/20 cursor-pointer"
                  >
                    Ativar Novo Plano
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </Card>
  );
}
