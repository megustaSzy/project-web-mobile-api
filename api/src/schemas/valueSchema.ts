import { z } from "zod";

export const createValueSchema = z.object({
    header: z.string().min(1, "header wajib diisi"),
    name: z.string().min(1, "name wajib diisi"),

    imageUrl: z.string().url("imageUrl wajib diisi").optional()
});

export const updateValueSchema = createValueSchema.partial();

export type CreateValueDTO = z.infer<typeof createValueSchema>;
export type UpdateValueDTO = z.infer<typeof updateValueSchema>