import { z } from "zod";

export const createTeamSchema = z.object({
    name: z.string().min(1, "name wajib diisi"),
    job: z.string().min(1, "job wajib diisi"),

    imageUrl: z.string().url("imageUrl wajib valid").optional(),
    imagePublicId: z.string().optional(),
}).strict()

export const updateTeamSchema = createTeamSchema.partial();

export type CreateTeamDTO = z.infer<typeof createTeamSchema>;
export type UpdateTeamDTO = z.infer<typeof updateTeamSchema>;