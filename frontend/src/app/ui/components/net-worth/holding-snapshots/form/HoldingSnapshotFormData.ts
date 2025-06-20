import z from "zod";
import { numberRegex } from "../../../cashflow/CashFlowUtils";

export const HoldingSnapshotFormSchema = z.object({
  id: z.string().uuid().optional(),
  holdingId: z.string().trim().min(1, { message: "Holding field is required" }),
  date: z.date({ message: "Date field is required." }),
  balance: z.string().trim().min(1, { message: "Balance field is required." })
  .refine(
    (val) => {
      const cleaned = val.replace(/[,\s]/g, '');
      return numberRegex.test(cleaned);
    },
    { message: "Balance must be a valid currency format (e.g., 100.50)" }
  )
  .refine(
    (val) => {
      const cleaned = val.replace(/[,\s]/g, '');
      const parsed = parseFloat(cleaned);
      return parsed > 0;
    },
    { message: "Balance must be greater than 0" }
  )
  .transform((val) => {
    return val.replace(/[,\s]/g, '');
  })
});

export type HoldingSnapshotFormData = z.infer<typeof HoldingSnapshotFormSchema>;