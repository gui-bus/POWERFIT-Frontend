"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrophyIcon, PlusIcon, BarbellIcon, TargetIcon } from "@phosphor-icons/react";
import { upsertPersonalRecord } from "@/lib/api/fetch-generated";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  exerciseName: z.string().min(2, "Nome do exercício é obrigatório"),
  weightInKg: z.coerce.number().min(0.1, "Peso deve ser maior que zero"),
  reps: z.coerce.number().int().min(1, "Mínimo de 1 repetição"),
});

export function UpsertPersonalRecordDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exerciseName: "",
      weightInKg: 0,
      reps: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await upsertPersonalRecord({
        exerciseName: values.exerciseName,
        weightInGrams: values.weightInKg * 1000,
        reps: values.reps,
      });

      if (response.status === 204) {
        // API retornou 204: ou salvou com sucesso ou ignorou por ser peso menor
        // A API retorna 204 para ambos os casos de sucesso/ignorar conforme regra de ouro
        toast.success("Recorde processado! Se for seu novo máximo, o XP já caiu na conta! 🔥");
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error("Erro ao registrar recorde.");
      }
    } catch {
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
            <PlusIcon weight="bold" className="size-3" />
            Novo Recorde
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card border-border rounded-[2.5rem] sm:max-w-[425px]">
        <DialogHeader>
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <TrophyIcon weight="duotone" className="size-6 text-primary" />
          </div>
          <DialogTitle className="font-anton text-2xl italic uppercase tracking-wider text-foreground">Superação Total</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium text-xs">
            Registre sua maior carga. O sistema só salvará se você superar sua marca anterior!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="exerciseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <BarbellIcon weight="duotone" className="size-4" /> Exercício
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Supino Reto" className="bg-muted/30 border-border rounded-xl h-12" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weightInKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Peso (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" placeholder="0.0" className="bg-muted/30 border-border rounded-xl h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <TargetIcon weight="duotone" className="size-4" /> Reps
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" className="bg-muted/30 border-border rounded-xl h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl font-black uppercase italic tracking-[0.2em] text-xs shadow-xl shadow-primary/20"
              >
                {isLoading ? "Validando Esforço..." : "Esmagar Recorde"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
