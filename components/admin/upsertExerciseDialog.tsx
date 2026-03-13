"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  postAdminExercises, 
  putAdminExercisesId,
  GetExercises200ExercisesItem
} from "@/lib/api/fetch-generated";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PlusIcon, PencilSimpleIcon, BarbellIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const exerciseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  muscleGroup: z.string().min(1, "Grupo muscular é obrigatório"),
  description: z.string().optional(),
  equipment: z.string().optional(),
  instructions: z.string().optional(),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  videoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  difficulty: z.string().optional(),
});

type ExerciseFormValues = z.infer<typeof exerciseSchema>;

interface UpsertExerciseDialogProps {
  exercise?: GetExercises200ExercisesItem;
  trigger?: React.ReactNode;
}

const MUSCLE_GROUPS = [
  "Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", "Core", "Cardio", "Corpo Todo"
];

const DIFFICULTIES = [
  "Iniciante", "Intermediário", "Avançado", "Elite"
];

export function UpsertExerciseDialog({ exercise, trigger }: UpsertExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!exercise;

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: exercise?.name || "",
      muscleGroup: exercise?.muscleGroup || "",
      description: exercise?.description || "",
      equipment: exercise?.equipment || "",
      instructions: exercise?.instructions || "",
      imageUrl: exercise?.imageUrl || "",
      videoUrl: exercise?.videoUrl || "",
      difficulty: exercise?.difficulty || "",
    },
  });

  const onSubmit = async (values: ExerciseFormValues) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        description: values.description || undefined,
        equipment: values.equipment || undefined,
        instructions: values.instructions || undefined,
        imageUrl: values.imageUrl || undefined,
        videoUrl: values.videoUrl || undefined,
        difficulty: values.difficulty || undefined,
      };

      const response = isEditing 
        ? await putAdminExercisesId(exercise!.id, payload)
        : await postAdminExercises(payload);

      if (response.status === 201 || response.status === 204) {
        toast.success(isEditing ? "Exercício atualizado!" : "Exercício criado!");
        setOpen(false);
        if (!isEditing) form.reset();
        router.refresh();
      } else {
        toast.error("Erro ao salvar exercício.");
      }
    } catch (error) {
      toast.error("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-2xl bg-primary text-white font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95">
            <PlusIcon weight="bold" className="mr-2 size-4" />
            Novo Exercício
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-card border-border rounded-[2.5rem] overflow-hidden p-0">
        <div className="p-8 pb-4">
          <DialogHeader>
            <div className="space-y-1 text-left">
              <DialogTitle className="text-4xl font-anton italic uppercase text-foreground leading-none tracking-tight">
                {isEditing ? "Editar Exercício" : "Novo Exercício"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
                {isEditing ? "Atualizar Catálogo Global" : "Expandir Biblioteca Oficial"}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Supino Reto" className="h-12 bg-muted/30 border-border/50 rounded-2xl font-bold uppercase italic" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="muscleGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Grupo Muscular</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-muted/30 border-border/50 rounded-2xl font-bold uppercase italic">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border rounded-xl">
                        {MUSCLE_GROUPS.map(group => (
                          <SelectItem key={group} value={group} className="font-bold uppercase italic text-[10px] py-3">{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Dificuldade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-muted/30 border-border/50 rounded-2xl font-bold uppercase italic">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border rounded-xl">
                        {DIFFICULTIES.map(diff => (
                          <SelectItem key={diff} value={diff} className="font-bold uppercase italic text-[10px] py-3">{diff}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Equipamento</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Barra, Halteres" className="h-12 bg-muted/30 border-border/50 rounded-2xl font-bold uppercase italic" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Descrição Curta</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 bg-muted/30 border-border/50 rounded-2xl font-medium italic text-xs" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Instruções de Execução</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-32 bg-muted/30 border-border/50 rounded-2xl font-medium italic text-xs resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">URL da Imagem</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." className="h-12 bg-muted/30 border-border/50 rounded-2xl font-medium italic text-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">URL do Vídeo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/..." className="h-12 bg-muted/30 border-border/50 rounded-2xl font-medium italic text-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 gap-3">
              <Button 
                type="button" 
                variant="ghost" 
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
                    Salvar Exercício
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
