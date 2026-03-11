"use client";

import {
  GetWorkoutDayById200ExercisesItem,
  getWorkoutExerciseHistory,
  upsertWorkoutSet,
  Item as HistoryItem,
} from "@/lib/api/fetch-generated";
import {
  QuestionIcon,
  CheckCircleIcon,
  CircleIcon,
  TimerIcon,
  CopyIcon,
  TrophyIcon,
} from "@phosphor-icons/react";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { RestTimer } from "./restTimer";
import { AnimatePresence } from "framer-motion";
import { playSoftPing } from "@/lib/utils/audio";
import { toast } from "sonner";
import { checkIsPersonalRecord, gramsToKg } from "@/lib/utils/workout";

interface ExerciseItemProps {
  exercise: GetWorkoutDayById200ExercisesItem;
  canMarkAsCompleted?: boolean;
  activeSessionId?: string;
}

export function ExerciseItem({
  exercise,
  canMarkAsCompleted,
  activeSessionId,
}: ExerciseItemProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  const [setInputs, setSetInputs] = useState<{ weight: string; reps: string }[]>(
    Array.from({ length: exercise.sets }, () => ({
      weight: "",
      reps: exercise.reps.toString(),
    })),
  );


  useEffect(() => {
    let ignore = false;

    const fetchHistory = async () => {
      try {
        const response = await getWorkoutExerciseHistory(exercise.id);
        if (response.status === 200 && response.data && !ignore) {
          setHistory(response.data.lastSets);

          const lastWeight = gramsToKg(response.data.lastSets[0]?.weightInGrams);
          if (lastWeight) {
            setSetInputs((prev) =>
              prev.map((input) => ({
                ...input,
                weight: input.weight || lastWeight,
              })),
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch exercise history", error);
      }
    };

    fetchHistory();

    return () => {
      ignore = true;
    };
  }, [exercise.id]);

  const queryKey = `sets_${exercise.id}`;
  const [setsString, setSetsString] = useQueryState(
    queryKey,
    parseAsString.withDefault(new Array(exercise.sets).fill("0").join(",")),
  );

  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [, setChatInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString,
  );

  const completedSets = useMemo(() => {
    return (setsString || "").split(",").map((val) => val === "1");
  }, [setsString]);

  const isAllCompleted = completedSets.every((set) => set);


  const isPersonalRecord = (index: number) => {
    const currentWeight = parseFloat(setInputs[index].weight) || 0;
    const historyWeights = history.map((h) => h.weightInGrams / 1000);
    return checkIsPersonalRecord(currentWeight, historyWeights);
  };

  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatOpen(true);
    setChatInitialMessage(
      `Poderia me dar instruções sobre como executar o ${exercise.name}?`,
    );
  };

  const handleInputChange = (
    index: number,
    field: "weight" | "reps",
    value: string,
  ) => {
    const newInputs = [...setInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setSetInputs(newInputs);
  };

  const copyFirstSetToAll = () => {
    const firstWeight = setInputs[0].weight;
    if (!firstWeight) {
      toast.error("Preencha o peso da primeira série primeiro.");
      return;
    }
    setSetInputs(prev => prev.map(input => ({ ...input, weight: firstWeight })));
    toast.success("Carga replicada para todas as séries!");
  };

  const toggleSet = async (index: number) => {
    if (!canMarkAsCompleted || !activeSessionId) return;

    const newSets = [...completedSets];
    const isNowCompleted = !newSets[index];
    const currentInput = setInputs[index];

    if (isNowCompleted) {
      if (!currentInput.weight || !currentInput.reps) {
        toast.error("Preencha peso e repetições antes de concluir a série.");
        return;
      }

      try {
        const response = await upsertWorkoutSet(
          activeSessionId,
          exercise.id,
          index,
          {
            weightInGrams: parseFloat(currentInput.weight) * 1000,
            reps: parseInt(currentInput.reps),
          },
        );

        if (response.status !== 204) {
          toast.error("Erro ao salvar dados da série.");
          return;
        }


        if (index < exercise.sets - 1) {
          setTimeout(() => {
            inputRefs.current[index + 1]?.focus();
          }, 100);
        }

        if (isPersonalRecord(index)) {
          toast.success("Novo Recorde Pessoal Batido! 🔥", {
            description: `${currentInput.weight}kg neste exercício!`,
            icon: <TrophyIcon weight="fill" className="text-yellow-500" />
          });
        }

      } catch {
        toast.error("Erro de conexão ao salvar série.");
        return;
      }
    }

    newSets[index] = isNowCompleted;
    const urlString = newSets.map((s) => (s ? "1" : "0")).join(",");
    await setSetsString(urlString);

    if (isNowCompleted) {
      setShowTimer(true);
    }
  };

  const minutes = Math.floor(exercise.restTimeInSeconds / 60);
  const seconds = exercise.restTimeInSeconds % 60;
  const formattedPausa = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <>
      <div
        className={cn(
          "group bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all duration-500",
          isAllCompleted
            ? "opacity-60 grayscale-[0.5]"
            : "hover:shadow-xl hover:shadow-primary/5",
        )}
      >
        <div className="p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleHelpClick}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-[9px] font-black tracking-widest border border-border px-3 py-1.5 rounded-xl bg-background/50 active:scale-95"
                >
                  <QuestionIcon size={14} /> Instruções
                </button>
                <div className="inline-flex items-center gap-2 text-primary uppercase text-[9px] font-black tracking-widest border border-primary/20 px-3 py-1.5 rounded-xl bg-primary/5">
                  <TimerIcon size={14} /> {formattedPausa} Pausa
                </div>
                {canMarkAsCompleted && !isAllCompleted && (
                  <button
                    onClick={copyFirstSetToAll}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors uppercase text-[9px] font-black tracking-widest border border-border px-3 py-1.5 rounded-xl bg-background/50 active:scale-95"
                  >
                    <CopyIcon size={14} /> Replicar Carga
                  </button>
                )}
              </div>

              <h3
                className={cn(
                  "text-2xl sm:text-3xl font-anton uppercase tracking-tight italic leading-none transition-all",
                  isAllCompleted ? "text-primary" : "text-foreground",
                )}
              >
                {exercise.name}
              </h3>
              
              {/* Mini Trend Chart */}
              {history.length > 1 && (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest italic">Tendência de Carga</span>
                    <div className="h-6 w-24 flex items-end gap-0.5 pt-1">
                      {history.slice(0, 8).reverse().map((h, i) => {
                        const weights = history.map(x => x.weightInGrams);
                        const min = Math.min(...weights);
                        const max = Math.max(...weights);
                        const range = max - min || 1;
                        const height = ((h.weightInGrams - min) / range) * 100;
                        return (
                          <div 
                            key={i} 
                            className="flex-1 bg-primary/20 rounded-t-[1px] relative group/bar"
                            style={{ height: `${Math.max(height, 10)}%` }}
                          >
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-popover text-[6px] px-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                              {h.weightInGrams / 1000}kg
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                     <span className="text-[10px] font-anton italic text-primary leading-none">
                        +{((history[0].weightInGrams - history[history.length - 1].weightInGrams) / 1000).toFixed(1)}kg
                     </span>
                     <span className="text-[6px] font-bold text-muted-foreground uppercase">Evolução Total</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              {isAllCompleted ? (
                <CheckCircleIcon
                  weight="fill"
                  className="size-10 text-primary animate-in zoom-in duration-300"
                />
              ) : (
                <div className="size-10 rounded-2xl bg-muted/30 border border-border flex items-center justify-center text-[10px] font-black italic text-muted-foreground">
                  {completedSets.filter((s) => s).length}/{exercise.sets}
                </div>
              )}
            </div>
          </div>

          {/* Individual Sets Section */}
          {canMarkAsCompleted && !isAllCompleted && (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 px-2 pb-2">
                <div className="col-span-1 text-[8px] font-black text-muted-foreground uppercase tracking-widest italic text-center">
                  Série
                </div>
                <div className="col-span-3 text-[8px] font-black text-muted-foreground uppercase tracking-widest italic pl-2">
                  Anterior
                </div>
                <div className="col-span-4 text-[8px] font-black text-muted-foreground uppercase tracking-widest italic text-center">
                  Peso (kg)
                </div>
                <div className="col-span-3 text-[8px] font-black text-muted-foreground uppercase tracking-widest italic text-center">
                  Reps
                </div>
                <div className="col-span-1"></div>
              </div>

              <div className="space-y-2">
                {completedSets.map((isSetDone, idx) => {
                  const prevData = history.find((h) => h.setIndex === idx);
                  const hasPR = isPersonalRecord(idx);
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "grid grid-cols-12 gap-2 items-center p-2 rounded-2xl border transition-all relative overflow-hidden",
                        isSetDone
                          ? "bg-primary/10 border-primary/30"
                          : "bg-muted/30 border-border/50",
                      )}
                    >
                      {hasPR && !isSetDone && (
                        <div className="absolute top-0 right-10 p-1">
                           <TrophyIcon weight="fill" className="size-3 text-yellow-500 animate-bounce" />
                        </div>
                      )}
                      
                      <div className="col-span-1 flex justify-center">
                        <span className="font-anton italic text-sm text-muted-foreground">
                          {idx + 1}
                        </span>
                      </div>

                      <div className="col-span-3 pl-2 overflow-hidden">
                        {prevData ? (
                          <p className="text-[10px] font-bold text-muted-foreground truncate italic">
                            {prevData.reps}x{prevData.weightInGrams / 1000}kg
                          </p>
                        ) : (
                          <p className="text-[10px] font-bold text-muted-foreground/30 italic">
                            --
                          </p>
                        )}
                      </div>

                      <div className="col-span-4 relative">
                        <input
                          ref={(el) => (inputRefs.current[idx] = el)}
                          type="number"
                          step="0.5"
                          disabled={isSetDone}
                          value={setInputs[idx].weight}
                          onChange={(e) =>
                            handleInputChange(idx, "weight", e.target.value)
                          }
                          className={cn(
                            "w-full bg-background border border-border rounded-xl py-2 text-center font-anton text-sm italic focus:border-primary transition-colors disabled:opacity-50",
                            hasPR && !isSetDone && "border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          disabled={isSetDone}
                          value={setInputs[idx].reps}
                          onChange={(e) =>
                            handleInputChange(idx, "reps", e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-xl py-2 text-center font-anton text-sm italic focus:border-primary transition-colors disabled:opacity-50"
                        />
                      </div>

                      <div className="col-span-1 flex justify-end pr-1">
                        <button
                          onClick={() => toggleSet(idx)}
                          className={cn(
                            "size-8 rounded-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer",
                            isSetDone
                              ? "bg-primary text-white"
                              : "bg-muted border border-border text-muted-foreground hover:border-primary/50",
                          )}
                          title="Marcar set como concluído"
                        >
                          {isSetDone ? (
                            <CheckCircleIcon weight="fill" className="size-5" />
                          ) : (
                            <CircleIcon weight="bold" className="size-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* View mode */}
          {(isAllCompleted || !canMarkAsCompleted) && (
            <div className="grid grid-cols-3 gap-8 py-4 border-t border-border/50">
              <div className="space-y-1 text-center">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Séries
                </p>
                <p className="text-2xl font-anton italic text-foreground leading-none">
                  {exercise.sets}
                </p>
              </div>
              <div className="space-y-1 text-center border-x border-border/50">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Reps
                </p>
                <p className="text-2xl font-anton italic text-foreground leading-none">
                  {exercise.reps}
                </p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Pausa
                </p>
                <p className="text-2xl font-anton italic text-foreground leading-none">
                  {formattedPausa}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showTimer && (
          <RestTimer
            initialSeconds={exercise.restTimeInSeconds}
            onClose={() => setShowTimer(false)}
            onFinish={() => {
              playSoftPing();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
