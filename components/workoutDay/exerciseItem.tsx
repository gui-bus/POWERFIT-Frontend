"use client";

import {
  GetWorkoutDayById200ExercisesItem,
  getWorkoutExerciseHistory,
  upsertWorkoutSet,
  Item as HistoryItem,
} from "@/lib/api/fetch-generated";
import { TrophyIcon } from "@phosphor-icons/react";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { RestTimer } from "./restTimer";
import { AnimatePresence } from "framer-motion";
import { playSoftPing } from "@/lib/utils/audio";
import { toast } from "sonner";
import { checkIsPersonalRecord, gramsToKg } from "@/lib/utils/workout";
import { ExerciseHeader } from "./exerciseItem/exerciseHeader";
import { ExerciseSetRow } from "./exerciseItem/exerciseSetRow";
import { ExerciseViewMode } from "./exerciseItem/exerciseViewMode";

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
          <ExerciseHeader
            name={exercise.name}
            formattedPausa={formattedPausa}
            isAllCompleted={isAllCompleted}
            canMarkAsCompleted={canMarkAsCompleted}
            completedCount={completedSets.filter((s) => s).length}
            setsTotal={exercise.sets}
            history={history}
            onHelpClick={handleHelpClick}
            onCopyFirstSet={copyFirstSetToAll}
          />

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
                {completedSets.map((isSetDone, idx) => (
                  <ExerciseSetRow
                    key={idx}
                    index={idx}
                    isSetDone={isSetDone}
                    weight={setInputs[idx].weight}
                    reps={setInputs[idx].reps}
                    prevData={history.find((h) => h.setIndex === idx)}
                    hasPR={isPersonalRecord(idx)}
                    inputRef={(el) => (inputRefs.current[idx] = el)}
                    onInputChange={handleInputChange}
                    onToggleSet={toggleSet}
                  />
                ))}
              </div>
            </div>
          )}

          {(isAllCompleted || !canMarkAsCompleted) && (
            <ExerciseViewMode
              sets={exercise.sets}
              reps={exercise.reps}
              formattedPausa={formattedPausa}
            />
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
