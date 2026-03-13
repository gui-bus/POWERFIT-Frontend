"use client";

import { useState, useEffect } from "react";
import { DropIcon, PlusIcon, ClockIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  logWater, 
  getWaterHistory, 
  GetWaterHistory200LogsItem 
} from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

const WATER_GOAL = 2000;

export function WaterTracker() {
  const [total, setTotal] = useState(0);
  const [logs, setLogs] = useState<GetWaterHistory200LogsItem[]>([]);

  const fetchWaterData = async () => {
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const response = await getWaterHistory(today);
      if (response.status === 200) {
        setTotal(response.data.totalInMl);
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error("Error fetching water data:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchWaterData();
    };
    init();
  }, []);

  const handleLogWater = async (amount: number) => {
    try {
      const response = await logWater({ amountInMl: amount });
      if (response.status === 201) {
        toast.success(`+${amount}ml registrados!`);
        fetchWaterData();
      } else {
        toast.error("Erro ao registrar consumo de água.");
      }
    } catch {
      toast.error("Erro na conexão.");
    }
  };

  const progress = Math.min((total / WATER_GOAL) * 100, 100);

  return (
    <Card className="p-6 border border-border dark:bg-zinc-900 relative overflow-hidden group rounded-3xl">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
        <DropIcon weight="fill" className="size-24 text-primary" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <DropIcon weight="duotone" className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest italic">Hidratação</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Meta Diária: {WATER_GOAL}ml</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase italic tracking-widest h-8 cursor-pointer">
                Histórico
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border-border rounded-[2.5rem]">
              <DialogHeader>
                <DialogTitle className="text-xl font-anton italic uppercase text-foreground flex items-center gap-3">
                  <DropIcon weight="duotone" className="size-6 text-primary" />
                  Histórico de Hoje
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Acompanhe seu consumo de água detalhado hoje.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {logs.length === 0 ? (
                  <p className="text-center py-10 text-muted-foreground font-medium uppercase italic tracking-widest text-xs">
                    Nenhum registro hoje.
                  </p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <DropIcon weight="fill" className="size-4 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-black italic uppercase text-foreground">{log.amountInMl}ml</p>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <ClockIcon weight="bold" className="size-3" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">{dayjs(log.loggedAt).format("HH:mm")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-anton italic text-foreground leading-none">{total}</span>
              <span className="text-xs font-black text-primary uppercase italic">ml</span>
            </div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
              {Math.round(progress)}% da meta
            </span>
          </div>
          
          <div className="h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border shadow-inner">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,100,0,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => handleLogWater(250)}
            variant="outline" 
            className="h-12 rounded-2xl border-border bg-background hover:border-primary/50 group/btn transition-all active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <PlusIcon weight="bold" className="size-4 text-primary transition-transform group-hover/btn:scale-110" />
              <span className="text-[10px] font-black uppercase italic tracking-widest">250ml</span>
            </div>
          </Button>
          <Button 
            onClick={() => handleLogWater(500)}
            variant="outline" 
            className="h-12 rounded-2xl border-border bg-background hover:border-primary/50 group/btn transition-all active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <PlusIcon weight="bold" className="size-4 text-primary transition-transform group-hover/btn:scale-110" />
              <span className="text-[10px] font-black uppercase italic tracking-widest">500ml</span>
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
}
