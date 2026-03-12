"use client";

import { GetChallenges200Item, joinChallenge } from "@/lib/api/fetch-generated";
import { 
  UsersIcon, 
  StarIcon, 
  CalendarIcon,
  CheckCircleIcon,
  PlusIcon,
  TargetIcon
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChallengeProgressDialog } from "./challengeProgressDialog";

interface ChallengeCardProps {
  challenge: GetChallenges200Item;
}

const getGoalLabel = (type?: string | null) => {
  switch (type) {
    case "WORKOUT_COUNT": return "Treinos";
    case "TOTAL_VOLUME": return "kg Levantados";
    case "TOTAL_XP": return "XP Ganhos";
    case "PR_COUNT": return "Recordes";
    case "TOTAL_DURATION": return "Minutos";
    case "STREAK_DAYS": return "Dias de Ofensiva";
    default: return "Objetivo";
  }
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (challenge.isJoined || challenge.status === "COMPLETED") return;
    
    setIsLoading(true);
    try {
      const response = await joinChallenge(challenge.id);
      if (response.status === 204) {
        toast.success(`Você entrou no desafio: ${challenge.name}`);
        router.refresh();
      } else {
        toast.error("Erro ao entrar no desafio.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  const isGlobal = challenge.type === "GLOBAL";
  const isCompleted = challenge.status === "COMPLETED";

  return (
    <div className={cn(
      "group relative bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-primary/30",
      challenge.isJoined && "bg-primary/2"
    )}>
      {/* Header - Clean & Minimal */}
      <div className="h-24 relative bg-muted/30">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-card/50" />
        
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-border bg-background text-foreground",
          )}>
            {isGlobal ? "Global" : "Duelo"}
          </span>
          {challenge.isJoined && (
            <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <CheckCircleIcon weight="duotone" className="size-3" />
              Inscrito
            </span>
          )}
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border">
          <UsersIcon weight="duotone" className="size-3.5 text-primary" />
          <span className="text-[10px] font-black text-foreground">{challenge.participantsCount}</span>
        </div>
      </div>

      <div className="p-8 pt-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-anton italic uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
            {challenge.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium line-clamp-2">
            {challenge.description}
          </p>
        </div>

        {challenge.goalType && (
          <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-4 border border-border/50">
            <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center">
              <TargetIcon weight="duotone" className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Objetivo</p>
              <p className="text-sm font-black italic text-foreground uppercase tracking-tight">
                {challenge.goalTarget} {getGoalLabel(challenge.goalType)}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <StarIcon weight="duotone" className="size-3.5" />
              <p className="text-[9px] font-bold uppercase tracking-widest">Prêmio</p>
            </div>
            <p className="text-sm font-black italic text-primary">+{challenge.xpReward} XP</p>
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
              <CalendarIcon weight="duotone" className="size-3.5" />
              <p className="text-[9px] font-bold uppercase tracking-widest">Término</p>
            </div>
            <p className="text-sm font-black italic text-foreground">
              {challenge.endDate ? dayjs(challenge.endDate).format("DD/MM") : "---"}
            </p>
          </div>
        </div>

        {challenge.isJoined ? (
          <ChallengeProgressDialog challengeId={challenge.id} />
        ) : (
          <button
            onClick={handleJoin}
            disabled={isLoading || isCompleted}
            className={cn(
              "w-full py-4 rounded-2xl font-black uppercase italic tracking-widest text-[11px] transition-all active:scale-95 flex items-center justify-center gap-2",
              isCompleted
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isCompleted ? (
              "Desafio Encerrado"
            ) : isLoading ? (
              "Entrando..."
            ) : (
              <>
                <PlusIcon weight="duotone" className="size-4" />
                Participar agora
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
