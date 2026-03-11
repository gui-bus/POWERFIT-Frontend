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
import { ScalesIcon, PlusIcon } from "@phosphor-icons/react";
import { logBodyProgress } from "@/lib/api/fetch-generated";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  weightInKg: z.coerce.number().min(1, "Obrigatório"),
  heightInCentimeters: z.coerce.number().int().min(1, "Obrigatório"),
  age: z.coerce.number().int().min(1, "Obrigatório"),
  bodyFatPercentage: z.coerce.number().min(0).max(100, "Máximo 100%"),
});

export function LogBodyProgressDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weightInKg: 0,
      heightInCentimeters: 0,
      age: 0,
      bodyFatPercentage: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await logBodyProgress({
        weightInGrams: values.weightInKg * 1000,
        heightInCentimeters: values.heightInCentimeters,
        age: values.age,
        bodyFatPercentage: values.bodyFatPercentage / 100,
      });

      if (response.status === 204) {
        toast.success("Medição registrada com sucesso! Acompanhe sua evolução. 📈");
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error("Erro ao registrar medição.");
      }
    } catch {
      toast.error("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <PlusIcon weight="bold" className="size-3" />
          Registrar Medição
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border rounded-[2.5rem] sm:max-w-md">
        <DialogHeader>
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <ScalesIcon weight="duotone" className="size-6 text-primary" />
          </div>
          <DialogTitle className="font-anton text-2xl italic uppercase tracking-wider text-foreground">Checkpoint Corporal</DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium text-xs">
            Atualize suas métricas para gerar sua timeline de evolução.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weightInKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Peso (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" className="bg-muted/30 border-border rounded-xl h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bodyFatPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gordura (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" className="bg-muted/30 border-border rounded-xl h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heightInCentimeters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Altura (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-muted/30 border-border rounded-xl h-12" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Idade</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-muted/30 border-border rounded-xl h-12" {...field} />
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
                {isLoading ? "Salvando..." : "Salvar Medição"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
