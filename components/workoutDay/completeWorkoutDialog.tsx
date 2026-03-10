"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UsersIcon, 
  CheckCircleIcon, 
  ChatTeardropTextIcon, 
  PlusIcon,
  CheckIcon
} from "@phosphor-icons/react";
import { getFriends, GetFriends200Item } from "@/lib/api/fetch-generated";
import { completeWorkoutAction } from "@/app/(dashboard)/workout-plans/[planId]/days/[dayId]/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "framer-motion";
import { playSoftPing } from "@/lib/utils/audio";

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

  const toggleFriend = (id: string) => {
    setSelectedSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await completeWorkoutAction(planId, dayId, sessionId, {
        statusMessage: statusMessage.trim() || undefined,
        taggedUserIds: selectedFriends.length > 0 ? selectedFriends : undefined
      });

      if (!("error" in response)) {
        playSoftPing();
        if ("vibrate" in navigator) window.navigator.vibrate([100, 50, 100]);
        
        setShowCelebration(true);
        toast.success("Treino concluído com sucesso! Disciplina é tudo. 🔥");
        
        setTimeout(() => {
          setOpen(false);
          setShowCelebration(false);
        }, 2000);
      } else {
        toast.error("Erro ao concluir treino.");
      }
    } catch (error) {
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
      <DialogContent className="bg-card border-border rounded-[2.5rem] sm:max-w-md p-0 overflow-hidden">
        <div className="p-8 space-y-8 relative">
          <AnimatePresence>
            {showCelebration && (
              <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 1, 
                      scale: 0, 
                      x: "50%", 
                      y: "50%",
                      rotate: 0 
                    }}
                    animate={{ 
                      opacity: 0, 
                      scale: Math.random() * 1.5 + 0.5, 
                      x: `${Math.random() * 200 - 50}%`, 
                      y: `${Math.random() * -200 - 50}%`,
                      rotate: Math.random() * 360 
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute size-3 rounded-sm bg-primary"
                    style={{ 
                      backgroundColor: i % 2 === 0 ? "var(--primary)" : "var(--foreground)",
                      left: "45%",
                      top: "45%"
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          <DialogHeader>
            <motion.div 
              animate={showCelebration ? { scale: [1, 1.2, 1] } : {}}
              className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
            >
              <CheckCircleIcon weight="duotone" className="size-8 text-primary" />
            </motion.div>
            <DialogTitle className="font-anton text-3xl italic uppercase tracking-wider text-foreground leading-none">Missão Cumprida</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-xs uppercase tracking-widest pt-1">
              Finalize sua sessão e registre o esforço
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status Message */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground px-1">
                <ChatTeardropTextIcon weight="duotone" className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Como foi o treino?</span>
              </div>
              <textarea
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="Ex: Treino insano de pernas! Foco total."
                className="w-full bg-muted/30 border border-border/50 rounded-[1.5rem] p-4 text-xs font-medium focus:outline-hidden focus:border-primary/50 transition-colors min-h-24 resize-none"
              />
            </div>

            {/* Tag Friends */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UsersIcon weight="duotone" className="size-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Treinou com algum de seus amigos?</span>
                </div>
                {selectedFriends.length > 0 && (
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                    {selectedFriends.length} marcados
                  </span>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar mask-fade-right p-5">
                {friends.length > 0 ? (
                  friends.map((friend) => {
                    const isSelected = selectedFriends.includes(friend.id);
                    return (
                      <button
                        key={friend.id}
                        onClick={() => toggleFriend(friend.id)}
                        className="flex flex-col items-center gap-2 group shrink-0"
                      >
                        <div className={cn(
                          "relative size-14 rounded-2xl p-0.5 transition-all duration-300",
                          isSelected ? "bg-primary shadow-lg shadow-primary/20 scale-110" : "bg-border/50 hover:bg-primary/30"
                        )}>
                          <div className="size-full rounded-[0.9rem] bg-card overflow-hidden">
                            <Avatar className="size-full rounded-none">
                              <AvatarImage src={friend.image || ""} className="object-cover" />
                              <AvatarFallback className="text-[10px] font-bold">{friend.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 size-5 bg-primary text-white rounded-full flex items-center justify-center border-2 border-card shadow-sm">
                              <CheckIcon weight="bold" className="size-2.5" />
                            </div>
                          )}
                        </div>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-tighter max-w-15 truncate transition-colors",
                          isSelected ? "text-primary" : "text-muted-foreground"
                        )}>
                          {friend.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-[9px] font-bold text-muted-foreground italic px-1 uppercase tracking-widest py-4">Nenhum amigo para marcar.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0">
          <Button 
            onClick={handleComplete} 
            disabled={isLoading || showCelebration}
            className="w-full h-16 rounded-[1.5rem] font-anton text-lg italic uppercase tracking-widest shadow-2xl shadow-primary/20"
          >
            {isLoading ? "Salvando..." : showCelebration ? "FINALIZADO! 🔥" : "CONCLUIR SESSÃO"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
