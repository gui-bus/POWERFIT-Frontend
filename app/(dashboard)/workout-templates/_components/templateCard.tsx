"use client";

import { GetWorkoutTemplates200TemplatesItem, applyWorkoutTemplate } from "@/lib/api/fetch-generated";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarbellIcon, LightningIcon, PlusIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TemplateCardProps {
  template: GetWorkoutTemplates200TemplatesItem;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      const response = await applyWorkoutTemplate(template.id);
      if (response.status === 201) {
        toast.success(`Plano "${template.name}" aplicado com sucesso!`);
        router.push("/");
      } else {
        toast.error("Erro ao aplicar plano.");
      }
    } catch (error) {
      toast.error("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = {
    BEGINNER: "bg-green-500/10 text-green-500 border-green-500/20",
    INTERMEDIATE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    ADVANCED: "bg-destructive/10 text-destructive border-destructive/20",
  }[template.difficulty?.toUpperCase() || ""] || "bg-primary/10 text-primary border-primary/20";

  return (
    <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-sm flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        {template.imageUrl ? (
          <Image 
            src={template.imageUrl} 
            alt={template.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="size-full bg-linear-to-br from-primary/20 to-orange-600/20 flex items-center justify-center">
            <BarbellIcon weight="duotone" className="size-16 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {template.category && (
            <Badge className="bg-white/10 text-white border-white/20 uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
              {template.category}
            </Badge>
          )}
          {template.difficulty && (
            <Badge className={`uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-full border ${difficultyColor} backdrop-blur-md`}>
              {template.difficulty}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-anton italic uppercase text-foreground leading-none tracking-tight group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">
            {template.description || "Nenhuma descrição fornecida."}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <LightningIcon weight="duotone" className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Ativar Plano</span>
              <span className="text-[9px] font-bold uppercase text-muted-foreground">{template.days.length} Dias / Semana</span>
            </div>
          </div>
          
          <Button 
            onClick={handleApply}
            disabled={loading}
            size="icon"
            className="size-12 rounded-2xl bg-primary hover:bg-orange-600 shadow-xl shadow-primary/20 group/btn transition-all active:scale-95 cursor-pointer"
          >
            <PlusIcon weight="bold" className="size-5 text-primary-foreground group-hover/btn:rotate-90 transition-transform duration-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
