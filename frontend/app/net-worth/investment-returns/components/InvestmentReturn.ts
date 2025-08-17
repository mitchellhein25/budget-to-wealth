import { RecurrenceFrequency } from "@/app/cashflow/components";
import { HoldingSnapshot } from "../../holding-snapshots/components";
import { Category } from "@/app/components/categories";

export type InvestmentReturn = {
  id?: number;
  startHoldingSnapshotId?: string;
  startHoldingSnapshot?: HoldingSnapshot;
  endHoldingSnapshotId?: string;
  endHoldingSnapshot?: HoldingSnapshot;
  manualInvestmentCategoryId?: string;
  manualInvestmentCategory?: Category;
  manualInvestmentReturnDate: string;
  manualInvestmentPercentageReturn?: number;
  manualInvestmentRecurrenceFrequency?: RecurrenceFrequency;
  manualInvestmentRecurrenceEndDate?: string;
  totalContributions?: number;
  totalWithdrawals?: number;
  returnPercentage?: number;
  userId?: string;
}