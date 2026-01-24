import { z } from "zod";

export const createOrderSchema = z.object({
  destinationId: z.number().int().positive(),

  pickupLocationId: z.number().int().positive().optional(),

  quantity: z
    .number()
    .int()
    .min(1, "minimal quantity 1")
    .max(16, "maksimal quantity 16"),

  date: z.coerce.date(),

  returnTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),

  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
