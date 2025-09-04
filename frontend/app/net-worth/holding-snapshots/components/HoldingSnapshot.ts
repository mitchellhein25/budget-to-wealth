import { ListTableItem } from "@/app/components";
import { Holding } from "@/app/net-worth/holding-snapshots/holdings";

export type HoldingSnapshot = ListTableItem & {
  id?: number;
  holdingId: string;
  holding?: Holding;
  date: string;
  balance: number;
  userId?: string;
}

export const getHoldingSnapshotDisplayName = (snapshot: HoldingSnapshot | undefined,) => {
  return snapshot ? `${snapshot.holding?.name} - ${snapshot.holding?.institution} - ${snapshot.holding?.holdingCategory?.name} (${snapshot.holding?.type})` : '';
}