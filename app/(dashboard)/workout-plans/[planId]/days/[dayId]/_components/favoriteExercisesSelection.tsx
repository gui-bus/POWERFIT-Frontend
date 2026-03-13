"use client";

import { useState, useEffect } from "react";
import { getExercises, GetExercises200ExercisesItem } from "@/lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import { HeartIcon, PlusIcon, StarIcon } from "@phosphor-icons/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FavoriteExercisesSelectionProps {
  onSelect: (exercise: GetExercises200ExercisesItem) => void;
}

export function FavoriteExercisesSelection({ onSelect }: FavoriteExercisesSelectionProps) {
  const [favorites, setFavorites] = useState<GetExercises200ExercisesItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getExercises({ favoritesOnly: true });
        if (response.status === 200) {
          setFavorites(response.data.exercises);
        }
      } catch (error) {
        console.error("Error fetching favorite exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return null;
  if (favorites.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <StarIcon weight="fill" className="size-3.5 text-amber-500" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] italic text-muted-foreground">Adição Rápida: Favoritos</h4>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-xl">
        <div className="flex w-max space-x-3 p-1">
          {favorites.map((exercise) => (
            <button
              key={exercise.id}
              onClick={(e) => {
                e.preventDefault();
                onSelect(exercise);
              }}
              className="flex flex-col items-start gap-2 p-4 bg-muted/30 border border-border/50 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group active:scale-95 cursor-pointer text-left w-48"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[8px] font-black uppercase tracking-widest text-primary italic bg-primary/10 px-2 py-0.5 rounded-md">
                  {exercise.muscleGroup}
                </span>
                <HeartIcon weight="fill" className="size-3 text-red-500" />
              </div>
              <p className="text-xs font-black uppercase italic text-foreground leading-tight truncate w-full">
                {exercise.name}
              </p>
              <div className="flex items-center gap-1 text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">
                <PlusIcon weight="bold" className="size-2 text-primary" />
                Clique para adicionar
              </div>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
