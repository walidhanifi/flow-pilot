import { z } from "zod";

export interface Board {
  readonly id: string;
  readonly user_id: string;
  readonly name: string;
  readonly description: string;
  readonly created_at: string;
}

export const createBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").max(80, "Name must be 80 characters or less"),
  description: z.string().max(200, "Description must be 200 characters or less").default(""),
});

export const updateBoardSchema = z
  .object({
    name: z.string().min(1, "Board name is required").max(80).optional(),
    description: z.string().max(200).optional(),
  })
  .refine((d) => d.name !== undefined || d.description !== undefined, {
    message: "At least one field must be provided",
  });

export type CreateBoardPayload = z.infer<typeof createBoardSchema>;
export type UpdateBoardPayload = z.infer<typeof updateBoardSchema>;
