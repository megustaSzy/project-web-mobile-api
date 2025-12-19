import { z } from "zod";

export const createOrderSchema = z.object({
  destinationId: z.number().int().positive(),

  pickupLocationId: z.number().int().positive("pickup location wajib"),

  quantity: z.number().int().min(1),
  date: z.coerce.date(),

  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

  returnTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),

  departureTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
