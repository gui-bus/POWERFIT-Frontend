"use client";

import { deleteAdminActivitiesId } from "@/lib/api/fetch-generated";
import { 
  DotsThreeVerticalIcon, 
  TrashIcon,
  ShieldCheckIcon
} from "@phosphor-icons/react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";

interface FeedModerationProps {
  activityId: string;
  userName: string;
}

export function FeedModeration({ activityId, userName }: FeedModerationProps) {
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const router = useRouter();

  if (!isAdmin) return null;

  const handleDeleteActivity = async () => {
    try {
      const response = await deleteAdminActivitiesId(activityId);
      if (response.status === 204) {
        toast.success("Atividade removida pela moderação.");
        router.refresh();
      }
    } catch {
      toast.error("Erro ao remover atividade.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10 rounded-2xl hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary cursor-pointer">
          <DotsThreeVerticalIcon weight="bold" className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 mt-2 rounded-[1.5rem] p-3 border-border bg-card shadow-2xl">
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheckIcon weight="duotone" className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Moderação Admin</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase">
          Postado por: <span className="font-black italic">{userName}</span>
        </DropdownMenuLabel>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="rounded-xl p-3 text-destructive focus:bg-destructive focus:text-destructive-foreground focus:text-white font-bold text-xs uppercase tracking-wider cursor-pointer mt-1"
            >
              <TrashIcon weight="duotone" className="mr-3 size-5" />
              Excluir Postagem
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-border rounded-[2.5rem] p-10">
            <AlertDialogHeader className="space-y-4">
              <AlertDialogTitle className="font-anton text-3xl italic uppercase tracking-wider text-foreground">
                Remover do Feed?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                Esta ação removerá permanentemente a postagem de <span className="font-black italic">{userName}</span> do feed global. Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 gap-4">
              <AlertDialogCancel className="h-14 rounded-2xl border border-border font-black uppercase italic tracking-widest text-[10px] hover:bg-muted/50 transition-all cursor-pointer">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteActivity}
                className="h-14 rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-black uppercase italic tracking-widest text-[10px] px-8 cursor-pointer shadow-lg shadow-destructive/20"
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
