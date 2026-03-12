"use client";

import { 
  getChallengeById, 
  GetChallengeById200, 
} from "@/lib/api/fetch-generated";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayIcon, TrophyIcon, TargetIcon, UserIcon, MedalIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChallengeProgressDialogProps {
  challengeId: string;
  trigger?: React.ReactNode;
}

export function ChallengeProgressDialog({ challengeId, trigger }: ChallengeProgressDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [challenge, setChallenge] = useState<GetChallengeById200 | null>(null);

  useEffect(() => {
    if (open) {
      fetchProgress();
    }
  }, [open]);

  async function fetchProgress() {
    setIsLoading(true);
    try {
      const response = await getChallengeById(challengeId);
      if (response.status === 200) {
        setChallenge(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const getGoalUnit = (type?: string | null) => {
    switch (type) {
      case "WORKOUT_COUNT": return "Treinos";
      case "TOTAL_VOLUME": return "kg";
      case "TOTAL_XP": return "XP";
      case "PR_COUNT": return "PRs";
      case "TOTAL_DURATION": return "Minutos";
      case "STREAK_DAYS": return "Dias";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            className="w-full py-4 rounded-2xl font-black uppercase italic tracking-widest text-[11px] bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <PlayIcon weight="duotone" className="size-4" />
            Ver Progresso
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-8 pb-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary flex items-center justify-center">
              <TrophyIcon weight="duotone" className="size-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-2xl font-anton italic uppercase tracking-tight text-foreground">
                RANKING ATUAL
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {challenge?.name || "Carregando..."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {isLoading ? (
            <div className="py-10 text-center animate-pulse space-y-4">
              <div className="h-4 w-3/4 bg-muted rounded mx-auto" />
              <div className="h-4 w-1/2 bg-muted rounded mx-auto" />
            </div>
          ) : challenge ? (
            <>
              {/* Goal Summary */}
              <div className="bg-muted/50 rounded-3xl p-6 border border-border/50 flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-background border border-border flex items-center justify-center">
                  <TargetIcon weight="duotone" className="size-7 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-1.5">Meta do Desafio</p>
                  <p className="text-xl font-anton italic text-foreground uppercase tracking-tight">
                    {challenge.goalTarget} {getGoalUnit(challenge.goalType)}
                  </p>
                </div>
              </div>

              {/* Participants List */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                  <UserIcon weight="duotone" className="size-5 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] italic text-foreground">Classificação</h3>
                </div>

                <div className="space-y-5">
                  {challenge.participants.sort((a, b) => b.score - a.score).map((participant, index) => {
                    const percentage = Math.min(Math.round((participant.score / (challenge.goalTarget || 1)) * 100), 100);
                    
                    return (
                      <div key={participant.userId} className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "size-8 rounded-lg flex items-center justify-center font-anton italic text-sm",
                              index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              {index + 1}
                            </div>
                            <span className="font-black uppercase italic tracking-tight text-sm text-foreground flex items-center gap-2">
                              {participant.userName}
                              {participant.hasWon && <MedalIcon weight="fill" className="size-4 text-amber-500 animate-bounce" />}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                            {participant.score} / {challenge.goalTarget}
                          </span>
                        </div>
                        
                        {/* Progress Bar - More refined */}
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              index === 0 ? "bg-primary" : "bg-muted-foreground/20"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">Não foi possível carregar os dados.</p>
          )}

          <Button 
            onClick={() => setOpen(false)}
            className="w-full h-14 rounded-2xl font-anton italic uppercase tracking-widest text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-none"
          >
            VOLTAR AOS DESAFIOS
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
