export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "abs"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves";

const muscleMap: Record<MuscleGroup, string[]> = {
  chest: ["supino", "peito", "fly", "crossover", "flexão", "push-up", "pullover", "peitoral"],
  back: ["remada", "puxada", "pulldown", "costa", "levantamento terra", "stiff", "barra fixa", "pull-up", "serrote", "lumbares"],
  shoulders: ["desenvolvimento", "lateral", "frontal", "ombro", "deltoide", "elevação", "arnold"],
  biceps: ["rosca", "bíceps", "martelo", "scott"],
  triceps: ["tríceps", "testa", "pulley", "coice", "mergulho"],
  abs: ["abdominal", "plancha", "prancha", "core", "crunch", "infra", "obliquo"],
  quads: ["agachamento", "leg press", "extensora", "afundo", "avanço", "hack", "quadríceps"],
  hamstrings: ["flexora", "posterior", "stiff", "mesa flexora", "cadeira flexora"],
  glutes: ["elevação pélvica", "glúteo", "sumô", "abdução"],
  calves: ["panturrilha", "gêmeos", "calf"],
};

export function mapExerciseToMuscles(exerciseName: string): MuscleGroup[] {
  const name = exerciseName.toLowerCase();
  const matchedMuscles: MuscleGroup[] = [];

  for (const [muscle, keywords] of Object.entries(muscleMap)) {
    if (keywords.some((keyword) => name.includes(keyword))) {
      matchedMuscles.push(muscle as MuscleGroup);
    }
  }

  return matchedMuscles;
}

export function getWorkoutMuscles(exercises: { name: string }[]): MuscleGroup[] {
  const allMuscles = exercises.flatMap((ex) => mapExerciseToMuscles(ex.name));
  return Array.from(new Set(allMuscles));
}
