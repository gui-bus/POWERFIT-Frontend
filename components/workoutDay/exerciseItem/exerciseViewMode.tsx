interface ExerciseViewModeProps {
  sets: number;
  reps: number;
  formattedPausa: string;
}

export function ExerciseViewMode({ sets, reps, formattedPausa }: ExerciseViewModeProps) {
  return (
    <div className="grid grid-cols-3 gap-8 py-4 border-t border-border/50">
      <div className="space-y-1 text-center">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
          Séries
        </p>
        <p className="text-2xl font-anton italic text-foreground leading-none">
          {sets}
        </p>
      </div>
      <div className="space-y-1 text-center border-x border-border/50">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
          Reps
        </p>
        <p className="text-2xl font-anton italic text-foreground leading-none">
          {reps}
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
  );
}
