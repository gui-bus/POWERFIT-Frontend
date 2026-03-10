"use client";

import { useState } from "react";
import { updatePrivacySettings } from "@/lib/api/fetch-generated";
import { 
  ShieldCheckIcon, 
  LockIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  InfoIcon
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PrivacySettingsProps {
  initialSettings: {
    isPublicProfile: boolean;
    showStats: boolean;
  };
}

export function PrivacySettings({ initialSettings }: PrivacySettingsProps) {
  const [isPublic, setIsPublic] = useState(initialSettings.isPublicProfile);
  const [showStats, setShowStats] = useState(initialSettings.showStats);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePublic = async () => {
    const newValue = !isPublic;
    setIsLoading(true);
    try {
      const response = await updatePrivacySettings({ isPublicProfile: newValue });
      if (response.status === 204) {
        setIsPublic(newValue);
        toast.success(newValue ? "Perfil agora é público!" : "Perfil agora é privado.");
      }
    } catch (error) {
      toast.error("Erro ao atualizar privacidade.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStats = async () => {
    const newValue = !showStats;
    setIsLoading(true);
    try {
      const response = await updatePrivacySettings({ showStats: newValue });
      if (response.status === 204) {
        setShowStats(newValue);
        toast.success(newValue ? "Estatísticas visíveis." : "Estatísticas ocultas.");
      }
    } catch (error) {
      toast.error("Erro ao atualizar visibilidade.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon weight="duotone" className="size-5 text-primary" />
        <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">Privacidade</h3>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleTogglePublic}
          disabled={isLoading}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "size-10 rounded-xl flex items-center justify-center transition-colors",
              isPublic ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {isPublic ? <EyeIcon weight="fill" /> : <EyeSlashIcon weight="fill" />}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase italic text-foreground tracking-tight">Aparecer nas buscas</p>
            </div>
          </div>
          {isPublic ? (
            <ToggleRightIcon weight="fill" className="size-8 text-primary" />
          ) : (
            <ToggleLeftIcon weight="fill" className="size-8 text-muted-foreground" />
          )}
        </button>

        {/* Toggle Estatísticas */}
        <button 
          onClick={handleToggleStats}
          disabled={isLoading}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "size-10 rounded-xl flex items-center justify-center transition-colors",
              showStats ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <InfoIcon weight="fill" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase italic text-foreground tracking-tight">Mostrar Biometria</p>
            </div>
          </div>
          {showStats ? (
            <ToggleRightIcon weight="fill" className="size-8 text-primary" />
          ) : (
            <ToggleLeftIcon weight="fill" className="size-8 text-muted-foreground" />
          )}
        </button>
      </div>

      {!isPublic && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3">
          <LockIcon weight="fill" className="size-4 text-primary shrink-0" />
          <p className="text-[9px] font-bold text-primary uppercase leading-relaxed tracking-widest italic">
            Seu perfil está protegido. Apenas amigos podem ver suas atividades completas.
          </p>
        </div>
      )}
    </div>
  );
}
