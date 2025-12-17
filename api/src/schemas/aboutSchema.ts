import { z } from "zod";

export const createAboutSchema = z.object({
  tittle: z.string().min(1, "tittle wajib diisi"),

  history: z.string().min(1, "history wajib diisi"),

  vision: z.string().min(1, "vision wajib diisi"),

  mission: z.string().min(1, "mission wajib diisi"),
});

export const updateAboutSchema = createAboutSchema.partial();

export type CreateAboutDTO = z.infer<typeof createAboutSchema>;

export type UpdateAboutDTO = z.infer<typeof updateAboutSchema>;
