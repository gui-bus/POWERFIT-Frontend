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
} from "@phosphor-icons/react";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RestTimer } from "./restTimer";
import { AnimatePresence, motion } from "framer-motion";
import { playSoftPing } from "@/lib/utils/audio";
import { toast } from "sonner";
import { createPortal } from "react-dom";

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

  // Estados para os inputs de cada série
  const [setInputs, setSetInputs] = useState<
    { weight: string; reps: string }[]
  >(
    new Array(exercise.sets).fill({
      weight: "",
      reps: exercise.reps.toString(),
    }),
  );

  // Efeito 2: Apenas para busca de histórico
  useEffect(() => {
    let ignore = false;

    const fetchHistory = async () => {
      try {
        const response = await getWorkoutExerciseHistory(exercise.id);
        if (response.status === 200 && response.data && !ignore) {
          setHistory(response.data.lastSets);

          const lastWeight = response.data.lastSets[0]?.weightInGrams / 1000;
          if (lastWeight) {
            setSetInputs((prev) =>
              prev.map((input) => ({
                ...input,
                weight: input.weight || lastWeight.toString(),
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

  const [chatOpen, setChatOpen] = useQueryState(
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
      } catch (error) {
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
              </div>

              <h3
                className={cn(
                  "text-2xl sm:text-3xl font-anton uppercase tracking-tight italic leading-none transition-all",
                  isAllCompleted ? "text-primary" : "text-foreground",
                )}
              >
                {exercise.name}
              </h3>
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
                <div className="col-span-1 text-[8px] font-black text-muted-foreground uppercase tracking-widest italic">
                  Série
                </div>
                <div className="col-span-4 text-[8px] font-black text-muted-foreground uppercase tracking-widest italic pl-2">
                  Anterior
                </div>
                <div className="col-span-3 text-[8px] font-black text-muted-foreground uppercase tracking-widest italic text-center">
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
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "grid grid-cols-12 gap-2 items-center p-2 rounded-2xl border transition-all",
                        isSetDone
                          ? "bg-primary/10 border-primary/30"
                          : "bg-muted/30 border-border/50",
                      )}
                    >
                      <div className="col-span-1 flex justify-center">
                        <span className="font-anton italic text-sm text-muted-foreground">
                          {idx + 1}
                        </span>
                      </div>

                      <div className="col-span-4 pl-2 overflow-hidden">
                        {prevData ? (
                          <p className="text-[10px] font-bold text-muted-foreground truncate italic">
                            {prevData.reps} x {prevData.weightInGrams / 1000}kg
                          </p>
                        ) : (
                          <p className="text-[10px] font-bold text-muted-foreground/30 italic">
                            --
                          </p>
                        )}
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          step="0.5"
                          disabled={isSetDone}
                          value={setInputs[idx].weight}
                          onChange={(e) =>
                            handleInputChange(idx, "weight", e.target.value)
                          }
                          className="w-full bg-background border border-border rounded-xl py-2 text-center font-anton text-sm italic focus:border-primary transition-colors disabled:opacity-50"
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
