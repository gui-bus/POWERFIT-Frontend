"use client";

import { GetWorkoutTemplates200TemplatesItem, applyWorkoutTemplate } from "@/lib/api/fetch-generated";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarbellIcon, LightningIcon, PlusIcon, EyeIcon, ClockIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WEEKDAY_TRANSLATIONS } from "@/lib/utils/date";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateCardProps {
  template: GetWorkoutTemplates200TemplatesItem;
}

export function TemplateCard({ template }: TemplateCardProps) {
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
    } catch (error) {
      toast.error("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = {
    BEGINNER: "bg-green-500/10 text-green-500 border-green-500/20",
    INTERMEDIATE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    ADVANCED: "bg-destructive/10 text-destructive border-destructive/20",
  }[template.difficulty?.toUpperCase() || ""] || "bg-primary/10 text-primary border-primary/20";

  return (
    <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-sm flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        {template.imageUrl ? (
          <Image 
            src={template.imageUrl} 
            alt={template.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="size-full bg-linear-to-br from-primary/20 to-orange-600/20 flex items-center justify-center">
            <BarbellIcon weight="duotone" className="size-16 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {template.category && (
            <Badge className="bg-white/10 text-white border-white/20 uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
              {template.category}
            </Badge>
          )}
          {template.difficulty && (
            <Badge className={`uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-full border ${difficultyColor} backdrop-blur-md`}>
              {template.difficulty}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-anton italic uppercase text-foreground leading-none tracking-tight group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">
            {template.description || "Nenhuma descrição fornecida."}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <LightningIcon weight="duotone" className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Ativar Plano</span>
              <span className="text-[9px] font-bold uppercase text-muted-foreground">{template.days.length} Dias / Semana</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="icon"
                  className="size-12 rounded-2xl border-border bg-background hover:border-primary/50 group/details transition-all active:scale-95 cursor-pointer"
                >
                  <EyeIcon weight="bold" className="size-5 text-muted-foreground group-hover/details:text-primary transition-colors" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-border rounded-[2.5rem] p-0 overflow-hidden">
                <div className="p-8 space-y-8">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <DialogTitle className="text-3xl font-anton italic uppercase text-foreground">
                          {template.name}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold uppercase tracking-widest text-primary italic">
                          Detalhes do Protocolo de Treino
                        </DialogDescription>
                      </div>
                      <Badge className={`uppercase text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full border ${difficultyColor}`}>
                        {template.difficulty}
                      </Badge>
                    </div>
                  </DialogHeader>

                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                          <BarbellIcon weight="duotone" className="size-5 text-primary" />
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] italic">Estrutura Semanal</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                          {template.days.map((day, idx) => (
                            <div key={idx} className="bg-muted/30 border border-border/50 rounded-3xl p-6 space-y-6">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">
                                    {WEEKDAY_TRANSLATIONS[day.weekDay as keyof typeof WEEKDAY_TRANSLATIONS]}
                                  </p>
                                  <h5 className="text-xl font-anton italic uppercase leading-none">{day.name}</h5>
                                </div>
                                {day.isRestDay ? (
                                  <Badge variant="outline" className="rounded-full uppercase text-[9px] font-black tracking-widest">Descanso</Badge>
                                ) : (
                                  <div className="flex items-center gap-3">
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
                                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
                    </div>
                  </ScrollArea>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <Button 
                      onClick={handleApply}
                      disabled={loading}
                      className="bg-primary hover:bg-orange-600 text-white rounded-2xl px-8 h-12 font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                      Começar este Protocolo
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={handleApply}
              disabled={loading}
              size="icon"
              className="size-12 rounded-2xl bg-primary hover:bg-orange-600 shadow-xl shadow-primary/20 group/btn transition-all active:scale-95 cursor-pointer"
            >
              <PlusIcon weight="bold" className="size-5 text-primary-foreground group-hover/btn:rotate-90 transition-transform duration-500" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
