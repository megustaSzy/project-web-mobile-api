import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, "name wajib diisi")
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;