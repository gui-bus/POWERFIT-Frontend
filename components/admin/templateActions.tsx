"use client";

import { useState } from "react";
import { 
  deleteAdminWorkoutTemplatesId 
} from "@/lib/api/fetch-generated";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdownMenu";
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
  DotsThreeVerticalIcon, 
  TrashIcon, 
  PencilSimpleIcon
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-10 rounded-xl hover:bg-primary/5 cursor-pointer text-white"
          disabled={isLoading}
        >
          <DotsThreeVerticalIcon weight="bold" className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border bg-card shadow-2xl">
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
          Gestão: {templateName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="rounded-xl p-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <TrashIcon weight="duotone" className="mr-3 size-4" />
              <span className="font-bold text-xs uppercase tracking-wider">Excluir Template</span>
            </DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
