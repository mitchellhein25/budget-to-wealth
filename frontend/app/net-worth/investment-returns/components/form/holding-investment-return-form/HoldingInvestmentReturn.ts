import { HoldingSnapshot } from "../../../../holding-snapshots/components";

export type HoldingInvestmentReturn = {
  id?: number;
  startHoldingSnapshotId: string;
  startHoldingSnapshot?: HoldingSnapshot;
  endHoldingSnapshotId: string;
  endHoldingSnapshot?: HoldingSnapshot;
  totalContributions: number;
  totalWithdrawals: number;
  returnPercentage?: number;
  userId?: string;
}