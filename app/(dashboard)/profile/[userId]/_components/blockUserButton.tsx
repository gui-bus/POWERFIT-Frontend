"use client";

import { useState } from "react";
import { toggleBlockUser } from "@/lib/api/fetch-generated";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProhibitIcon, WarningIcon } from "@phosphor-icons/react";
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

interface BlockUserButtonProps {
  userId: string;
  userName: string;
  trigger?: React.ReactNode;
}

export function BlockUserButton({ userId, userName, trigger }: BlockUserButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBlock = async () => {
    setLoading(true);
    try {
      const response = await toggleBlockUser(userId);
      if (response.status === 200) {
        toast.success(response.data.isBlocked ? "Usuário bloqueado." : "Usuário desbloqueado.");
        router.refresh();
      }
    } catch {
      toast.error("Erro ao processar bloqueio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <button className="p-4 bg-muted/50 hover:bg-destructive hover:text-destructive-foreground rounded-2xl transition-all active:scale-95 group cursor-pointer shadow-sm">
            <ProhibitIcon weight="bold" className="size-5 text-muted-foreground group-hover:text-white" />
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border rounded-[2.5rem]">
        <AlertDialogHeader>
          <div className="size-12 bg-destructive/10 rounded-2xl flex items-center justify-center mb-2">
            <WarningIcon weight="duotone" className="size-6 text-destructive" />
          </div>
          <AlertDialogTitle className="text-2xl font-anton italic uppercase">Bloquear Atleta</AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
            Deseja bloquear <span className="text-foreground font-black italic">{userName}</span>? 
            Esta ação removerá qualquer amizade existente e impedirá que o atleta veja suas atividades ou envie mensagens.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 mt-4">
          <AlertDialogCancel className="rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 border-border cursor-pointer">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleBlock}
            disabled={loading}
            className="bg-destructive hover:bg-red-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-destructive/20 cursor-pointer"
          >
            Confirmar Bloqueio
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
