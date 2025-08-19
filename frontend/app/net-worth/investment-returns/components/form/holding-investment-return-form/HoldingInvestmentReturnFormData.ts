import z from "zod";

export const HoldingInvestmentReturnFormSchema = z.object({
  id: z.string().uuid().optional(),
  startHoldingSnapshotDate: z.string().min(1, { message: "Start Holding Snapshot Date field is required" }),
  startHoldingSnapshotId: z.string().min(1, { message: "Start Holding Snapshot Id field is required" }),
  endHoldingSnapshotId: z.string().min(1, { message: "End Holding Snapshot Id field is required. It was not created successfully on submit." }),
  endHoldingSnapshotHoldingId: z.string().min(1, { message: "End Holding Snapshot Holding Id field is required" }),
  endHoldingSnapshotDate: z.string().min(1, { message: "End Holding Snapshot Date field is required" }),
  endHoldingSnapshotBalance: z.string().min(1, { message: "End Holding Snapshot Balance field is required" }),
  totalContributions: z.string().optional().default('0'),
  totalWithdrawals: z.string().optional().default('0')
});

export type HoldingInvestmentReturnFormData = z.infer<typeof HoldingInvestmentReturnFormSchema>;


