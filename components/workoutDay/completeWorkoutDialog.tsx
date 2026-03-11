"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CheckCircleIcon, 
  SpinnerGapIcon
} from "@phosphor-icons/react";
import { getFriends, GetFriends200Item } from "@/lib/api/fetch-generated";
import { completeWorkoutAction } from "@/app/(dashboard)/workout-plans/[planId]/days/[dayId]/actions";
import { toast } from "sonner";
import { uploadFiles } from "@/lib/uploadthing";
import { authClient } from "@/lib/authClient";
import { motion } from "framer-motion";
import { playSoftPing } from "@/lib/utils/audio";
import { CelebrationEffect } from "./completeWorkoutDialog/celebrationEffect";
import { PhotoUploader } from "./completeWorkoutDialog/photoUploader";
import { StatusMessageInput } from "./completeWorkoutDialog/statusMessageInput";
import { TagFriendsSection } from "./completeWorkoutDialog/tagFriendsSection";

interface CompleteWorkoutDialogProps {
  planId: string;
  dayId: string;
  sessionId: string;
  trigger: React.ReactNode;
}

export function CompleteWorkoutDialog({ planId, dayId, sessionId, trigger }: CompleteWorkoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<GetFriends200Item[]>([]);
  const [selectedFriends, setSelectedSelectedFriends] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchFriends = async () => {
        const response = await getFriends();
        if (response.status === 200) {
          setFriends(response.data);
        }
      };
      fetchFriends();
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removePhoto = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const toggleFriend = (id: string) => {
    setSelectedSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    let imageUrl = undefined;

    try {
      if (selectedFile) {
        setIsUploading(true);
        const uploadToastId = "workout-upload-toast";
        toast.loading("Enviando foto do treino...", { id: uploadToastId });

        const session = await authClient.getSession();
        const token = session.data?.session?.token;

        if (!token) {
          toast.error("Sessão não encontrada. Faça login novamente.", { id: uploadToastId });
          setIsLoading(false);
          setIsUploading(false);
          return;
        }

        try {
          const uploadRes = await uploadFiles("workoutImage", {
            files: [selectedFile],
            headers: {
              "Authorization": `Bearer ${token}`,
              "Cookie": `better-auth.session-token=${token}`,
              "x-session-token": token 
            }
          });

          if (uploadRes && uploadRes[0]) {
            imageUrl = uploadRes[0].url;
            toast.success("Foto enviada!", { id: uploadToastId });
          } else {
            throw new Error("Resposta de upload vazia");
          }
        } catch (uploadError: unknown) {
          console.error("Erro técnico no upload:", uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : "Erro desconhecido";
          toast.error(`Falha no upload: ${errorMessage}`, { id: uploadToastId });
          setIsLoading(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const response = await completeWorkoutAction(planId, dayId, sessionId, {
        statusMessage: statusMessage.trim() || undefined,
        taggedUserIds: selectedFriends.length > 0 ? selectedFriends : undefined,
        imageUrl
      });

      if (!("error" in response)) {
        playSoftPing();
        if ("vibrate" in navigator) window.navigator.vibrate([100, 50, 100]);
        
        setShowCelebration(true);
        toast.success("Treino concluído com sucesso! Disciplina é tudo. 🔥");
        
        setTimeout(() => {
          setOpen(false);
          setShowCelebration(false);
          setSelectedFile(null);
          setPreviewUrl(null);
          setStatusMessage("");
          setSelectedSelectedFriends([]);
        }, 2000);
      } else {
        toast.error("Erro ao concluir treino.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao concluir treino.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-card border-border rounded-[2.5rem] sm:max-w-md p-0 overflow-hidden outline-hidden">
        <div className="p-8 space-y-8 relative max-h-[85vh] overflow-y-auto custom-scrollbar">
          <CelebrationEffect show={showCelebration} />

          <DialogHeader>
            <motion.div 
              animate={showCelebration ? { scale: [1, 1.2, 1] } : {}}
              className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
            >
              <CheckCircleIcon weight="duotone" className="size-8 text-primary" />
            </motion.div>
            <DialogTitle className="font-anton text-3xl italic uppercase tracking-wider text-foreground leading-none">Missão Cumprida</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-[10px] uppercase tracking-widest pt-1">
              Finalize sua sessão e registre o esforço
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <PhotoUploader
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onRemovePhoto={removePhoto}
            />

            <StatusMessageInput
              value={statusMessage}
              onChange={setStatusMessage}
            />

            <TagFriendsSection
              friends={friends}
              selectedFriends={selectedFriends}
              onToggleFriend={toggleFriend}
            />
          </div>
        </div>

        <div className="p-8 pt-0">
          <Button 
            onClick={handleComplete} 
            disabled={isLoading || isUploading || showCelebration}
            className="w-full h-16 rounded-[1.5rem] font-anton text-lg italic uppercase tracking-widest shadow-2xl shadow-primary/20 gap-3 cursor-pointer"
          >
            {isLoading || isUploading ? (
              <>
                <SpinnerGapIcon className="size-5 animate-spin" />
                {isUploading ? "ENVIANDO FOTO..." : "SALVANDO..."}
              </>
            ) : showCelebration ? (
              "FINALIZADO! 🔥"
            ) : (
              "CONCLUIR SESSÃO"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
