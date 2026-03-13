"use client";

import { useState } from "react";
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  postAdminWorkoutTemplates,
  PostAdminWorkoutTemplatesBodyDaysItemWeekDay,
} from "@/lib/api/fetch-generated";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusIcon,
  CheckIcon,
  XIcon,
  BarbellIcon,
  CalendarIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WEEKDAY_TRANSLATIONS } from "@/lib/utils/date";

const exerciseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  sets: z.coerce.number().min(1, "Mínimo 1 série"),
  reps: z.coerce.number().min(1, "Mínimo 1 repetição"),
  restTimeInSeconds: z.coerce.number().min(0, "Tempo de descanso inválido"),
  order: z.number(),
});

const daySchema = z.object({
  name: z.string().min(1, "Nome do dia é obrigatório"),
  weekDay: z.nativeEnum(PostAdminWorkoutTemplatesBodyDaysItemWeekDay),
  isRestDay: z.boolean(),
  estimatedDurationInSeconds: z.coerce.number().min(0),
  exercises: z.array(exerciseSchema),
});

const templateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  days: z.array(daySchema).min(1, "Adicione ao menos um dia"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

const WEEK_DAYS = Object.keys(
  PostAdminWorkoutTemplatesBodyDaysItemWeekDay,
) as PostAdminWorkoutTemplatesBodyDaysItemWeekDay[];

export function CreateTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      difficulty: "BEGINNER",
      days: [
        {
          name: "Treino A",
          weekDay: "MONDAY",
          isRestDay: false,
          estimatedDurationInSeconds: 3600,
          exercises: [],
        },
      ],
    },
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control: form.control,
    name: "days",
  });

  const onSubmit = async (values: TemplateFormValues) => {
    setLoading(false);
    setLoading(true);
    try {
      const response = await postAdminWorkoutTemplates(values as any);
      if (response.status === 201) {
        toast.success("Template criado com sucesso!");
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error("Erro ao criar template.");
      }
    } catch (error) {
      toast.error("Erro na conexão.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-primary text-white font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95 w-full max-w-xs">
          <PlusIcon weight="bold" className="mr-2 size-4" />
          Criar Novo Template
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl bg-card border-border rounded-[3rem] overflow-y-auto p-0 flex flex-col max-h-[90vh]">
        <div className="p-8 pb-4">
          <DialogHeader>
            <div className="space-y-1 text-left">
              <DialogTitle className="text-4xl font-anton uppercase text-foreground leading-none tracking-tight">
                Novo Template
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
                Criação de Protocolo Recomendado
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            <ScrollArea className="flex-1 px-8">
              <div className="space-y-10 py-4 pb-10">
                <div className="gap-6 bg-muted/30 p-6 rounded-3xl border border-border/50">
                  <div className="flex flex-col md:flex-row items-center gap-5 w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Nome do Plano
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: Full Body Iniciante"
                              className="h-12 bg-background/50 border-border/50 rounded-2xl font-bold uppercase italic"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Categoria
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: Hipertrofia, Emagrecimento"
                              className="h-12 bg-background/50 border-border/50 rounded-2xl font-bold uppercase italic"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-5 w-full mt-5">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Descrição
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Breve resumo do plano..."
                              className="h-12 bg-background/50 border-border/50 rounded-2xl font-medium italic text-xs w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Dificuldade
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-background/50 border-border/50 rounded-2xl font-bold uppercase italic w-full">
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card border-border rounded-xl">
                              <SelectItem
                                value="BEGINNER"
                                className="font-bold uppercase italic text-[10px] py-3"
                              >
                                Iniciante
                              </SelectItem>
                              <SelectItem
                                value="INTERMEDIATE"
                                className="font-bold uppercase italic text-[10px] py-3"
                              >
                                Intermediário
                              </SelectItem>
                              <SelectItem
                                value="ADVANCED"
                                className="font-bold uppercase italic text-[10px] py-3"
                              >
                                Avançado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dias de Treino */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon
                        weight="duotone"
                        className="size-5 text-primary"
                      />
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] italic text-foreground">
                        Estrutura Semanal
                      </h4>
                    </div>
                    <Button
                      type="button"
                      onClick={() =>
                        appendDay({
                          name: "Novo Treino",
                          weekDay: "MONDAY",
                          isRestDay: false,
                          estimatedDurationInSeconds: 3600,
                          exercises: [],
                        })
                      }
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-[10px] font-black uppercase italic tracking-widest text-primary gap-2 hover:bg-primary/10 cursor-pointer"
                    >
                      <PlusIcon weight="bold" className="size-3" />
                      Adicionar Dia
                    </Button>
                  </div>

                  <div className="space-y-8">
                    {dayFields.map((day, dayIndex) => (
                      <div
                        key={day.id}
                        className="bg-muted/30 border border-border/50 rounded-[2.5rem] p-8 space-y-8 relative group/day hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                            <FormField
                              control={form.control}
                              name={`days.${dayIndex}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Nome do Dia
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="h-10 bg-background/50 border-border/50 rounded-xl font-bold uppercase italic text-xs"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`days.${dayIndex}.weekDay`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Dia da Semana
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="h-10 bg-background/50 border-border/50 rounded-xl font-bold uppercase italic text-xs text-left">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-card border-border rounded-xl">
                                      {WEEK_DAYS.map((wd) => (
                                        <SelectItem
                                          key={wd}
                                          value={wd}
                                          className="font-bold uppercase italic text-[10px] py-3"
                                        >
                                          {
                                            WEEKDAY_TRANSLATIONS[
                                              wd as keyof typeof WEEKDAY_TRANSLATIONS
                                            ]
                                          }
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`days.${dayIndex}.estimatedDurationInSeconds`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Duração (s)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      className="h-10 bg-background/50 border-border/50 rounded-xl font-bold italic text-xs"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeDay(dayIndex)}
                            variant="ghost"
                            size="icon"
                            className="size-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            <TrashIcon weight="bold" className="size-5" />
                          </Button>
                        </div>

                        {/* Exercícios do Dia */}
                        <ExercisesFieldArray dayIndex={dayIndex} form={form} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-8 border-t border-border bg-card/80 backdrop-blur-md">
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
                  disabled={loading}
                  className="flex-2 bg-primary hover:bg-orange-600 text-white rounded-2xl h-14 font-black uppercase italic tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95 cursor-pointer"
                >
                  {loading ? (
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckIcon weight="bold" className="size-4 mr-2" />
                      Publicar Template
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ExercisesFieldArray({
  dayIndex,
  form,
}: {
  dayIndex: number;
  form: UseFormReturn<TemplateFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `days.${dayIndex}.exercises`,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground italic flex items-center gap-2">
          <BarbellIcon weight="fill" className="size-3 text-primary" />
          Exercícios do Dia
        </h5>
        <Button
          type="button"
          onClick={() =>
            append({
              name: "",
              sets: 3,
              reps: 12,
              restTimeInSeconds: 60,
              order: fields.length,
            })
          }
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg text-[9px] font-black uppercase italic tracking-widest text-primary gap-1.5 hover:bg-primary/5 cursor-pointer"
        >
          <PlusIcon weight="bold" className="size-2.5" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, exIndex) => (
          <div
            key={field.id}
            className="bg-background/50 border border-border/40 rounded-2xl p-4 space-y-4 group/ex"
          >
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-lg bg-muted flex items-center justify-center text-[9px] font-black italic text-muted-foreground shrink-0">
                {exIndex + 1}
              </div>
              <FormField
                control={form.control}
                name={`days.${dayIndex}.exercises.${exIndex}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nome do exercício"
                        className="h-9 bg-transparent border-none p-0 focus-visible:ring-0 font-bold uppercase italic text-xs shadow-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => remove(exIndex)}
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-muted-foreground hover:text-destructive opacity-0 group-hover/ex:opacity-100 transition-opacity cursor-pointer"
              >
                <TrashIcon weight="bold" className="size-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name={`days.${dayIndex}.exercises.${exIndex}.sets`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Séries
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="h-8 bg-muted/20 border-border/30 rounded-lg text-center font-bold text-[10px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`days.${dayIndex}.exercises.${exIndex}.reps`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Reps
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="h-8 bg-muted/20 border-border/30 rounded-lg text-center font-bold text-[10px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`days.${dayIndex}.exercises.${exIndex}.restTimeInSeconds`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Descanso (s)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="h-8 bg-muted/20 border-border/30 rounded-lg text-center font-bold text-[10px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="py-6 text-center border border-dashed border-border rounded-2xl bg-muted/5 opacity-50">
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground italic">
              Nenhum exercício definido para este dia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
