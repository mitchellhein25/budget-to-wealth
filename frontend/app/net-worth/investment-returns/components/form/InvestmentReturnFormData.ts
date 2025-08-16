import z from "zod";
import { RecurrenceFrequency } from "@/app/cashflow/components";

export const InvestmentReturnFormSchema = z.object({
  id: z.string().uuid().optional(),
  isManualInvestment: z.boolean().default(false),

  manualInvestmentCategoryId: z.string().optional(),
  manualInvestmentReturnDate: z.string().optional(),
  manualInvestmentPercentageReturn: z.string().optional(),
  manualInvestmentRecurrenceFrequency: z.nativeEnum(RecurrenceFrequency).optional(),
  manualInvestmentRecurrenceEndDate: z.string().optional(),

  startHoldingSnapshotDate: z.string().optional(),
  startHoldingSnapshotId: z.string().optional(),
  endHoldingSnapshotHoldingId: z.string().optional(),
  endHoldingSnapshotDate: z.string().optional(),
  endHoldingSnapshotBalance: z.string().optional(),

  totalContributions: z.string().optional(),
  totalWithdrawals: z.string().optional(),
});

export type InvestmentReturnFormData = z.infer<typeof InvestmentReturnFormSchema>;


