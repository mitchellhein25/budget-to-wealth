import z from "zod";

export const HoldingInvestmentReturnFormSchema = z.object({
  id: z.string().uuid().optional(),
  startHoldingSnapshotDate: z.date({ message: "Start Holding Snapshot Date field is required" }),
  startHoldingSnapshotId: z.string().min(1, { message: "Start Holding Snapshot field is required" }),
  endHoldingSnapshotId: z.string().min(1, { message: "End Holding Snapshot field is required. It was not created successfully on submit." }),
  endHoldingSnapshotHoldingId: z.string().min(1, { message: "End Holding Snapshot Holding field is required" }),
  endHoldingSnapshotDate: z.date({ message: "End Holding Snapshot Date field is required" }),
  endHoldingSnapshotBalance: z.string().min(1, { message: "End Holding Snapshot Balance field is required" }),
  totalContributions: z.string().optional().default('0'),
  totalWithdrawals: z.string().optional().default('0')
});

export type HoldingInvestmentReturnFormData = z.infer<typeof HoldingInvestmentReturnFormSchema>;


