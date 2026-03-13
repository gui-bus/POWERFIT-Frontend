"use client";

import { useState } from "react";
import { 
  deleteAdminWorkoutTemplatesId 
} from "@/lib/api/fetch-generated";
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
import { Button } from "@/components/ui/button";
import { 
  TrashIcon, 
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TemplateActionsProps {
  templateId: string;
  templateName: string;
}

export function TemplateActions({ templateId, templateName }: TemplateActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteAdminWorkoutTemplatesId(templateId);
      if (response.status === 204) {
        toast.success("Template removido com sucesso!");
        router.refresh();
      } else {
        toast.error("Erro ao remover template.");
      }
    } catch (error) {
      toast.error("Erro na conexão.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          disabled={isLoading}
          className="w-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white rounded-2xl h-12 gap-2 font-black uppercase italic tracking-widest text-[10px] transition-all active:scale-95 cursor-pointer shadow-none"
        >
          <TrashIcon weight="bold" className="size-4" />
          Excluir Template
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border rounded-[2.5rem] p-10">
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="font-anton text-3xl italic uppercase tracking-wider text-foreground">
            Remover Template?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
            Esta ação removerá o template <span className="font-black italic text-foreground">{templateName}</span> da lista de planos recomendados para todos os usuários.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 gap-4">
          <AlertDialogCancel className="h-14 rounded-2xl border border-border font-black uppercase italic tracking-widest text-[10px] hover:bg-muted/50 transition-all cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-destructive text-destructive-foreground hover:bg-red-600 transition-all font-black uppercase italic tracking-widest text-[10px] px-8 cursor-pointer shadow-lg shadow-destructive/20"
          >
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
