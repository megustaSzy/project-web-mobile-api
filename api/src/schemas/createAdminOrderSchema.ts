import { z } from "zod";

export const createAdminOrderSchema = z.object({
  userId: z.number().int().positive("userId tidak valid"),

  destinationId: z.number().int().positive("destinationId tidak valid"),

  pickupLocationId: z.number().int().positive().optional(),

  quantity: z.number().int().min(1, "quantity minimal 1"),

  date: z.coerce.date(),

  departureTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "format jam HH:mm"),

  returnTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),

  isPaid: z.boolean().optional(),
});

export type CreateAdminOrderInput = z.infer<typeof createAdminOrderSchema>;
