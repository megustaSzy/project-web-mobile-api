import { z } from "zod";


export const createPickupSchema= z.object({
    name: z.string().min(1, "nama pickup wajib diisi")
});

export const updatePickupSchema = createPickupSchema.partial();

export type CreatePickupDTO = z.infer<typeof createPickupSchema>
export type UpdatePickupDTO = z.infer<typeof updatePickupSchema>


// export interface PickupData {
//   name: string;
// }