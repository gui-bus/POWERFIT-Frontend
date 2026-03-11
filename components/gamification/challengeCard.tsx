"use client";

import { GetChallenges200Item, joinChallenge } from "@/lib/api/fetch-generated";
import { 
  UsersIcon, 
  StarIcon, 
  CalendarIcon,
  CheckCircleIcon,
  PlayIcon,
  PlusIcon
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ChallengeCardProps {
  challenge: GetChallenges200Item;
}

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
      "group relative bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5",
      challenge.isJoined && "border-primary/30 bg-primary/[0.01]"
    )}>
      {/* Header Image/Gradient */}
      <div className={cn(
        "h-32 relative transition-all duration-500 group-hover:h-36",
        isGlobal ? "bg-primary/10" : "bg-blue-500/10"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-card" />
        
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
            isGlobal 
              ? "bg-primary text-primary-foreground border-primary/20" 
              : "bg-blue-500 text-white border-blue-400/20"
          )}>
            {isGlobal ? "Global" : "Duelo"}
          </span>
          {challenge.isJoined && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
              <CheckCircleIcon weight="fill" className="size-3" />
              Inscrito
            </span>
          )}
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-2 bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border">
          <UsersIcon weight="duotone" className="size-3.5 text-primary" />
          <span className="text-[10px] font-black text-foreground">{challenge.participantsCount}</span>
        </div>
      </div>

      <div className="p-8 pt-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-anton italic uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
            {challenge.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium line-clamp-2">
            {challenge.description}
          </p>
        </div>

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

        <button
          onClick={handleJoin}
          disabled={isLoading || challenge.isJoined || isCompleted}
          className={cn(
            "w-full py-4 rounded-2xl font-black uppercase italic tracking-widest text-[11px] transition-all active:scale-95 flex items-center justify-center gap-2",
            challenge.isJoined 
              ? "bg-muted text-muted-foreground cursor-default" 
              : isCompleted
                ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02]"
          )}
        >
          {challenge.isJoined ? (
            <>
              <PlayIcon weight="fill" className="size-4" />
              Ver Progresso
            </>
          ) : isCompleted ? (
            "Desafio Encerrado"
          ) : isLoading ? (
            "Entrando..."
          ) : (
            <>
              <PlusIcon weight="bold" className="size-4" />
              Participar agora
            </>
          )}
        </button>
      </div>
    </div>
  );
}
