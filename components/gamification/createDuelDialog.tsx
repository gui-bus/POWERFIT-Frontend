"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createChallenge } from "@/lib/api/fetch-generated";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import {
  SwordIcon,
  TrophyIcon,
  CalendarIcon,
  InfoIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { StarIcon } from "@phosphor-icons/react/dist/ssr";

const duelSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  endDate: z.string().min(1, "Selecione uma data de término"),
  xpReward: z.number().min(10, "Mínimo de 10 XP").default(100),
  goalType: z.enum([
    "WORKOUT_COUNT",
    "TOTAL_VOLUME",
    "TOTAL_XP",
    "PR_COUNT",
    "TOTAL_DURATION",
    "STREAK_DAYS",
  ]),
  goalTarget: z.number().min(1, "O objetivo deve ser maior que 0"),
});

type DuelFormValues = z.infer<typeof duelSchema>;

const GOAL_OPTIONS = [
  { value: "WORKOUT_COUNT", label: "Qtd. de Treinos" },
  { value: "TOTAL_VOLUME", label: "Volume Total (kg)" },
  { value: "TOTAL_XP", label: "XP Total Ganhos" },
  { value: "PR_COUNT", label: "Recordes Quebrados" },
  { value: "TOTAL_DURATION", label: "Duração Total (min)" },
  { value: "STREAK_DAYS", label: "Ofensiva (Dias)" },
] as const;

interface CreateDuelDialogProps {
  friend: {
    id: string;
    name: string;
  };
  trigger?: React.ReactNode;
}

export function CreateDuelDialog({ friend, trigger }: CreateDuelDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<DuelFormValues>({
    resolver: zodResolver(duelSchema),
    defaultValues: {
      name: `Duelo vs ${friend.name.split(" ")[0]}`,
      description: "Quem completar o objetivo primeiro vence!",
      endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
      xpReward: 100,
      goalType: "WORKOUT_COUNT",
      goalTarget: 10,
    },
  });

  async function onSubmit(values: DuelFormValues) {
    setIsLoading(true);
    try {
      const response = await createChallenge({
        name: values.name,
        description: values.description,
        opponentId: friend.id,
        endDate: new Date(values.endDate).toISOString(),
        xpReward: values.xpReward,
        goalType: values.goalType as any,
        goalTarget: values.goalTarget,
      });

      if (response.status === 201) {
        toast.success("Desafio enviado! Seu amigo receberá uma notificação.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Erro ao criar desafio.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className="p-3 bg-muted/50 hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all active:scale-90 cursor-pointer"
            title="Desafiar para Duelo"
          >
            <SwordIcon weight="duotone" className="size-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-112.5 bg-card border-border rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-8 pb-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary flex items-center justify-center">
              <SwordIcon weight="duotone" className="size-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-2xl font-anton italic uppercase tracking-tight text-foreground">
                NOVO DUELO
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                Desafiar {friend.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 space-y-6"
          >
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <TrophyIcon weight="duotone" className="size-3.5" />
                      Nome do Desafio
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Batalha de Supino"
                        className="h-12 bg-muted/50 border-border rounded-xl font-medium focus:ring-primary/20 border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase italic" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <InfoIcon weight="duotone" className="size-3.5" />
                      Objetivo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descreva as regras ou objetivo"
                        className="h-12 bg-muted/50 border-border rounded-xl font-medium focus:ring-primary/20 border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase italic" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="goalType"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <TargetIcon weight="duotone" className="size-3.5" />
                      Tipo
                    </FormLabel>
                    <select
                      {...field}
                      className="flex h-12 w-full items-center justify-between rounded-xl border-none bg-muted/50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                    >
                      {GOAL_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-card text-foreground"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FormMessage className="text-[10px] font-bold uppercase italic" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goalTarget"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <StarIcon weight="duotone" className="size-3.5" />
                      Meta
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        className="h-12 bg-muted/50 border-border rounded-xl font-medium focus:ring-primary/20 border-none" 
                        {...field}
                        value={isNaN(field.value) ? "" : field.value}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase italic" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <CalendarIcon weight="duotone" className="size-3.5" />
                      Término
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-12 bg-muted/50 border-border rounded-xl font-medium focus:ring-primary/20 border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase italic" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="xpReward"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <StarIcon weight="duotone" className="size-3.5" />
                      Prêmio XP
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        className="h-12 bg-muted/50 border-border rounded-xl font-medium focus:ring-primary/20 border-none" 
                        {...field}
                        value={isNaN(field.value) ? "" : field.value}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold uppercase italic" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-14 rounded-2xl font-anton italic uppercase tracking-widest text-lg transition-all active:scale-95",
                  "bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-none",
                )}
              >
                {isLoading ? "Enviando Convite..." : "LANÇAR DESAFIO"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
