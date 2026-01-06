import { z } from "zod";

export const createRegionSchema = z.object({
  name: z.string().min(1, "Name wajib diisi"),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
});

export const updateRegionSchema = createRegionSchema.partial();

export type CreateRegionDTO = z.infer<typeof createRegionSchema>;
export type UpdateeRegionDTO = z.infer<typeof updateRegionSchema>;
