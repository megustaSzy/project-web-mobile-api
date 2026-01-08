import { z } from "zod";

export const updateSchema = z
  .object({
    name: z.string().min(1, "nama tidak boleh kosong").optional(),
    email: z.string().email("format email tidak valid").optional(),
    notelp: z.string().length(12, "nomor telepon harus 12 digit").optional(),
    password: z
      .string()
      .min(6, "password minimal 6 karakter")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d).+$/,
        "password harus mengandung huruf dan angka"
      )
      .optional(),
  })
  .strict();

export type UpdateUserData = z.infer<typeof updateSchema>;
