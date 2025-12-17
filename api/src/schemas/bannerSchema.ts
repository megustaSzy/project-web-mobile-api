import { z } from "zod";

// Schema untuk create banner
export const createBannerSchema = z.object({
  number: z.string().min(1, "Number wajib diisi"),
  header: z.string().min(1, "Header wajib diisi"),
  name: z.string().min(1, "Name wajib diisi"),
  imageUrl: z.string().url("Image URL harus valid").optional(), 
});

// Schema untuk update banner → semua field optional
export const updateBannerSchema = createBannerSchema.partial();

// TypeScript types
export type CreateBannerDTO = z.infer<typeof createBannerSchema>;
export type UpdateBannerDTO = z.infer<typeof updateBannerSchema>;
