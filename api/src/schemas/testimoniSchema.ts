import { z } from "zod";

export const testimoniSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  profession: z.string().optional(),
  comment: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
});

export type TestimoniData = z.infer<typeof testimoniSchema>;