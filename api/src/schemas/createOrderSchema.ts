import { z } from "zod";

export const createOrderSchema = z.object({
  destinationId: z.number().int().positive(),

  pickupLocationId: z.number().int().positive().optional(),

  quantity: z.number().int().min(1, "quantity minimal 1"),
  date: z.coerce.date(),

  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .min(1, "jam keberangkatan wajib"),

  returnTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
