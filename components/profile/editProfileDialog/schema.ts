import * as z from "zod";

export const profileSchema = z.object({
  weight: z.coerce
    .number()
    .min(30, "Peso muito baixo")
    .max(300, "Peso muito alto"),
  height: z.coerce
    .number()
    .min(100, "Altura muito baixa")
    .max(250, "Altura muito alta"),
  age: z.coerce
    .number()
    .min(12, "Idade mínima 12 anos")
    .max(100, "Idade máxima 100 anos"),
  bodyFatPercentage: z.coerce
    .number()
    .min(0, "Mínimo 0%")
    .max(100, "Máximo 100%"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
