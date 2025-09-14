import { HoldingInvestmentReturn, HoldingInvestmentReturnFormData } from "@/app/net-worth/investment-returns";

export const convertHoldingInvestmentReturnItemToFormData = (item: HoldingInvestmentReturn) : HoldingInvestmentReturnFormData => ({
  id: item.id?.toString(),
  startHoldingSnapshotDate: new Date(item.startHoldingSnapshot?.date ?? ''),
  startHoldingSnapshotId: item.startHoldingSnapshotId,
  endHoldingSnapshotId: item.endHoldingSnapshotId,
  endHoldingSnapshotHoldingId: item.endHoldingSnapshot?.holdingId ?? '',
  endHoldingSnapshotDate: new Date(item.endHoldingSnapshot?.date ?? ''),
  endHoldingSnapshotBalance: (item.endHoldingSnapshot?.balance ?? 0 / 100).toFixed(2),
  totalContributions: (item.totalContributions / 100).toFixed(2),
  totalWithdrawals: (item.totalWithdrawals / 100).toFixed(2),
});
