import { ListTableItem } from "@/app/components";
import { HoldingSnapshot } from "../../holding-snapshots/components";

export type HoldingInvestmentReturn = ListTableItem & {
  id?: number;
  startHoldingSnapshotId: string;
  startHoldingSnapshot?: HoldingSnapshot;
  endHoldingSnapshotId: string;
  endHoldingSnapshot?: HoldingSnapshot;
  totalContributions: number;
  totalWithdrawals: number;
  returnPercentage?: number;
  userId?: string;
  name?: string;
}

export const getHoldingInvestmentReturnDisplayName = (investmentReturn: HoldingInvestmentReturn) => {
  return `${investmentReturn.endHoldingSnapshot?.holding?.name} - ${investmentReturn.endHoldingSnapshot?.holding?.holdingCategory?.name}`;
}