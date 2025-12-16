import { z } from "zod";

export const testimoniSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  comment: z.string().min(1, "Komentar wajib diisi"),
  rating: z.coerce.number().min(1).max(5),
});
