import z from "zod";
import { ListTableItem } from "@/app/components";

export type Category = ListTableItem & {
  id?: number;
  name: string;
  userId?: string;
};

export const categoryFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "Name field is required" }),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;