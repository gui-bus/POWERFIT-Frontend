"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { upsertUserTrainData, GetUserTrainData200 } from "@/lib/api/fetch-generated";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckIcon, SpinnerGapIcon } from "@phosphor-icons/react";

const profileSchema = z.object({
  weight: z.coerce.number().min(30, "Peso muito baixo").max(300, "Peso muito alto"),
  height: z.coerce.number().min(100, "Altura muito baixa").max(250, "Altura muito alta"),
  age: z.coerce.number().min(12, "Idade mínima 12 anos").max(100, "Idade máxima 100 anos"),
  bodyFatPercentage: z.coerce.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
});

interface ProfileFormValues {
  weight: number;
  height: number;
  age: number;
  bodyFatPercentage: number;
}

interface EditProfileDialogProps {
  initialData: GetUserTrainData200;
  children: React.ReactNode;
}

export function EditProfileDialog({ initialData, children }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as unknown as Resolver<ProfileFormValues>,
    defaultValues: {
      weight: initialData?.weightInGrams ? initialData.weightInGrams / 1000 : 70,
      height: initialData?.heightInCentimeters || 170,
      age: initialData?.age || 25,
      bodyFatPercentage: initialData?.bodyFatPercentage ?? 15,
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    try {
      const response = await upsertUserTrainData({
        weightInGrams: values.weight * 1000,
        heightInCentimeters: values.height,
        age: values.age,
        bodyFatPercentage: values.bodyFatPercentage / 100,
      });

      if (response.status === 200) {
        toast.success("Perfil atualizado com sucesso!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Erro ao atualizar perfil.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Mantenha seus dados atualizados para que a IA possa ajustar seu treino.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Peso (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="70" 
                        type="number" 
                        step="0.1" 
                        className="rounded-2xl bg-muted/50 border-none h-12 font-bold"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Altura (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="175" 
                        type="number" 
                        className="rounded-2xl bg-muted/50 border-none h-12 font-bold"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Idade</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="25" 
                        type="number" 
                        className="rounded-2xl bg-muted/50 border-none h-12 font-bold"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
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
                      <Input 
                        placeholder="15" 
                        type="number" 
                        className="rounded-2xl bg-muted/50 border-none h-12 font-bold"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl font-black uppercase italic tracking-widest gap-3 cursor-pointer"
              >
                {isLoading ? (
                  <SpinnerGapIcon className="size-5 animate-spin" />
                ) : (
                  <>
                    Salvar Alterações
                    <CheckIcon weight="bold" className="size-5" />
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
