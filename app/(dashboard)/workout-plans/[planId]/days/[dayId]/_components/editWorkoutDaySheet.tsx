"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  updateWorkoutDay, 
  GetWorkoutDayById200, 
  UpdateWorkoutDayBodyWeekDay 
} from "@/lib/api/fetch-generated";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PencilSimpleIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowsDownUpIcon, 
  CheckIcon, 
  XIcon,
  BarbellIcon,
  ClockIcon,
  TimerIcon
} from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const exerciseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sets: z.coerce.number().min(1, "Mínimo 1 série"),
  reps: z.coerce.number().min(1, "Mínimo 1 repetição"),
  restTimeInSeconds: z.coerce.number().min(0, "Tempo de descanso inválido"),
  order: z.number(),
});

const workoutDaySchema = z.object({
  name: z.string().min(1, "Nome do treino é obrigatório"),
  estimatedDurationInSeconds: z.coerce.number().min(1, "Duração inválida"),
  exercises: z.array(exerciseSchema),
});

type WorkoutDayFormValues = z.infer<typeof workoutDaySchema>;

interface EditWorkoutDaySheetProps {
  workoutDay: GetWorkoutDayById200;
  planId: string;
  dayId: string;
}

export function EditWorkoutDaySheet({ workoutDay, planId, dayId }: EditWorkoutDaySheetProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<WorkoutDayFormValues>({
    resolver: zodResolver(workoutDaySchema),
    defaultValues: {
      name: workoutDay.name,
      estimatedDurationInSeconds: workoutDay.estimatedDurationInSeconds,
      exercises: workoutDay.exercises.sort((a, b) => a.order - b.order).map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        restTimeInSeconds: ex.restTimeInSeconds,
        order: ex.order,
      })),
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  const onSubmit = async (values: WorkoutDayFormValues) => {
    setLoading(true);
    try {
      // Re-map order just in case
      const payload = {
        ...values,
        weekDay: workoutDay.weekDay as unknown as UpdateWorkoutDayBodyWeekDay,
        isRestDay: workoutDay.isRestDay,
        exercises: values.exercises.map((ex, index) => ({
          ...ex,
          order: index,
        })),
      };

      const response = await updateWorkoutDay(planId, dayId, payload);

      if (response.status === 204) {
        toast.success("Protocolo atualizado com sucesso!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Erro ao atualizar protocolo.");
      }
    } catch {
      toast.error("Erro na conexão ao atualizar protocolo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white gap-2 font-black uppercase italic tracking-widest text-[10px] h-10 px-4 transition-all"
        >
          <PencilSimpleIcon weight="bold" className="size-3.5" />
          Editar Protocolo
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl bg-card border-l border-border p-0 overflow-y-auto custom-scrollbar">
        <div className="p-8 space-y-10 pb-32">
          <SheetHeader>
            <div className="space-y-1 text-left">
              <SheetTitle className="text-4xl font-anton italic uppercase text-foreground leading-none tracking-tight">
                Ajustar Protocolo
              </SheetTitle>
              <SheetDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
                Sincronização de Treinamento
              </SheetDescription>
            </div>
          </SheetHeader>

          <form id="edit-workout-day-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-3xl border border-border/50">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome do Treino</Label>
                  <div className="relative">
                    <BarbellIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary" />
                    <Input 
                      {...form.register("name")}
                      placeholder="Ex: Peito e Tríceps"
                      className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary/30 font-bold uppercase italic"
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-[9px] font-bold text-destructive uppercase ml-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Duração (Segundos)</Label>
                  <div className="relative">
                    <TimerIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary" />
                    <Input 
                      type="number"
                      {...form.register("estimatedDurationInSeconds")}
                      placeholder="3600"
                      className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary/30 font-bold italic"
                    />
                  </div>
                  {form.formState.errors.estimatedDurationInSeconds && (
                    <p className="text-[9px] font-bold text-destructive uppercase ml-1">{form.formState.errors.estimatedDurationInSeconds.message}</p>
                  )}
                </div>
              </div>

              {/* Lista de Exercícios */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <BarbellIcon weight="duotone" className="size-5 text-primary" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] italic text-foreground">Exercícios do Dia</h4>
                  </div>
                  <Button 
                    type="button"
                    onClick={() => append({ name: "", sets: 3, reps: 12, restTimeInSeconds: 60, order: fields.length })}
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-[10px] font-black uppercase italic tracking-widest text-primary gap-2 hover:bg-primary/10"
                  >
                    <PlusIcon weight="bold" className="size-3" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div 
                      key={field.id} 
                      className="bg-muted/30 border border-border/50 rounded-3xl p-6 space-y-6 relative group/item hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="size-8 rounded-xl bg-background border border-border flex items-center justify-center text-[10px] font-black text-primary italic shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-1">
                            <Input 
                              {...form.register(`exercises.${index}.name`)}
                              placeholder="Nome do Exercício"
                              className="h-10 bg-background/50 border-border/50 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/30 font-bold uppercase italic text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            type="button"
                            onClick={() => index > 0 && move(index, index - 1)}
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            className="size-8 rounded-lg text-muted-foreground hover:text-primary"
                          >
                            <ArrowsDownUpIcon weight="bold" className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <TrashIcon weight="bold" className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Séries</Label>
                          <Input 
                            type="number"
                            {...form.register(`exercises.${index}.sets`)}
                            className="h-10 bg-background/50 border-border/50 rounded-xl font-bold italic text-xs text-center"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reps</Label>
                          <Input 
                            type="number"
                            {...form.register(`exercises.${index}.reps`)}
                            className="h-10 bg-background/50 border-border/50 rounded-xl font-bold italic text-xs text-center"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pausa (s)</Label>
                          <Input 
                            type="number"
                            {...form.register(`exercises.${index}.restTimeInSeconds`)}
                            className="h-10 bg-background/50 border-border/50 rounded-xl font-bold italic text-xs text-center"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl bg-muted/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Nenhum exercício definido</p>
                    </div>
                  )}
                </div>
              </div>
              </form>
              </div>

              <div className="p-8 pt-4 border-t border-border bg-card/80 backdrop-blur-md sticky bottom-0 z-30">

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 rounded-2xl h-14 font-black uppercase italic tracking-widest text-[10px] cursor-pointer"
            >
              <XIcon weight="bold" className="size-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              form="edit-workout-day-form"
              disabled={loading}
              className="flex-2 bg-primary hover:bg-orange-600 text-white rounded-2xl h-14 font-black uppercase italic tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckIcon weight="bold" className="size-4 mr-2" />
                  Salvar Protocolo
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
